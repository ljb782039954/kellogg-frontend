import { useState, useEffect, useCallback } from "react";

export type ProductGridSortId = "newest" | "price-asc" | "price-desc" | "sales";

export interface ProductGridQuery {
  page: number;
  pageSize: number;
  category?: string;
  sort?: string;
}

export interface UseProductGridOptions<TProduct> {
  initialProducts?: TProduct[];
  initialTotal?: number;
  initialCategory?: string;
  itemsPerPage?: number;
  fetchProducts: (
    query: ProductGridQuery,
    options?: { signal?: AbortSignal }
  ) => Promise<{
    data: TProduct[];
    pagination?: { total: number };
  }>;
}

/**
 * Generic React hook for ProductGrid container logic.
 * Manages pagination, sorting, category filtering, loading states, 
 * and handles client-side fetch cancellation on state change.
 */
export function useProductGrid<TProduct>({
  initialProducts = [],
  initialTotal = 0,
  initialCategory = "all",
  itemsPerPage = 12,
  fetchProducts,
}: UseProductGridOptions<TProduct>) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<ProductGridSortId>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState<TProduct[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  // Map user-friendly sorting ids to backend sort options
  const toBackendSort = useCallback((sortId: ProductGridSortId): string => {
    return sortId.replace("-", "_");
  }, []);

  useEffect(() => {
    // Optimization: Skip initial load if on page 1 with initial category and newest sorting.
    // This allows using statically pre-fetched server-side data for first render.
    if (currentPage === 1 && selectedCategory === initialCategory && sortBy === "newest") {
      setDisplayedProducts(initialProducts);
      setTotalCount(initialTotal);
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      try {
        const query: ProductGridQuery = {
          page: currentPage,
          pageSize: itemsPerPage,
          category: selectedCategory === "all" ? undefined : selectedCategory,
          sort: toBackendSort(sortBy),
        };

        const res = await fetchProducts(query, { signal: controller.signal });

        if (!controller.signal.aborted) {
          setDisplayedProducts(res.data || []);
          setTotalCount(res.pagination?.total || 0);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("[useProductGrid] Failed to fetch products:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    selectedCategory,
    sortBy,
    initialProducts,
    initialTotal,
    initialCategory,
    itemsPerPage,
    fetchProducts,
    toBackendSort,
  ]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sortId: ProductGridSortId) => {
    setSortBy(sortId);
    setCurrentPage(1);
  }, []);

  return {
    selectedCategory,
    sortBy,
    currentPage,
    displayedProducts,
    totalCount,
    isLoading,
    setCurrentPage,
    setSelectedCategory: handleCategoryChange,
    setSortBy: handleSortChange,
  };
}
