import type { SiteConfig } from "../types";
import { createSiteApiClient } from "../services/apiClient";

type SiteApiConfig = SiteConfig["api"];
type SiteSecurityConfig = NonNullable<SiteConfig["security"]>;
type SiteCspConfig = NonNullable<SiteSecurityConfig["csp"]>;
type VideoProvider = NonNullable<SiteSecurityConfig["videoProviders"]>[number];

interface SiteRuntimeOptions {
  fallbackSiteUrl?: string;
  api?: Partial<SiteApiConfig>;
  security?: {
    csp?: Partial<SiteCspConfig>;
    videoProviders?: readonly VideoProvider[];
  };
}

function mergeValues(base: readonly string[] = [], extra: readonly string[] = []) {
  return Array.from(new Set([...base, ...extra]));
}

const tawkOrigins = [
  "https://tawk.to",
  "https://*.tawk.to",
  "https://tawk.link",
  "https://*.tawk.link",
] as const;

export const defaultSiteSecurityConfig = {
  csp: {
    scriptSrc: [
      "https://challenges.cloudflare.com",
      "https://static.cloudflareinsights.com",
      ...tawkOrigins,
    ],
    styleSrc: tawkOrigins,
    fontSrc: tawkOrigins,
    imgSrc: tawkOrigins,
    mediaSrc: tawkOrigins,
    frameSrc: [
      "https://challenges.cloudflare.com",
      "https://www.youtube-nocookie.com",
      "https://player.vimeo.com",
      "https://www.facebook.com",
      "https://www.tiktok.com",
      ...tawkOrigins,
    ],
    connectSrc: [
      "https:",
      "wss:",
      "https://challenges.cloudflare.com",
      ...tawkOrigins,
      "wss://*.tawk.to",
      "wss://*.tawk.link",
    ],
  },
  videoProviders: ["youtube", "vimeo", "facebook", "tiktok", "direct"],
} satisfies SiteSecurityConfig;

export function mergeSiteSecurityConfig(
  base: SiteSecurityConfig = defaultSiteSecurityConfig,
  override: SiteRuntimeOptions["security"] = {},
): SiteSecurityConfig {
  return {
    csp: {
      scriptSrc: mergeValues(base.csp?.scriptSrc, override.csp?.scriptSrc),
      styleSrc: mergeValues(base.csp?.styleSrc, override.csp?.styleSrc),
      fontSrc: mergeValues(base.csp?.fontSrc, override.csp?.fontSrc),
      imgSrc: mergeValues(base.csp?.imgSrc, override.csp?.imgSrc),
      mediaSrc: mergeValues(base.csp?.mediaSrc, override.csp?.mediaSrc),
      frameSrc: mergeValues(base.csp?.frameSrc, override.csp?.frameSrc),
      connectSrc: mergeValues(base.csp?.connectSrc, override.csp?.connectSrc),
    },
    videoProviders: Array.from(new Set([
      ...(base.videoProviders ?? []),
      ...(override.videoProviders ?? []),
    ])),
  };
}

export function createDefaultSiteRuntimeConfig(options: SiteRuntimeOptions = {}) {
  return {
    siteUrl: import.meta.env.PUBLIC_SITE_URL || options.fallbackSiteUrl || "",
    api: {
      baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
      localBaseUrl: import.meta.env.PUBLIC_API_BASE_URL_LOCAL,
      assetsBaseUrl: import.meta.env.PUBLIC_API_ASSETS,
      ...options.api,
    },
    createApiClient: createSiteApiClient,
    security: mergeSiteSecurityConfig(defaultSiteSecurityConfig, options.security),
  } satisfies Pick<SiteConfig, "siteUrl" | "api" | "createApiClient" | "security">;
}
