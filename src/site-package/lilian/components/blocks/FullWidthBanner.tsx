import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FullWidthBannerContent {
  image: string;
  imageAlt?: Translation;
  height?: "small" | "medium" | "large";
}

export interface FullWidthBannerProps {
  content?: FullWidthBannerContent;
  lang?: Language;
  image?: string;
  imageAlt?: string;
  height?: "small" | "medium" | "large";
}

const heightClass = {
  small: "h-[220px]",
  medium: "h-[280px]",
  large: "h-[420px]",
};

export default function FullWidthBanner({
  content,
  lang = "en",
  image,
  imageAlt = "Banner",
  height = "medium",
}: FullWidthBannerProps) {
  const translate = createTranslate(lang);
  const resolvedImage = content?.image || image || "";
  const resolvedImageAlt = content ? translate(content.imageAlt, "Banner") : imageAlt;
  const resolvedHeight = content?.height || height;

  return (
    <section className="w-full py-12">
      <div className={`overflow-hidden ${heightClass[resolvedHeight]}`}>
        <OptimizedImage src={resolvedImage} alt={resolvedImageAlt} className="w-full h-full object-cover" sizes="100vw" />
      </div>
    </section>
  );
}


