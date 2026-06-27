import { api } from "../lib/api";
import { SiteService } from "../services/siteService";

export const prerender = false;

/**
 * 动态生成 Sitemap.xml
 * 包含静态页面 (CustomPages) 和动态商品详情页 (Products)
 */
export async function GET() {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://kelloggfashion.com';

  try {
    // 1. 并发获取页面和商品数据
    const [siteData, productsRes] = await Promise.all([
      SiteService.getSiteData(),
      api.getProducts({ pageSize: 1000 }) // 假设商品总量不超过1000，否则需要分页递归抓取
    ]);

    const pages = siteData.pages || [];
    const products = productsRes.data || [];

    // 2. 构造 URL 列表
    const urls: string[] = [];

    // 处理自定义页面
    pages.forEach(page => {
      // 过滤掉隐藏页面或系统页面（如果有的话）
      const loc = `${siteUrl}${page.path.startsWith('/') ? page.path : '/' + page.path}`;
      urls.push(`
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.path === '/' ? '1.0' : '0.9'}</priority>
  </url>`);
    });

    // Process product detail pages
    products.forEach(product => {
      if (!product.isActive) return;
      
      const loc = `${siteUrl}/product/${product.id}`;
      const imageUrl = api.resolveMediaUrl(product.image);
      const title = typeof product.name === 'string' ? product.name : (product.name?.en || '');

      urls.push(`
  <url>
    <loc>${loc}</loc>
    <lastmod>${product.releaseDate ? new Date(product.releaseDate).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title><![CDATA[${title}]]></image:title>
    </image:image>
  </url>`);
    });

    // Process blog article pages
    try {
      const blogsRes = await api.getBlogs({ pageSize: 1000, sort: 'newest' });
      (blogsRes.data || []).forEach((blog: any) => {
        const loc = `${siteUrl}/blog/${blog.slug}`;
        const lastmod = blog.updated_at ? new Date(blog.updated_at).toISOString() : new Date().toISOString();
        const imageEntry = blog.cover_image
          ? `\n    <image:image>\n      <image:loc>${blog.cover_image}</image:loc>\n      <image:title><![CDATA[${blog.title_en || blog.title_zh}]]></image:title>\n    </image:image>` : '';
        urls.push(`
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageEntry}
  </url>`);
      });
    } catch (blogErr) {
      console.warn('[Sitemap] Could not fetch blog posts:', blogErr);
    }

    // 3. 组装 XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('')}
</urlset>`.trim();

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        // 边缘缓存策略：缓存 1 小时，后台异步刷新
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    });

  } catch (error) {
    console.error("[Sitemap Error]:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
