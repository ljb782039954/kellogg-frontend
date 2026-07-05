import {
  createApiRequester,
  type ApiClientConfig,
} from "@/cms/lib/api";
import type {
  PaginatedResponse,
} from "../types";

import type {
  Blog,
  BlogSummary,
  Category,
  CmsCustomPage,
  Product,
} from "@/cms/types";

export interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "sales";
  search?: string;
}

export interface BlogsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  sort?: string;
}

export interface SubmitInquiryInput {
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

function buildQuery(params?: object): string {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
  }

  return query.toString();
}

export function createSiteApiClient(config: ApiClientConfig) {
  const requester = createApiRequester(config);
  const { request } = requester;

  return {
    getProducts: (params?: ProductsQuery, options: Pick<RequestInit, "signal"> = {}) => {
      const queryStr = buildQuery(params);
      return request<PaginatedResponse<Product>>(
        `/api/products${queryStr ? `?${queryStr}` : ""}`,
        options,
      );
    },

    getProduct: (id: number | string) => request<Product>(`/api/products/${id}`),

    getCategories: () => request<Category[]>("/api/categories"),

    getConfig: <T = unknown>(key: string) =>
      request<T>(`/api/config/${key}`).catch((err) => {
        if (err.status === 404) return null;
        throw err;
      }),

    getPageById: (id: string) => request<CmsCustomPage>(`/api/config/pages/${id}`),

    resolveMediaUrl: requester.resolveMediaUrl,

    getOptimizedImageUrl: requester.getOptimizedImageUrl,

    submitInquiry: (data: SubmitInquiryInput) => request("/api/inquiries/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

    getBlogs: (params?: BlogsQuery) => {
      const queryStr = buildQuery(params);
      return request<PaginatedResponse<BlogSummary>>(
        `/api/blogs${queryStr ? `?${queryStr}` : ""}`,
      );
    },

    getBlog: (idOrSlug: string) => request<Blog>(`/api/blogs/${idOrSlug}`),

    getReviews: () => request<any[]>("/api/reviews"),
  };
}

export type SiteApiClient = ReturnType<typeof createSiteApiClient>;
