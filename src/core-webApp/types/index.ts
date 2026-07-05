
import type { CompanyInfo, HeaderContent, FooterContent } from "@/cms/types";
import type { CmsCustomPage } from "@/cms/types";
import type { Language } from "@/cms/types";
import type { SiteApiClient } from "../services/apiClient";

// ============================================
// 核心聚合与 API 响应类型
// ============================================

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
  createApiClient?: (config: SiteConfig["api"]) => SiteApiClient;
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

export interface SiteContent {
  companyInfo: CompanyInfo;
  header: HeaderContent;
  footer: FooterContent;
  pages: CmsCustomPage[];
  lang: Language;
}


// ============================================
// 响应类型封装
// ============================================

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
