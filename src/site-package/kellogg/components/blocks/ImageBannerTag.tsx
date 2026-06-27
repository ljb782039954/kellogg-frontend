import { Sparkles } from "lucide-react";
import type { Language, Translation } from "../../types";
import { createTranslate } from "../../utils/i18n";
import { api } from "../../../../services/api";

export interface ImageBannerTagProps {
  tag?: Translation;
  title?: Translation;
  subtitle?: Translation;
  image?: string;
  lang: Language;
}

export default function ImageBannerTag({ tag, title, subtitle, image, lang }: ImageBannerTagProps) {
  const t = createTranslate(lang);
  const optimizedBgImage = image ? api.getOptimizedImageUrl(image, 1920) : "";
  const escapedBgImage = optimizedBgImage.replace(/"/g, '\\"');

  return (
    <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url("${escapedBgImage}")` }} />
      <div className="relative z-10 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-medium tracking-widest text-sm uppercase">{tag ? t(tag) : ""}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">{title ? t(title) : ""}</h1>
        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-light">{subtitle ? t(subtitle) : ""}</p>
      </div>
    </section>
  );
}
