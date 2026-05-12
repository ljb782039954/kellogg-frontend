import { api } from "./api";
import type { SiteContent, CompanyInfo, HeaderContent, FooterContent, CustomPage } from "../types";

export async function getSiteData(): Promise<SiteContent> {
  const [siteSettings, headerConfig, footerConfig, pagesData] = await Promise.all([
    api.getConfig<CompanyInfo>("site_settings"),
    api.getConfig<HeaderContent>("header_config"),
    api.getConfig<FooterContent>("footer_config"),
    api.getConfig<CustomPage[]>("pages"),
  ]);

  if (!siteSettings || !headerConfig || !footerConfig || !pagesData) {
    throw new Error("Missing essential site data from API/KV");
  }

  return {
    companyInfo: siteSettings,
    header: headerConfig,
    footer: footerConfig,
    pages: pagesData,
  };
}
