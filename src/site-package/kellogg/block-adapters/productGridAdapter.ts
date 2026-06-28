import type { Language } from "@core/types";
import type { Category, Product, SortOption } from "../types";
import { toProductCardStaticProps } from "./productCardAdapter";
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
  formatPriceText,
}: Pick<ProductGridAdapterOptions, "products" | "lang" | "formatPriceText">): ProductGridItem[] {
  return products.map((product) => ({
      id: String(product.id),
      href: `/product/${product.id}`,
      ...toProductCardStaticProps(product, {
        lang,
        formatPriceText,
      }),
    }));
}

export function toProductGridLabels(lang: Language, totalCount: number): ProductGridLabels {
  return {
    loading: lang === "zh" ? "正在为您加载商品..." : "Loading products...",
    empty: lang === "zh" ? "暂无商品" : "No products available",
    total: lang === "zh" ? `共 ${totalCount} 件商品` : `${totalCount} products total`,
  };
}
