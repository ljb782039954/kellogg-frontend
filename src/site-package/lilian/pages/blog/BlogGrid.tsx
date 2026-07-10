import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import { Pagination } from "../../components/base";
import type { BlogGridSortId } from "@/cms/types";

export interface BlogGridItem {
  id: string;
  href: string;
  titleText: string;
  summaryText?: string;
  categoryText?: string;
  dateText?: string;
  image?: string;
}

export interface BlogGridSortOption {
  id: BlogGridSortId;
  label: string;
}

export interface BlogGridProps {
  items: BlogGridItem[];
  categories: string[];
  selectedCategory: string;
  sortBy: BlogGridSortId;
  sortOptions: BlogGridSortOption[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: BlogGridSortId) => void;
  onPageChange: (page: number) => void;
}

export default function BlogGrid({
  items,
  categories,
  selectedCategory,
  sortBy,
  sortOptions,
  totalCount,
  totalPages,
  currentPage,
  isLoading,
  onCategoryChange,
  onSortChange,
  onPageChange,
}: BlogGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <section className="px-6 py-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="border-y border-border py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
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
                  <option key={option.id} value={option.id}>
                    {option.label}
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
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "list" ? "bg-surface text-ink-strong shadow-sm" : "text-subtle hover:text-body"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-overlay backdrop-blur-sm">
              <p className="text-sm text-body">Loading articles...</p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="py-16 text-center text-body">No articles found</div>
          ) : (
            <div
              className={
                viewMode === "list"
                  ? "flex flex-col gap-6"
                  : "grid grid-cols-1 md:grid-cols-3 gap-6"
              }
            >
              {items.map((item) => (
                <a key={item.id} href={item.href} className="group block">
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
                      {item.image ? (
                        <OptimizedImage
                          src={item.image}
                          alt={item.titleText}
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
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase text-subtle">
                          {item.categoryText && <span>{item.categoryText}</span>}
                          {item.dateText && <span>{item.dateText}</span>}
                        </div>
                        <h3 className="mt-3 font-luxury-heading text-xl leading-snug group-hover:text-ink-strong transition-colors">
                          {item.titleText}
                        </h3>
                        {item.summaryText && (
                          <RichText
                            value={item.summaryText}
                            className="mt-3 text-xs leading-relaxed text-body line-clamp-3"
                          />
                        )}
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            totalText={`${totalCount} articles total`}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </section>
  );
}
