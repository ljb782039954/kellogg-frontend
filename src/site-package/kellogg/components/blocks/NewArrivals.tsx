import type { Language, Product, Translation } from "../../types";
import { formatPrice } from "@core/lib/currency";
import { toProductCardStaticProps } from "../../block-adapters/productCardAdapter";
import ProductCardStatic from "../base/ProductCardStatic";
import SectionHeader from "../base/SectionHeader";

export interface NewArrivalsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  products: Product[];
  lang: Language;
}

export default function NewArrivals({ title, subtitle, maxItems, products = [], lang }: NewArrivalsProps) {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;
  const cards = displayProducts.map((product) => ({
    id: product.id,
    href: `/product/${product.id}`,
    props: toProductCardStaticProps(product, {
      lang,
      variant: "arrival",
      formatPriceText: formatPrice,
    }),
  }));

  if (cards.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="light" />}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 md:gap-4 px-4 pb-4">
          {cards.map((card) => (
            <a key={card.id} href={card.href} className="block">
              <ProductCardStatic {...card.props} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
