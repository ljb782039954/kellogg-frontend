# WebApp Security And Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复前台与公开询盘接口的高风险安全问题，减少 SSR/API 重复请求和不必要水合，并收紧 Blocks 类型与维护边界。

**Architecture:** Astro 继续承担 SSR/SSG 数据装配，React 只负责确有交互需求的 Islands。内容输出统一经过白名单消毒，媒体 URL 统一经过域名校验；请求层使用单次渲染共享、in-flight Promise 去重、超时和 Cloudflare 缓存语义，不引入客户端 Query 框架。

**Tech Stack:** Astro 6、React 19、TypeScript、Cloudflare Workers/D1/KV、Node test runner、sanitize-html、Turnstile。

---

### Task 1: 内容与媒体安全

**Files:**
- Create: `src/lib/contentSecurity.ts`
- Create: `src/lib/video.ts`
- Modify: `src/components/RichText.tsx`
- Modify: `src/components/blocks/CustomerReviews.tsx`
- Modify: `src/components/blocks/Carousel.tsx`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/product/[id].astro`
- Test: `tests/security.test.mjs`

- [ ] 先写危险 HTML 和未知视频域名的失败测试。
- [ ] 安装并封装白名单 sanitizer，所有 CMS HTML 通过同一入口。
- [ ] 建立视频 URL 解析器，仅允许 YouTube、Vimeo、TikTok、Facebook 和自有媒体域名。
- [ ] 运行安全测试、类型检查和构建。

### Task 2: 询盘防滥用

**Files:**
- Modify: `webApp-astro/src/hooks/useInquiry.ts`
- Modify: `webApp-astro/src/components/blocks/InquirySection.tsx`
- Modify: `webApp-astro/src/components/pages/InquiryView.tsx`
- Modify: `worker-api/src/routes/inquiries.ts`
- Modify: `worker-api/src/types/api-input.ts`
- Test: `worker-api/tests/inquiries.test.mjs`

- [ ] 为缺失 Turnstile token、无效邮箱、字段超限和重复提交写失败测试。
- [ ] 前端表单加入 Turnstile token 状态与重复提交保护。
- [ ] Worker 在写 D1 前执行 token 校验、字段规范化和长度限制。
- [ ] 实际云端 Widget/验证 Worker 的创建遵循 Turnstile Spin 确认流程。

### Task 3: SSR 请求去重与超时

**Files:**
- Create: `webApp-astro/src/lib/requestCache.ts`
- Modify: `webApp-astro/src/lib/api.ts`
- Modify: `webApp-astro/src/services/siteService.ts`
- Modify: `webApp-astro/src/layouts/Layout.astro`
- Modify: `webApp-astro/src/functions/DynamicRenderer.astro`
- Test: `webApp-astro/tests/request-cache.test.mjs`

- [ ] 为并发相同 GET 复用 Promise、失败后清除缓存、超时取消写失败测试。
- [ ] 页面级 `Astro.locals` 共享 site data，Layout 接受已加载数据。
- [ ] DynamicRenderer 对分类和相同商品查询复用请求。
- [ ] 客户端筛选使用 AbortController 取消旧请求。

### Task 4: Island 与构建性能

**Files:**
- Modify: `webApp-astro/src/components/Header/*`
- Modify: `webApp-astro/src/components/blocks/InquirySection.tsx`
- Modify: `webApp-astro/src/components/blocks/Gallery.tsx`
- Modify: `webApp-astro/src/components/blocks/ImageFull.tsx`
- Modify: `webApp-astro/src/functions/DynamicRenderer.astro`
- Modify: `webApp-astro/src/pages/product/[id].astro`

- [ ] 删除无效 Header 滚动状态，拆出可延迟交互边界。
- [ ] Gallery/ImageFull 改为可见时水合并使用具名图标导入。
- [ ] 商品详情改为动态 SSR，移除 1000 商品全量静态路径生成。
- [ ] 对比构建产物客户端 chunk 和构建耗时。

### Task 5: 类型、复用与可访问性

**Files:**
- Modify: `webApp-astro/src/types/blocks.ts`
- Modify: `webApp-astro/src/functions/DynamicRenderer.astro`
- Modify: `webApp-astro/src/components/blocks/{Carousel,Gallery,ImageFull}.tsx`
- Consolidate: `webApp-astro/src/components/product/ProductCard*`
- Modify: `webApp-astro/docs/README.md`

- [ ] 将 PageBlock 改为按 BlockType 区分的联合类型。
- [ ] 收敛商品卡片为静态核心和单一交互包装。
- [ ] 补充按钮标签、Escape、焦点和键盘导航。
- [ ] 生产环境隐藏未知 Block 原始 JSON。
- [ ] 更新导航文档和架构测试。

### Task 6: 完整验证

- [ ] 运行所有 Node 测试与 Worker 测试。
- [ ] 运行 webApp 和 worker-api TypeScript 检查。
- [ ] 运行 webApp 完整构建。
- [ ] 运行 `git diff --check` 并复核未提交改动。
