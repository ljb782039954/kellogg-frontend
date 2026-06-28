import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Send, Loader2, CheckCircle2, Globe, Building2, Package } from 'lucide-react';
import { useInquiry } from '../../../../core/hooks/useInquiry';
import type { Language, CompanyInfo } from '../../types';
import TurnstileWidget from '../../../../core/components/TurnstileWidget';
import { kelloggSiteConfig } from '../../config';
import { api } from '../../../../services/api';
import {
  getKelloggInquiryTranslations,
  kelloggInquiryContent,
} from '../../utils/inquiry';

interface Props {
  lang: Language;
  companyInfo: CompanyInfo;
  pageContent?: any;
}

export default function InquiryView({ lang, companyInfo, pageContent }: Props) {
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
    t,
    language
  } = useInquiry(lang, pageContent || kelloggInquiryContent, getKelloggInquiryTranslations(lang), {
    submitInquiry: api.submitInquiry,
  });

  const contactInfo = companyInfo?.contact || {
    address: { zh: '中国 广州', en: 'Guangzhou, China' },
    phone: '+86 123 4567 8900',
    email: 'contact@kellogg.com'
  };

  const tSidebar = {
    location: language === 'zh' ? '办公地址' : 'Our Office',
    contact: language === 'zh' ? '联系方式' : 'Contact Details',
    follow: language === 'zh' ? '关注我们' : 'Follow Us'
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
              
              {/* Left Side: Info */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    {config.title[language]}
                  </h1>
                  <p className="text-xl text-gray-500 font-light leading-relaxed">
                    {config.description[language]}
                  </p>
                </motion.div>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{tSidebar.location}</h4>
                      <p className="text-gray-900 font-medium">
                        {typeof contactInfo.address === 'string' 
                          ? contactInfo.address 
                          : contactInfo.address[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{tSidebar.contact}</h4>
                      <p className="text-gray-900 font-medium">{contactInfo.phone}</p>
                      <p className="text-gray-500">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{tSidebar.follow}</h4>
                  <div className="flex gap-4">
                    {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map(social => (
                      <button key={social} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
                         <span className="sr-only">{social}</span>
                         <div className="w-4 h-4 border border-current rounded-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-50 rounded-[40px] -rotate-1 lg:block hidden" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50"
                >
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12 space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">{t.form.success}</h2>
                        <p className="text-gray-500">{t.form.successMsg}</p>
                      </div>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="text-gray-900 font-bold border-b-2 border-gray-900 hover:text-black hover:border-black transition-colors"
                      >
                        {t.form.back}
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            {t.form.name} *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder={language === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            {t.form.email} *
                          </label>
                          <input
                            required
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {t.form.phone}
                          </label>
                          <input
                            type="tel"
                            placeholder="+1..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {t.form.country}
                          </label>
                          <input
                            type="text"
                            placeholder={language === 'zh' ? '输入国家' : 'Your country'}
                            value={formData.country}
                            onChange={e => setFormData({...formData, country: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {t.form.company}
                        </label>
                        <input
                          type="text"
                          placeholder={language === 'zh' ? '输入公司名称' : 'Company name'}
                          value={formData.company}
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <Package className="w-3 h-3" /> {t.form.productType}
                          </label>
                          <input
                            type="text"
                            placeholder={language === 'zh' ? '想要的产品' : 'Interested product'}
                            value={formData.product_type}
                            onChange={e => setFormData({...formData, product_type: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            {t.form.quantity}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 500 pcs"
                            value={formData.quantity}
                            onChange={e => setFormData({...formData, quantity: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                          {t.form.message} *
                        </label>
                        <textarea
                          required
                          placeholder={language === 'zh' ? '告诉我们您的具体需求' : 'Tell us about your requirements...'}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all text-sm min-h-[120px] outline-none"
                        />
                      </div>

                  <TurnstileWidget
                    lang={lang}
                    siteKey={kelloggSiteConfig.turnstile?.siteKey}
                    useTestSiteKey={kelloggSiteConfig.turnstile?.useTestSiteKey}
                    onTokenChange={setTurnstileToken}
                    resetKey={turnstileResetKey}
                  />

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-gray-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                        {t.form.submit}
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
