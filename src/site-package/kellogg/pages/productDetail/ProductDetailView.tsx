import React, { useState ,useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Share2, Layers, Calendar } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $currency, $rates, formatPrice } from '@/cms/lib/currency';
import { t } from '../../utils/i18n';
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
    const title = t(product.name, lang);
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
        <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 relative shadow-2xl shadow-gray-200/50">
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
                alt={t(product.name, lang)}
                className="w-full h-full object-cover"
                priority={true}
              />
            </motion.div>
          </AnimatePresence>

          {product.tag && (
            <span className="absolute top-8 left-8 px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-full tracking-widest uppercase z-10 shadow-lg">
              {t(product.tag, lang)}
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
              className={`relative w-24 aspect-square rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                activeImageIndex === idx && !variantPreviewImage ? 'border-gray-900 scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
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
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full uppercase tracking-wider">
              {t(product.category, lang)}
            </span>
            <div className="flex items-center gap-1.5 text-amber-400 bg-gray-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold text-gray-900">{product.rating || '5.0'}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t(product.name, lang)}
            </h1>
            <button
              onClick={handleShare}
              className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm flex-shrink-0"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Price Section */}
          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              {getDisplayPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl md:text-2xl text-gray-300 line-through font-medium">
                {getDisplayPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Bulk Pricing */}
        {product.bulkPrices && product.bulkPrices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] whitespace-nowrap">
                {lang === 'zh' ? '批量阶梯价格' : 'Bulk Pricing'}
              </span>
              <div className="h-px w-full bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.bulkPrices.map((tier, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-gray-200 transition-all text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    {tier.maxQty ? `${tier.minQty}-${tier.maxQty} PCS` : `${tier.minQty}+ PCS`}
                  </p>
                  <p className="text-base font-bold text-gray-900">{getDisplayPrice(tier.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variants */}
        <div className="space-y-10 py-10 border-y border-gray-100">
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <div className="flex gap-2 md:gap-4 items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{lang === 'zh' ? '颜色' : 'Color'}</span>
                <span className="text-sm font-bold text-gray-900">
                  {selectedColorIndex !== null ? t(product.colors[selectedColorIndex].name, lang) : (lang === 'zh' ? '请选择' : 'Select')}
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
                    className={`w-14 h-14 rounded-full p-1 border-2 transition-all ${
                      selectedColorIndex === idx ? 'border-gray-900 scale-110 shadow-xl' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    {color.image ? (
                      <OptimizedImage src={color.image} alt="" width={80} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full text-[10px] font-bold uppercase">
                        {t(color.name, lang).slice(0, 2)}
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
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{lang === 'zh' ? '尺码' : 'Size'}</span>
                <span className="text-sm font-bold text-gray-900">{selectedSize || (lang === 'zh' ? '请选择' : 'Select')}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSize(size.name);
                      if (size.image) setVariantPreviewImage(size.image);
                    }}
                    className={`px-8 py-3.5 rounded-2xl border-2 text-sm font-black transition-all ${
                      selectedSize === size.name
                        ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-105'
                        : 'border-gray-100 text-gray-900 hover:border-gray-300 bg-white'
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
          <p className="text-gray-500 leading-relaxed text-lg italic font-light">
            {t(product.description, lang)}
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Layers size={20} /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">{lang === 'zh' ? '分类' : 'Category'}</p>
                <p className="font-bold text-gray-900">{t(product.category, lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Calendar size={20} /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">{lang === 'zh' ? '发布' : 'Release'}</p>
                <p className="font-bold text-gray-900">{product.releaseDate || '2024'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
