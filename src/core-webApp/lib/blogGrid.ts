import {type BlogGridSortId} from '@/cms/types'

export interface BlogGridQueryState {
  page: number;
  pageSize: number;
  category: string;
  sort: BlogGridSortId;
}

export interface BlogGridQueryDefaults {
  pageSize: number;
  category?: string;
  sort?: BlogGridSortId;
}

const BLOG_GRID_SORT_IDS: BlogGridSortId[] = ["newest", "popular", "oldest"];
const DEFAULT_CATEGORY = "All";

function toPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isBlogGridSortId(value: string | null): value is BlogGridSortId {
  return Boolean(value && BLOG_GRID_SORT_IDS.includes(value as BlogGridSortId));
}

export function parseBlogGridSearchParams(
  searchParams: URLSearchParams,
  defaults: BlogGridQueryDefaults,
): BlogGridQueryState {
  const defaultCategory = defaults.category || DEFAULT_CATEGORY;
  const defaultSort = defaults.sort || "newest";
  const requestedCategory = searchParams.get("category");
  const requestedSort = searchParams.get("sort");

  return {
    page: toPositiveInteger(searchParams.get("page"), 1),
    pageSize: defaults.pageSize,
    category: requestedCategory || defaultCategory,
    sort: isBlogGridSortId(requestedSort) ? requestedSort : defaultSort,
  };
}

export function toBlogGridApiQuery({
  page,
  pageSize,
  category,
  sort,
}: BlogGridQueryState) {
  return {
    page,
    pageSize,
    category: category === DEFAULT_CATEGORY ? undefined : category,
    sort,
  };
}

export function buildBlogGridUrl(
  currentUrl: string,
  state: Pick<BlogGridQueryState, "page" | "category" | "sort">,
  defaults: Pick<BlogGridQueryDefaults, "category" | "sort">,
) {
  const url = new URL(currentUrl);
  const defaultCategory = defaults.category || DEFAULT_CATEGORY;
  const defaultSort = defaults.sort || "newest";

  url.searchParams.delete("page");
  url.searchParams.delete("category");
  url.searchParams.delete("sort");

  if (state.page > 1) url.searchParams.set("page", String(state.page));
  if (state.category !== defaultCategory) url.searchParams.set("category", state.category);
  if (state.sort !== defaultSort) url.searchParams.set("sort", state.sort);

  return `${url.pathname}${url.search}${url.hash}`;
}
