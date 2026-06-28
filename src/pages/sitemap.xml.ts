import { api } from "@services/api";
import { SiteService, siteConfig } from "@services/siteService";
import {
  getCmsPageSitemapPath,
  joinSiteUrl,
  renderSitemapXml,
  type SitemapUrl,
} from "@core/lib/sitemap";

export const prerender = false;

const fixedPageCapabilities: Record<string, keyof NonNullable<typeof siteConfig.pages>> = {
  products: "products",
  "system-inquiry": "inquiry",
  "customer-reviews": "customerReviews",
  "system-blog": "blogIndex",
};

function canIncludeCmsPage(page: { id: string; type?: string }): boolean {
  const requiredCapability = fixedPageCapabilities[page.id];
  if (!requiredCapability) return true;
  return Boolean(siteConfig.pages?.[requiredCapability]);
}

/**
 * 动态生成 Sitemap.xml
 * 包含静态页面 (CustomPages) 和动态商品详情页 (Products)
 */
export async function GET() {
  const siteUrl = siteConfig.siteUrl;
  const supportsProductDetails = Boolean(siteConfig.pages?.productDetail);
  const supportsBlogDetails = Boolean(siteConfig.pages?.blogDetail);

  try {
    // 1. 并发获取页面和商品数据
    const [siteData, productsRes] = await Promise.all([
      SiteService.getSiteData(),
      supportsProductDetails
        ? api.getProducts({ pageSize: 1000 }) // 假设商品总量不超过1000，否则需要分页递归抓取
        : Promise.resolve({ data: [] }),
    ]);

    const pages = siteData.pages || [];
    const products = productsRes.data || [];

    // 2. 构造 URL 列表
    const urls: SitemapUrl[] = [];

    // 处理自定义页面
    pages.forEach(page => {
      if (!canIncludeCmsPage(page)) return;
      const path = getCmsPageSitemapPath(page);
      if (!path) return;

      urls.push({
        loc: joinSiteUrl(siteUrl, path),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: path === "/" ? "1.0" : "0.9",
      });
    });

    // Process product detail pages
    products.forEach(product => {
      if (!product.isActive) return;
      
      const imageUrl = api.resolveMediaUrl(product.image);
      const title = typeof product.name === 'string' ? product.name : (product.name?.en || '');

      urls.push({
        loc: joinSiteUrl(siteUrl, `/product/${product.id}`),
        lastmod: product.releaseDate ? new Date(product.releaseDate).toISOString() : new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
        image: {
          loc: imageUrl,
          title,
        },
      });
    });

    // Process blog article pages
    if (supportsBlogDetails) try {
      const blogsRes = await api.getBlogs({ pageSize: 1000, sort: 'newest' });
      (blogsRes.data || []).forEach((blog: any) => {
        const lastmod = blog.updated_at ? new Date(blog.updated_at).toISOString() : new Date().toISOString();
        urls.push({
          loc: joinSiteUrl(siteUrl, `/blog/${blog.slug}`),
          lastmod,
          changefreq: "weekly",
          priority: "0.7",
          image: blog.cover_image
            ? {
                loc: blog.cover_image,
                title: blog.title_en || blog.title_zh,
              }
            : undefined,
        });
      });
    } catch (blogErr) {
      console.warn('[Sitemap] Could not fetch blog posts:', blogErr);
    }

    // 3. 组装 XML
    const sitemap = renderSitemapXml(urls);

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
