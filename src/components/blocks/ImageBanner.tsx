import type { Language, Translation } from "../../types";
import { createTranslate } from "../../lib/i18n";
import OptimizedImage from "../ui/OptimizedImage";
import SectionHeader from "../base/SectionHeader";

export interface ImageBannerProps {
  image?: string;
  title?: Translation;
  subtitle?: Translation;
  buttonText?: Translation;
  linkUrl?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
  lang: Language;
}

export default function ImageBanner({ image, title, subtitle, buttonText, linkUrl, height = "medium", overlay = true, lang }: ImageBannerProps) {
  const t = createTranslate(lang);
  const heightClass = {
    small: "h-48 md:h-64",
    medium: "h-64 md:h-[400px]",
    large: "h-96 md:h-[600px]",
    full: "h-screen",
  }[height];

  return (
    <section className={`relative overflow-hidden ${heightClass}`}>
      <OptimizedImage src={image} alt={title ? t(title) : "Banner"} className="absolute inset-0 w-full h-full object-cover object-center" sizes="100vw" />
      {overlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme='light'/>}
        {/* <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">{title ? t(title) : ""}</h2>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto ">{subtitle ? t(subtitle) : ""}</p> */}
        {buttonText && <a href={linkUrl || "#"} className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">{t(buttonText)}</a>}
      </div>
    </section>
  );
}
