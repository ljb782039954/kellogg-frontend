import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface ParallaxImageContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  height?: "medium" | "large";
}

export interface ParallaxImageProps {
  content?: ParallaxImageContent;
  lang?: Language;
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  titleText?: string;
  height?: "medium" | "large";
}

const heightClass = {
  medium: "h-[60vh]",
  large: "h-[75vh]",
};

export default function ParallaxImage({
  content,
  lang = "en",
  image,
  imageAlt = "",
  eyebrow = "",
  titleText = "",
  height = "medium",
}: ParallaxImageProps) {
  const translate = createTranslate(lang);
  const resolvedImage = content?.image || image || "";
  const resolvedTitle = content ? translate(content.title) : titleText;
  const resolvedEyebrow = content ? translate(content.eyebrow) : eyebrow;
  const resolvedImageAlt = content ? translate(content.imageAlt, resolvedTitle) : imageAlt;
  const resolvedHeight = content?.height || height;

  return (
    <section className={`relative ${heightClass[resolvedHeight]}`}>
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={resolvedImage}
          alt={resolvedImageAlt || resolvedTitle}
          className="w-full h-[120%] object-cover absolute -top-[10%]"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {resolvedEyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{resolvedEyebrow}</p>}
          {resolvedTitle && (
            <h3 className="text-3xl sm:text-4xl font-light font-luxury-heading [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
              {resolvedTitle}
            </h3>
          )}
        </div>
      </div>
    </section>
  );
}


