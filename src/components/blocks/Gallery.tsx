import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import type { Translation, Language } from "../../types";
import OptimizedImage from '../ui/OptimizedImage';

export interface GalleryValues {
  src: string;
  caption?: Translation;
}

export interface GalleryProps {
  title?: Translation;
  subtitle?: Translation;
  items?: GalleryValues[];
  lang: Language;
}

export default function Gallery({ title, subtitle, items = [], lang }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {title && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{t(title)}</h2>}
          {subtitle && <p className="text-md md:text-lg text-gray-600">{t(subtitle)}</p>}
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 px-4"
        >
          {items.map((img, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(i)}
            >
              <OptimizedImage
                src={img.src}
                alt={t(img.caption)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  <LucideIcons.ZoomIn className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">{t(img.caption)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <LucideIcons.X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-4 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! - 1 + items.length) % items.length);
              }}
            >
              <LucideIcons.ChevronLeft className="w-12 h-12" />
            </button>
            <OptimizedImage
              src={items[selectedImage].src}
              alt={t(items[selectedImage].caption)}
              width={1200}
              className="max-w-4xl max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! + 1) % items.length);
              }}
            >
              <LucideIcons.ChevronRight className="w-12 h-12" />
            </button>
            <div className="absolute bottom-8 text-white text-center">
              <p className="text-lg">{t(items[selectedImage].caption)}</p>
              <p className="text-sm opacity-60">{selectedImage + 1} / {items.length}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
