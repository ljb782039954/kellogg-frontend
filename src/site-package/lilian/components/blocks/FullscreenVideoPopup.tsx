import EmbeddedVideo, { type EmbeddedVideoAspect } from "@/runtime/components/EmbeddedVideo";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import { getSafeVideoSource, type SafeVideoProvider, type SafeVideoSource } from "@/cms/lib/video";
import type { Language, Translation } from "@/cms/types";
import { Play } from "lucide-react";
import { useState } from "react";
import type { LilianExternalVideoItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

const EXTERNAL_VIDEO_PROVIDERS: SafeVideoProvider[] = ["youtube", "vimeo", "facebook", "tiktok"];

function toEmbeddedVideoAspect(aspect: LilianExternalVideoItem["aspect"]): EmbeddedVideoAspect | undefined {
  if (aspect === "video") return "landscape";
  return aspect;
}

export interface VideoPopupContent extends LilianExternalVideoItem {
  caption?: Translation;
}

export interface FullscreenVideoPopupProps {
  content?: VideoPopupContent;
  lang?: Language;
  source?: SafeVideoSource | null;
}

export default function FullscreenVideoPopup({
  content,
  lang = "en",
  source,
}: FullscreenVideoPopupProps) {
  if (!content) return null;

  const translate = createTranslate(lang);
  const resolvedSource = getSafeVideoSource(content.url, { providers: EXTERNAL_VIDEO_PROVIDERS }) || source;
  const resolvedTitle = translate(content.title) || "Video";
  const resolvedCoverImage = content.coverImage || "";
  const resolvedCoverImageAlt = translate(content.coverImageAlt);
  const resolvedAspect = toEmbeddedVideoAspect(content.aspect) || "auto";
  const resolvedCaption = translate(content.caption);
  const [isPlaying, setIsPlaying] = useState(false);
  if (!resolvedSource) return null;
  const coverAspectClass = resolvedAspect === "portrait"
    ? "aspect-[9/16] max-w-[420px] mx-auto"
    : resolvedAspect === "square"
      ? "aspect-square max-w-[720px] mx-auto"
      : "aspect-video";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-center">
      {isPlaying ? (
        <EmbeddedVideo source={resolvedSource} title={resolvedTitle} aspect={resolvedAspect} className="rounded-md shadow-2xl" />
      ) : (
        <button
          type="button"
          className={`relative block w-full overflow-hidden rounded-md bg-soft ${coverAspectClass}`}
          onClick={() => setIsPlaying(true)}
          aria-label={resolvedTitle}
        >
          <OptimizedImage src={resolvedCoverImage} alt={resolvedCoverImageAlt || resolvedCaption} className="w-full h-full object-cover" sizes="900px" />
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-soft hover:bg-overlay-soft transition-colors">
            <div className="w-16 h-16 bg-surface-glass rounded-full flex items-center justify-center text-ink shadow-sm">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        </button>
      )}
      {resolvedCaption && <p className="text-xs text-subtle mt-3">{resolvedCaption}</p>}
    </section>
  );
}


