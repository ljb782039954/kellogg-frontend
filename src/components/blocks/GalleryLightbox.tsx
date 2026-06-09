import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import type { Translation, Language } from "../../types";

interface GalleryItem {
  src: string;
  caption?: Translation;
}

interface Props {
  items: GalleryItem[];
  lang: Language;
  initialIndex: number | null;
  onClose: () => void;
}

export default function GalleryLightbox({ items, lang, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (currentIndex === null) return null;

  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev! + 1) % items.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev! - 1 + items.length) % items.length);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
        onClick={onClose}
      >
        <LucideIcons.X className="w-8 h-8" />
      </button>

      <button
        className="absolute left-6 text-white/50 hover:text-white transition-colors p-4"
        onClick={prev}
      >
        <LucideIcons.ChevronLeft className="w-12 h-12" />
      </button>

      <div className="max-w-5xl max-h-[85vh] p-4 flex flex-col items-center">
        <OptimizedImage
          src={items[currentIndex].src}
          alt={t(items[currentIndex].caption)}
          width={1200}
          className="max-w-full max-h-[75vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="mt-6 text-center text-white">
          <p className="text-xl font-medium mb-1">{t(items[currentIndex].caption)}</p>
          <p className="text-sm opacity-50">{currentIndex + 1} / {items.length}</p>
        </div>
      </div>

      <button
        className="absolute right-6 text-white/50 hover:text-white transition-colors p-4"
        onClick={next}
      >
        <LucideIcons.ChevronRight className="w-12 h-12" />
      </button>
    </div>
  );
}
