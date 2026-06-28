import type { Language } from "@core/types";
import type { ImageTextContent } from "../block-schemas";
import type { ImageTextProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toImageTextViewProps(
  content: ImageTextContent,
  lang: Language,
): ImageTextProps {
  const translate = createTranslate(lang);
  const titleText = content.title ? translate(content.title) : "";

  return {
    titleText,
    contentText: content.content ? translate(content.content) : "",
    image: content.image,
    imageAlt: titleText || "Section Image",
    imagePosition: content.imagePosition,
    buttonText: content.buttonText ? translate(content.buttonText) : "",
    buttonLink: content.buttonLink,
  };
}
