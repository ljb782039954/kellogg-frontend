import { Globe, Share2, Menu, X, Coins } from 'lucide-react';
import { CurrencyService } from '../../services/currencyService';
import { t } from '../../utils/common';
import type { CompanyInfo, Language } from '../../types';

interface HeaderActionsProps {
  currency: string;
  rates: Record<string, number> | null;
  lang: Language;
  companyInfo: CompanyInfo;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  textStyle: string;
  borderStyle: string;
}

export default function HeaderActions({
  currency,
  rates,
  lang,
  companyInfo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  textStyle,
  borderStyle,
}: HeaderActionsProps) {
  
  const handleShare = () => {
    const url = window.location.origin;
    const title = t(companyInfo.name, lang);
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(lang === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    });
  };

  const switchLanguage = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    document.cookie = `lang=${newLang};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {/* 桌面端货币切换 */}
      <div className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${textStyle} border ${borderStyle}`}>
        <Coins className="w-4 h-4" />
        <select
          value={currency}
          onChange={(e) => CurrencyService.switchCurrency(e.target.value)}
          className="bg-transparent appearance-none border-none outline-none cursor-pointer px-1"
        >
          {(rates ? Object.keys(rates) : ['USD', 'CNY']).map(cur => (
            <option key={cur} value={cur} className="text-gray-900 bg-white">{cur}</option>
          ))}
        </select>
      </div>

      <button onClick={switchLanguage} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${textStyle} border ${borderStyle}`}>
        <Globe className="w-4 h-4" />
        {lang === 'zh' ? '中文' : 'EN'}
      </button>

      <button onClick={handleShare} className={`p-2 rounded-full ${textStyle} border ${borderStyle}`}>
        <Share2 className="w-4 h-4" />
      </button>

      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 ${textStyle}`}>
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
