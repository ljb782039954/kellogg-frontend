import { api } from "@services/api";
import { useBlogGrid, type BlogGridSortId } from "@core-webApp/hooks/useBlogGrid";
import type { BlogSummary, Language } from "@/cms/types";
import BlogGrid from "./BlogGrid";

export interface BlogGridContainerProps {
  blogs: BlogSummary[];
  categories: string[];
  totalBlogs: number;
  lang: Language;
  initialPage?: number;
  initialCategory?: string;
  initialSort?: BlogGridSortId;
  itemsPerPage?: number;
}

export default function BlogGridContainer({
  blogs,
  categories,
  totalBlogs,
  lang,
  initialPage = 1,
  initialCategory = "All",
  initialSort = "newest",
  itemsPerPage = 12,
}: BlogGridContainerProps) {
  const {
    selectedCategory,
    sortBy,
    currentPage,
    displayedBlogs,
    totalCount,
    isLoading,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
  } = useBlogGrid<BlogSummary>({
    initialBlogs: blogs,
    initialTotal: totalBlogs,
    initialPage,
    initialCategory,
    initialSort,
    itemsPerPage,
    syncUrl: true,
    fetchBlogs: (query, options) => api.getBlogs(query, options),
  });

  return (
    <BlogGrid
      blogs={displayedBlogs}
      categories={categories}
      lang={lang}
      totalCount={totalCount}
      totalPages={Math.ceil(totalCount / itemsPerPage)}
      currentPage={currentPage}
      selectedCategory={selectedCategory}
      sortBy={sortBy}
      isLoading={isLoading}
      onCategoryChange={setSelectedCategory}
      onSortChange={setSortBy}
      onPageChange={setCurrentPage}
    />
  );
}
