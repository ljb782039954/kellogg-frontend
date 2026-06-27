import type { CSSProperties } from "react";
import type { Language, NavLink, Translation } from "../../types";
import { createTranslate } from "../../utils/i18n";
import OptimizedImage from "../../../../core/components/OptimizedImage";
import SectionHeader from "../base/SectionHeader";

export interface CtaBannerValues {
  primaryButton?: NavLink;
  secondaryButton?: NavLink;
  backgroundImage?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
}

export interface CtaBannerProps {
  title?: Translation;
  subtitle?: Translation;
  values?: CtaBannerValues;
  lang: Language;
}

export default function CtaBanner({ title, subtitle, values, lang }: CtaBannerProps) {
  const t = createTranslate(lang);
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[values?.alignment || "center"];
  const backgroundStyle: CSSProperties | undefined = values?.backgroundColor ? { backgroundColor: values.backgroundColor } : undefined;

  return (
    <div className="relative rounded-2xl overflow-hidden text-white my-8 mx-4">
      {values?.backgroundImage ? (
        <>
          <OptimizedImage src={values.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700" style={backgroundStyle} />
      )}
      <div className={`relative container mx-auto px-6 py-16 flex flex-col ${alignClass}`}>
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="dark" />}
        <div className="flex flex-wrap gap-4 mt-6">
          {values?.primaryButton?.name && <a href={values.primaryButton.href} className="px-8 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">{t(values.primaryButton.name)}</a>}
          {values?.secondaryButton?.name && <a href={values.secondaryButton.href} className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-bold hover:bg-white/30 transition-colors">{t(values.secondaryButton.name)}</a>}
        </div>
      </div>
    </div>
  );
}
