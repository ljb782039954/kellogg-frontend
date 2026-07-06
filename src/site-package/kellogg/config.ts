import type { SiteConfig } from "@core-webApp/types";
import { createDefaultSiteRuntimeConfig } from "@core-webApp/config/siteRuntime";

const tawkOrigins = [
  "https://tawk.to",
  "https://*.tawk.to",
  "https://tawk.link",
  "https://*.tawk.link",
] as const;

const runtimeConfig = createDefaultSiteRuntimeConfig({
  fallbackSiteUrl: "https://kelloggfashion.com",
  api: {
    assetHostnames: ["kelloggfashion.com", "kellogg-fashion.com"],
  },
  security: {
    csp: {
      scriptSrc: [
        ...tawkOrigins,
        "https://static.cloudflareinsights.com",
      ],
      styleSrc: tawkOrigins,
      fontSrc: tawkOrigins,
      imgSrc: tawkOrigins,
      mediaSrc: tawkOrigins,
      frameSrc: tawkOrigins,
      connectSrc: [
        ...tawkOrigins,
        "wss://*.tawk.to",
        "wss://*.tawk.link",
      ],
    },
  },
});

export const kelloggSiteConfig = {
  ...runtimeConfig,
  name: "kellogg",
  displayName: "Kellogg Fashion",
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
  tawk: {
    scriptUrl: "https://embed.tawk.to/69f7493d0b9cc71c320940a8/1jnmvc6gf",
  },
  seo: {
    defaultTitle: "Kellogg Fashion",
  },
  pages: {
    cms: () => import("./pages/CmsPage.astro"),
    products: () => import("./pages/CmsPage.astro"),
    inquiry: () => import("./pages/InquiryPage.astro"),
    customerReviews: () => import("./pages/CustomerReviewsPage.astro"),
    blogIndex: () => import("./pages/BlogIndexPage.astro"),
    blogDetail: () => import("./pages/BlogDetailPage.astro"),
    productDetail: () => import("./pages/ProductDetailPage.astro"),
  },
} satisfies SiteConfig;
