import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, Category, SortOption, Language } from '../../types';
import ProductCard from './ProductCard';
import Pagination from '../Pagination';

export interface ProductGridProps {
  itemsPerPage?: number;
  categories: Category[];
  products: Product[];
  lang: Language;
}

export default function ProductGrid({
  itemsPerPage = 12,
  categories = [],
  products = [],
  lang,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const t = (obj: { zh: string; en: string } | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const sortOptions: SortOption[] = [
    { id: 'newest', name: { zh: '最新上架', en: 'Newest' } },
    { id: 'price-asc', name: { zh: '价格从低到高', en: 'Price Low-High' } },
    { id: 'price-desc', name: { zh: '价格从高到低', en: 'Price High-Low' } },
    { id: 'sales', name: { zh: '销量优先', en: 'Best Selling' } },
  ];

  // 1. 筛选产品
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. 排序
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'sales') {
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    } else {
      result.sort((a, b) =>
        new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
      );
    }
    return result;
  }, [products, selectedCategory, sortBy]);

  // 3. 分页
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="pt-12 pb-24 w-full">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="w-full border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang === 'zh' ? '全部' : 'All'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(cat.name)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="py-12">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {lang === 'zh' ? '暂无商品' : 'No products available'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product, index) => (
                  <a
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block group"
                  >
                    <ProductCard lang={lang} product={product} index={index} />
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredProducts.length}
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
