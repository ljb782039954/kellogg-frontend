import { useEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { Translation, Language } from "../../types";
import OptimizedImage from '../../../../core/components/OptimizedImage';

export interface ImageFullProps {
    image?: string;
    description?: Translation;
    alt?: Translation;
    width?: 'small' | 'medium' | 'large' | 'full';
    height?: 'small' | 'medium' | 'large' | 'full';
    overlay?: boolean;
    lang: Language;
};

export default function ImageFull({
  image, 
  alt, 
  height = 'medium', 
  width = 'full', 
  overlay = false, 
  description,
  lang
}: ImageFullProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [isFullscreen]);

  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const heightClasses = {
    small: 'h-48 md:h-64',
    medium: 'h-64 md:h-[400px]',
    large: 'h-96 md:h-[600px]',
    full: 'h-screen'
  };

  const widthClasses = {
    small: 'max-w-2xl mx-auto px-4 my-8',
    medium: 'max-w-4xl mx-auto px-4 my-8',
    large: 'max-w-6xl mx-auto px-4 my-8',
    full: 'w-full'
  };

  if (!image) {
    return (
      <div className={`${heightClasses[height]} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-4`}>
        <div className="text-gray-400 flex flex-col items-center gap-2">
          <Maximize2 className="w-8 h-8" />
          <span>Image Full Block (No image selected)</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={widthClasses[width]}>
        <button
          type="button"
          className={`relative w-full ${heightClasses[height]} overflow-hidden group cursor-zoom-in transition-all duration-500 rounded-lg shadow-sm`}
          onClick={() => setIsFullscreen(true)}
          aria-label={lang === 'zh' ? '打开全屏图片' : 'Open fullscreen image'}
        >
          <OptimizedImage
            src={image}
            alt={t(alt)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay Mask */}
          {overlay && (
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
              {description && (
                <p className="text-lg md:text-2xl font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {t(description)}
                </p>
              )}
            </div>
          )}

          {/* Hover Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
              <Maximize2 className="w-5 h-5 text-gray-800" />
            </div>
          </div>
        </button>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'zh' ? '全屏图片预览' : 'Fullscreen image preview'}
        >
          <button 
            ref={closeButtonRef}
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label={lang === 'zh' ? '关闭全屏图片' : 'Close fullscreen image'}
          >
            <X className="w-8 h-8" />
          </button>
          
          <OptimizedImage
            src={image}
            alt={t(alt)}
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            width={1280}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
