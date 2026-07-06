# 页面 SEO Alternates 管理计划

## 背景

`webApp-astro/src/site-package/kellogg/config.ts` 当前在站点级 `seo.alternates` 中硬编码了一组区域页面 URL。这个设计不合理：

- 这些 URL 是具体页面的 SEO 内容，不是站点运行时配置。
- `SiteLayout.astro` 会把这组 alternates 传给所有页面，导致无关页面也输出同一批 `hreflang`。
- 后台页面管理无法维护这些 SEO 关系，修改 URL 或新增区域页面时必须改前台代码。
- 这会继续放大多项目迁移成本，让 `webApp-astro` 的站点配置承担内容管理职责。

因此，`seo.alternates` 应从站点配置下沉到页面 SEO 数据，由 `adminApp` 的页面管理维护，`webApp-astro` 只负责渲染。

## 目标

1. 页面管理可以维护每个页面的 alternate links。
2. `webApp-astro` 根据当前页面数据输出 `link rel="alternate"`。
3. `config.ts` 只保留站点运行时配置和 SEO 默认兜底，如 `defaultTitle`。
4. 现有页面在迁移完成前不丢失 SEO 信息。
5. hreflang 使用独立管理模块，不混入普通页面 SEO 表单。

## 数据契约

建议在跨项目页面契约中增加一个最小类型：

```ts
export interface SeoAlternate {
  hreflang: string;
  href: string;
  enabled?: boolean;
}
```

页面 SEO 扩展为：

```ts
seo?: {
  title: Translation;
  description: Translation;
  keywords?: Translation;
  targetCountry?: string;
  alternates?: SeoAlternate[];
};
```

`href` 第一阶段可以支持完整 URL 或站内路径。渲染时如果是站内路径，由 `webApp-astro` 使用 `siteConfig.siteUrl` 归一化为完整 URL。

`hreflang` 需要做基础校验，允许 `x-default`、`en`、`zh`、`en-US`、`en-GB`、`en-CA`、`en-AU` 等格式。当前配置中的 `en-UK` 建议迁移时修正为标准的 `en-GB`。

## 实施步骤

### 1. 契约层

- 在 `adminApp/src/cms/types/pages.ts`、`webApp-astro/src/cms/types/pages.ts` 和 worker-api 的页面契约中补充 `SeoAlternate`。
- 如果 worker-api 后续已建立 contracts 包，应优先从 contracts 导出页面 SEO 类型，再由各前端项目复用。

### 2. 后台 hreflang 管理

- 在 `Dashboard` 主侧边栏新增独立入口：`/hreflang`。
- 不把 hreflang 放入 `SEOEditor`，因为不是每个页面都需要配置地区替代关系。
- 不放入 `PageLayoutEditor`，因为这不是“当前页面编辑”，而是“一组页面关系”的站点级管理。
- 业务逻辑必须放在 `core-adminApp/items/hreflang` 和 `ContentContext`，UI 组件只负责调用逻辑和展示。
- hreflang 管理模块的每一行包含：
  - 左侧下拉：选择页面链接
  - 右侧下拉：选择 `hreflang`
  - 启用 / 停用
  - 删除
- `hreflang` 不直接让运营手写，第一阶段提供地区下拉选项和中文说明：
  - `x-default`：默认页面，无法判断语言或地区时展示
  - `en`：英语页面
  - `en-US`：美国英语页面
  - `en-GB`：英国英语页面
  - `en-CA`：加拿大英语页面
  - `en-AU`：澳大利亚英语页面
  - `zh`：中文页面
  - `zh-CN`：中国大陆中文页面
  - `zh-HK`：香港中文页面
- 保存时不只写当前页面，而是批量同步：
  - 启用列表中的每个页面都会写入同一份 `seo.alternates`
  - 从启用列表移除或停用的页面，会从对应页面 JSON 中删除 `seo.alternates`
- 页面管理卡片不展示 hreflang 状态，避免把列表页变成 SEO 检查面板。

### 3. 后端存储与兼容

- worker-api 保存页面配置时保留 `seo.alternates` 字段。
- 读取旧页面时，如果没有 `alternates`，按空数组处理。
- 将当前 `config.ts` 里硬编码的 alternates 迁移到对应页面的 SEO 数据中。
- 本地 KV 种子数据中的 USA、UK、Canada、Australia 四个区域落地页已迁入同一组 `alternates`；原来的 `en-UK` 已修正为标准 `en-GB`。

注意：如果这些区域页面互相构成同一组 hreflang 关系，每个相关页面都应该输出同一组 alternates。第一阶段可以在各页面 SEO 中重复维护；如果后续页面数量增多，再考虑引入 `alternateGroupId` 或 SEO 分组管理。

### 4. 前台渲染

- 扩展 `SiteLayout.astro` 的 `seo` 入参，允许传入 `alternates`。
- `SiteLayout.astro` 不再从 `kelloggSiteConfig.seo.alternates` 读取页面 alternate links。
- `CmsPage.astro` 从当前页面的 `page.seo.alternates` 传给 `SiteLayout`。
- `CoreLayout.astro` 当前已经支持 `alternates` 渲染，保留该能力。
- 商品详情、博客详情等固定布局页面先不复用页面管理中的 alternates；如果后续需要，再从商品/博客自身 SEO 数据生成。

### 5. 清理站点配置

- 数据迁移完成后，从 `webApp-astro/src/site-package/kellogg/config.ts` 删除 `seo.alternates`。当前已删除 Kellogg 配置中的硬编码 alternates。
- `SiteConfig` 类型中的 `seo.alternates` 可以标记废弃，或直接移除。
- `webApp-astro/docs/README.md` 中同步说明：站点配置只放 SEO 默认兜底，不放页面级 alternate links。

## 验证方式

- 打开一个有 alternates 的 CMS 页面，确认 `<head>` 输出对应的 `link rel="alternate"`。
- 打开一个没有 alternates 的页面，确认不会输出旧的硬编码区域链接。
- 在 adminApp 修改页面 SEO 后保存，再刷新前台页面确认生效。
- 只运行与类型和页面管理相关的局部检查，不需要跑全量测试或构建。
