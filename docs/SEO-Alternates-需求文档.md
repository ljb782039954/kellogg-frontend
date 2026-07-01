# SEO 元数据与 Robots 后台化需求文档

## 背景

当前前端曾在站点配置中维护固定的 `seo.alternates` 链接数组，用于输出 `hreflang` alternate links。
同时，当前项目存在静态 `public/robots.txt` 文件，其中包含固定域名：

```txt
User-agent: *
Allow: /

Sitemap: https://kelloggfashion.com/sitemap.xml
```

这种方式存在维护问题：

- 后台修改页面路径后，前端硬编码链接不会自动同步。
- 不同页面的 alternate 关系不一定相同，统一写在站点配置中不够准确。
- 链接失效或指向不存在页面时，可能对 SEO 产生负面影响。
- 新增站点或新增落地页时需要改前端代码，不符合内容后台化管理方向。
- `robots.txt` 如果固定在 `public/`，不同站点、不同环境、不同域名无法从后台统一管理。

因此，`alternates` 和 `robots.txt` 不应作为前端静态配置长期维护，而应由后端 SEO 配置提供，前端根据 KV 数据决定是否输出。

## 目标

将 SEO alternate links 与 robots.txt 从前端静态配置迁移为后台可编辑配置。

后端负责：

- 在页面 SEO 配置中维护 alternate links。
- 将 alternate 数据保存到 KV 页面数据中。
- 支持后台编辑、新增、删除 alternate 项。
- 在站点级 SEO 配置中维护 robots.txt 内容或 robots 规则。
- 将 robots 配置保存到 KV 站点配置中。

前端负责：

- 从 KV 页面数据中读取当前页面的 SEO 配置。
- 如果页面存在 `seo.alternates`，则输出对应 `<link rel="alternate" hreflang="..." href="..." />`。
- 如果页面不存在 `seo.alternates`，则不输出 alternate links。
- 提供动态 `/robots.txt` 路由。
- 从 KV 站点 SEO 配置中读取 robots 内容。
- 如果后台没有配置 robots 内容，则输出安全默认值。
- 不再长期依赖 `public/robots.txt` 中的固定域名文件。

## 数据结构建议

### 页面级 SEO

页面数据中的 `seo` 字段可增加可选 `alternates`。

```ts
interface PageSeo {
  title?: Translation;
  description?: Translation;
  keywords?: Translation;
  targetCountry?: string;
  alternates?: SeoAlternate[];
}

interface SeoAlternate {
  href: string;
  hreflang: string;
}
```

### 站点级 Robots

站点配置中可增加 SEO robots 配置。建议先采用“完整文本”方案，最省事且兼容性最好。

```ts
interface SiteSeoConfig {
  robotsTxt?: string;
}
```

示例：

```json
{
  "seo_config": {
    "robotsTxt": "User-agent: *\nAllow: /\n\nSitemap: https://kelloggfashion.com/sitemap.xml"
  }
}
```

如果后续后台希望做结构化编辑，也可以扩展成规则模型：

```ts
interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
}

interface SiteSeoConfig {
  robotsTxt?: string;
  robotsRules?: RobotsRule[];
  sitemapUrl?: string;
}
```

短期推荐只实现 `robotsTxt`，避免前后端同时维护一套 robots 规则生成器。

示例：

```json
{
  "seo": {
    "title": {
      "zh": "重磅连帽衫制造商",
      "en": "Heavyweight Hoodie Manufacturer"
    },
    "description": {
      "zh": "高品质重磅连帽衫定制生产",
      "en": "High quality heavyweight hoodie manufacturing"
    },
    "alternates": [
      {
        "href": "https://kelloggfashion.com/usa-heavyweight-hoodie-manufacturer",
        "hreflang": "en-US"
      },
      {
        "href": "https://kelloggfashion.com/uk-streetwear-clothing-manufacturer",
        "hreflang": "en-GB"
      },
      {
        "href": "https://kelloggfashion.com/",
        "hreflang": "x-default"
      }
    ]
  }
}
```

