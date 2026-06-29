import type { Language } from "@core/types";
import type { VideoSectionContent } from "../block-schemas";
import type { VideoSectionProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";
import { toProductVideoSource } from "./productMediaAdapter";

export function toVideoSectionViewProps(
  content: VideoSectionContent,
  lang: Language,
): VideoSectionProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    videoSource: toProductVideoSource(content.videoUrl || content.values?.videoUrl),
  };
}
