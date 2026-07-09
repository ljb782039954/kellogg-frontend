import type { Language } from "@/cms/types";

// 迁移类型

import type { FeaturedProductsProps, FeaturedProductsContent } from "../components/blocks";
import type { Product } from "@/cms/types";
import { createTranslate } from "../utils/i18n";
import { toProductCardStaticProps } from "./productCardAdapter";

interface FeaturedProductsAdapterOptions {
  content: FeaturedProductsContent;
  products: Product[];
  lang: Language;
  formatPriceText: (price?: number) => string;
}

export function toFeaturedProductsViewProps({
  content,
  products,
  lang,
  formatPriceText,
}: FeaturedProductsAdapterOptions): FeaturedProductsProps {
  const translate = createTranslate(lang);
  const displayLimit = content.maxItems || 8;

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    cards: products.slice(0, displayLimit).map((product) => ({
      id: String(product.id),
      href: `/product/${product.id}`,
      card: toProductCardStaticProps(product, {
        lang,
        formatPriceText,
      }),
    })),
  };
}
