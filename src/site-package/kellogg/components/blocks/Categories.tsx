import type { Category, Language } from "../../types";
import { createTranslate } from "../../utils/i18n";
import OptimizedImage from "../../../../core/components/OptimizedImage";

export interface CategoriesProps {
  showAll?: boolean;
  maxItems?: number;
  categories: Category[];
  lang: Language;
}

export default function Categories({ showAll, maxItems, categories = [], lang }: CategoriesProps) {
  const t = createTranslate(lang);
  const displayCategories = showAll ? categories : categories.slice(0, maxItems);
  if (displayCategories.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {displayCategories.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              <div className="w-full aspect-[1/1.5] max-w-[60px] mx-auto bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm mb-2 group-hover:shadow-md group-hover:scale-105 transition-all">
                <OptimizedImage src={category.image} alt={t(category.name)} width={120} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{t(category.name)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
