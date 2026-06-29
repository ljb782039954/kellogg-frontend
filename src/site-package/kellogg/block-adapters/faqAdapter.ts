import type { Language } from "@core/types";
import type { FAQContent } from "../types/block-schemas";
import type { FAQProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

function toFAQStructuredData(items: FAQProps["items"]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (items ?? []).map((item) => ({
      "@type": "Question",
      name: item.questionText,
      acceptedAnswer: { "@type": "Answer", text: item.answerText },
    })),
  }).replace(/</g, "\\u003c");
}

export function toFAQViewProps(
  content: FAQContent,
  lang: Language,
): FAQProps {
  const translate = createTranslate(lang);
  const items = (content.items ?? []).map((item) => ({
    id: item.id,
    questionText: translate(item.question),
    answerText: translate(item.answer),
  }));

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items,
    structuredData: toFAQStructuredData(items),
    labels: {
      showLess: lang === "zh" ? "收起部分" : "Show Less",
      viewMore: lang === "zh" ? "查看更多" : "View More",
    },
  };
}
