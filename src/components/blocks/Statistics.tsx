import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import type { Translation, Language } from '../../types';

export interface Statistic {
  id: number;
  value: string;
  label: Translation;
}

export interface StatisticProps {
  title?: Translation;
  subtitle?: Translation;
  items?: Statistic[];
  lang: Language;
}

export default function Statistics({ title, subtitle, items = [], lang }: StatisticProps) {
  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          {title && <h2 className="text-3xl md:text-5xl font-bold mb-4">{t(title)}</h2>}
          {subtitle && <p className="text-gray-400 text-lg">{t(subtitle)}</p>}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-bold mb-3 text-white">
                <AnimatedNumber value={item.value} />
              </div>
              <div className="text-sm md:text-lg text-gray-400 font-medium">
                {t(item.label)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current) + suffix);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}
