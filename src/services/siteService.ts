import { api } from "./api";
import { createSiteService } from "@core-webApp/services/siteService";
import { currentSite } from "@site-package";

export type { SiteData } from "@core-webApp/services/siteService";

export const siteConfig = currentSite;
export const SiteService = createSiteService({
  site: currentSite,
  api,
});
