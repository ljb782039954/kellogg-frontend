import React, { useState ,useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Share2, Layers, Calendar } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $currency, $rates, formatPrice } from '@/cms/lib/currency';
import { createTranslate } from '../../utils/i18n';
import OptimizedImage from '@/runtime/components/OptimizedImage';
import type { Product, Language } from '@/cms/types';

interface Props {
  product: Product;
  lang: Language;
}

export default function ProductDetailView({ product, lang }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [variantPreviewImage, setVariantPreviewImage] = useState<string | null>(null);
  
  const [hasMounted, setHasMounted] = useState(false);
  const currency = useStore($currency);
  const rates = useStore($rates);

const translate = createTranslate(lang);


  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getDisplayPrice = (price: number | null | undefined) => {
    return hasMounted 
      ? formatPrice(price, currency, rates)
      : formatPrice(price);
  };

  const handleShare = () => {
    const url = window.location.href;
    const title = translate(product.name);
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(lang === 'zh' ? '链接已复制' : 'Link copied');
    });
  };

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
      {/* Left: Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-media">
          <AnimatePresence mode="wait">
            <motion.div
              key={variantPreviewImage || gallery[activeImageIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <OptimizedImage
                src={variantPreviewImage || gallery[activeImageIndex]}
                alt={translate(product.name)}
                className="w-full h-full object-cover"
                priority={true}
              />
            </motion.div>
          </AnimatePresence>

          {product.tag && (
            <span className="absolute left-5 top-5 z-10 bg-ink-strong px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-on-dark">
              {translate(product.tag)}
            </span>
          )}
        </div>

        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx);
                setVariantPreviewImage(null);
              }}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border transition-colors ${
                activeImageIndex === idx && !variantPreviewImage ? 'border-ink-strong' : 'border-border hover:border-ink'
              }`}
            >
              <OptimizedImage src={img} alt="thumbnail" className="w-full h-full object-cover" width={100} />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="flex flex-col space-y-8 lg:pt-2">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-body">
              {translate(product.category)}
            </span>
            <div className="flex items-center gap-1.5 text-rating">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[11px] text-body">{product.rating || '5.0'}</span>
            </div>
          </div>
          
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-luxury-heading text-4xl font-light leading-tight text-ink-strong md:text-5xl">
              {translate(product.name)}
            </h1>
            <button
              onClick={handleShare}
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-subtle transition-colors hover:border-ink-strong hover:text-ink-strong"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Price Section */}
          <div className="mt-7 flex items-baseline gap-4">
            <span className="font-luxury-heading text-4xl text-ink-strong md:text-5xl">
              {getDisplayPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg font-light text-subtle line-through md:text-xl">
                {getDisplayPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Bulk Pricing */}
        {product.bulkPrices && product.bulkPrices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-subtle">
                {lang === 'zh' ? '批量阶梯价格' : 'Bulk Pricing'}
              </span>
              <div className="h-px w-full bg-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.bulkPrices.map((tier, idx) => (
                <div key={idx} className="border border-border bg-page p-4 text-center transition-colors hover:border-ink-strong">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.1em] text-subtle">
                    {tier.maxQty ? `${tier.minQty}-${tier.maxQty} PCS` : `${tier.minQty}+ PCS`}
                  </p>
                  <p className="font-luxury-heading text-lg text-ink-strong">{getDisplayPrice(tier.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variants */}
        <div className="space-y-8 border-y border-border py-8">
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">{lang === 'zh' ? '颜色' : 'Color'}</span>
                <span className="text-sm text-ink-strong">
                  {selectedColorIndex !== null ? translate(product.colors[selectedColorIndex].name) : (lang === 'zh' ? '请选择' : 'Select')}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      if (color.image) setVariantPreviewImage(color.image);
                    }}
                    className={`h-12 w-12 rounded-full border p-1 transition-colors ${
                      selectedColorIndex === idx ? 'border-ink-strong' : 'border-border hover:border-ink'
                    }`}
                  >
                    {color.image ? (
                      <OptimizedImage src={color.image} alt="" width={80} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-media text-[10px] uppercase text-body">
                        {translate(color.name).slice(0, 2)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">{lang === 'zh' ? '尺码' : 'Size'}</span>
                <span className="text-sm text-ink-strong">{selectedSize || (lang === 'zh' ? '请选择' : 'Select')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSize(size.name);
                      if (size.image) setVariantPreviewImage(size.image);
                    }}
                    className={`border px-6 py-3 text-sm transition-colors ${
                      selectedSize === size.name
                        ? 'border-ink-strong bg-ink-strong text-on-dark'
                        : 'border-border bg-surface text-ink-strong hover:border-ink'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Extra Info */}
        <div className="space-y-7">
          <p className="text-base font-light leading-8 text-body">
            {translate(product.description)}
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <Layers size={18} className="text-subtle" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-subtle">{lang === 'zh' ? '分类' : 'Category'}</p>
                <p className="mt-1 text-sm text-ink-strong">{translate(product.category)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <Calendar size={18} className="text-subtle" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-subtle">{lang === 'zh' ? '发布' : 'Release'}</p>
                <p className="mt-1 text-sm text-ink-strong">{product.releaseDate || '2024'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
