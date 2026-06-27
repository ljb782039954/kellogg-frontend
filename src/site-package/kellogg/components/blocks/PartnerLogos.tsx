import type { Language, Translation } from "../../types";
import { createTranslate } from "../../utils/i18n";
import OptimizedImage from "../../../../core/components/OptimizedImage";
import SectionHeader from "../base/SectionHeader";

export interface Partner {
  id?: string;
  logo: string;
  name: string;
  color?: string;
  link?: string;
}

export interface PartnerLogosProps {
  title?: Translation;
  subtitle?: Translation;
  items?: Partner[];
  lang: Language;
}

export default function PartnerLogos({ title, subtitle, items = [], lang }: PartnerLogosProps) {
  const t = createTranslate(lang);
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="light" />}
        <div className="flex justify-center items-center gap-8 px-8 flex-wrap">
          {items.map((partner, index) => (
            <div key={partner.id || `${partner.name}-${index}`} className="w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0 cursor-pointer">
              {partner.logo ? (
                <OptimizedImage src={partner.logo} alt={partner.name} width={200} className="max-w-[80%] max-h-[80%] object-contain" />
              ) : (
                <div className="text-xl font-bold" style={{ color: partner.color }}>{partner.name}</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">{t({ zh: "以及更多优质合作伙伴...", en: "And many more quality partners..." })}</p>
      </div>
    </section>
  );
}
