import { useEffect, useState } from "react";
import { api } from "@services/api";
import { useStore } from "@nanostores/react";
import { $currency, $rates, formatPrice } from "@/cms/lib/currency";
import {
  toProductGridInitialCategory,
  toProductGridQuery,
  toProductGridViewProps,
} from "../../block-adapters";
import type { ProductGridContent } from "../../block-adapters";
import type { Category, Language, Product } from "@/cms/types";
import { ProductGrid as ProductGridView, type ProductGridSortId } from "../blocks";

export interface ProductGridContainerProps extends ProductGridContent {
  categories: Category[];
  products: Product[];
  totalProducts?: number;
  lang: Language;
}

export default function ProductGridContainer({
  itemsPerPage: defaultItemsPerPage = 12,
  category,
  categories = [],
  products: initialProducts = [],
  totalProducts,
  lang,
  ...content
}: ProductGridContainerProps) {
  const currentItemsPerPage = defaultItemsPerPage || 12;
  const initialCategory = toProductGridInitialCategory(category);
  const currency = useStore($currency);
  const rates = useStore($rates);
  const [hasMounted, setHasMounted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<ProductGridSortId>("newest");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(totalProducts || initialProducts.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (selectedCategory === initialCategory && sortBy === "newest") {
      setDisplayedProducts(initialProducts);
      setTotalCount(totalProducts || initialProducts.length);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.getProducts(
          toProductGridQuery({
            itemsPerPage: currentItemsPerPage,
            selectedCategory,
            sortBy,
          }),
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setDisplayedProducts(response.data || []);
          setTotalCount(response.pagination?.total || 0);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("[Lilian ProductGrid] Failed to fetch products:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [currentItemsPerPage, initialCategory, initialProducts, selectedCategory, sortBy, totalProducts]);

  const viewProps = toProductGridViewProps({
    content: {
      ...content,
      itemsPerPage: defaultItemsPerPage,
      category,
    },
    categories,
    products: displayedProducts,
    totalCount,
    selectedCategory,
    sortBy,
    isLoading,
    lang,
    formatPriceText: (price) => hasMounted
      ? formatPrice(price, currency, rates)
      : formatPrice(price),
    onCategoryChange: (categoryId) => {
      setSelectedCategory(categoryId);
    },
    onSortChange: setSortBy,
  });

  return <ProductGridView {...viewProps} />;
}
