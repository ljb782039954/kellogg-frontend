import type { Translation, Product, Language } from "../../types";
import { formatPrice } from "@core/lib/currency";
import { toProductCardStaticProps } from "../../block-adapters/productCardAdapter";
import { createTranslate } from "../../utils/i18n";
import ProductCardStatic from "../base/ProductCardStatic";

export interface FeaturedProductsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  initialProducts?: Product[];
  products?: Product[];
  lang: Language;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  subtitle, 
  maxItems, 
  initialProducts = [],
  products: providedProducts,
  lang 
}) => {
  const products = providedProducts || initialProducts;
  const t = createTranslate(lang);

  const displayLimit = maxItems || 8;
  const cards = products.slice(0, displayLimit).map((product) => ({
    id: product.id,
    href: `/product/${product.id}`,
    props: toProductCardStaticProps(product, {
      lang,
      formatPriceText: formatPrice,
    }),
  }));

  if (cards.length === 0) return null;

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t(title)}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{t(subtitle)}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {cards.map((card) => (
            <a key={card.id} href={card.href} className="block group">
              <ProductCardStatic {...card.props} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
