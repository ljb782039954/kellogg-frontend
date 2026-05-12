export type Currency = 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  GBP: { symbol: '£', rate: 0.8 },
  EUR: { symbol: '€', rate: 0.92 },
  AUD: { symbol: 'A$', rate: 1.52 },
  CAD: { symbol: 'C$', rate: 1.36 },
};

export function formatPrice(price: number, currency: Currency = 'USD') {
  const config = CURRENCY_CONFIG[currency];
  const converted = price * config.rate;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
