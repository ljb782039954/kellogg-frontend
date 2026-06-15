import type { Language, Product, Translation } from "../../types";
import ProductCardNew from "../product/ProductCardNew";
import SectionHeader from "../SectionHeader";

export interface NewArrivalsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  products: Product[];
  lang: Language;
}

export default function NewArrivals({ title, subtitle, maxItems, products = [], lang }: NewArrivalsProps) {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;
  if (displayProducts.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="light" />}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 md:gap-4 px-4 pb-4">
          {displayProducts.map((product, index) => <ProductCardNew key={product.id} product={product} index={index} lang={lang} />)}
        </div>
      </div>
    </section>
  );
}
