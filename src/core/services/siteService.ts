import type { api } from "../lib/api";
import type {
  SiteContent,
  CompanyInfo,
  HeaderContent,
  FooterContent,
  CustomPage,
  Language,
  SiteLanguageConfig,
} from "../types";
import type { ExchangeRates } from "../lib/currency";

export type SiteData = SiteContent & { exchangeRates: ExchangeRates | null };

interface SiteRequestContext {
  cookies: { get(name: string): { value?: string } | undefined };
  url: URL;
  locals?: Record<string, any>;
}

interface SiteDataApi {
  getConfig: typeof api.getConfig;
}

interface CreateSiteServiceOptions {
  site: SiteLanguageConfig;
  api: SiteDataApi;
}

export function createSiteService({ site, api }: CreateSiteServiceOptions) {
  return class SiteService {
    /**
     * 获取全站核心数据
     */
    static async getSiteData(Astro?: SiteRequestContext): Promise<SiteData> {
      if (Astro?.locals) {
        Astro.locals.siteDataPromise ||= this.loadSiteData(Astro);
        return Astro.locals.siteDataPromise;
      }
      return this.loadSiteData(Astro);
    }

    private static resolveLanguage(requested?: string): Language {
      if (requested && site.languages.includes(requested)) {
        return requested;
      }
      return site.defaultLanguage;
    }

    private static async loadSiteData(Astro?: SiteRequestContext): Promise<SiteData> {
      const [siteSettings, headerConfig, footerConfig, pagesData, exchangeRates] = await Promise.all([
        api.getConfig<CompanyInfo>("site_settings"),
        api.getConfig<HeaderContent>("header_config"),
        api.getConfig<FooterContent>("footer_config"),
        api.getConfig<CustomPage[]>("pages"),
        api.getConfig<ExchangeRates>("exchangeRates"),
      ]);

      if (!siteSettings || !headerConfig || !footerConfig || !pagesData) {
        throw new Error("Missing essential site data from API/KV");
      }

      const cookieLang = Astro?.cookies.get("lang")?.value;
      const urlLang = Astro?.url.searchParams.get("lang");
      const lang = this.resolveLanguage(urlLang || cookieLang);

      return {
        companyInfo: siteSettings,
        header: headerConfig,
        footer: footerConfig,
        pages: pagesData,
        lang,
        exchangeRates
      };
    }
  };
}
