# webApp-astro 前台架构说明

这是一个运行在 Cloudflare Workers 上的 Astro 前台项目，使用 Astro、React、TypeScript 与 Tailwind。项目采用“共享业务层 + 站点资源包”的架构：路由入口不直接绑定某个品牌站点，运行时根据当前站点配置加载页面实现。

## 当前状态

- 已存在 `kellogg` 与 `lilian` 两个站点资源包。
- `src/site-package/index.ts` 当前只注册了 `kellogg`，因此默认和可选站点均为 Kellogg。
- Lilian 包已具备页面、布局、样式和组件实现；要正式切换到 Lilian，需要先在站点注册表中加入 `lilianSiteConfig`。
- 产品和博客列表已实现 SSR 首屏查询、客户端筛选/排序/分页以及 URL 同步。
- 客户评价目前使用前端分页；公开评价接口不提供前台分页参数。

## 目录与职责

```text
src/
├─ cms/                    与站点无关的数据契约、纯工具和数据适配
│  ├─ types/               商品、博客、页面、区块、询盘、评价等通用类型
│  ├─ lib/                 API requester、i18n、内容安全、视频、货币、sitemap、请求去重
│  └─ adapters/            通用数据转换，例如 Product -> ProductCard 数据
│
├─ core-webApp/            可复用的前台业务能力，不依赖 site-package
│  ├─ components/          DynamicRenderer、TawkChat 等通用宿主组件
│  ├─ config/              默认运行时配置和安全配置
│  ├─ hooks/               useProductGrid、useBlogGrid、useInquiry
│  ├─ lib/                 产品/博客查询参数与 CSP 工具
│  ├─ layouts/             CoreLayout，负责公共 HTML/head 骨架
│  ├─ services/            API client、SiteService、PageService、货币服务
│  └─ types/               站点运行时配置协议
│
├─ runtime/                可被站点 UI 使用的宿主组件
│  ├─ components/          OptimizedImage、RichText、VideoEmbed、TurnstileWidget
│  └─ hooks/               宿主交互 hooks
│
├─ services/               当前站点的连接层
│  ├─ api.ts               按 currentSite 创建 API client
│  └─ siteService.ts       按 currentSite 创建 SiteService
│
├─ site-package/
│  ├─ index.ts             站点注册表、currentSite、页面懒加载工具
│  ├─ kellogg/             Kellogg 资源包
│  └─ lilian/              Lilian 资源包
│
├─ pages/                  唯一的物理 Astro 路由入口
└─ middleware.ts           依据当前站点安全配置写入 CSP 等响应头
```

依赖方向：

```text
pages -> site-package/index -> 当前站点包
services -> currentSite + core-webApp
site-package/{site} -> cms + core-webApp + runtime
core-webApp -> cms
cms -> 不依赖站点包、React 组件或页面
```

`core-webApp`、`cms`、`runtime` 不得反向导入站点包。跨站点相同的类型和业务逻辑应优先放到这些共享层，而不是从某个站点包再次导出。

## 站点选择与路由

站点由构建环境变量 `PUBLIC_SITE_NAME` 决定，缺省为 `kellogg`：

```ts
const siteName = import.meta.env.PUBLIC_SITE_NAME || "kellogg";
```

通用路由入口使用站点配置中注册的页面 loader：

```astro
---
import { currentSite, loadSitePage } from "@site-package";

const ProductsPage = await loadSitePage(currentSite.pages?.products);
if (!ProductsPage) return Astro.redirect("/404");
---

<ProductsPage />
```

物理路由集中于 `src/pages/`，包括 CMS catch-all、产品、产品详情、博客、询盘、客户评价和 sitemap。站点包中的 `config.ts` 通过懒加载声明其支持的页面能力；未注册的能力会由通用路由返回 404。

### 新增或启用站点

1. 创建或完善 `src/site-package/{siteName}/config.ts`、布局、样式、页面与组件。
2. 在 `src/site-package/index.ts` 导入配置并加入 `siteConfigs`。
3. 在构建环境设置 `PUBLIC_SITE_NAME={siteName}`。
4. 检查站点 `pages` 注册、`SiteLayout`、`BlockRenderer`、`loadBlockData` 与站点配置是否完整。

`@site` 和 `@site/*` 目前在 `tsconfig.json` 中仍固定指向 Kellogg。多站点或共享代码不得使用这两个别名，应使用 `@site-package`、相对站点路径，或共享层别名。

## 运行时配置与环境变量

`createDefaultSiteRuntimeConfig()` 统一提供基础运行时配置。站点包只声明品牌、域名回退值、资产白名单、默认货币、SEO 与页面能力等差异。

常用环境变量：

| 变量 | 用途 |
| --- | --- |
| `PUBLIC_SITE_NAME` | 当前站点名称，当前注册值为 `kellogg` |
| `PUBLIC_SITE_URL` | 当前站点根地址，用于运行时 URL、SEO 和 sitemap |
| `PUBLIC_API_BASE_URL` | 生产 API 根地址 |
| `PUBLIC_API_BASE_URL_LOCAL` | 本地开发 API 根地址 |
| `PUBLIC_API_ASSETS` | 资源 API 根地址 |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 站点 key |

