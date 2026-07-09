import type { Category, Language, Product } from "@/cms/types";
import NewArrivals, { type NewArrivalsContent } from "../blocks/NewArrivals";

export interface NewArrivalsContainerProps extends NewArrivalsContent {
  products?: Product[];
  categories?: Category[];
  lang: Language;
}

export default function NewArrivalsContainer({
  products = [],
  categories = [],
  lang,
  ...content
}: NewArrivalsContainerProps) {
  return (
    <NewArrivals
      content={content}
      products={products}
      categories={categories}
      lang={lang}
    />
  );
}
