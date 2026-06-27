import type { Language, Translation } from '../types';

export function t(
  obj: string | Translation | null | undefined,
  lang: Language,
  fallbackLanguages: Language[] = ['en', 'zh']
): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;

  return (
    obj[lang] ||
    fallbackLanguages.map((l) => obj[l]).find(Boolean) ||
    ''
  );
}

export function resolveLink(href: string) {
  if (!href) return '/';
  if (href.startsWith('http')) return href;
  return href;
}
