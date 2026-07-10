import { api } from "@services/api";
import { useBlogGrid } from "@core-webApp/hooks/useBlogGrid";
import type { BlogGridSortId, BlogSummary, Language } from "@/cms/types";
import BlogGrid, {
  type BlogGridItem,
  type BlogGridSortOption,
} from "./BlogGrid";

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
  const t = (zh: string, en: string) => lang === "zh" ? zh : en;
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

  const sortOptions: BlogGridSortOption[] = [
    { id: "newest", label: t("最新发布", "Newest") },
    { id: "popular", label: t("最多阅读", "Popular") },
    { id: "oldest", label: t("最早发布", "Oldest") },
  ];
  const items: BlogGridItem[] = displayedBlogs.map((blog) => ({
    id: String(blog.id),
    href: `/blog/${blog.slug}`,
    titleText: lang === "zh" ? blog.title_zh : blog.title_en,
    summaryText: lang === "zh" ? blog.summary_zh || "" : blog.summary_en || "",
    categoryText: blog.category || undefined,
    dateText: new Date(blog.publish_date || blog.created_at).toLocaleDateString(
      lang === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    ),
    image: blog.cover_image || undefined,
  }));

  return (
    <BlogGrid
      items={items}
      categories={categories}
      sortOptions={sortOptions}
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
