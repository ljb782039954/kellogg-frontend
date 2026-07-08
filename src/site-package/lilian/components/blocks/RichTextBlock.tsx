import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface RichTextBlockContent {
  title?: Translation;
  content: Translation;
  align?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide";
}

export interface RichTextBlockProps {
  content?: RichTextBlockContent;
  lang?: Language;
  titleText?: string;
  contentText?: string;
  align?: "left" | "center";
  maxWidth?: "narrow" | "medium" | "wide";
}

const widthClass = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  wide: "max-w-5xl",
};

export default function RichTextBlock({
  titleText = "",
  contentText,
  content,
  lang = "en",
  align = "left",
  maxWidth = "medium",
}: RichTextBlockProps) {
  const translate = createTranslate(lang);
  const resolvedTitle = content ? translate(content.title) : titleText;
  const resolvedContent = content ? translate(content.content) : contentText || "";
  const resolvedAlign = content?.align || align;
  const resolvedMaxWidth = content?.maxWidth || maxWidth;

  return (
    <section className="px-6 py-12">
      <div className={`${widthClass[resolvedMaxWidth]} mx-auto ${resolvedAlign === "center" ? "text-center" : ""}`}>
        {resolvedTitle && <h2 className="font-luxury-heading text-3xl md:text-4xl mb-5">{resolvedTitle}</h2>}
        <RichText value={resolvedContent} className="text-sm md:text-base text-body leading-7 space-y-4" />
      </div>
    </section>
  );
}


