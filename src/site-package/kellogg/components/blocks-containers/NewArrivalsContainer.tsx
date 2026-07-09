import { formatPrice } from "@/cms/lib/currency";
import { toNewArrivalsViewProps } from "../../block-adapters";
import type { NewArrivalsContent } from "../blocks";
import type { Language, Product } from "@/cms/types";
import NewArrivals from "../blocks/NewArrivals";

export interface NewArrivalsContainerProps extends NewArrivalsContent {
  products?: Product[];
  lang: Language;
}

export default function NewArrivalsContainer({
  products = [],
  lang,
  ...content
}: NewArrivalsContainerProps) {
  return (
    <NewArrivals
      {...toNewArrivalsViewProps({
        content,
        products,
        lang,
        formatPriceText: formatPrice,
      })}
    />
  );
}
