/**
 * API 客户端 (Astro SSR 版)
 * 封装与 worker-api 的请求通信
 * 移除了内存缓存，确保数据实时性
 */

import type { Product, Category, CustomPage } from "../types";

export interface ApiClientConfig {
  baseUrl?: string;
  localBaseUrl?: string;
  assetsBaseUrl?: string;
  assetHostnames?: readonly string[];
}

// API 错误类型
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function normalizeApiBase(config: ApiClientConfig): string {
  const isLocalDev = import.meta.env.PUBLIC_IS_LOCAL_DEV === "true" && import.meta.env.DEV;
  const baseUrl = (isLocalDev ? config.localBaseUrl : config.baseUrl) || "";
  return baseUrl.replace(/\/$/, "");
}

// 分页响应类型
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 商品列表查询参数
interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

interface SubmitInquiryInput {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
  turnstileToken: string;
}

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function resolveConfiguredHostnames(config: ApiClientConfig): string[] {
  const hostnames = [...(config.assetHostnames ?? [])];

  if (config.assetsBaseUrl) {
    try {
      hostnames.push(new URL(config.assetsBaseUrl).hostname);
    } catch {}
  }

  return hostnames.map(normalizeHost).filter(Boolean);
}

function isConfiguredAssetUrl(url: string, hostnames: readonly string[]): boolean {
  if (!hostnames.length) return false;

  try {
    const host = normalizeHost(new URL(url).hostname);
    return hostnames.some((configuredHost) => (
      host === configuredHost || host.endsWith(`.${configuredHost}`)
    ));
  } catch {
    return false;
  }
}

export function createApiClient(config: ApiClientConfig) {
  const apiBase = normalizeApiBase(config);
  const assetsBase = (config.assetsBaseUrl || "").replace(/\/$/, "");
  const assetHostnames = resolveConfiguredHostnames(config);

  // 通用请求函数
  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${apiBase}${path}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const timeoutSignal = AbortSignal.timeout(10000);
    const signal = options.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;
    const response = await fetch(url, {
      ...options,
      headers,
      signal,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.error || errorData.message || 'Request failed',
        response.status,
        errorData
      );
    }

    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text);
  }

  const client = {
  // 商品
  getProducts: (params?: ProductsQuery, options: Pick<RequestInit, 'signal'> = {}) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.set(key, String(value));
        }
      });
    }
    const queryStr = query.toString();
    return request<PaginatedResponse<Product>>(
      `/api/products${queryStr ? `?${queryStr}` : ''}`,
      options,
    );
  },

  getProduct: (id: number | string) => request<Product>(`/api/products/${id}`),

  // 分类
  getCategories: () => request<Category[]>('/api/categories'),

  // 通用配置 KV 系统
  getConfig: <T = unknown>(key: string) =>
    request<T>(`/api/config/${key}`).catch((err) => {
      if (err.status === 404) return null;
      throw err;
    }),

  getPageById: (id: string) => request<CustomPage>(`/api/config/pages/${id}`),

  /**
   * 解析媒体 URL
   */
  resolveMediaUrl: (url: string | null | undefined): string => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;

    const cleanPath = url.startsWith('/') ? url.slice(1) : url;

    return assetsBase ? `${assetsBase}/${cleanPath}` : `/${cleanPath}`;
  },

  /**
   * 获取优化后的图片 URL
   */
  getOptimizedImageUrl: (url: string | null | undefined, width: number): string => {
    if (!url) return '/placeholder.jpg';

    if (url.startsWith('http') && !isConfiguredAssetUrl(url, assetHostnames)) {
      return url;
    }

    const cleanUrl = url.split('?')[0];
    let path = cleanUrl;
    if (cleanUrl.startsWith('http')) {
      try {
        path = new URL(cleanUrl).pathname;
      } catch (e) {}
    }

    const filename = path
      .replace(/^\//, '')
      .replace(/^uploads\//, '');

    if (!filename) return client.resolveMediaUrl(url);

    const quality = width <= 768 ? 75 : 85;

    if (!assetsBase) return client.resolveMediaUrl(url);

    return `${assetsBase}/cdn-cgi/image/width=${width},quality=${quality},format=auto/uploads/${filename}`;
  },

  submitInquiry: (data: SubmitInquiryInput) => request('/api/inquiries/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Blog
  getBlogs: (params?: { page?: number; pageSize?: number; category?: string; tag?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const queryStr = query.toString();
    return request<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
      `/api/blogs${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getBlog: (idOrSlug: string) => request<any>(`/api/blogs/${idOrSlug}`),

  // Customer Reviews
  getReviews: () => request<any[]>('/api/reviews'),
  };

  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;

export const api = createApiClient({
  baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
  localBaseUrl: import.meta.env.PUBLIC_API_BASE_URL_LOCAL,
  assetsBaseUrl: import.meta.env.PUBLIC_API_ASSETS,
});

export default api;
