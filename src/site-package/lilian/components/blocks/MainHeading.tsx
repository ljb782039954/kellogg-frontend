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
  content: MainHeadingContent;
  lang: Language;
}

export default function MainHeading({
  content,
  lang = "en",
}: MainHeadingProps) {
  if (!content) return null;

  const translate = createTranslate(lang);
  const resolvedTitle = translate(content.title) || "";
  const resolvedSubtitle = translate(content.subtitle);
  const resolvedDescription = translate(content.description);
  const resolvedAlign = content.align || "center";

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


