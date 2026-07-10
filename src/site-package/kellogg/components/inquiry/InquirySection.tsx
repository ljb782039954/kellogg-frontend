import { motion } from 'framer-motion';
import InquiryFormContainer from './InquiryFormContainer';
import type { Language } from '@/cms/types';
import { kelloggInquiryContent } from './inquiryContent';

export interface InquirySectionProps {
  lang: Language;
}

export default function InquirySection({
  lang,
}: InquirySectionProps) {
  const language = lang === 'zh' || lang === 'en' ? lang : 'en';
  const resolvedTitle = kelloggInquiryContent.title[language] || kelloggInquiryContent.title.en;
  const resolvedPageContent = kelloggInquiryContent;

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {resolvedTitle}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-gray-900 mx-auto rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/40"
          >
            <InquiryFormContainer lang={lang} pageContent={resolvedPageContent} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
