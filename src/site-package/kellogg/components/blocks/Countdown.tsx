import { useState, useEffect, useCallback } from 'react';
import OptimizedImage from '../../../../core/components/OptimizedImage';
import type { Translation, Language } from "../../types";

export interface CountdownValues {
  endTime?: string;
  backgroundImage?: string;
}

export interface CountdownProps {
  title?: Translation;
  subtitle?: Translation;
  values?: CountdownValues;
  lang: Language;
}

export default function Countdown({ title, subtitle, values, lang }: CountdownProps) {
  const t = (obj: Translation | undefined) => {
    if (!obj) return '';
    return lang === 'zh' ? obj.zh : obj.en;
  };

  const calculateTimeLeft = useCallback(() => {
    if (!values?.endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +new Date(values.endTime) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [values?.endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="relative py-16 overflow-hidden text-center">
      <OptimizedImage
        src={values?.backgroundImage}
        alt=""
        width={1920}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-500/90" />
      <div className="relative text-white">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {title && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">{t(title)}</h2>}
          {subtitle && <p className="text-md md:text-lg text-white/70">{t(subtitle)}</p>}
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '天', en: 'Days' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '时', en: 'Hours' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '分', en: 'Min' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '秒', en: 'Sec' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
