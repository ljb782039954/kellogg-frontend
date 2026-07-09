import { useInquiry } from '@core-webApp/hooks/useInquiry';
import { api } from '@services/api';
import InquiryForm from './InquiryForm';
import { kelloggSiteConfig } from '../../config';
import type { Language } from '@/cms/types';
import {
  getKelloggInquiryFormText,
  getKelloggInquiryTranslations,
  kelloggInquiryContent,
} from './inquiryContent';

export interface InquiryFormContainerProps {
  lang: Language;
  pageContent?: any;
  onSuccess?: () => void;
}

export default function InquiryFormContainer({
  lang,
  pageContent,
  onSuccess,
}: InquiryFormContainerProps) {
  const {
    formData,
    setFormData,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    setTurnstileToken,
    turnstileResetKey,
    handleSubmit,
  } = useInquiry(lang, pageContent || kelloggInquiryContent, getKelloggInquiryTranslations(lang), {
    submitInquiry: async (data) => {
      const result = await api.submitInquiry(data);
      if (onSuccess) onSuccess();
      return result;
    },
  });

  return (
    <InquiryForm
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
