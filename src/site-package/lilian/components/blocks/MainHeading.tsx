import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface MainHeadingContent {
  title: Translation;
  subtitle?: Translation;
  description?: Translation;
  align?: "left" | "center";
}

export interface MainHeadingProps {
  content?: MainHeadingContent;
  lang?: Language;
  titleText?: string;
  subtitleText?: string;
  descriptionText?: string;
  align?: "left" | "center";
}

export default function MainHeading({
  titleText,
  subtitleText,
  descriptionText,
  content,
  lang = "en",
  align = "center",
}: MainHeadingProps) {
  const translate = createTranslate(lang);
  const resolvedTitle = content ? translate(content.title) : titleText || "";
  const resolvedSubtitle = content ? translate(content.subtitle) : subtitleText;
  const resolvedDescription = content ? translate(content.description) : descriptionText;
  const resolvedAlign = content?.align || align;

  return (
    <section className={`max-w-4xl mx-auto px-6 py-10 space-y-6 ${resolvedAlign === "center" ? "text-center" : ""}`}>
      <h2
        className="text-3xl sm:text-4xl font-bold leading-tight"
        style={{ fontFamily: "Georgia, serif", color: "var(--color-ink)" }}
      >
        {resolvedTitle}
      </h2>
      {resolvedSubtitle && (
        <p className="text-sm uppercase text-subtle" >{resolvedSubtitle}</p>
      )}
      {resolvedDescription && (
          <RichText value={resolvedDescription} className="text-sm md:text-base leading-[1.9] text-body" />
      )}
    </section>
  );
}


