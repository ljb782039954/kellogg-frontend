import InquirySection from '../inquiry/InquirySection';
import type { Language } from '@/cms/types';
import { lilianInquiryContent } from '../inquiry/inquiryContent';

interface InquirySectionContainerProps {
  lang: Language;
}

export default function InquirySectionContainer({ lang}: InquirySectionContainerProps) {
    const config = lilianInquiryContent;
  
  const language = lang === 'zh' || lang === 'en' ? lang : 'en';

  return (
    <InquirySection
      titleText={config.title[language]}
      subtitleText={config.description[language]}
      lang={lang}
      pageContent={lilianInquiryContent}
    />
  );
}
