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
    <div className="min-h-screen bg-page">
      <div className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="space-y-10 md:space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl space-y-5"
                >
                  <h1 className="font-luxury-heading text-4xl font-light leading-tight text-ink-strong sm:text-5xl">
                    {config.title[language] || config.title.en}
                  </h1>
                  <p className="text-sm font-light leading-relaxed text-body">
                    {config.description[language] || config.description.en}
                  </p>
                </motion.div>

                <div className="divide-y divide-border border-y border-border">
                  <div className="flex gap-4 py-6">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-surface">
                      <MapPin className="h-4 w-4 text-ink" />
                    </div>
                    <div>
                      <h4 className="mb-2 text-[10px] font-medium uppercase tracking-widest text-subtle">
                        {tSidebar.location}
                      </h4>
                      <p className="text-sm text-ink">
                        {typeof contactInfo.address === 'string'
                          ? contactInfo.address
                          : contactInfo.address[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 py-6">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-surface">
                      <Phone className="h-4 w-4 text-ink" />
                    </div>
                    <div>
                      <h4 className="mb-2 text-[10px] font-medium uppercase tracking-widest text-subtle">
                        {tSidebar.contact}
                      </h4>
                      <p className="text-sm text-ink">{contactInfo.phone}</p>
                      <p className="mt-1 text-xs text-subtle">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="mb-5 text-[10px] font-medium uppercase tracking-widest text-subtle">
                    {tSidebar.follow}
                  </h4>
                  <div className="flex gap-4">
                    {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((social) => (
                      <button
                        key={social}
                        className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-subtle transition-colors hover:border-ink-strong hover:bg-ink-strong hover:text-on-dark"
                      >
                        <span className="sr-only">{social}</span>
                        <div className="w-3.5 h-3.5 border border-current rounded-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-border bg-surface p-6 md:p-8"
                >
                  <InquiryFormContainer
                    lang={lang}
                    pageContent={config}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
