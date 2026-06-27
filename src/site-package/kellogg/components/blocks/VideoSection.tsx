import type { Language, Translation } from "../../types";
import { createTranslate } from "../../../../core/lib/i18n";
import ProductVideo from "../base/ProductVideo";

export interface VideoSectionValues {
  videoUrl?: string;
  posterImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface VideoSectionProps {
  title?: Translation;
  subtitle?: Translation;
  videoUrl?: string;
  values?: VideoSectionValues;
  lang: Language;
}

export default function VideoSection({ title, subtitle, videoUrl, values, lang }: VideoSectionProps) {
  const t = createTranslate(lang);
  const finalVideoUrl = videoUrl || values?.videoUrl;
  if (!finalVideoUrl) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {(title || subtitle) && (
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              {title && <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{t(title)}</h2>}
              {subtitle && <p className="text-lg text-gray-500 font-light leading-relaxed">{t(subtitle)}</p>}
              <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full mt-6" />
            </div>
          )}
          <div className="shadow-2xl rounded-[40px] overflow-hidden">
            <ProductVideo url={finalVideoUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
