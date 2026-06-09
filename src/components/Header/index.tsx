import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $currency, $rates } from '../../lib/currency';
import { CurrencyService } from '../../services/currencyService';
import OptimizedImage from '../ui/OptimizedImage';
import { t } from '../../utils/common';
import type { CompanyInfo, HeaderContent, Language } from '../../types';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import HeaderActions from './HeaderActions';

export interface HeaderProps {
  header: HeaderContent;
  companyInfo: CompanyInfo;
  lang: Language;
  pathname: string;
  initialRates?: Record<string, number> | null;
}

export default function Header({ 
  header, 
  companyInfo, 
  lang, 
  pathname,
  initialRates = null
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currency = useStore($currency);
  const rates = useStore($rates);

  // 初始化逻辑转移到 Service
  useEffect(() => {
    CurrencyService.initRates(initialRates);
    CurrencyService.autoDetectCurrency();
  }, [initialRates]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 样式定义
  const style = {
    bg: 'bg-white/95 backdrop-blur-md shadow-sm',
    text: 'text-gray-800',
    border: 'border-gray-100',
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${style.bg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            {companyInfo.logo && (
              <OptimizedImage src={companyInfo.logo} alt="Logo" width={80} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            )}
            <span className={`text-base md:text-lg lg:text-xl font-bold tracking-wider ${style.text}`}>
              {t(companyInfo.name, lang)}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:block h-full">
            <DesktopNav 
              navItems={header.navItems} 
              lang={lang} 
              pathname={pathname} 
              textStyle={style.text}
            />
          </div>

          {/* Right Actions */}
          <HeaderActions 
            currency={currency}
            rates={rates}
            lang={lang}
            companyInfo={companyInfo}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            textStyle={style.text}
            borderStyle={style.border}
          />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className={`md:hidden ${style.bg} border-t ${style.border} overflow-hidden max-h-[80vh] overflow-y-auto`}>
             <MobileNav 
                navItems={header.navItems} 
                lang={lang} 
                pathname={pathname} 
                onNavigate={() => setIsMobileMenuOpen(false)}
                textStyle={style.text}
             />
             
             {/* 移动端底部货币切换 */}
             <div className="container mx-auto px-4 pb-6">
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl ${style.text} border ${style.border}`}>
                      <Coins className="w-5 h-5" />
                      <select
                        value={currency}
                        onChange={(e) => CurrencyService.switchCurrency(e.target.value)}
                        className="bg-transparent appearance-none border-none outline-none cursor-pointer font-bold"
                      >
                        {(rates ? Object.keys(rates) : ['USD', 'CNY']).map(cur => (
                          <option key={cur} value={cur} className="text-gray-900 bg-white">{cur}</option>
                        ))}
                      </select>
                  </div>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
