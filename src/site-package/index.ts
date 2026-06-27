import { kelloggSiteConfig } from "./kellogg/config";

const siteConfigs = {
  kellogg: kelloggSiteConfig,
} as const;

export type SiteName = keyof typeof siteConfigs;

export function getCurrentSiteName(): SiteName {
  const env = import.meta.env ?? {};
  const siteName = env.PUBLIC_SITE_NAME || "kellogg";

  if (siteName in siteConfigs) {
    return siteName as SiteName;
  }

  throw new Error(`[site-package] Unknown site: ${siteName}`);
}

export const currentSite = siteConfigs[getCurrentSiteName()];
export { siteConfigs };
