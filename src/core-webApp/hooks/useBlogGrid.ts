import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildBlogGridUrl,
  parseBlogGridSearchParams,
  toBlogGridApiQuery,
} from "../lib/blogGrid";

import {type BlogGridSortId} from '@/cms/types'

export interface BlogGridQuery {
  page: number;
  pageSize: number;
  category?: string;
  sort?: string;
}

export interface UseBlogGridOptions<TBlog> {
  initialBlogs?: TBlog[];
  initialTotal?: number;
  initialPage?: number;
  initialCategory?: string;
  initialSort?: BlogGridSortId;
  itemsPerPage?: number;
  syncUrl?: boolean;
  fetchBlogs: (
    query: BlogGridQuery,
    options?: { signal?: AbortSignal }
  ) => Promise<{
    data: TBlog[];
    pagination?: { total: number };
  }>;
}

/** Shared blog list state: SSR data, remote page loading, and optional URL synchronization. */
export function useBlogGrid<TBlog>({
  initialBlogs = [],
  initialTotal = 0,
  initialPage = 1,
  initialCategory = "All",
  initialSort = "newest",
  itemsPerPage = 12,
  syncUrl = false,
  fetchBlogs,
}: UseBlogGridOptions<TBlog>) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<BlogGridSortId>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [displayedBlogs, setDisplayedBlogs] = useState<TBlog[]>(initialBlogs);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const fetchBlogsRef = useRef(fetchBlogs);

  useEffect(() => {
    fetchBlogsRef.current = fetchBlogs;
  }, [fetchBlogs]);

  const syncLocation = useCallback((nextState: {
    page: number;
    category: string;
    sort: BlogGridSortId;
  }) => {
    if (!syncUrl || typeof window === "undefined") return;

    const nextUrl = buildBlogGridUrl(window.location.href, nextState, {
      category: initialCategory,
      sort: initialSort,
    });
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.pushState(null, "", nextUrl);
    }
  }, [initialCategory, initialSort, syncUrl]);

  useEffect(() => {
    if (
      currentPage === initialPage
      && selectedCategory === initialCategory
      && sortBy === initialSort
    ) {
      setDisplayedBlogs(initialBlogs);
      setTotalCount(initialTotal);
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchBlogsRef.current(
          toBlogGridApiQuery({
            page: currentPage,
            pageSize: itemsPerPage,
            category: selectedCategory,
            sort: sortBy,
          }),
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setDisplayedBlogs(response.data || []);
          setTotalCount(response.pagination?.total || 0);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("[useBlogGrid] Failed to fetch blogs:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [
    currentPage,
    selectedCategory,
    sortBy,
    initialBlogs,
    initialTotal,
    initialPage,
    initialCategory,
    initialSort,
    itemsPerPage,
  ]);

  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;

    const handlePopState = () => {
      const state = parseBlogGridSearchParams(new URLSearchParams(window.location.search), {
        pageSize: itemsPerPage,
        category: initialCategory,
        sort: initialSort,
      });
      setCurrentPage(state.page);
      setSelectedCategory(state.category);
      setSortBy(state.sort);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialCategory, initialSort, itemsPerPage, syncUrl]);

  const handleCategoryChange = useCallback((category: string) => {
    const page = 1;
    setSelectedCategory(category);
    setCurrentPage(page);
    syncLocation({ page, category, sort: sortBy });
  }, [sortBy, syncLocation]);

  const handleSortChange = useCallback((sort: BlogGridSortId) => {
    const page = 1;
    setSortBy(sort);
    setCurrentPage(page);
    syncLocation({ page, category: selectedCategory, sort });
  }, [selectedCategory, syncLocation]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page === currentPage) return;
    setCurrentPage(page);
    syncLocation({ page, category: selectedCategory, sort: sortBy });
  }, [currentPage, selectedCategory, sortBy, syncLocation]);

  return {
    selectedCategory,
    sortBy,
    currentPage,
    displayedBlogs,
    totalCount,
    isLoading,
    setCurrentPage: handlePageChange,
    setSelectedCategory: handleCategoryChange,
    setSortBy: handleSortChange,
  };
}
