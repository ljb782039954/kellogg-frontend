import { $currency, $rates, setGlobalCurrency } from '../lib/currency';

export class CurrencyService {
  /**
   * 初始化汇率数据
   */
  static initRates(initialRates?: Record<string, number> | null) {
    const rates = initialRates || (window as any).__EXCHANGE_RATES__;
    if (rates) {
      $rates.set(rates);
    }
  }

  /**
   * 自动检测并设置货币
   */
  static async autoDetectCurrency() {
    // 1. 检查本地存储
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('kellogg_currency');
    if (saved) {
      $currency.set(saved);
      return;
    }

    // 2. IP 自动检测
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        const detectedCur = data.currency;
        const currentRates = $rates.get();
        
        if (detectedCur && (!currentRates || currentRates[detectedCur])) {
          setGlobalCurrency(detectedCur);
        } else {
          setGlobalCurrency('USD');
        }
      }
    } catch (err) {
      console.warn('[CurrencyService] GeoIP detection failed', err);
      setGlobalCurrency('USD');
    }
  }

  /**
   * 切换货币
   */
  static switchCurrency(newCurrency: string) {
    setGlobalCurrency(newCurrency);
  }
}
