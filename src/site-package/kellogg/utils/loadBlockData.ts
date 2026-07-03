import type { RequestMemo } from "@core-webApp/lib/requestMemo";
import type { SiteApiClient } from "@core-webApp/services/apiClient";
import type { PageBlock } from "@core-webApp/types";

interface LoadBlockDataOptions {
  block: PageBlock;
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
