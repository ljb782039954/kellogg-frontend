import { formatPrice } from "@core-webApp/lib/currency";
import { toNewArrivalsViewProps } from "../../block-adapters";
import type { NewArrivalsContent } from "../../types/block-schemas";
import type { Language, Product } from "@core-webApp/types";
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