## 后端管理要求

### Alternates

后台页面编辑器需要支持：

- 在页面 SEO 配置中编辑 alternate links。
- 每条 alternate 包含：
  - `href`：完整 URL。
  - `hreflang`：语言或地区标识，例如 `en-US`、`en-GB`、`zh-CN`、`x-default`。
- `alternates` 为可选字段。
- 支持不配置 alternate links。
- 保存时写入对应页面的 KV 数据。

建议校验：

- `href` 必须是合法 URL。
- `hreflang` 不为空。
- 同一个页面内不应出现重复 `hreflang`。
- `x-default` 最多一个。

### Robots

后台站点 SEO 设置需要支持：

- 编辑 robots.txt 完整文本。
- 保存到 KV 站点配置，例如 `seo_config.robotsTxt`。
- 允许留空。
- 留空时前端使用默认 robots 内容。

建议校验：

- robots 内容必须是纯文本。
- 不允许输入 HTML。
- 可提示用户确认是否包含 `Sitemap:`。
- 如果包含 `Sitemap:`，建议 URL 为完整绝对地址。

## 前端渲染要求

### Alternates

前端页面渲染时：

- 优先使用当前页面 KV 数据中的 `seo.alternates`。
- 如果没有 `seo.alternates`，不输出 alternate links。
- 不再从站点 `config.ts` 中读取固定 alternates 数组。
- `CoreLayout` 可继续保留 `alternates` 入参，以便页面将 KV 中的数据传入。

输出示例：

```html
<link rel="alternate" hreflang="en-US" href="https://kelloggfashion.com/usa-heavyweight-hoodie-manufacturer" />
<link rel="alternate" hreflang="en-GB" href="https://kelloggfashion.com/uk-streetwear-clothing-manufacturer" />
<link rel="alternate" hreflang="x-default" href="https://kelloggfashion.com/" />
```

### Robots

前端新增动态路由：

```text
src/pages/robots.txt.ts
```

响应逻辑：

- 从站点配置 API/KV 中读取 `seo_config`。
- 如果存在 `seo_config.robotsTxt`，直接输出该文本。
- 如果不存在，输出默认内容：

```txt
User-agent: *
Allow: /

Sitemap: {siteUrl}/sitemap.xml
```

响应头：

```http
Content-Type: text/plain; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

迁移完成后，删除或停止使用 `public/robots.txt`，避免静态文件优先级覆盖动态路由。

## 非目标

本次不要求：

- 自动推断所有页面的 alternate links。
- 自动生成跨页面映射关系。
- 强制每个页面都必须配置 alternates。
- 在前端站点配置中继续维护固定 alternates 数组。
- 在第一阶段实现复杂 robots 规则编辑器。
- 自动从所有页面生成 robots 规则。

## 兼容策略

- 旧页面没有 `seo.alternates` 时，前端保持正常渲染。
- 不输出 alternates 不影响页面基础 SEO。
- 后台逐步补充重点页面的 alternates 即可。
- 后台没有配置 robots 时，前端输出默认允许抓取和当前站点 sitemap。
- 在动态 `/robots.txt` 上线前，当前 `public/robots.txt` 可作为临时兼容文件保留。

## 验收标准

- 后台可以编辑页面级 `seo.alternates`。
- KV 页面数据中可以保存 alternate links。
- 前端可以根据页面数据输出 alternate links。
- 删除页面中的 `seo.alternates` 后，前端不再输出 alternate links。
- 前端站点配置中不再维护硬编码 alternates 数组。
- 后台可以编辑站点级 robots.txt 内容。
- KV 站点配置中可以保存 `seo_config.robotsTxt`。
- 前端 `/robots.txt` 可以根据 KV 配置输出文本。
- 后台清空 robots 配置后，前端输出默认 robots 内容。
- 静态 `public/robots.txt` 不再作为长期维护入口。
