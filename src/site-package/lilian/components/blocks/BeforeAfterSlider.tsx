import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { useCallback, useRef, useState } from "react";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface BeforeAfterSliderContent {
  title?: Translation;
  subtitle?: Translation;
  beforeImage: string;
  beforeImageAlt?: Translation;
  afterImage: string;
  afterImageAlt?: Translation;
}

export interface BeforeAfterSliderProps {
  content: BeforeAfterSliderContent;
  lang: Language;
}

export default function BeforeAfterSlider({
  content,
  lang = "en",
}: BeforeAfterSliderProps) {
  const t = createTranslate(lang);
  const resolvedTitle = t(content.title);
  const resolvedSubtitle = t(content.subtitle);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, nextPosition)));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {(resolvedTitle || resolvedSubtitle) && (
        <div className="text-center mb-8">
          {resolvedTitle && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{resolvedTitle}</h2>}
          {resolvedSubtitle && <p className="mt-3 text-sm md:text-base text-body max-w-2xl mx-auto">{resolvedSubtitle}</p>}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-sm select-none aspect-video"
        onMouseMove={(event) => handleMove(event.clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
      >
        <OptimizedImage src={content?.afterImage} alt={t(content.afterImageAlt)} className="absolute inset-0 w-full h-full object-cover" sizes="100vw" />
        <OptimizedImage
          src={content?.beforeImage}
          alt={t(content.beforeImageAlt)}
          className="absolute inset-0 w-full h-full object-cover"
          sizes="100vw"
          style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
        />
        <div className="absolute top-0 bottom-0 w-0.5 bg-surface cursor-ew-resize" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface rounded-full shadow-md flex items-center justify-center">
            <span className="text-[10px] text-body">|||</span>
          </div>
        </div>
      </div>
    </section>
  );
}


