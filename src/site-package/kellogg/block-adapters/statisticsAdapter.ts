import type { Language } from "@core/types";
import type { StatisticsContent } from "../types/block-schemas";
import type { StatisticsProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toStatisticsViewProps(
  content: StatisticsContent,
  lang: Language,
): StatisticsProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      value: item.value,
      labelText: translate(item.label),
    })),
  };
}
