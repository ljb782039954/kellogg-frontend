export * from "./blog";
export * from "./blocks";
export * from "./pages";
export * from "./common";
export * from "./products";
export * from "./baseEditor";
export * from "./review";
export * from "./query";


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

