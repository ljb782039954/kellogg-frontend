import type { RequestMemo } from "@core/lib/requestMemo";
import type { Language, PageBlock } from "@core/types";
import { toImageBannerTagViewProps } from "../block-adapters/imageBannerTagAdapter";
import type { ImageBannerTagContent } from "../block-schemas/imageBannerTag";
import type { KelloggApiClient } from "./api";

interface LoadBlockDataOptions {
  block: PageBlock;
  lang: Language;
  api: KelloggApiClient;
  requestMemo: RequestMemo;
}

export async function loadKelloggBlockData({
  block,
  lang,
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

  if (block.type === "imageBannerTag") {
    return {
      viewModel: toImageBannerTagViewProps(block.content as ImageBannerTagContent, {
        lang,
        getImageUrl: (src, width) => api.getOptimizedImageUrl(src, width),
      }),
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

  if (block.type === "caseStudies") {
    const reviews = await requestMemo.get("reviews", () => api.getReviews());
    return { reviews: reviews || [] };
  }

  return {};
}
