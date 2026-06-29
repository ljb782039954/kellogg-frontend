import type { SiteConfig } from "@core/types";
import { createKelloggApiClient } from "./utils/api";

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
    cms: () => import("./pages/CmsPage.astro"),
    products: () => import("./pages/CmsPage.astro"),
    inquiry: () => import("./pages/InquiryPage.astro"),
    customerReviews: () => import("./pages/CustomerReviewsPage.astro"),
    blogIndex: () => import("./pages/BlogIndexPage.astro"),
    blogDetail: () => import("./pages/BlogDetailPage.astro"),
    productDetail: () => import("./pages/ProductDetailPage.astro"),
  },
} satisfies SiteConfig;
