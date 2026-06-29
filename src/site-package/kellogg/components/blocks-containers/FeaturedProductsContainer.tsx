import { formatPrice } from "@core/lib/currency";
import { toFeaturedProductsViewProps } from "../../block-adapters";
import type { FeaturedProductsContent } from "../../block-schemas";
import type { Language, Product } from "@core/types";
import FeaturedProducts from "../blocks/FeaturedProducts";

export interface FeaturedProductsContainerProps extends FeaturedProductsContent {
  initialProducts?: Product[];
  products?: Product[];
  lang: Language;
}

export default function FeaturedProductsContainer({
  initialProducts = [],
  products: providedProducts,
  lang,
  ...content
}: FeaturedProductsContainerProps) {
  const products = providedProducts || initialProducts;

  return (
    <FeaturedProducts
      {...toFeaturedProductsViewProps({
        content,
        products,
        lang,
        formatPriceText: formatPrice,
      })}
    />
  );
}
