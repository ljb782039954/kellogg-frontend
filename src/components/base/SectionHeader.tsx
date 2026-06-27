import type { Language, Translation } from "../../types";
import { createTranslate } from "../../lib/i18n";

export interface SectionHeaderProps {
  title: Translation;
  subtitle?: Translation;
  lang: Language;
  theme?: "dark" | "light";
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  lang,
  theme = "dark",
  className,
}: SectionHeaderProps) {
  const t = createTranslate(lang);
  const titleClass = theme === "dark" ? "text-white" : "text-gray-900";
  const subtitleClass = theme === "dark" ? "text-white/70" : "text-gray-600";

  return (
    <div className={["text-center mb-12 max-w-2xl mx-auto", className].filter(Boolean).join(" ")}>
      <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${titleClass}`}>{t(title)}</h2>
      <p className={`text-lg md:text-xl max-w-2xl mx-auto ${subtitleClass} `}>{subtitle ? t(subtitle) : ""}</p>
    </div>
  );
}
