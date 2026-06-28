import { useState } from 'react';
import type { Language } from '../types';

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

export interface InquiryPageContent {
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export interface InquiryTranslations {
  form: {
    name: string;
    email: string;
    phone: string;
    country: string;
    company: string;
    productType: string;
    quantity: string;
    message: string;
    submit: string;
    success: string;
    successMsg: string;
    back: string;
  };
  alerts: {
    turnstileRequired: string;
    submitFailed: string;
  };
}

export interface SubmitInquiryInput extends InquiryFormData {
  turnstileToken: string;
}

export interface UseInquiryOptions {
  submitInquiry: (data: SubmitInquiryInput) => Promise<unknown>;
}

const emptyForm: InquiryFormData = {
  name: '',
  email: '',
  phone: '',
  country: '',
  company: '',
  product_type: '',
  quantity: '',
  message: '',
};

const defaultPageContent: InquiryPageContent = {
  title: { en: 'Contact Us' },
  description: {
    en: 'Send your inquiry and we will get back to you soon.',
  },
};

const fallbackTranslations: InquiryTranslations = {
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    country: 'Country/Region',
    company: 'Company',
    productType: 'Product Type',
    quantity: 'Quantity',
    message: 'Message',
    submit: 'Submit',
    success: 'Success!',
    successMsg: 'Thank you for your inquiry.',
    back: 'Back',
  },
  alerts: {
    turnstileRequired: 'Please complete the human verification',
    submitFailed: 'Submission failed, please try again',
  },
};

export function useInquiry(
  lang: Language = 'en',
  pageContent?: InquiryPageContent,
  translations?: InquiryTranslations,
  options?: UseInquiryOptions
) {
  const [formData, setFormData] = useState<InquiryFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const config = pageContent || defaultPageContent;

  const t = translations || fallbackTranslations;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!turnstileToken) {
      alert(t.alerts.turnstileRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!options?.submitInquiry) {
        throw new Error('Missing inquiry submit handler');
      }
      await options.submitInquiry({ ...formData, turnstileToken });
      setIsSuccess(true);
      setFormData(emptyForm);
      setTurnstileToken('');
    } catch {
      setTurnstileToken('');
      setTurnstileResetKey((key) => key + 1);
      alert(t.alerts.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    setTurnstileToken,
    turnstileResetKey,
    handleSubmit,
    config,
    t,
    language: lang,
  };
}
