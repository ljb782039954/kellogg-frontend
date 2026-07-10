import {type ProductGridSortId} from '@/cms/types'

export interface ProductGridQueryState {
  page: number;
  pageSize: number;
  category: string;
  sort: ProductGridSortId;
}

export interface ProductGridQueryDefaults {
  pageSize: number;
  category?: string;
  sort?: ProductGridSortId;
}

const PRODUCT_GRID_SORT_IDS: ProductGridSortId[] = [
  "newest",
  "price-asc",
  "price-desc",
  "sales",
];

const PRODUCT_GRID_API_SORTS = {
  newest: "newest",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  sales: "sales",
} as const;

function toPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isProductGridSortId(value: string | null): value is ProductGridSortId {
  return Boolean(value && PRODUCT_GRID_SORT_IDS.includes(value as ProductGridSortId));
}

export function parseProductGridSearchParams(
  searchParams: URLSearchParams,
  defaults: ProductGridQueryDefaults,
): ProductGridQueryState {
  const defaultCategory = defaults.category && defaults.category !== "all" ? defaults.category : "all";
  const defaultSort = defaults.sort || "newest";
  const requestedCategory = searchParams.get("category");
  const requestedSort = searchParams.get("sort");

  return {
    page: toPositiveInteger(searchParams.get("page"), 1),
    pageSize: defaults.pageSize,
    category: requestedCategory ? requestedCategory : defaultCategory,
    sort: isProductGridSortId(requestedSort) ? requestedSort : defaultSort,
  };
}

export function toProductGridApiQuery({
  page,
  pageSize,
  category,
  sort,
}: ProductGridQueryState) {
  return {
    page,
    pageSize,
    category: category === "all" ? undefined : category,
    sort: PRODUCT_GRID_API_SORTS[sort],
  };
}

export function buildProductGridUrl(
  currentUrl: string,
  state: Pick<ProductGridQueryState, "page" | "category" | "sort">,
  defaults: Pick<ProductGridQueryDefaults, "category" | "sort">,
) {
  const url = new URL(currentUrl);
  const defaultCategory = defaults.category && defaults.category !== "all" ? defaults.category : "all";
  const defaultSort = defaults.sort || "newest";

  url.searchParams.delete("page");
  url.searchParams.delete("category");
  url.searchParams.delete("sort");

  if (state.page > 1) url.searchParams.set("page", String(state.page));
  if (state.category !== defaultCategory) url.searchParams.set("category", state.category);
  if (state.sort !== defaultSort) url.searchParams.set("sort", state.sort);

  return `${url.pathname}${url.search}${url.hash}`;
}
