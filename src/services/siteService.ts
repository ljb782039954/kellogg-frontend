import { api } from "./api";
import { createSiteService } from "../core/services/siteService";
import { currentSite } from "../site-package";

export type { SiteData } from "../core/services/siteService";

export const siteConfig = currentSite;
export const SiteService = createSiteService({
  site: currentSite,
  api,
});
