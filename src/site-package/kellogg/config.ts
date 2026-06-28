import type { SiteConfig } from "../../core/types";
import CmsPage from "./pages/CmsPage.astro";
import ProductsPage from "./pages/ProductsPage.astro";
import InquiryPage from "./pages/InquiryPage.astro";
import CustomerReviewsPage from "./pages/CustomerReviewsPage.astro";
import BlogIndexPage from "./pages/BlogIndexPage.astro";
import BlogDetailPage from "./pages/BlogDetailPage.astro";
import ProductDetailPage from "./pages/ProductDetailPage.astro";
import { createKelloggApiClient } from "./utils/api";
import type { BlogSummary } from "./types";

export const kelloggSiteConfig = {
  name: "kellogg",
  displayName: "Kellogg Fashion",
  languages: ["zh", "en"],
  defaultLanguage: "en",
  fallbackLanguages: ["en", "zh"],
  siteUrl: import.meta.env.PUBLIC_SITE_URL || "https://kelloggfashion.com",
  api: {
    baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
    localBaseUrl: import.meta.env.PUBLIC_API_BASE_URL_LOCAL,
    assetsBaseUrl: import.meta.env.PUBLIC_API_ASSETS,
    assetHostnames: ["kelloggfashion.com", "kellogg-fashion.com"],
  },
  createApiClient: createKelloggApiClient,
  currency: {
    defaultCurrency: "USD",
  },
  turnstile: {
    siteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
    useTestSiteKey: import.meta.env.DEV,
  },
  tawk: {
    scriptUrl: "https://embed.tawk.to/69f7493d0b9cc71c320940a8/1jnmvc6gf",
  },
  seo: {
    defaultTitle: "Kellogg Fashion",
    alternates: [
      {
        href: "https://kellogg-fashion.com/",
        hreflang: "x-default",
      },
      {
        href: "https://kelloggfashion.com/usa-heavyweight-hoodie-manufacturer",
        hreflang: "en-US",
      },
      {
        href: "https://kelloggfashion.com/uk-streetwear-clothing-manufacturer",
        hreflang: "en-UK",
      },
      {
        href: "https://kelloggfashion.com/canada-blank-apparel-supplier",
        hreflang: "en-CA",
      },
      {
        href: "https://kelloggfashion.com/australia-heavyweight-tshirt-supplier",
        hreflang: "en-AU",
      },
    ],
  },
  security: {
    csp: {
      scriptSrc: ["https://challenges.cloudflare.com", "https://*.tawk.to"],
      frameSrc: [
        "https://challenges.cloudflare.com",
        "https://www.youtube-nocookie.com",
        "https://player.vimeo.com",
        "https://www.facebook.com",
        "https://www.tiktok.com",
        "https://*.tawk.to",
      ],
      connectSrc: ["https:", "wss:"],
    },
    videoProviders: ["youtube", "vimeo", "facebook", "tiktok", "direct"],
  },
  pages: {
    cms: CmsPage,
    products: ProductsPage,
    inquiry: InquiryPage,
    customerReviews: CustomerReviewsPage,
    blogIndex: BlogIndexPage,
    blogDetail: BlogDetailPage,
    productDetail: ProductDetailPage,
    getBlogStaticPaths: async (api: any) => {
      try {
        const resp = await api.getBlogs({ pageSize: 1000, sort: "newest" });
        return (resp.data || []).map((blog: BlogSummary) => ({
          params: { slug: blog.slug },
          props: { blogSlug: blog.slug },
        }));
      } catch (error) {
        console.error("[Blog Slug] getStaticPaths failed:", error);
        return [];
      }
    },
  },
} satisfies SiteConfig;
