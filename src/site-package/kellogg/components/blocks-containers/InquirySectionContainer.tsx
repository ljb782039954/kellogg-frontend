import InquirySection from '../inquiry/InquirySection';
import type { Language } from '@/cms/types';
import { kelloggInquiryContent } from '../inquiry/inquiryContent';

interface InquirySectionContainerProps {
  lang: Language;
}

export default function InquirySectionContainer({ lang }: InquirySectionContainerProps) {
  const config = kelloggInquiryContent;
  const language = lang === 'zh' || lang === 'en' ? lang : 'en';

  return (
    <InquirySection
      titleText={config.title[language] || config.title.en}
      lang={lang}
      pageContent={kelloggInquiryContent}
    />
  );
}
