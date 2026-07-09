import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface BlogSidebarArticleProps {
  title: string;
  date?: string;
}

export interface BlogSidebarArticleContent {
  title: Translation;
  date?: string;
}

export interface BlogSidebarContent {
  categoriesTitle?: Translation;
  categories: Translation[];
  popularTitle?: Translation;
  popularArticles: BlogSidebarArticleContent[];
  newsletterTitle?: Translation;
  newsletterDescription?: Translation;
  emailPlaceholder?: Translation;
}

export interface BlogSidebarProps {
  content?: BlogSidebarContent;
  lang?: Language;
  categoriesTitle?: string;
  categories?: string[];
  popularTitle?: string;
  popularArticles?: BlogSidebarArticleProps[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  emailPlaceholder?: string;
}

export default function BlogSidebar({
  content,
  lang = "en",
  categoriesTitle = "Categories",
  categories = [],
  popularTitle = "Popular Articles",
  popularArticles = [],
  newsletterTitle = "Newsletter",
  newsletterDescription = "",
  emailPlaceholder = "Your email",
}: BlogSidebarProps) {
  const translate = createTranslate(lang);
  const resolvedCategoriesTitle = content ? translate(content.categoriesTitle, "Categories") : categoriesTitle;
  const resolvedCategories = content ? content.categories.map((category) => translate(category)) : categories;
  const resolvedPopularTitle = content ? translate(content.popularTitle, "Popular Articles") : popularTitle;
  const resolvedPopularArticles = content
    ? content.popularArticles.map((article) => ({ title: translate(article.title), date: article.date }))
    : popularArticles;
  const resolvedNewsletterTitle = content ? translate(content.newsletterTitle, "Newsletter") : newsletterTitle;
  const resolvedNewsletterDescription = content ? translate(content.newsletterDescription) : newsletterDescription;
  const resolvedEmailPlaceholder = content ? translate(content.emailPlaceholder, "Your email") : emailPlaceholder;

  return (
      <div className="bg-panel p-6 rounded-sm space-y-8">
        <div>
          <h4 className="text-xs font-medium mb-3">{resolvedCategoriesTitle}</h4>
          <div className="flex flex-wrap gap-2">
            {resolvedCategories.map((tag) => (
              <span key={tag} className="text-[10px] border border-border px-2 py-1 text-body hover:border-subtle cursor-default transition-colors">{tag}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium mb-3">{resolvedPopularTitle}</h4>
          <div className="space-y-3">
            {resolvedPopularArticles.map((article, index) => (
              <div key={`${article.title}-${index}`} className="border-b border-border pb-2 last:border-0">
                <p className="text-xs text-ink hover:text-ink-strong cursor-default transition-colors">{article.title}</p>
                {article.date && <p className="text-[9px] text-subtle mt-0.5">{article.date}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium mb-2">{resolvedNewsletterTitle}</h4>
          {resolvedNewsletterDescription && <p className="text-[10px] text-subtle mb-3">{resolvedNewsletterDescription}</p>}
          <div className="flex border-b border-border pb-1">
            <input type="email" placeholder={resolvedEmailPlaceholder} className="flex-1 bg-transparent text-xs outline-none" />
            <span className="text-xs cursor-default text-subtle">&rarr;</span>
          </div>
        </div>
      </div>
  );
}


