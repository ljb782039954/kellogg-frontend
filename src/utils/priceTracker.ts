import { $currency, $rates, updateAllPrices } from "../lib/currency";

/**
 * 初始化全局价格追踪器 (仅在客户端运行)
 */
export function initPriceTracker() {
  if (typeof window === 'undefined') return;

  // 1. 初始化汇率 (从 window.__EXCHANGE_RATES__ 同步)
  if (window.__EXCHANGE_RATES__) {
    $rates.set(window.__EXCHANGE_RATES__);
  }

  // 2. 监听币种变化并更新所有标记的价格元素
  $currency.subscribe(cur => {
    updateAllPrices($rates.get(), cur);
  });

  // 3. 监听汇率变化 (防止汇率动态加载延迟)
  $rates.subscribe(rates => {
    updateAllPrices(rates, $currency.get());
  });

  // 4. 监听自定义事件 (处理不同 Island 间的通信)
  window.addEventListener('currency-change', (e: any) => {
    updateAllPrices($rates.get(), e.detail);
  });
}
