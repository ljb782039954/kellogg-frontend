import type { SiteConfig } from "@core-webApp/types";
import { createDefaultSiteRuntimeConfig } from "@core-webApp/config/siteRuntime";

const runtimeConfig = createDefaultSiteRuntimeConfig({
  fallbackSiteUrl: "https://lilianfashion.com",
  api: {
    assetHostnames: ["lilianfashion.com", "lilian-fashion.com"],
  },
});

export const lilianSiteConfig = {
  ...runtimeConfig,
  name: "lilian",
  displayName: "Lilian Fashion",
  languages: ["zh", "en"],
  defaultLanguage: "en",
  fallbackLanguages: ["en", "zh"],
  currency: {
    defaultCurrency: "USD",
  },
  turnstile: {
    siteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
    useTestSiteKey: import.meta.env.DEV,
  },
  // 实际未使用
  // tawk: {
  //   scriptUrl: import.meta.env.PUBLIC_TAWCHAT_URL,
  // },
  seo: {
    defaultTitle: "Lilian Fashion",
  },
  pages: {
    cms: () => import("./pages/CmsPage.astro"),
    products: () => import("./pages/CmsPage.astro"),
    // inquiry: () => import("./pages/InquiryPage.astro"),
    customerReviews: () => import("./pages/CustomerReviewsPage.astro"),
    blogIndex: () => import("./pages/BlogIndexPage.astro"),
    blogDetail: () => import("./pages/BlogDetailPage.astro"),
    productDetail: () => import("./pages/ProductDetailPage.astro"),
  },
} satisfies SiteConfig;
