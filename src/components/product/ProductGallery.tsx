import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';

const MotionOptimizedImage = motion(OptimizedImage);

interface ProductGalleryProps {
  gallery: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  variantPreviewImage: string | null;
  productName: string;
  tag?: string;
}

export default function ProductGallery({
  gallery,
  activeImageIndex,
  setActiveImageIndex,
  variantPreviewImage,
  productName,
  tag
}: ProductGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative">
        <AnimatePresence mode="wait">
          <MotionOptimizedImage
            key={variantPreviewImage || gallery[activeImageIndex]}
            src={variantPreviewImage || gallery[activeImageIndex]}
            alt={productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
            responsive={{
              sm: 640,
              md: 800,
              lg: 1200
            }}
            priority={true}
          />
        </AnimatePresence>

        {tag && (
          <span className="absolute top-6 left-6 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full tracking-wider uppercase">
            {tag}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`relative w-24 aspect-square rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-200'
              }`}
          >
            <OptimizedImage 
              src={img} 
              alt={`${productName} thumbnail ${idx}`} 
              className="w-full h-full object-cover" 
              width={200}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
