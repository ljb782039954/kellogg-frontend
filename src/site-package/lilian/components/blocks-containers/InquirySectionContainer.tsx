import InquirySection from '../inquiry/InquirySection';
import type { Language } from '@/cms/types';
import type { InquiryContent } from '../../block-adapters';
import { createTranslate } from '../../utils/i18n';
import { lilianInquiryContent } from '../inquiry/inquiryContent';

interface InquirySectionContainerProps extends InquiryContent {
  lang: Language;
}

export default function InquirySectionContainer({ lang, title, subtitle }: InquirySectionContainerProps) {
  const translate = createTranslate(lang);
  const fallbackDescription = lilianInquiryContent.description[lang] || lilianInquiryContent.description.en || "";
  const language = lang === 'zh' || lang === 'en' ? lang : 'en';

  const pageContent = {
    title: {
      ...lilianInquiryContent.title,
      [lang]: translate(title, lilianInquiryContent.title[lang] || lilianInquiryContent.title.en || ""),
    },
    description: {
      ...lilianInquiryContent.description,
      [lang]: translate(subtitle, fallbackDescription),
    },
  };

  return (
    <InquirySection
      titleText={pageContent.title[language]}
      subtitleText={pageContent.description[language]}
      lang={lang}
      pageContent={pageContent}
    />
  );
}
