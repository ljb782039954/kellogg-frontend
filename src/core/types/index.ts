export * from "./blocks";
export * from "./common";
export * from "./products";
export * from "./baseEditor";

import type { CompanyInfo, HeaderContent, FooterContent } from "./baseEditor";
import type { CustomPage } from "./blocks";
import type { Language } from "./common";
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
  pages: CustomPage[];
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

// ============================================
// Blog types (frontend)
// ============================================

export interface BlogSummary {
  id: number;
  slug: string;
  title_zh: string;
  title_en: string;
  summary_zh: string | null;
  summary_en: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  status: string;
  publish_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Blog extends BlogSummary {
  content_zh: string;
  content_en: string;
  seo_title_zh: string | null;
  seo_title_en: string | null;
  seo_desc_zh: string | null;
  seo_desc_en: string | null;
}
