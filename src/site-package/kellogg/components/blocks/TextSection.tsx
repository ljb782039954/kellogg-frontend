import type { Language } from "../../types";
import type { TextSectionContent } from "../../block-schemas/textSection";
import { toTextSectionViewProps } from "../../block-adapters/textSectionAdapter";
import TextSectionView from "../ui-blocks/TextSectionView";

export interface TextSectionProps extends TextSectionContent {
  lang: Language;
}

export default function TextSection({ lang, ...content }: TextSectionProps) {
  return <TextSectionView {...toTextSectionViewProps(content, lang)} />;
}
