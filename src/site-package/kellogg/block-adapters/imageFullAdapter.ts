import type { Language } from "@core/types";
import type { ImageFullContent } from "../block-schemas";
import type { ImageFullProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toImageFullViewProps(
  content: ImageFullContent,
  lang: Language,
): ImageFullProps {
  const translate = createTranslate(lang);

  return {
    image: content.image,
    descriptionText: content.description ? translate(content.description) : "",
    altText: content.alt ? translate(content.alt) : "",
    width: content.width,
    height: content.height,
    overlay: content.overlay,
    labels: {
      noImage: lang === "zh" ? "未选择图片" : "No image selected",
      openFullscreen: lang === "zh" ? "打开全屏图片" : "Open fullscreen image",
      fullscreenPreview: lang === "zh" ? "全屏图片预览" : "Fullscreen image preview",
      closeFullscreen: lang === "zh" ? "关闭全屏图片" : "Close fullscreen image",
    },
  };
}
