import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { useCallback, useRef, useState } from "react";
import { createTranslate } from "../../utils/i18n";

export interface BeforeAfterSliderContent {
  eyebrow?: Translation;
  beforeImage: string;
  beforeImageAlt?: Translation;
  afterImage: string;
  afterImageAlt?: Translation;
}

export interface BeforeAfterSliderProps {
  content?: BeforeAfterSliderContent;
  lang?: Language;
  eyebrow?: string;
  beforeImage?: string;
  beforeImageAlt?: string;
  afterImage?: string;
  afterImageAlt?: string;
}

export default function BeforeAfterSlider({
  content,
  lang = "en",
  eyebrow = "",
  beforeImage,
  beforeImageAlt = "",
  afterImage,
  afterImageAlt = "",
}: BeforeAfterSliderProps) {
  const translate = createTranslate(lang);
  const resolvedEyebrow = content ? translate(content.eyebrow) : eyebrow;
  const resolvedBeforeImage = content?.beforeImage || beforeImage || "";
  const resolvedBeforeImageAlt = content ? translate(content.beforeImageAlt) : beforeImageAlt;
  const resolvedAfterImage = content?.afterImage || afterImage || "";
  const resolvedAfterImageAlt = content ? translate(content.afterImageAlt) : afterImageAlt;
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, nextPosition)));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      {resolvedEyebrow && <p className="text-[10px] tracking-[0.2em] text-subtle uppercase mb-4 text-center">{resolvedEyebrow}</p>}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-sm select-none aspect-video"
        onMouseMove={(event) => handleMove(event.clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
      >
        <OptimizedImage src={resolvedAfterImage} alt={resolvedAfterImageAlt} className="absolute inset-0 w-full h-full object-cover" sizes="100vw" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <OptimizedImage
            src={resolvedBeforeImage}
            alt={resolvedBeforeImageAlt}
            className="absolute inset-0 h-full object-cover max-w-none"
            sizes="100vw"
            style={{ width: `${100 / position * 100}%` }}
          />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-surface cursor-ew-resize" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface rounded-full shadow-md flex items-center justify-center">
            <span className="text-[10px] text-body">|||</span>
          </div>
        </div>
      </div>
    </section>
  );
}


