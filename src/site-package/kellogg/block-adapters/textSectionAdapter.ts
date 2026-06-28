import type { Language } from "@core/types";
import type { TextSectionContent } from "../block-schemas/textSection";
import type { TextSectionViewProps } from "../components/ui-blocks/TextSectionView";
import { createTranslate } from "../utils/i18n";

export function toTextSectionViewProps(
  content: TextSectionContent,
  lang: Language,
): TextSectionViewProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    contentText: content.content ? translate(content.content) : "",
    alignment: content.alignment,
    paddingY: content.paddingY,
    backgroundColor: content.backgroundColor,
  };
}
