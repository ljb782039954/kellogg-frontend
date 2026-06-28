import type { Language, Product } from "../../types";
import { formatPrice } from "@/core/lib/currency";
import { t } from "../../utils/i18n";
import OptimizedImage from "@/core/components/OptimizedImage";

interface ProductCardStaticProps {
  product: Product;
  lang: Language;
  variant?: "standard" | "arrival";
  priceText?: string;
}

export default function ProductCardStatic({ product, lang, variant = "standard", priceText }: ProductCardStaticProps) {
  const bulkPrice = product.bulkPrices?.[0];
  const displayPrice = priceText || formatPrice(bulkPrice?.price ?? product.price);

  if (variant === "arrival") {
    return (
      <div className="group">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-6">
          <OptimizedImage src={product.image} alt={t(product.name, lang)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" width={640} />
          {product.releaseDate && <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm">{product.releaseDate}</div>}
          {product.tag && <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-sm">{t(product.tag, lang)}</div>}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{t(product.name, lang)}</h3>
            <span className="text-lg font-medium text-gray-500 whitespace-nowrap">{formatPrice(product.price)}</span>
          </div>
          <p className="text-sm text-gray-400 capitalize">{typeof product.category === "string" ? product.category : t(product.category, lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group h-full flex flex-col">
      <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
        {product.image ? (
          <OptimizedImage src={product.image} alt={t(product.name, lang)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
        {product.tag && <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm z-10">{t(product.tag, lang)}</span>}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">{t(product.name, lang)}</h3>
        <div className="flex items-center justify-between mt-auto">
          {bulkPrice && (
            <>
              <p className="text-xs md:text-sm font-semibold text-gray-400 uppercase group-hover:text-amber-600 transition-colors">
                {bulkPrice.maxQty ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS` : `${bulkPrice.minQty}+ PCS`}
              </p>
              <p className="text-sm md:text-base font-bold text-gray-900" data-base-price={bulkPrice.price}>{displayPrice}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
