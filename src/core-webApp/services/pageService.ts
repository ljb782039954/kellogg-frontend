import type { BlogCategory, Category, Product, Blog, BlogSummary } from "@/cms/types";

export interface ProductDetailPageData {
  product: Product & { categoryName?: string };
  relatedProducts: Product[];
}

export interface BlogIndexPageData {
  blogs: BlogSummary[];
  categories: string[];
  blogPageDetail: any;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface BlogDetailPageData {
  blog: Blog;
  relatedBlogs: BlogSummary[];
}

interface CommonPageOptions {
  api: any;
  lang: string;
}

/**
 * PageService provides generic server-side data loading and processing functions
 * for common CMS pages such as Product Detail, Blog Index, and Blog Detail.
 */
export class PageService {
  /**
   * Loads product detail data, resolves category name mapping, 
   * and filters related recommended products.
   */
  static async loadProductDetailPageData({
    id,
    api,
  }: CommonPageOptions & { id: number }): Promise<ProductDetailPageData | { product: null; relatedProducts: [] }> {
    const [productRaw, productsRes, categories] = await Promise.all([
      api.getProduct(id),
      api.getProducts({ pageSize: 5 }),
      api.getCategories(),
    ]);

    if (!productRaw) {
      return { product: null, relatedProducts: [] };
    }

    const categoryObj = (categories as Category[]).find((c) => c.id === productRaw.category);
    const product: Product & { categoryName?: string } = {
      ...productRaw,
      categoryName: categoryObj ? categoryObj.name : undefined,
    };

    // Filter out the current product from recommendations and take up to 4
    const relatedProducts = (productsRes.data || [])
      .filter((item: Product) => String(item.id) !== String(id))
      .slice(0, 4);

    return {
      product,
      relatedProducts,
    };
  }

  /**
   * Loads blog listing data, extracts and unique-groups all categories, 
   * and loads system blog configuration.
   */
  static async loadBlogIndexPageData({
    api,
    page = 1,
    pageSize = 12,
    category = "All",
    sort = "newest",
  }: CommonPageOptions & {
    page?: number;
    pageSize?: number;
    category?: string;
    sort?: string;
  }): Promise<BlogIndexPageData> {
    const [blogsResp, blogCategories, blogPageDetail] = await Promise.all([
      api.getBlogs({
        page,
        pageSize,
        category: category === "All" ? undefined : category,
        sort,
      }),
      api.getBlogCategories(),
      api.getPageById("system-blog").catch(() => null),
    ]);

    const blogs = blogsResp.data || [];
    
    const cats = new Set<string>((blogCategories as BlogCategory[])
      .map((item) => item.name_en)
      .filter(Boolean));
    if (category !== "All") cats.add(category);
    const categories = ["All", ...Array.from(cats)];

    return {
      blogs,
      categories,
      blogPageDetail,
      pagination: blogsResp.pagination || {
        total: blogs.length,
        page,
        pageSize,
        totalPages: 1,
      },
    };
  }

  /**
   * Loads a single blog detail, fetches related recommended posts 
   * from the same category, and filters out the current post.
   */
  static async loadBlogDetailPageData({
    blogSlug,
    api,
  }: CommonPageOptions & { blogSlug: string }): Promise<BlogDetailPageData | { blog: null; relatedBlogs: [] }> {
    let blog: Blog | null = null;
    try {
      blog = await api.getBlog(blogSlug || "");
    } catch {
      return { blog: null, relatedBlogs: [] };
    }

    if (!blog) {
      return { blog: null, relatedBlogs: [] };
    }

    let relatedBlogs: BlogSummary[] = [];
    try {
      const resp = await api.getBlogs({
        pageSize: 20,
        category: blog.category || undefined,
        sort: "newest",
      });
      // Filter out current post
      relatedBlogs = (resp.data || [])
        .filter((item: BlogSummary) => item.slug !== blog!.slug)
        .slice(0, 4);
    } catch (err) {
      console.error("[PageService] Failed to load related blogs:", err);
    }

    return {
      blog,
      relatedBlogs,
    };
  }
}
