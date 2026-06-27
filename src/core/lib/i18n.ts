import type { Translation, Language } from "../types";

export function createTranslate(
  language: Language,
  fallbackLanguages: Language[] = ["en", "zh"]
) {
  return (
    value: string | Translation | null | undefined,
    fallback?: string
  ): string => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    return (
      value[language] ||
      fallback ||
      fallbackLanguages.map((lang) => value[lang]).find(Boolean) ||
      Object.values(value)[0] ||
      ""
    );
  };
}
