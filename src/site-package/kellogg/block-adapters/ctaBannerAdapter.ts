import type { Language } from "@core/types";
import type { CtaBannerContent } from "../block-schemas/ctaBanner";
import type { CtaBannerViewProps } from "../components/ui-blocks/CtaBannerView";
import { createTranslate } from "../utils/i18n";

interface CtaBannerAdapterContext {
  lang: Language;
  getImageUrl: (src: string, width: number) => string;
}

export function toCtaBannerViewProps(
  content: CtaBannerContent,
  { lang, getImageUrl }: CtaBannerAdapterContext,
): CtaBannerViewProps {
  const translate = createTranslate(lang);
  const values = content.values ?? {};

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    alignment: values.alignment,
    backgroundColor: values.backgroundColor,
    backgroundImageUrl: values.backgroundImage ? getImageUrl(values.backgroundImage, 1920) : "",
    primaryButton: values.primaryButton?.name
      ? {
          href: values.primaryButton.href,
          label: translate(values.primaryButton.name),
        }
      : undefined,
    secondaryButton: values.secondaryButton?.name
      ? {
          href: values.secondaryButton.href,
          label: translate(values.secondaryButton.name),
        }
      : undefined,
  };
}
