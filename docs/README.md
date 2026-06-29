# webApp-astro - 前台用户端

Astro 6 + React 19 + TypeScript，部署目标为 Cloudflare Workers。项目已经从单一 Kellogg 站点重构为“通用业务逻辑集中管理 + 站点资源包集中管理 + 路由入口按当前站点分发”的多站点架构。

## 架构概览

```text
src/
├─ core/                  跨站点通用能力，不依赖任何 site-package
│  ├─ components/          通用组件，如 DynamicRenderer、OptimizedImage、RichText、TurnstileWidget
│  ├─ hooks/               通用 React hooks
│  ├─ layouts/             CoreLayout，负责 HTML/head/body 与通用 SEO 骨架
│  ├─ lib/                 API requester、媒体 URL、CSP、i18n、sitemap、请求去重等
│  ├─ services/            可注入的 core service factory
│  └─ types.ts             跨站点最小协议类型
│
├─ services/               应用层连接器，连接 currentSite 与 core
│  ├─ api.ts               基于当前站点配置创建站点 API client
│  └─ siteService.ts       基于当前站点配置创建 SiteService
│
├─ site-package/
│  ├─ index.ts             站点注册表、currentSite、页面 lazy loader
│  └─ kellogg/             Kellogg 站点资源包
│     ├─ config.ts         站点配置、API、SEO、CSP、第三方服务、页面能力注册
│     ├─ components/       Header/Footer/block/base/product 等 Kellogg 组件
│     ├─ layouts/          SiteLayout，组合 CoreLayout 与 Kellogg 品牌壳
│     ├─ pages/            Kellogg 页面实现与 Astro wrapper
│     ├─ styles/           Kellogg 样式资源
│     ├─ types/            Kellogg 内容、商品、博客等站点模型
│     └─ utils/            Kellogg API adapter、i18n、block 数据预取等
│
├─ pages/                  Astro 路由入口，只委托给 currentSite.pages
└─ middleware.ts           使用 core CSP builder + 当前站点 security 配置生成安全响应头
```

依赖方向必须保持为：

```text
site-package/{siteName} -> core
services -> site-package + core
pages -> site-package/index
core -> 不允许引用 site-package
```

`src/pages` 不直接引用 `src/site-package/kellogg/**`，只通过 `@site-package` 获取当前站点与页面 loader。

## 站点切换

当前站点由构建时环境变量 `PUBLIC_SITE_NAME` 决定，默认值为 `kellogg`。新增站点时，增加 `src/site-package/{siteName}/config.ts`，再在 `src/site-package/index.ts` 的 `siteConfigs` 中注册。

站点配置集中管理：

- 站点名、默认语言、fallback 语言
- `siteUrl`
- API base、local API base、assets base、asset hostnames
- API client factory
- 默认货币
- Turnstile site key 与测试 key 开关
- Tawk script URL
- 默认 SEO 与 alternate links
- CSP 补充域名与视频 provider 白名单
- 页面能力注册

页面能力使用 lazy import 注册，避免构建期循环依赖：

```ts
pages: {
  cms: () => import("./pages/CmsPage.astro"),
  products: () => import("./pages/ProductsPage.astro"),
  productDetail: () => import("./pages/ProductDetailPage.astro"),
}
```

路由入口通过 `loadSitePage()` 加载当前站点页面：

```astro
---
import { currentSite, loadSitePage } from "@site-package";

const ProductsPage = await loadSitePage(currentSite.pages?.products);
if (!ProductsPage) return Astro.redirect("/404");
---

<ProductsPage />
```

## 渲染边界

- `src/pages` 是物理路由入口，业务页面实现集中在 `src/site-package/kellogg/pages`。
- CMS 页面、博客列表、博客详情、询盘、客户评价、商品列表等由当前站点页面能力决定是否可用。
- `src/pages/product/[id].astro` 明确 `prerender = false`，商品详情是 SSR 路由。
- `src/pages/sitemap.xml.ts` 明确 `prerender = false`，运行时根据当前站点页面能力、商品和博客数据生成。
- `npm run dev` 会通过开发服务器处理 SSR 路由；本地 build 后如果只用纯静态文件 preview，SSR 路由不会像 dev 一样完整工作。需要使用 Astro/Cloudflare 对应的 preview/server 环境验证 SSR 页面。

## Block 渲染

`src/core/components/DynamicRenderer.astro` 只负责通用流程：

- 过滤可见 block
- 创建请求内 `requestMemo`
- 调用站点传入的 `loadBlockData`
- 将 block 交给站点包的 `BlockRenderer.astro`

Kellogg 的 block 渲染和水合策略集中在：

- `src/site-package/kellogg/pages/BlockRenderer.astro`
- `src/site-package/kellogg/utils/loadBlockData.ts`
- `src/site-package/kellogg/components/blocks/**`

因为 Astro 的 `client:*` 指令需要编译期可见，带水合策略的 block 由站点包 Astro wrapper 显式渲染。

- `{站点包}\components\blocks-fixed` 中的积木块是固定的积木块，在CMS页面中固定存在，所以单独管理。

## API 与数据

- `src/core/lib/api.ts` 只提供通用 `createApiRequester(config)`，不包含 Kellogg endpoint。
- Kellogg endpoint 集中在 `src/site-package/kellogg/utils/api.ts`。
- `src/services/api.ts` 根据 `currentSite.api` 创建运行时 API client，并配置媒体 URL 解析。
- `SiteService.getSiteData(Astro)` 继续使用请求内缓存，优先保存到 `Astro.locals`，避免同一次渲染重复请求。
- 不使用模块级 API 响应缓存，避免 Cloudflare isolate 跨请求共享旧数据。

## 安全边界

- CSP 字符串由 `src/core/lib/csp.ts` 生成，站点配置只补充第三方域名。
- `middleware.ts` 使用 `buildContentSecurityPolicy(currentSite)` 设置安全响应头。
- CMS Markdown/HTML 必须经过 `sanitizeCmsHtml()`。
- 视频 URL 通过 core 视频解析能力处理，允许的 provider 由站点配置决定。
- Turnstile widget 是 core 通用组件，site key 从当前站点配置传入；生产 key 不写死在 core。
- Tawk script URL 从 Kellogg config 传入。

## Astro 文件约束

站点资源包中，新增 `.astro` 文件只允许放在 `pages/` 下。普通站点组件优先使用 `.tsx`、`.ts` 或样式资源。

当前保留的非 `pages/` `.astro` 是兼容债务，不继续扩大：


## 常用命令

```bash
npm run dev
npm run build
npm run preview
npm test
npm run test:architecture
npm run test:security
npm run test:inquiry
npm run test:requests
npm run test:accessibility
```

本项目协作中通常只运行与当前变更相关的轻量测试，不默认运行全量测试或完整构建。
