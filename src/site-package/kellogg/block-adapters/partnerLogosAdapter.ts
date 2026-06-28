import type { Language } from "@core/types";
import type { PartnerLogosContent } from "../block-schemas";
import type { PartnerLogosProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toPartnerLogosViewProps(
  content: PartnerLogosContent,
  lang: Language,
): PartnerLogosProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    moreText: translate({
      zh: "以及更多优质合作伙伴...",
      en: "And many more quality partners...",
    }),
    items: content.items ?? [],
  };
}
