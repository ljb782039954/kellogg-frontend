import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, Category, SortOption, Language } from '../../types';
import ProductCard from '../product/ProductCard';
import Pagination from '../base/Pagination';
import { t } from '../../utils/common';
import { api } from '../../lib/api';

export interface ProductGridProps {
  itemsPerPage?: number;
  categories: Category[];
  products: Product[];
  totalProducts?: number;
  lang: Language;
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'newest', name: { zh: '最新上架', en: 'Newest' } },
  { id: 'price-asc', name: { zh: '价格从低到高', en: 'Price Low-High' } },
  { id: 'price-desc', name: { zh: '价格从高到低', en: 'Price High-Low' } },
  { id: 'sales', name: { zh: '销量优先', en: 'Best Selling' } },
];

export default function ProductGrid({
  itemsPerPage: defaultItemsPerPage = 12,
  categories = [],
  products: initialProducts = [],
  totalProducts: initialTotal = 0,
  lang,
}: ProductGridProps) {
  // 读取后台配置的每页显示数量，若未指定则默认显示 12 个
  const currentItemsPerPage = defaultItemsPerPage || 12;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 维护客户端展示的产品列表和产品总数
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);

  // 监听翻页、筛选和排序变化，发起客户端 Fetch 请求
  useEffect(() => {
    // 首次加载（第一页，且无任何分类/排序条件筛选）时，直接使用静态传入的 products 数组数据
    // 保证首屏的极致加载速度与零客户端冗余请求
    if (currentPage === 1 && selectedCategory === 'all' && sortBy === 'newest' && initialTotal > 0) {
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
          category: selectedCategory === 'all' ? undefined : selectedCategory,
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

  return (
    <section className="pt-20 w-full">
      <div className="container mx-auto px-4">
        {/* Filters Bar */}
        <div className="w-full border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang === 'zh' ? '全部' : 'All'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(cat.name, lang)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 border-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.name, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid Display Area */}
        <div className="py-12 relative min-h-[400px]">
          {/* Premium Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                  {lang === 'zh' ? '正在为您加载商品...' : 'Loading products...'}
                </p>
              </div>
            </div>
          )}

          {displayedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {lang === 'zh' ? '暂无商品' : 'No products available'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayedProducts.map((product, index) => (
                  <a key={product.id} href={`/product/${product.id}`} className="block group h-full">
                    <ProductCard lang={lang} product={product} index={index} />
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={totalCount}
                  lang={lang}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
