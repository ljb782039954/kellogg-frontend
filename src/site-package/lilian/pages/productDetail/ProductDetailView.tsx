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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
      {/* Left: Gallery */}
      <div className="space-y-6">
        <div className="aspect-[4/5] rounded-md overflow-hidden bg-panel border border-border relative">
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
            <span className="absolute top-6 left-6 px-4 py-2 bg-ink-strong text-on-dark text-[10px] tracking-widest uppercase rounded-sm z-10">
              {translate(product.tag)}
            </span>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx);
                setVariantPreviewImage(null);
              }}
              className={`relative w-20 aspect-square rounded-md overflow-hidden flex-shrink-0 border transition-all ${
                activeImageIndex === idx && !variantPreviewImage ? 'border-brand scale-105 shadow-sm' : 'border-transparent hover:border-border'
              }`}
            >
              <OptimizedImage src={img} alt="thumbnail" className="w-full h-full object-cover" width={100} />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="flex flex-col space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-widest uppercase px-3 py-1 bg-panel border border-border text-brand rounded-sm">
              {translate(product.category)}
            </span>
            <div className="flex items-center gap-1.5 text-rating bg-panel border border-border px-3 py-1 rounded-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-semibold text-ink">{product.rating || '5.0'}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-start gap-4">
            <h1 className="font-luxury-heading text-3xl sm:text-4xl text-ink font-light leading-tight">
              {translate(product.name)}
            </h1>
            <button
              onClick={handleShare}
              className="p-3.5 rounded-md border border-border bg-surface text-subtle hover:text-ink hover:bg-panel transition-all flex-shrink-0"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Price Section */}
          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-3xl md:text-4xl font-semibold text-brand">
              {getDisplayPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-subtle line-through font-medium">
                {getDisplayPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Bulk Pricing */}
        {product.bulkPrices && product.bulkPrices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-subtle uppercase tracking-widest whitespace-nowrap">
                {lang === 'zh' ? '批量阶梯价格' : 'Bulk Pricing'}
              </span>
              <div className="h-px w-full bg-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.bulkPrices.map((tier, idx) => (
                <div key={idx} className="bg-panel rounded-md p-4 border border-border hover:border-subtle transition-all text-center">
                  <p className="text-[10px] text-subtle font-light uppercase tracking-wider mb-1">
                    {tier.maxQty ? `${tier.minQty}-${tier.maxQty} PCS` : `${tier.minQty}+ PCS`}
                  </p>
                  <p className="text-sm font-semibold text-ink">{getDisplayPrice(tier.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variants */}
        <div className="space-y-10 py-10 border-y border-border">
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <div className="flex gap-2 md:gap-4 items-center">
                <span className="text-xs uppercase tracking-wider text-subtle">{lang === 'zh' ? '颜色' : 'Color'}</span>
                <span className="text-sm font-semibold text-ink">
                  {selectedColorIndex !== null ? translate(product.colors[selectedColorIndex].name) : (lang === 'zh' ? '请选择' : 'Select')}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      if (color.image) setVariantPreviewImage(color.image);
                    }}
                    className={`w-12 h-12 rounded-full p-0.5 border transition-all ${
                      selectedColorIndex === idx ? 'border-brand scale-105' : 'border-transparent hover:border-border'
                    }`}
                  >
                    {color.image ? (
                      <OptimizedImage src={color.image} alt="" width={80} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-media rounded-full text-[9px] text-body font-medium uppercase tracking-wider">
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
              <div className="flex gap-2 md:gap-4 items-center">
                <span className="text-xs uppercase tracking-wider text-subtle">{lang === 'zh' ? '尺码' : 'Size'}</span>
                <span className="text-sm font-semibold text-ink">{selectedSize || (lang === 'zh' ? '请选择' : 'Select')}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSize(size.name);
                      if (size.image) setVariantPreviewImage(size.image);
                    }}
                    className={`px-6 py-2.5 rounded-md border text-xs font-medium uppercase tracking-wider transition-all ${
                      selectedSize === size.name
                        ? 'bg-ink-strong border-ink-strong text-on-dark scale-105 shadow-sm'
                        : 'border-border text-ink hover:border-subtle bg-surface'
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
        <div className="space-y-8">
          <p className="text-body leading-relaxed text-sm">
            {translate(product.description)}
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-panel border border-border rounded-md text-subtle"><Layers size={18} /></div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider font-bold">{lang === 'zh' ? '分类' : 'Category'}</p>
                <p className="font-semibold text-ink text-sm">{translate(product.category)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-panel border border-border rounded-md text-subtle"><Calendar size={18} /></div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider font-bold">{lang === 'zh' ? '发布' : 'Release'}</p>
                <p className="font-semibold text-ink text-sm">{product.releaseDate || '2024'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
