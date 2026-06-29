import type { Language } from "@core/types";
import type { ImageBannerTagContent } from "../types/block-schemas";
import type { ImageBannerTagProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

interface ImageBannerTagAdapterContext {
  lang: Language;
  getImageUrl: (src: string, width: number) => string;
}

export function toImageBannerTagViewProps(
  content: ImageBannerTagContent,
  { lang, getImageUrl }: ImageBannerTagAdapterContext,
): ImageBannerTagProps {
  const translate = createTranslate(lang);

  return {
    tagText: content.tag ? translate(content.tag) : "",
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    imageUrl: content.image ? getImageUrl(content.image, 1920) : "",
  };
}
