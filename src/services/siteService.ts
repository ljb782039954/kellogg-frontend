import { api } from "../lib/api";
import type { SiteContent, CompanyInfo, HeaderContent, FooterContent, CustomPage, Language } from "../types";
import type { ExchangeRates } from "../lib/currency";

export type SiteData = SiteContent & { exchangeRates: ExchangeRates | null };

interface SiteRequestContext {
  cookies: { get(name: string): { value?: string } | undefined };
  url: URL;
  locals?: { siteDataPromise?: Promise<SiteData> };
}

export class SiteService {
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

    // 语言检测逻辑
    let lang: Language = 'en';
    if (Astro) {
      const cookieLang = Astro.cookies.get('lang')?.value;
      const urlLang = Astro.url.searchParams.get('lang');
      const requestedLang = urlLang || cookieLang;
      lang = requestedLang === 'zh' ? 'zh' : 'en';
    }

    return {
      companyInfo: siteSettings,
      header: headerConfig,
      footer: footerConfig,
      pages: pagesData,
      lang,
      exchangeRates
    };
  }
}
