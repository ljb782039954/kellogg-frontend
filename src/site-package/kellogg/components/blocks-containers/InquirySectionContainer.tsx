import { useInquiry } from '@core-webApp/hooks/useInquiry';
import { api } from '@services/api';
import InquirySection from '../blocks-fixed/InquirySection';
import { kelloggSiteConfig } from '../../config';
import type { Language } from '@/cms/types';
import {
  getKelloggInquiryFormText,
  getKelloggInquiryTranslations,
  kelloggInquiryContent,
} from '../../utils/inquiry';

interface InquirySectionContainerProps {
  lang: Language;
}

export default function InquirySectionContainer({ lang }: InquirySectionContainerProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    setTurnstileToken,
    turnstileResetKey,
    handleSubmit,
    config,
    language,
  } = useInquiry(lang, kelloggInquiryContent, getKelloggInquiryTranslations(lang), {
    submitInquiry: api.submitInquiry,
  });

  return (
    <InquirySection
      titleText={config.title[language]}
      values={formData}
      text={getKelloggInquiryFormText(lang)}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      turnstileLang={lang}
      turnstileSiteKey={kelloggSiteConfig.turnstile?.siteKey}
      useTurnstileTestSiteKey={kelloggSiteConfig.turnstile?.useTestSiteKey}
      turnstileResetKey={turnstileResetKey}
      onValuesChange={setFormData}
      onTurnstileTokenChange={setTurnstileToken}
      onSubmit={handleSubmit}
      onBack={() => setIsSuccess(false)}
    />
  );
}
