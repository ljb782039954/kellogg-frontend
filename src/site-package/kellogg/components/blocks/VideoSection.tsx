import { ProductVideo } from "../base";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";
import { toProductVideoSource } from "../../block-adapters/productMediaAdapter";

export interface VideoSectionValues {
  videoUrl?: string;
  posterImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface VideoSectionContent {
  title?: Translation;
  subtitle?: Translation;
  videoUrl?: string;
  values?: VideoSectionValues;
}
export interface VideoSectionProps {
  content: VideoSectionContent;
  lang: Language;
}

export default function VideoSection({
  content: 
  {
    title,
    subtitle,
    videoUrl,
    values,
  },
  lang,
}: VideoSectionProps) {
  const translate = createTranslate(lang);
  const titleText = title ? translate(title) : "";
  const subtitleText = subtitle ? translate(subtitle) : "";
  const videoSource = toProductVideoSource(videoUrl || values?.videoUrl);

  if (!videoSource) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {(titleText || subtitleText) && (
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              {titleText && <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{titleText}</h2>}
              {subtitleText && <p className="text-lg text-gray-500 font-light leading-relaxed">{subtitleText}</p>}
              <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full mt-6" />
            </div>
          )}
          <div className="shadow-2xl rounded-[40px] overflow-hidden">
            <ProductVideo source={videoSource} />
          </div>
        </div>
      </div>
    </section>
  );
}
