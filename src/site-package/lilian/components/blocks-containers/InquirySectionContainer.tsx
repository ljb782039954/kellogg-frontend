import { useInquiry } from '@core-webApp/hooks/useInquiry';
import { api } from '@services/api';
import InquirySection from '../blocks-fixed/InquirySection';
import type { InquiryFormValues } from '../blocks-fixed/InquirySection';
import { lilianSiteConfig } from '../../config';
import type { Language } from '@/cms/types';
import type { InquiryContent } from '../../block-adapters';
import { createTranslate } from '../../utils/i18n';
import {
  getLilianInquiryFormText,
  getLilianInquiryTranslations,
  lilianInquiryContent,
} from '../../utils/inquiry';

interface InquirySectionContainerProps extends InquiryContent {
  lang: Language;
}

export default function InquirySectionContainer({ lang, title, subtitle }: InquirySectionContainerProps) {
  const translate = createTranslate(lang);
  const fallbackDescription = lilianInquiryContent.description[lang] || lilianInquiryContent.description.en || "";
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
  } = useInquiry(lang, pageContent, getLilianInquiryTranslations(lang), {
    submitInquiry: api.submitInquiry,
  });

  const values: InquiryFormValues = {
    name: formData.name,
    email: formData.email,
    company: formData.company,
    product_type: formData.product_type,
    quantity: formData.quantity,
    message: formData.message,
  };

  const handleValuesChange = (nextValues: InquiryFormValues) => {
    setFormData((prev) => ({ ...prev, ...nextValues }));
  };

  return (
    <InquirySection
      titleText={config.title[language]}
      subtitleText={config.description[language]}
      values={values}
      text={getLilianInquiryFormText(lang)}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      turnstileLang={lang}
      turnstileSiteKey={lilianSiteConfig.turnstile?.siteKey}
      useTurnstileTestSiteKey={lilianSiteConfig.turnstile?.useTestSiteKey}
      turnstileResetKey={turnstileResetKey}
      onValuesChange={handleValuesChange}
      onTurnstileTokenChange={setTurnstileToken}
      onSubmit={handleSubmit}
      onBack={() => setIsSuccess(false)}
    />
  );
}
