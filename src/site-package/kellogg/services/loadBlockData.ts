import type { RequestMemo } from "@/cms/lib/requestMemo";
import type { SiteApiClient } from "@core-webApp/services/apiClient";
import type { CmsPageBlock } from "@/cms/types";
import type {
  FeaturedProductsContent,
  NewArrivalsContent,
  ProductGridContent,
} from "../types/blocks";

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

  if (block.type === "productGrid") {
    const content = block.content as ProductGridContent;
    const pageSize = content.itemsPerPage || 12;
    const params: NonNullable<Parameters<typeof api.getProducts>[0]> = { pageSize, page: 1 };

    if (content.category && content.category !== "all") {
      params.category = String(content.category);
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
    const content = block.content as FeaturedProductsContent | NewArrivalsContent;
    const params: NonNullable<Parameters<typeof api.getProducts>[0]> = {
      pageSize: content.maxItems || 200,
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

  return {};
}
