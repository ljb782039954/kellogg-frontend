# webApp-astro - 前台用户端

Astro 6 + React 19 + TypeScript，部署到 Cloudflare Workers。页面默认服务端输出 HTML，只有确需交互的 React 组件使用 Astro Islands 水合。

## 目录导航

```text
src/
├─ components/
│  ├─ blocks/          22 种 TSX 积木组件
│  ├─ Header/          导航、语言和货币交互
│  ├─ product/         商品卡片、详情与自定义字段
│  ├─ RichText.tsx     CMS 富文本解析与白名单消毒
│  └─ TurnstileWidget.tsx
├─ functions/
│  └─ DynamicRenderer.astro  CMS Block 分发与请求内数据注入
├─ layouts/
│  └─ Layout.astro     SEO、全站数据、Header、Footer
├─ lib/
│  ├─ api.ts           API 请求、超时与取消
│  ├─ contentSecurity.ts
│  ├─ requestMemo.ts   单次页面渲染的 Promise 去重
│  └─ video.ts         视频 URL 白名单与嵌入转换
├─ services/
│  └─ siteService.ts   通过 Astro.locals 共享全站配置请求
├─ pages/
│  ├─ [...slug].astro  CMS 页面，构建时预渲染
│  ├─ product/[id].astro 商品详情，动态 SSR
│  ├─ products.astro
│  ├─ blog/
│  └─ inquiry.astro
└─ middleware.ts       CSP 与基础安全响应头
```

## 渲染边界

- 静态 Blocks 使用 TSX，但不添加 `client:*`，只在服务端渲染。
- Carousel、ProductGrid、Countdown 等交互组件按需要水合。
- Gallery、ImageFull、FAQ、Statistics 和询盘表单使用 `client:visible` 延迟水合。
- 商品详情采用动态 SSR，避免构建阶段全量预渲染商品。

## 数据请求

- `SiteService.getSiteData(Astro)` 将 Promise 保存到 `Astro.locals`，页面和 Layout 共享一次请求。
- `DynamicRenderer.astro` 使用请求内 Map 合并相同分类、商品和评价请求。
- `api.ts` 默认 10 秒超时；客户端商品筛选会取消已过期请求。
- 不使用模块级请求缓存，避免 Cloudflare isolate 跨请求共享 I/O。

## 安全边界

- CMS Markdown/HTML 必须经过 `sanitizeCmsHtml()`。
- iframe 和视频只能通过 `getSafeVideoSource()` 的域名白名单。
- 询盘必须携带 Turnstile token，最终由 `worker-api` 服务端验证。
- `middleware.ts` 设置 CSP、frame、referrer、permissions 等响应头。

## 常用命令

```bash
npm test
npm run build
npm run test:architecture
```

生产环境需要配置 `PUBLIC_TURNSTILE_SITE_KEY`。本地开发使用 Cloudflare 官方测试 site key。
