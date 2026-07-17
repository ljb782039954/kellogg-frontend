import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FullscreenImageBackgroundContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  subtitle?: Translation;
  align?: "left" | "center" | "right";
  overlay?: boolean;
}

export interface FullscreenImageBackgroundProps {
  content: FullscreenImageBackgroundContent;
  lang: Language;
}

export default function FullscreenImageBackground({
  content,
  lang = "en",
}: FullscreenImageBackgroundProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImage = content.image || "";
  const resolvedTitle = t(content.title);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedSubtitle = t(content.subtitle);
  const resolvedImageAlt = t(content.imageAlt, resolvedTitle || resolvedEyebrow);
  const resolvedOverlay = content.overlay ?? true;
  const resolvedAlign = content.align || "center";

  const containerAlignClasses = {
    left: "justify-start pl-6 sm:pl-12 md:pl-20 lg:pl-32",
    center: "justify-center",
    right: "justify-end pr-6 sm:pr-12 md:pr-20 lg:pr-32",
  };

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <section className="relative overflow-hidden h-[60vh]">
      <OptimizedImage
        src={resolvedImage}
        alt={resolvedImageAlt || resolvedTitle || resolvedEyebrow}
        width={1440}
        className="absolute inset-0 w-full h-full object-cover"
        sizes="100vw"
        priority
      />
      {resolvedOverlay && <div className="absolute inset-0 bg-overlay-soft" />}
      <div className={`relative z-10 h-full max-w-7xl mx-auto px-6 w-full flex items-center ${containerAlignClasses[resolvedAlign]}`}>
        <div className={`text-on-dark max-w-2xl ${textAlignClasses[resolvedAlign]}`}>
          {resolvedEyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{resolvedEyebrow}</p>}
          {resolvedTitle && <h3 className="text-3xl sm:text-4xl md:text-5xl font-light font-luxury-heading mb-4 leading-tight">{resolvedTitle}</h3>}
          {resolvedSubtitle && <p className="text-sm md:text-base font-light text-on-dark-soft leading-relaxed">{resolvedSubtitle}</p>}
        </div>
      </div>
    </section>
  );
}


