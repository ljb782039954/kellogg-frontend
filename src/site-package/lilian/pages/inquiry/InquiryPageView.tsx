import { motion } from 'framer-motion';
import { Phone, MapPin } from 'lucide-react';
import InquiryFormContainer from '../../components/inquiry/InquiryFormContainer';
import type { Language, CompanyInfo } from '@/cms/types';
import { lilianInquiryContent } from '../../components/inquiry/inquiryContent';

interface Props {
  lang: Language;
  companyInfo: CompanyInfo;
  pageContent?: any;
}

export default function InquiryPageView({ lang, companyInfo, pageContent }: Props) {
  const config = pageContent || lilianInquiryContent;
  const language = lang === 'zh' || lang === 'en' ? lang : 'en';

  const contactInfo = companyInfo?.contact || {
    address: { zh: '中国 广州', en: 'Guangzhou, China' },
    phone: '+86 123 4567 8900',
    email: 'contact@lilianfashion.com',
  };

  const tSidebar = {
    location: language === 'zh' ? '办公地址' : 'Our Office',
    contact: language === 'zh' ? '联系方式' : 'Contact Details',
    follow: language === 'zh' ? '关注我们' : 'Follow Us',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h1 className="font-luxury-heading text-4xl sm:text-5xl font-light text-ink leading-tight">
                    {config.title[language] || config.title.en}
                  </h1>
                  <p className="text-sm text-subtle font-light leading-relaxed">
                    {config.description[language] || config.description.en}
                  </p>
                </motion.div>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-panel border border-border rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-subtle uppercase tracking-widest mb-1">
                        {tSidebar.location}
                      </h4>
                      <p className="text-ink text-sm font-medium">
                        {typeof contactInfo.address === 'string'
                          ? contactInfo.address
                          : contactInfo.address[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-panel border border-border rounded-md flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-subtle uppercase tracking-widest mb-1">
                        {tSidebar.contact}
                      </h4>
                      <p className="text-ink text-sm font-medium">{contactInfo.phone}</p>
                      <p className="text-xs text-subtle">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                    {tSidebar.follow}
                  </h4>
                  <div className="flex gap-4">
                    {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((social) => (
                      <button
                        key={social}
                        className="w-10 h-10 bg-panel border border-border rounded-md flex items-center justify-center text-subtle hover:bg-ink-strong hover:text-on-dark transition-all"
                      >
                        <span className="sr-only">{social}</span>
                        <div className="w-3.5 h-3.5 border border-current rounded-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-surface border border-border rounded-md p-8 md:p-12 shadow-sm"
                >
                  <InquiryFormContainer
                    lang={lang}
                    pageContent={pageContent}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
