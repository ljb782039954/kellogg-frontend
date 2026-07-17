import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import { Pagination } from "../../components/base";
import type { BlogGridSortId, BlogSummary, Language } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface BlogGridPagination {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export interface BlogGridProps {
  blogs: BlogSummary[];
  lang: Language;
  sortOptions: BlogGridSortId[];
  sortBy: BlogGridSortId;
  onSortChange: (sort: BlogGridSortId) => void;

  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  pagination?: BlogGridPagination;
  isLoading?: boolean;
}

export default function BlogGrid({
  blogs,
  lang,
  sortOptions,
  sortBy,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  pagination,
  isLoading,
}: BlogGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const t = createTranslate(lang);
  const translate = (zh: string, en: string) => t({ zh, en });
  const getBlogTitle = (blog: BlogSummary) => t({ zh: blog.title_zh, en: blog.title_en });
  const getBlogSummary = (blog: BlogSummary) => t({
    zh: blog.summary_zh || "",
    en: blog.summary_en || "",
  });
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const categoryControls = categories?.length && onCategoryChange
    ? { items: categories, onChange: onCategoryChange }
    : null;

  return (
    <section className="py-4 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`border-y border-border py-4 flex flex-col md:flex-row md:items-center gap-4 mb-8 ${
          categoryControls ? "md:justify-between" : "md:justify-end"
        }`}>
          {categoryControls && (
            <div className="flex flex-wrap gap-2">
              {categoryControls.items.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => categoryControls.onChange(category)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-wider border transition-colors ${
                    selectedCategory === category
                      ? "bg-ink-strong text-on-dark border-ink-strong"
                      : "bg-surface text-body border-border hover:border-subtle"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 self-end md:self-auto flex-wrap">
            <label className="flex items-center gap-2 text-xs text-body">
              <SlidersHorizontal className="w-3.5 h-3.5 text-subtle" />
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as BlogGridSortId)}
                className="border border-border bg-surface px-2.5 py-1.5 text-xs text-ink-strong outline-none focus:border-ink-strong transition-colors cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "newest" && translate("最新发布", "Newest")}
                    {option === "popular" && translate("最多阅读", "Popular")}
                    {option === "oldest" && translate("最早发布", "Oldest")}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-1 p-1 bg-panel border border-border rounded flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "grid" ? "bg-surface text-ink-strong shadow-sm" : "text-subtle hover:text-body"
                }`}
                title={translate("网格视图", "Grid view")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "list" ? "bg-surface text-ink-strong shadow-sm" : "text-subtle hover:text-body"
                }`}
                title={translate("列表视图", "List view")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-overlay backdrop-blur-sm">
              <p className="text-sm text-body">{translate("正在加载文章...", "Loading articles...")}</p>
            </div>
          )}

          {blogs.length === 0 ? (
            <div className="py-16 text-center text-body">{translate("暂无文章", "No articles found")}</div>
          ) : (
            <div
              className={
                viewMode === "list"
                  ? "flex flex-col gap-6"
                  : "grid grid-cols-1 md:grid-cols-3 gap-6"
              }
            >
              {blogs.map((blog) => {
                const title = getBlogTitle(blog);
                const summary = getBlogSummary(blog);

                return (
                  <a key={blog.id} href={`/blog/${blog.slug}`} className="group block">
                    <article
                      className={`h-full overflow-hidden rounded-md border border-border bg-surface transition-all ${
                        viewMode === "list" ? "flex flex-col md:flex-row items-stretch" : "flex flex-col"
                      }`}
                    >
                      <div
                        className={`overflow-hidden bg-media ${
                          viewMode === "list"
                            ? "aspect-[16/10] md:w-80 flex-shrink-0 md:aspect-auto"
                            : "aspect-[4/3]"
                        }`}
                      >
                        {blog.cover_image ? (
                          <OptimizedImage
                            src={blog.cover_image}
                            alt={title}
                            width={720}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes={
                              viewMode === "list"
                                ? "(max-width: 768px) 100vw, 320px"
                                : "(max-width: 768px) 100vw, 33vw"
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-subtle min-h-[160px]">
                            {translate("暂无图片", "No Image")}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase text-subtle">
                            {blog.category && <span>{blog.category}</span>}
                            <span>{formatDate(blog.publish_date || blog.created_at)}</span>
                          </div>
                          <h3 className="mt-3 font-luxury-heading text-xl leading-snug group-hover:text-ink-strong transition-colors">
                            {title}
                          </h3>
                          {summary && (
                            <RichText
                              value={summary}
                              className="mt-3 text-xs leading-relaxed text-body line-clamp-3"
                            />
                          )}
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            totalText={pagination.totalCount === undefined
              ? undefined
              : translate(`共 ${pagination.totalCount} 篇文章`, `${pagination.totalCount} articles total`)}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    </section>
  );
}
