import type { Language, Translation } from '../types';

/**
 * 统一的翻译处理函数
 */
export function t(obj: any, lang: Language): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  
  // 针对 Translation 对象结构 { zh: string, en: string }
  const val = obj[lang] || obj['en'] || obj['zh'] || '';
  return val;
}

/**
 * 链接处理
 */
export function resolveLink(href: string) {
  if (!href) return '/';
  if (href.startsWith('http')) return href;
  return href;
}
