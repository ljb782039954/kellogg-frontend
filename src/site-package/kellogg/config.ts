import type { SiteConfig } from "@core-webApp/types";
import { createDefaultSiteRuntimeConfig } from "@core-webApp/config/siteRuntime";

const runtimeConfig = createDefaultSiteRuntimeConfig({
  fallbackSiteUrl: "https://kelloggfashion.com",
  api: {
    assetHostnames: ["kelloggfashion.com", "kellogg-fashion.com"],
  },
  security: {
    csp: {
      scriptSrc: ["https://tawk.to", "https://*.tawk.to"],
      frameSrc: ["https://tawk.to", "https://*.tawk.to"],
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
