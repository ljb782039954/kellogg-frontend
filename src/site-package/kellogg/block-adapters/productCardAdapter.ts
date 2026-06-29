import type { Language } from "@core/types";
import type { Product, Translation } from "../types";
import type { ProductCardStaticProps } from "../components/base";
import { t } from "../utils/i18n";

interface ProductCardAdapterOptions {
  lang: Language;
  variant?: ProductCardStaticProps["variant"];
  formatPriceText: (price?: number) => string;
}

function translateMaybe(value: string | Translation | undefined, lang: Language): string {
  if (!value) return "";
  return typeof value === "string" ? value : t(value, lang);
}

export function toProductCardStaticProps(
  product: Product,
  {
    lang,
    variant = "standard",
    formatPriceText,
  }: ProductCardAdapterOptions,
): ProductCardStaticProps {
  const bulkPrice = product.bulkPrices?.[0];
  const basePrice = variant === "arrival"
    ? product.price
    : bulkPrice?.price ?? product.price;

  return {
    variant,
    title: t(product.name, lang),
    imageSrc: product.image || "",
    tagText: product.tag ? t(product.tag, lang) : undefined,
    releaseText: product.releaseDate,
    categoryText: translateMaybe(product.category as string | Translation | undefined, lang),
    quantityText: bulkPrice
      ? bulkPrice.maxQty
        ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS`
        : `${bulkPrice.minQty}+ PCS`
      : undefined,
    priceText: formatPriceText(basePrice),
    basePrice,
  };
}
