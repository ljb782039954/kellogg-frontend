import { kelloggSiteConfig } from "./kellogg/config";
import { lilianSiteConfig } from "./lilian/config";

const siteConfigs = {
  kellogg: kelloggSiteConfig,
  lilian: lilianSiteConfig,
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

export async function loadSitePage(pageLoader: (() => Promise<{ default: any }>) | undefined) {
  if (!pageLoader) return undefined;
  const pageModule = await pageLoader();
  return pageModule.default;
}
