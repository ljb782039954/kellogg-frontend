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
  totalProducts: initialTotal = 0,
  lang,
}: ProductGridContainerProps) {
  // 读取后台配置的每页显示数量，若未指定则默认显示 12 个
  const currentItemsPerPage = defaultItemsPerPage || 12;
  const initialCategory = toProductGridInitialCategory(category);
  const currency = useStore($currency);
  const rates = useStore($rates);
  const [hasMounted, setHasMounted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<ProductGridSortId>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 维护客户端展示的产品列表和产品总数
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setHasMounted(true), []);

  // 监听翻页、筛选和排序变化，发起客户端 Fetch 请求
  useEffect(() => {
    // 首次加载（第一页，且仍为后台配置的初始分类/默认排序）时，直接使用静态传入的 products 数组数据
    // 保证首屏的极致加载速度与零客户端冗余请求
    if (currentPage === 1 && selectedCategory === initialCategory && sortBy === "newest") {
      setDisplayedProducts(initialProducts);
      setTotalCount(initialTotal);
      return;
    }

    const controller = new AbortController();
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts(
          toProductGridQuery({
            currentPage,
            itemsPerPage: currentItemsPerPage,
            selectedCategory,
            sortBy,
          }),
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setDisplayedProducts(res.data || []);
          setTotalCount(res.pagination?.total || 0);
        }
      } catch (err) {
        if (!controller.signal.aborted) console.error('[ProductGrid] Failed to fetch products on client:', err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchFilteredProducts();

    return () => {
      controller.abort();
    };
  }, [currentPage, selectedCategory, sortBy, initialProducts, initialTotal, initialCategory, currentItemsPerPage]);

  const viewProps = toProductGridViewProps({
    categories,
    products: displayedProducts,
    totalCount,
    currentPage,
    itemsPerPage: currentItemsPerPage,
    selectedCategory,
    sortBy,
    isLoading,
    lang,
    formatPriceText: (price) => hasMounted
      ? formatPrice(price, currency, rates)
      : formatPrice(price),
    onCategoryChange: (categoryId) => {
      setSelectedCategory(categoryId);
      setCurrentPage(1);
    },
    onSortChange: (sortId) => {
      setSortBy(sortId);
      setCurrentPage(1);
    },
    onPageChange: setCurrentPage,
  });

  return <ProductGridView {...viewProps} />;
}
