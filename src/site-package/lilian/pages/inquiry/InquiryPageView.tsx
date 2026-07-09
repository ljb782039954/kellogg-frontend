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
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    {config.title[language] || config.title.en}
                  </h1>
                  <p className="text-xl text-gray-500 font-light leading-relaxed">
                    {config.description[language] || config.description.en}
                  </p>
                </motion.div>

                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {tSidebar.location}
                      </h4>
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
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {tSidebar.contact}
                      </h4>
                      <p className="text-gray-900 font-medium">{contactInfo.phone}</p>
                      <p className="text-gray-500">{contactInfo.email}</p>
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
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all"
                      >
                        <span className="sr-only">{social}</span>
                        <div className="w-4 h-4 border border-current rounded-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gray-50 rounded-[40px] -rotate-1 lg:block hidden" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50"
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
