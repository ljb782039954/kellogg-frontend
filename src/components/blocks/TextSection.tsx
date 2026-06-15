import type { CSSProperties } from "react";
import type { Language, Translation } from "../../types";
import { createTranslate } from "../../lib/i18n";
import RichText from "../RichText";

export interface TextSectionProps {
  title?: Translation;
  content?: Translation;
  alignment?: "left" | "center" | "right";
  paddingY?: "small" | "medium" | "large";
  backgroundColor?: string;
  lang: Language;
}

export default function TextSection({ title, content, alignment = "center", backgroundColor, lang }: TextSectionProps) {
  const t = createTranslate(lang);
  const style: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  return (
    <section className={`py-12 ${backgroundColor ? "" : "bg-gray-50"} ${alignmentClass}`} style={style}>
      <div className="container mx-auto px-4">
        {title && <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">{t(title)}</h1>}
        {content && <RichText value={t(content)} className="text-sm content-rich-text" />}
      </div>
    </section>
  );
}
