import { useState } from "react";
import { Eye, FileText, Grid2X2, List, SlidersHorizontal } from "lucide-react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import { Pagination } from "../../components/base";
import type { BlogSummary, Language , BlogGridSortId} from "@/cms/types";

type BlogGridViewMode = "grid" | "list";

export interface BlogGridProps {
  blogs: BlogSummary[];
  categories: string[];
  lang: Language;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  selectedCategory: string;
  sortBy: BlogGridSortId;
  isLoading: boolean;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: BlogGridSortId) => void;
  onPageChange: (page: number) => void;
}

export default function BlogGrid({
  blogs,
  categories,
  lang,
  totalCount,
  totalPages,
  currentPage,
  selectedCategory,
  sortBy,
  isLoading,
  onCategoryChange,
  onSortChange,
  onPageChange,
}: BlogGridProps) {
  const [viewMode, setViewMode] = useState<BlogGridViewMode>("grid");
  const t = (zh: string, en: string) => lang === "zh" ? zh : en;
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getBlogTitle = (blog: BlogSummary) => lang === "zh" ? blog.title_zh : blog.title_en;
  const getBlogSummary = (blog: BlogSummary) => lang === "zh" ? (blog.summary_zh || "") : (blog.summary_en || "");

  return (
    <>
      <section className="sticky top-16 md:top-20 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 overflow-x-auto" aria-label={t("博客分类", "Blog categories")}>
            {categories.map((category) => {
              const selected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  aria-pressed={selected}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                    selected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <label className="flex items-center gap-2 text-sm text-gray-500">
              <SlidersHorizontal className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as BlogGridSortId)}
                className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <option value="newest">{t("最新发布", "Newest")}</option>
                <option value="popular">{t("最多阅读", "Popular")}</option>
                <option value="oldest">{t("最早发布", "Oldest")}</option>
              </select>
            </label>

            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg" aria-label={t("列表视图", "Blog view")}>
              <button
                type="button"
                title={t("网格视图", "Grid view")}
                aria-label={t("网格视图", "Grid view")}
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                title={t("列表视图", "List view")}
                aria-label={t("列表视图", "List view")}
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">{t("正在加载文章...", "Loading articles...")}</p>
            </div>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FileText className="w-14 h-14 mx-auto mb-4 stroke-[1.2]" />
            <p className="text-lg font-medium">{t("暂无文章", "No articles yet")}</p>
            <p className="text-sm mt-1">{t("敬请期待精彩内容", "Stay tuned for exciting content")}</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {blogs.map((blog) => {
                const title = getBlogTitle(blog);
                const summary = getBlogSummary(blog);
                const isList = viewMode === "list";

                return (
                  <a
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className={`group overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                      isList ? "flex flex-col md:flex-row items-stretch" : "block"
                    }`}
                  >
                    <div className={`overflow-hidden bg-gray-100 ${isList ? "md:w-[180px] md:flex-shrink-0 aspect-[16/9] md:aspect-auto" : "aspect-[16/9]"}`}>
                      {blog.cover_image ? (
                        <OptimizedImage
                          src={blog.cover_image}
                          alt={title}
                          width={600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <FileText className="w-12 h-12 text-gray-300 stroke-[1]" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1">
                      {blog.category && (
                        <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-3">
                          {blog.category}
                        </span>
                      )}
                      <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {title}
                      </h2>
                      {summary && <p className="text-gray-500 text-sm line-clamp-2 mb-4">{summary}</p>}

                      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
                        <div className="flex items-center gap-2">
                          <span>{blog.author}</span>
                          <span>·</span>
                          <span>{formatDate(blog.publish_date || blog.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.view_count.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalCount={totalCount}
                totalText={t(`共 ${totalCount} 篇文章`, `${totalCount} articles total`)}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
