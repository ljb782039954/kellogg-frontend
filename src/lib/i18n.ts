import type { Translation, Language } from "../types";

export function createTranslate(language: Language) {
  return (zhOrTranslation: string | Translation, en?: string): string => {
    if (typeof zhOrTranslation === 'object' && zhOrTranslation !== null) {
      // 纠正原代码可能的逻辑错误：en 应该返回 en
      return language === 'zh' ? zhOrTranslation.zh : zhOrTranslation.en;
    }
    const zhStr = zhOrTranslation as string;
    return language === 'zh' ? zhStr : (en || zhStr);
  };
}
