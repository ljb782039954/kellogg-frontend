# webApp-astro — 前台用户端

Astro 6 + React 19 SSR，部署于 Cloudflare Workers。

---

## src/ 目录导航

```
components/
├── blocks/        22种积木块组件（React Island 或纯 Astro）
├── Header/        导航（React Island，含语言/货币切换）
├── product/       商品卡片/详情数据/自定义字段数据
└── Footer.astro + TawkChat.astro
functions/
├── DynamicRenderer.astro  积木块渲染引擎入口
└── 
layouts/Layout.astro  全局布局（SEO/站点数据加载/语言检测）
lib/
├── api.ts         所有后端请求封装
├── currency.ts    汇率换算
└── i18n.ts        中英翻译函数
pages/             每个文件即一个路由
├── [...slug].astro    通配符，渲染后台配置的 CMS 页面
├── products.astro + product/[id].astro
├── inquiry.astro + blog/ + customer-reviews.astro
└── sitemap.xml.ts     动态站点地图
services/
├── siteService.ts     并发加载5个 KV 配置 + 语言检测
└── currencyService.ts 客户端货币检测
types/              类型定义（与 adminApp 和 worker-api 共享相同结构）
```

---

## 架构要点

### 积木块渲染机制
`DynamicRenderer.astro` 接收 `CustomPage` schema，按 `BlockType` switch 分发到对应组件。需要全局数据的块（如 featuredProducts、categories）在 SSR 阶段预取数据再传给组件。

### 语言检测优先级
URL 参数 `?lang=` → Cookie `lang` → 默认 `'en'`。切换时写 cookie 后 reload 页面。

### 货币系统
数据库所有价格以 CNY 存储。`siteService` 将汇率表注入 `window.__EXCHANGE_RATES__`，客户端通过 nanostores（`$currency` + `$rates`）管理切换，触发 `currency-change` 自定义事件通知各组件。

### 状态管理策略
不使用 React Context。语言和数据通过 Astro props 向下传递，客户端用 nanostores + 自定义事件完成货币切换等交互。

### 图片优化
使用 Cloudflare Image Resizing（`/cdn-cgi/image/`）自动 format 转换和尺寸裁剪。`api.getOptimizedImageUrl(url, width)` 拼接参数。

### SSR vs SSG
`[...slug].astro`（CMS 页面）通过 `getStaticPaths()` 预渲染为静态页面。商品详情页(`product/[id].astro`)为 SSR 动态渲染。博客和评价为 SSG。

## 环境变量

`.env`: 生产环境所需要的环境变量
`.env.local`: 本地开发环境所需的环境变量，由`PUBLIC_IS_LOCAL_DEV`值来决定项目是否访问本地开发环境。

