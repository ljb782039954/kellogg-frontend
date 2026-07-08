import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FullscreenImageBackgroundContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  overlay?: boolean;
}

export interface FullscreenImageBackgroundProps {
  content?: FullscreenImageBackgroundContent;
  lang?: Language;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  titleText?: string;
  overlay?: boolean;
}

export default function FullscreenImageBackground({
  content,
  lang = "en",
  image,
  imageAlt = "",
  eyebrow = "",
  titleText = "",
  overlay = true,
}: FullscreenImageBackgroundProps) {
  const translate = createTranslate(lang);
  const resolvedImage = content?.image || image || "";
  const resolvedTitle = content ? translate(content.title) : titleText;
  const resolvedEyebrow = content ? translate(content.eyebrow) : eyebrow;
  const resolvedImageAlt = content ? translate(content.imageAlt, resolvedTitle || resolvedEyebrow) : imageAlt;
  const resolvedOverlay = content?.overlay ?? overlay;

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
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {resolvedEyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{resolvedEyebrow}</p>}
          {resolvedTitle && <h3 className="text-3xl font-light font-luxury-heading">{resolvedTitle}</h3>}
        </div>
      </div>
    </section>
  );
}


