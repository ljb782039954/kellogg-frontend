import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Translation, Language } from '../../types';

export interface FAQItem {
  id: number;
  question: Translation;
  answer: Translation;
}

export interface FAQProps {
  title?: Translation;
  subtitle?: Translation;
  items?: FAQItem[];
  lang: Language;
}

export default function FAQ({ title, subtitle, items = [], lang }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const hasMore = items.length > 5;
  const displayedItems = isExpanded ? items : items.slice(0, 5);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          {title && <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">{t(title)}</h2>}
          {subtitle && <p className="text-gray-500 text-lg">{t(subtitle)}</p>}
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50/50 border border-gray-100 rounded-2xl overflow-hidden hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-gray-800 pr-4">
                  {t(item.question)}
                </span>
                <div className={`p-1 rounded-full transition-all ${openIndex === item.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-400'}`}>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${openIndex === item.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-gray-600 leading-relaxed border-t border-gray-200 pt-6">
                        {t(item.answer)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-8 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all active:scale-95"
            >
              {isExpanded 
                ? (lang === 'zh' ? '收起部分' : 'Show Less') 
                : (lang === 'zh' ? '查看更多' : 'View More')}
            </button>
          </div>
        )}
      </div>

      {/* SEO Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": t(item.question),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t(item.answer)
            }
          }))
        })
      }} />
    </section>
  );
}
