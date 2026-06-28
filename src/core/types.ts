export type Language = string;

export interface Translation {
  [lang: string]: string;
}

export interface SiteLanguageConfig {
  languages: readonly Language[];
  defaultLanguage: Language;
  fallbackLanguages?: readonly Language[];
}

export interface SiteConfig extends SiteLanguageConfig {
  name: string;
  displayName: string;
  siteUrl: string;
  api: {
    baseUrl?: string;
    localBaseUrl?: string;
    useLocalBaseUrl?: boolean;
    assetsBaseUrl?: string;
    assetHostnames?: readonly string[];
  };
  createApiClient?: (config: SiteConfig["api"]) => any;
  currency?: {
    defaultCurrency?: string;
  };
  turnstile?: {
    siteKey?: string;
    useTestSiteKey?: boolean;
  };
  tawk?: {
    scriptUrl?: string;
  };
  seo?: {
    defaultTitle?: string;
    alternates?: readonly {
      href: string;
      hreflang: string;
    }[];
  };
  security?: {
    csp?: {
      scriptSrc?: readonly string[];
      frameSrc?: readonly string[];
      connectSrc?: readonly string[];
    };
    videoProviders?: readonly ("youtube" | "vimeo" | "facebook" | "tiktok" | "direct")[];
  };
  pages?: Record<string, any>;
}

export type SiteResource = Record<string, unknown>;

export interface PageBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  isVisible: boolean;
}

export interface CustomPage {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: "fixed-block" | "dynamic-block" | "fixed-layout";
  content?: unknown;
  blocks: PageBlock[];
  seo?: {
    title: Translation;
    description: Translation;
    keywords?: Translation;
    targetCountry?: string;
  };
}

export interface SiteContent {
  companyInfo: SiteResource;
  header: SiteResource;
  footer: SiteResource;
  pages: CustomPage[];
  lang: Language;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  last_updated: string;
}
