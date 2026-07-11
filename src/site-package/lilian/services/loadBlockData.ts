import type { RequestMemo } from "@/cms/lib/requestMemo";
import type { SiteApiClient } from "@core-webApp/services/apiClient";
import type { CmsPageBlock } from "@/cms/types";
import {
  parseProductGridSearchParams,
  toProductGridApiQuery,
} from "@core-webApp/lib/productGrid";

import type { 
  ProductGridContent ,
  FeaturedProductsContent,
  NewArrivalsContent,
} from "../components/blocks";

interface LoadBlockDataOptions {
  block: CmsPageBlock;
  api: SiteApiClient;
  requestMemo: RequestMemo;
  url?: URL;
}

export async function loadLilianBlockData({
  block,
  api,
  requestMemo,
  url,
}: LoadBlockDataOptions): Promise<Record<string, any>> {
  const getCategories = () => requestMemo.get("categories", () => api.getCategories());
  const getProducts = (params: Parameters<typeof api.getProducts>[0]) =>
    requestMemo.get(`products:${JSON.stringify(params)}`, () => api.getProducts(params));
  // const getBlogs = (params: Parameters<typeof api.getBlogs>[0]) =>
  //   requestMemo.get(`blogs:${JSON.stringify(params)}`, () => api.getBlogs(params));

  if (block.type === "productGrid") {
    const content = block.content as ProductGridContent;
    const pageSize = content.itemsPerPage || 12;
    const queryState = parseProductGridSearchParams(url?.searchParams || new URLSearchParams(), {
      pageSize,
    });

    const [productsData, categoriesData] = await Promise.all([
      getProducts(toProductGridApiQuery(queryState)),
      getCategories(),
    ]);

    return {
      products: productsData.data || [],
      categories: categoriesData || [],
      totalProducts: productsData.pagination?.total || 0,
      initialPage: productsData.pagination?.page || queryState.page,
      initialCategory: queryState.category,
      initialSort: queryState.sort,
    };
  }

  if (block.type === "featuredProducts" || block.type === "newArrivals") {
    const content = block.content as FeaturedProductsContent | NewArrivalsContent;
    const params: NonNullable<Parameters<typeof api.getProducts>[0]> = {
      pageSize: content.maxItems || 4,
    };
    if (block.type === "featuredProducts") params.featured = true;
    if (block.type === "newArrivals") params.sort = "newest";

    const [productsData, categoriesData] = await Promise.all([
      getProducts(params),
      getCategories(),
    ]);

    return {
      products: productsData.data || [],
      categories: categoriesData || [],
    };
  }

  if (block.type === "categories") {
    const categoriesData = await getCategories();
    return { categories: categoriesData };
  }

  // if (block.type === "blogGrid") {
  //   const content = block.content as BlogGridContent;
  //   const blogsData = await getBlogs({
  //     pageSize: content.maxItems || 3,
  //     page: 1,
  //   });

  //   return {
  //     blogs: blogsData.data || [],
  //   };
  // }

  return {};
}
