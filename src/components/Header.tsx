import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Share2, Menu, X, Coins } from 'lucide-react';
import type { HeaderContent, CompanyInfo, Language } from '../types';

interface HeaderProps {
  header: HeaderContent;
  companyInfo: CompanyInfo;
  lang: Language;
  theme?: 'light' | 'dark' | 'vintage' | 'street' | 'luxury';
  pathname?: string;
}

export default function Header({ 
  header, 
  companyInfo, 
  lang, 
  theme = 'light',
  pathname = '/'
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(lang);
  // Currency logic can be added here or passed as props
  const [currency, setCurrency] = useState('USD');
  const validCurrencies = ['USD', 'GBP', 'EUR', 'AUD', 'CAD'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeStyles = {
    light: {
      bg: isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent',
      text: isScrolled ? 'text-gray-800' : 'text-gray-900',
      border: 'border-gray-200',
    },
    dark: {
      bg: isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-sm' : 'bg-transparent',
      text: 'text-white',
      border: 'border-gray-700',
    },
    vintage: {
      bg: isScrolled ? 'bg-amber-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent',
      text: 'text-amber-900',
      border: 'border-amber-200',
    },
    street: {
      bg: isScrolled ? 'bg-black/90 backdrop-blur-md shadow-sm' : 'bg-transparent',
      text: 'text-white',
      border: 'border-purple-500/30',
    },
    luxury: {
      bg: isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent',
      text: 'text-amber-100',
      border: 'border-amber-500/30',
    },
  };

  const style = themeStyles[theme];

  const handleShare = () => {
    const url = window.location.origin;
    const title = companyInfo.name[currentLang];
    
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(currentLang === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    });
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    // In a real SSR app, we might want to redirect to a localized URL
    // window.location.href = `/${newLang}${pathname}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${style.bg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            {companyInfo.logo && (
              <img src={companyInfo.logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            )}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl md:text-2xl font-bold tracking-wider ${style.text}`}
            >
              {companyInfo.name[currentLang]}
            </motion.span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {header.navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.href === '#' ? (
                  <span className={`text-sm font-medium ${style.text} opacity-50 cursor-default`}>
                    {item.name[currentLang]}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={`text-sm font-medium ${style.text} ${
                      pathname === item.href ? 'opacity-100' : 'opacity-70'
                    } hover:opacity-100 transition-opacity`}
                  >
                    {item.name[currentLang]}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleShare}
              className={`p-2 rounded-full ${style.text} hover:opacity-70 transition-opacity border ${style.border}`}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <div className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-sm font-medium ${style.text} border ${style.border}`}>
              <Coins className="w-4 h-4 ml-1" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent appearance-none border-none outline-none cursor-pointer px-1 pr-4"
              >
                {validCurrencies.map(cur => (
                  <option key={cur} value={cur} className="text-gray-900 bg-white">
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={toggleLanguage}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${style.text} hover:opacity-70 transition-opacity border ${style.border}`}
            >
              <Globe className="w-4 h-4" />
              {currentLang === 'zh' ? '中文' : 'EN'}
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${style.text}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${style.bg} border-t ${style.border}`}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                <button
                  onClick={toggleLanguage}
                  className={`flex-1 flex items-center justify-center border-r border-gray-100 dark:border-gray-800 gap-2 ${style.text} py-2`}
                >
                  <Globe className="w-5 h-5" />
                  {currentLang === 'zh' ? 'English' : '中文'}
                </button>
                <div className={`flex-1 flex items-center justify-center gap-2 ${style.text} py-2`}>
                   <Coins className="w-5 h-5" />
                   <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className={`bg-transparent appearance-none border-none outline-none cursor-pointer font-medium ${style.text}`}
                   >
                     {validCurrencies.map(cur => (
                        <option key={cur} value={cur} className="text-gray-900 bg-white">
                          {cur}
                        </option>
                     ))}
                   </select>
                </div>
              </div>
              
              {header.navItems.map((item) => 
                item.href === '#' ? (
                  <span key={item.href} className={`text-lg font-medium ${style.text} py-2 opacity-50 cursor-default`}>
                    {item.name[currentLang]}
                  </span>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${style.text} py-2 ${
                      pathname === item.href ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {item.name[currentLang]}
                  </a>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
