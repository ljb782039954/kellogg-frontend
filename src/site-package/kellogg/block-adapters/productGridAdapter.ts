import type { Language } from "@core/types";
import type { Category, Product, SortOption } from "../types";
import type {
  ProductGridItem,
  ProductGridLabels,
  ProductGridOption,
  ProductGridSortId,
} from "../components/ui-blocks/ProductGridView";
import { t } from "../utils/i18n";

export const PRODUCT_GRID_SORT_OPTIONS: SortOption[] = [
  { id: "newest", name: { zh: "最新上架", en: "Newest" } },
  { id: "price-asc", name: { zh: "价格从低到高", en: "Price Low-High" } },
  { id: "price-desc", name: { zh: "价格从高到低", en: "Price High-Low" } },
  { id: "sales", name: { zh: "销量优先", en: "Best Selling" } },
];

interface ProductGridAdapterOptions {
  categories: Category[];
  products: Product[];
  totalCount: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
  lang: Language;
  getImageUrl: (src: string, width: number) => string;
  formatPriceText: (price?: number) => string;
}

export function toProductGridCategoryOptions({
  categories,
  selectedCategory,
  lang,
}: Pick<ProductGridAdapterOptions, "categories" | "selectedCategory" | "lang">): ProductGridOption[] {
  return [
    {
      id: "all",
      label: lang === "zh" ? "全部" : "All",
      selected: selectedCategory === "all",
    },
    ...categories.map((category) => ({
      id: category.id,
      label: t(category.name, lang),
      selected: selectedCategory === category.id,
    })),
  ];
}

export function toProductGridSortOptions(
  sortBy: ProductGridSortId,
  lang: Language,
): ProductGridOption<ProductGridSortId>[] {
  return PRODUCT_GRID_SORT_OPTIONS.map((option) => ({
    id: option.id as ProductGridSortId,
    label: t(option.name, lang),
    selected: sortBy === option.id,
  }));
}

export function toProductGridItems({
  products,
  lang,
  getImageUrl,
  formatPriceText,
}: Pick<ProductGridAdapterOptions, "products" | "lang" | "getImageUrl" | "formatPriceText">): ProductGridItem[] {
  return products.map((product) => {
    const bulkPrice = product.bulkPrices?.[0];
    return {
      id: String(product.id),
      href: `/product/${product.id}`,
      title: t(product.name, lang),
      imageUrl: product.image ? getImageUrl(product.image, 640) : "",
      tagText: product.tag ? t(product.tag, lang) : undefined,
      quantityText: bulkPrice
        ? bulkPrice.maxQty
          ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS`
          : `${bulkPrice.minQty}+ PCS`
        : undefined,
      priceText: formatPriceText(bulkPrice?.price ?? product.price),
      basePrice: bulkPrice?.price ?? product.price,
    };
  });
}

export function toProductGridLabels(lang: Language, totalCount: number): ProductGridLabels {
  return {
    loading: lang === "zh" ? "正在为您加载商品..." : "Loading products...",
    empty: lang === "zh" ? "暂无商品" : "No products available",
    total: lang === "zh" ? `共 ${totalCount} 件商品` : `${totalCount} products total`,
  };
}
