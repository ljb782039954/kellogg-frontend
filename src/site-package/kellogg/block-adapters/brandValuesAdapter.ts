import type { Language } from "@core/types";
import type { BrandValuesContent } from "../types/block-schemas";
import type { BrandValuesProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toBrandValuesViewProps(
  content: BrandValuesContent,
  lang: Language,
): BrandValuesProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      icon: item.icon,
      titleText: translate(item.title),
      descriptionText: translate(item.description),
    })),
  };
}
