export type Language = 'zh' | 'en';

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  last_updated: string;
}

/**
 * 将基准货币(CNY)转换为目标货币并格式化
 * 需求：基于 CNY 存储，精确计算，增加币种简写后缀。比如 $ 19.34 USD
 */
export function formatPrice(
  basePrice: number | null | undefined, 
  currency: string = 'USD', 
  rates: Record<string, number> | null = null
): string {
  if (basePrice === undefined || basePrice === null) return '';

  // 如果没有汇率表或者找不到对应币种，默认当做 CNY 去格式化
  if (!rates || !rates[currency]) {
    const fallbackFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CNY',
      currencyDisplay: 'narrowSymbol',
    });
    return `${fallbackFormatter.format(basePrice)} CNY`;
  }

  // 汇率换算 (base 为 CNY)
  const targetRate = rates[currency];
  const convertedPrice = basePrice * targetRate;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  });

  const formattedOutput = formatter.format(convertedPrice);

  return `${formattedOutput} ${currency}`;
}

// 可选：添加一个简单的 store 机制，用于客户端 Island 之间的状态同步
import { atom } from 'nanostores';

export const $currency = atom<string>('USD');
export const $rates = atom<Record<string, number> | null>(null);

// 初始化客户端 Store (仅在浏览器运行)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('kellogg_currency');
  if (saved) $currency.set(saved);
}

export function setGlobalCurrency(cur: string) {
  $currency.set(cur);
  if (typeof window !== 'undefined') {
    localStorage.setItem('kellogg_currency', cur);
    // 触发全局价格刷新
    window.dispatchEvent(new CustomEvent('currency-change', { detail: cur }));
  }
}

// 辅助函数：让非 React 组件也能更新价格
export function updateAllPrices(rates: Record<string, number> | null, currency: string) {
  const elements = document.querySelectorAll('[data-base-price]');
  elements.forEach(el => {
    const basePrice = parseFloat(el.getAttribute('data-base-price') || '0');
    el.textContent = formatPrice(basePrice, currency, rates);
  });
}
