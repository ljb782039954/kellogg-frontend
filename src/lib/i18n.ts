import type { Translation, Language } from "../types";

export function createTranslate(language: Language) {
  return (zhOrTranslation: string | Translation | null | undefined, en?: string): string => {
    if (!zhOrTranslation) return "";
    
    if (typeof zhOrTranslation === 'object') {
      return language === 'zh' ? zhOrTranslation.zh : (zhOrTranslation.en || zhOrTranslation.zh || "");
    }
    const zhStr = zhOrTranslation as string;
    return language === 'zh' ? zhStr : (en || zhStr);
  };
}
