import { t as coreTranslate } from "@core-webApp/lib/common";
import { createTranslate as createCoreTranslate } from "@core-webApp/lib/i18n";
import type { Language, Translation } from "@/cms/types";
import { kelloggSiteConfig } from "../config";

function getFallbackLanguages(): readonly Language[] {
  return kelloggSiteConfig.fallbackLanguages ?? [kelloggSiteConfig.defaultLanguage];
}

export function createTranslate(language: Language) {
  return createCoreTranslate(language, getFallbackLanguages());
}

export function t(
  value: string | Translation | null | undefined,
  language: Language,
  fallback?: string
) {
  return coreTranslate(value, language, getFallbackLanguages()) || fallback || "";
}
