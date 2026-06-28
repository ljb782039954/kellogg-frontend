import type { Language } from "@core/types";
import type { TestimonialsContent } from "../block-schemas";
import type { TestimonialsProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toTestimonialsViewProps(
  content: TestimonialsContent,
  lang: Language,
): TestimonialsProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      nameText: translate(item.name),
      roleText: item.role ? translate(item.role) : "",
      contentText: translate(item.content),
      avatar: item.avatar,
    })),
  };
}
