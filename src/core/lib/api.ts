/**
 * API 客户端 (Astro SSR 版)
 * 封装与 worker-api 的请求通信
 * 移除了内存缓存，确保数据实时性
 */

import type { Product, Category, CustomPage } from "../types";

const isLocalDev = import.meta.env.PUBLIC_IS_LOCAL_DEV === "true" && import.meta.env.DEV;

const API_BASE = (
  isLocalDev ? import.meta.env.PUBLIC_API_BASE_URL_LOCAL : import.meta.env.PUBLIC_API_BASE_URL
).replace(/\/$/, '');

// const API_BASE = (
//   import.meta.env.PUBLIC_API_BASE_URL || 
//   ''
// ).replace(/\/$/, '');

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

// 通用请求函数
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
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

export const api = {
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
    
    const assetsBase = import.meta.env.PUBLIC_API_ASSETS;
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    
    return `${assetsBase}/${cleanPath}`;
  },

  /**
   * 获取优化后的图片 URL
   */
  getOptimizedImageUrl: (url: string | null | undefined, width: number): string => {
    if (!url) return '/placeholder.jpg';
    
    if (url.startsWith('http') && !url.includes('kelloggfashion.com')) {
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

    if (!filename) return api.resolveMediaUrl(url);

    const assetsBase = import.meta.env.PUBLIC_API_ASSETS;
    const quality = width <= 768 ? 75 : 85;

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

export default api;