不要把生产密钥写入组件。Turnstile 是 runtime 组件，由站点配置传入 key；CSP 默认允许 Turnstile、Tawk 和受支持的视频提供方，站点需要额外第三方域名时在运行时安全配置中补充。

## CMS 页面与区块

CMS 页面由 `DynamicRenderer.astro` 统一处理：

1. 读取页面 schema，仅保留可见区块。
2. 创建请求内 `requestMemo`，合并相同数据请求。
3. 调用站点 `loadBlockData` 预取区块所需数据。
4. 将内容与预取数据交给站点 `BlockRenderer.astro` 渲染。

`DynamicRenderer` 会向 `loadBlockData` 传入当前 URL，因此产品网格可以在 SSR 阶段直接根据 `page`、`category`、`sort` 请求正确的数据页。

### 区块实现规则

- `components/blocks/` 放区块 UI；UI 可以依赖 React、动画、`runtime` 组件和站点的展示工具，但不直接请求 API。
- `components/blocks-containers/` 放确有查询、状态、货币或 URL 同步需求的区块容器。
- 用于后台编辑器的 `XxxContent` 类型与对应 `Xxx` 积木组件放在同一文件；`types/blocks.ts` 只聚合成 `BlockContentMap`，不重复定义 Content。
- 产品/博客列表等需要 SSR 与交互查询的区块由 container 调用共享 hooks；简单展示区块不应为了形式额外创建 container。
- 新增站点组件时优先使用 `.tsx` / `.ts`。站点包中新增 `.astro` 仅放在 `pages/`；现存的非页面 `.astro` 为兼容遗留，不继续扩大。

## 产品与博客列表

### 产品网格

共享查询规则位于：

- `core-webApp/lib/productGrid.ts`：解析 URL、构造 API 参数、生成规范 URL。
- `core-webApp/hooks/useProductGrid.ts`：SSR 初始数据、客户端请求、取消过期请求、浏览器历史记录同步。

`ProductGrid` 是展示组件：产品卡片和排序能力为必传；分类筛选、分页、加载状态和文案按场景可选。站点 container 负责 API 调用、货币格式化、语言化分类名称和分页状态。

产品页查询参数：

```text
/products?page=2&category={categoryId}&sort=newest|price-asc|price-desc|sales
```

URL 参数优先于默认值。没有参数时默认显示全部分类、第 1 页和最新排序。

### 博客网格

共享查询规则位于 `core-webApp/lib/blogGrid.ts` 与 `core-webApp/hooks/useBlogGrid.ts`。博客索引页先根据 URL 在 SSR 阶段调用 `PageService.loadBlogIndexPageData()`，客户端容器接管后续分类、排序与分页。

博客页查询参数：

```text
/blog?page=2&category={categoryName}&sort=newest|popular|oldest
```

BlogGrid 负责博客的展示语言解析、日期与本地化文案；container 只负责 API、查询状态和 URL 同步。博客分类来自公开的 `getBlogCategories()` 接口，而非通过拉取大量博客在前端推导。

## 通用页面业务

`PageService` 承担跨站点共用的页面数据加载，例如：

- 商品详情与相关推荐
- 博客索引与博客详情
- 博客分类和分页数据

站点页面负责站点布局、品牌视觉、SEO 兜底及将页面数据交给站点 UI。客户评价接口当前一次返回公开评价数据，由页面 UI 在浏览器侧进行简单分页。

## 多语言、媒体与安全

- `Language` 可扩展，不限定为 `zh` 与 `en`；文本统一使用 `Translation` 字典。
- 站点 `createTranslate(lang)` 包装通用翻译工具，站点 UI 应用它解析 `Translation` 内容。
- 富文本或 CMS HTML 必须先经 `sanitizeCmsHtml()` 清理。
- 图片使用 `runtime/OptimizedImage`；第三方视频 URL 必须经 `cms/lib/video` 校验与转换。
- `SiteService.getSiteData(Astro)` 使用 `Astro.locals` 缓存当前请求的站点基础数据，避免单次 SSR 重复请求；不使用模块级 API 响应缓存。

## SEO、站点地图与 robots

- `CoreLayout` 输出基础 SEO 元信息；站点 `SiteLayout` 解析站点名称、页面 SEO 与 alternate links。
- `src/pages/sitemap.xml.ts` 在运行时汇总当前站点支持的页面、产品、博客与 CMS 页面。
- 页面 SEO 与 alternate links 由已发布的页面 SEO 数据提供，站点布局负责解析与输出。
- `public/robots.txt` 当前是固定的 Kellogg 文件。robots 的多站点配置与后台管理尚未接入，切换站点前必须单独处理该文件。

## 常用命令

```bash
npm run dev
npm run preview
npm run build
npm test
npm run test:architecture
npm run test:security
npm run test:inquiry
npm run test:requests
npm run test:accessibility
npm run generate-types
```

日常协作只运行与当前改动相关的检查；不要默认执行完整构建或全量测试。SSR 页面应通过 Astro/Cloudflare 的服务环境验证，不能仅依赖静态文件预览。
