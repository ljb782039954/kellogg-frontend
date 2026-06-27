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

const defaultTranslations: Record<Language, InquiryTranslations> = {
  zh: {
    form: {
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      country: '国家/地区',
      company: '公司名称',
      productType: '产品类型',
      quantity: '需求数量',
      message: '消息详情',
      submit: '提交询盘',
      success: '提交成功！',
      successMsg: '感谢您的咨询，我们会尽快与您联系。',
      back: '返回',
    },
    alerts: {
      turnstileRequired: '请先完成人机验证',
      submitFailed: '提交失败，请重试',
    },
  },
  en: {
    form: {
      name: 'First Name',
      email: 'Email',
      phone: 'Phone Number',
      country: 'Country/Region',
      company: 'Company Name',
      productType: 'Product Type',
      quantity: 'Order Quantity',
      message: 'Message details',
      submit: 'Submit Inquiry',
      success: 'Success!',
      successMsg: 'Thank you for your inquiry, we will contact you soon.',
      back: 'Go Back',
    },
    alerts: {
      turnstileRequired: 'Please complete the human verification',
      submitFailed: 'Submission failed, please try again',
    },
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

  const config = pageContent || {
    title: { zh: '联系我们获取样品', en: 'Contact Us For Samples' },
    description: {
      zh: '如果您有任何产品咨询，请填写下方表格，我们的团队会尽快与您联系。',
      en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.',
    },
  };

  const t = translations || defaultTranslations[lang] || defaultTranslations['en'];

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
