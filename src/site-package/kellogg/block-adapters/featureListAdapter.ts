import type { Language } from "@core/types";
import type { FeatureListContent } from "../types/block-schemas";
import type { FeatureListProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toFeatureListViewProps(
  content: FeatureListContent,
  lang: Language,
): FeatureListProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      icon: item.icon,
      titleText: translate(item.title),
      descriptionText: translate(item.description),
    })),
  };
}
