import { useEffect, useState } from "react";
import { api } from "@services/api";
import { useStore } from "@nanostores/react";
import { $currency, $rates, formatPrice } from "@core/lib/currency";
import {
  toProductGridCategoryOptions,
  toProductGridItems,
  toProductGridLabels,
  toProductGridSortOptions,
} from "../../block-adapters/productGridAdapter";
import type { ProductGridContent } from "../../block-schemas/productGrid";
import type { Category, Language, Product } from "../../types";
import ProductGridView, { type ProductGridSortId } from "../ui-blocks/ProductGridView";

export interface ProductGridProps extends ProductGridContent {
  categories: Category[];
  products: Product[];
  totalProducts?: number;
  lang: Language;
}

export default function ProductGrid({
  itemsPerPage: defaultItemsPerPage = 12,
  categories = [],
  products: initialProducts = [],
  totalProducts: initialTotal = 0,
  lang,
}: ProductGridProps) {
  // 读取后台配置的每页显示数量，若未指定则默认显示 12 个
  const currentItemsPerPage = defaultItemsPerPage || 12;
  const currency = useStore($currency);
  const rates = useStore($rates);
  const [hasMounted, setHasMounted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<ProductGridSortId>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 维护客户端展示的产品列表和产品总数
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setHasMounted(true), []);

  // 监听翻页、筛选和排序变化，发起客户端 Fetch 请求
  useEffect(() => {
    // 首次加载（第一页，且无任何分类/排序条件筛选）时，直接使用静态传入的 products 数组数据
    // 保证首屏的极致加载速度与零客户端冗余请求
    if (currentPage === 1 && selectedCategory === "all" && sortBy === "newest" && initialTotal > 0) {
      setDisplayedProducts(initialProducts);
      setTotalCount(initialTotal);
      return;
    }

    const controller = new AbortController();
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const backendSort = sortBy.replace('-', '_') as any;
        const res = await api.getProducts({
          page: currentPage,
          pageSize: currentItemsPerPage,
          category: selectedCategory === "all" ? undefined : selectedCategory,
          sort: backendSort,
        }, { signal: controller.signal });

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
  }, [currentPage, selectedCategory, sortBy, initialProducts, initialTotal, currentItemsPerPage]);

  const totalPages = Math.ceil(totalCount / currentItemsPerPage);
  const categoriesView = toProductGridCategoryOptions({ categories, selectedCategory, lang });
  const sortOptionsView = toProductGridSortOptions(sortBy, lang);
  const productsView = toProductGridItems({
    products: displayedProducts,
    lang,
    formatPriceText: (price) => hasMounted
      ? formatPrice(price, currency, rates)
      : formatPrice(price),
  });
  const labels = toProductGridLabels(lang, totalCount);

  return (
    <ProductGridView
      categories={categoriesView}
      sortOptions={sortOptionsView}
      products={productsView}
      labels={labels}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
      selectedCategory={selectedCategory}
      sortBy={sortBy}
      isLoading={isLoading}
      onCategoryChange={(categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
      }}
      onSortChange={(sortId) => {
        setSortBy(sortId);
        setCurrentPage(1);
      }}
      onPageChange={setCurrentPage}
    />
  );
}
