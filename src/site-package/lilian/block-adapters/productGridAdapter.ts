import type { Category, Language, Product, SortOption, Translation } from "@/cms/types";
import type { ProductsQuery } from "@core-webApp/services/apiClient";
import type {
  ProductGridItem,
  ProductGridLabels,
  ProductGridOption,
  ProductGridProps,
  ProductGridSortId,
} from "../components/blocks";
import { createTranslate } from "../utils/i18n";
import { toProductCardViewProps } from "./productCardAdapter";

export interface ProductGridContent {
  title?: Translation;
  subtitle?: Translation;
  itemsPerPage?: number;
  category?: string;
}

export const PRODUCT_GRID_SORT_OPTIONS: SortOption[] = [
  { id: "newest", name: { zh: "最新上架", en: "Newest" } },
  { id: "price-asc", name: { zh: "价格从低到高", en: "Price Low-High" } },
  { id: "price-desc", name: { zh: "价格从高到低", en: "Price High-Low" } },
  { id: "sales", name: { zh: "热度优先", en: "Popular" } },
];

interface ProductGridAdapterOptions {
  content: ProductGridContent;
  categories: Category[];
  products: Product[];
  totalCount?: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
  isLoading: boolean;
  lang: Language;
  formatPriceText: (price?: number) => string;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sortId: ProductGridSortId) => void;
}

export function toProductGridInitialCategory(category?: string): string {
  return category && category !== "all" ? category : "all";
}

export function toProductGridQuery({
  itemsPerPage,
  selectedCategory,
  sortBy,
}: {
  itemsPerPage: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
}): ProductsQuery {
  const query: ProductsQuery = {
    page: 1,
    pageSize: itemsPerPage,
  };

  if (selectedCategory !== "all") {
    query.category = selectedCategory;
  }

  if (sortBy === "newest") query.sort = "newest";
  if (sortBy === "price-asc") query.sort = "price_asc";
  if (sortBy === "price-desc") query.sort = "price_desc";
  if (sortBy === "sales") query.sort = "sales";

  return query;
}

function toCategoryNameMap(categories: Category[]): Record<string, Translation> {
  return Object.fromEntries(categories.map((category) => [category.id, category.name]));
}

function toCategoryOptions(categories: Category[], selectedCategory: string, lang: Language): ProductGridOption[] {
  const translate = createTranslate(lang);

  return [
    {
      id: "all",
      label: lang === "zh" ? "全部" : "All",
      selected: selectedCategory === "all",
    },
    ...categories.map((category) => ({
      id: category.id,
      label: translate(category.name),
      selected: selectedCategory === category.id,
    })),
  ];
}

function toSortOptions(sortBy: ProductGridSortId, lang: Language): ProductGridOption<ProductGridSortId>[] {
  const translate = createTranslate(lang);

  return PRODUCT_GRID_SORT_OPTIONS.map((option) => ({
    id: option.id as ProductGridSortId,
    label: translate(option.name),
    selected: sortBy === option.id,
  }));
}

function sortProducts(products: Product[], sortBy: ProductGridSortId) {
  return [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "sales") return b.sales - a.sales;
    return (b.releaseDate || "").localeCompare(a.releaseDate || "");
  });
}

function toLabels(lang: Language, totalCount: number): ProductGridLabels {
  return {
    loading: lang === "zh" ? "正在加载商品..." : "Loading products...",
    empty: lang === "zh" ? "暂无商品" : "No products available",
    total: lang === "zh" ? `共 ${totalCount} 件商品` : `${totalCount} products total`,
  };
}

export function toProductGridViewProps({
  content,
  categories,
  products,
  totalCount,
  selectedCategory,
  sortBy,
  isLoading,
  lang,
  formatPriceText,
  onCategoryChange,
  onSortChange,
}: ProductGridAdapterOptions): ProductGridProps {
  const translate = createTranslate(lang);
  const categoryNames = toCategoryNameMap(categories);
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((product) => product.category === selectedCategory);
  const displayProducts = sortProducts(filteredProducts, sortBy).slice(0, content.itemsPerPage || 9);
  const displayTotal = totalCount ?? filteredProducts.length;

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    categories: toCategoryOptions(categories, selectedCategory, lang),
    sortOptions: toSortOptions(sortBy, lang),
    products: displayProducts.map<ProductGridItem>((product) => ({
      id: String(product.id),
      ...toProductCardViewProps(product, {
        lang,
        formatPriceText,
        categoryNames,
      }),
    })),
    labels: toLabels(lang, displayTotal),
    totalCount: displayTotal,
    selectedCategory,
    sortBy,
    isLoading,
    onCategoryChange,
    onSortChange,
  };
}
