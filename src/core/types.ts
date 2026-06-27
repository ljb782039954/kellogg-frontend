export type Language = string;

export interface Translation {
  [lang: string]: string;
}

export type LinkType = 'internal' | 'external';

export interface NavLink {
  id: string;
  name: Translation;
  linkType: LinkType;
  href: string;
  pageDeleted?: boolean;
  children?: NavLink[];
}

export interface SocialMediaType {
  wechat?: string;
  weibo?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface CompanyInfo {
  name: Translation;
  logo: string;
  description: Translation;
  contact: {
    phone: string;
    email: string;
    address: Translation;
  };
  socialMedia: SocialMediaType;
}

export interface HeaderContent {
  logoText: Translation;
  navItems: NavLink[];
}

export interface FooterLink {
  id: string;
  name: Translation;
  linkType: LinkType;
  href: string;
  pageDeleted?: boolean;
}

export interface FooterLinkGroup {
  id: string;
  title: Translation;
  links: FooterLink[];
}

export interface FooterContent {
  linkGroups: FooterLinkGroup[];
  newsletterPlaceholder: Translation;
  newsletterButton: Translation;
}

export interface Category {
  id: string;
  name: Translation;
  image?: string;
}

export interface BulkPrice {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface Product {
  id: number;
  name: Translation;
  price: number;
  originalPrice?: number;
  bulkPrices?: BulkPrice[];
  image: string;
  images: string[];
  videos: string[];
  rating: number;
  sales: number;
  tag?: Translation;
  category?: string;
  releaseDate?: string;
  description?: Translation;
  isFeatured: boolean;
  fabric?: Translation;
  notes?: Translation;
  isActive: boolean;
  sizes?: { name: string; image?: string }[];
  colors?: { name: Translation; image?: string }[];
  customFields?: { name: Translation; value: Translation }[];
}

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
  companyInfo: CompanyInfo;
  header: HeaderContent;
  footer: FooterContent;
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
