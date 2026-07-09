import { useState } from "react";
import type { BlogSummary, Language } from "@/cms/types";
import { BlogGrid as BlogGridView } from "../blocks";
import { toBlogGridViewProps } from "../../block-adapters/blogGridAdapter";

export interface BlogGridContainerProps {
  blogs?: BlogSummary[];
  lang: Language;
  title?: any;
  subtitle?: any;
  maxItems?: number;
}

export default function BlogGridContainer({
  blogs = [],
  lang,
  title,
  subtitle,
  maxItems,
}: BlogGridContainerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 1. 动态生成分类列表
  const cats = new Set<string>();
  blogs.forEach((blog) => {
    if (blog.category) cats.add(blog.category);
  });
  const categories = ["All", ...Array.from(cats)];

  // 2. 根据选中的分类过滤博客
  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter((blog) => blog.category === selectedCategory);

  // 3. 对过滤后的博客进行排序
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "views") {
      return (b.view_count || 0) - (a.view_count || 0);
    }
    // 默认 newest 发布时间降序
    const timeA = new Date(a.publish_date || a.created_at).getTime();
    const timeB = new Date(b.publish_date || b.created_at).getTime();
    return timeB - timeA;
  });

  // 4. 只有当在 All 分类并且传入了 maxItems 时（比如首页显示 3 篇），才进行裁剪。
  const resolvedMaxItems = selectedCategory === "All" ? maxItems : -1;

  const viewProps = toBlogGridViewProps({
    content: {
      title,
      subtitle,
      maxItems: resolvedMaxItems,
    },
    blogs: sortedBlogs,
    lang,
  });

  // 5. 排序选项定义（支持多语言）
  const sortOptions = [
    { id: "newest", label: lang === "zh" ? "最新发布" : "Newest" },
    { id: "views", label: lang === "zh" ? "最多阅读" : "Popular" },
  ];

  return (
    <BlogGridView
      {...viewProps}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      sortBy={sortBy}
      onSortChange={setSortBy}
      sortOptions={sortOptions}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );
}
