import { formatPrice } from "@/cms/lib/currency";
import { toNewArrivalsViewProps } from "../../block-adapters";
import type { NewArrivalsContent } from "../../block-adapters";
import type { Category, Language, Product } from "@/cms/types";
import NewArrivals from "../blocks/NewArrivals";

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
      {...toNewArrivalsViewProps({
        content,
        products,
        categories,
        lang,
        formatPriceText: formatPrice,
      })}
    />
  );
}
