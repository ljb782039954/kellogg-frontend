import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FullWidthBannerContent {
  image: string;
  imageAlt?: Translation;
  height?: "small" | "medium" | "large";
}

export interface FullWidthBannerProps {
  content: FullWidthBannerContent;
  lang: Language;
}

const heightClass = {
  small: "h-[220px]",
  medium: "h-[280px]",
  large: "h-[420px]",
};

export default function FullWidthBanner({
  content,
  lang = "en",
}: FullWidthBannerProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImage = content.image || "";
  const resolvedImageAlt = t(content.imageAlt, "Banner");
  const resolvedHeight = content.height || "medium";

  return (
    <section className="w-full py-12">
      <div className={`overflow-hidden ${heightClass[resolvedHeight]}`}>
        <OptimizedImage src={resolvedImage} alt={resolvedImageAlt} className="w-full h-full object-cover" sizes="100vw" />
      </div>
    </section>
  );
}


