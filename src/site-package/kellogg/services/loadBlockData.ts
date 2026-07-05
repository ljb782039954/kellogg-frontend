import type { RequestMemo } from "@/cms/lib/requestMemo";
import type { SiteApiClient } from "@core-webApp/services/apiClient";
import type { CmsPageBlock } from "@/cms/types";

interface LoadBlockDataOptions {
  block: CmsPageBlock;
  api: SiteApiClient;
  requestMemo: RequestMemo;
}

export async function loadKelloggBlockData({
  block,
  api,
  requestMemo,
}: LoadBlockDataOptions): Promise<Record<string, any>> {
  const getCategories = () => requestMemo.get("categories", () => api.getCategories());
  const getProducts = (params: Parameters<typeof api.getProducts>[0]) =>
    requestMemo.get(`products:${JSON.stringify(params)}`, () => api.getProducts(params));

  // itemsPerPage 提示错误可以忽略，因为这是productGrid积木块独有的属性
  if (block.type === "productGrid") {
    const pageSize = block.content.itemsPerPage || 12;
    const params: NonNullable<Parameters<typeof api.getProducts>[0]> = { pageSize, page: 1 };

    if (block.content.category && block.content.category !== "all") {
      params.category = String(block.content.category);
    }

    const [productsData, categoriesData] = await Promise.all([
      getProducts(params),
      getCategories(),
    ]);

    return {
      products: productsData.data || [],
      categories: categoriesData || [],
      totalProducts: productsData.pagination?.total || 0,
    };
  }

  if (block.type === "featuredProducts" || block.type === "newArrivals") {
    const params: NonNullable<Parameters<typeof api.getProducts>[0]> = { pageSize: 200 };
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

  return {};
}
