import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Language, Translation } from "../../types";
import { createTranslate } from "../../../../core/lib/i18n";
import RichText from "../../../../core/components/RichText";
import SectionHeader from "../../../../core/components/SectionHeader";

export interface BrandValue {
  id: number;
  icon: string;
  title: Translation;
  description: Translation;
}

export interface BrandValuesProps {
  title?: Translation;
  subtitle?: Translation;
  items?: BrandValue[];
  lang: Language;
}

export default function BrandValues({ title, subtitle, items = [], lang }: BrandValuesProps) {
  const t = createTranslate(lang);
  if (items.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="light" />}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-between max-w-6xl mx-auto gap-2 md:gap-4">
          {items.map((item) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] || LucideIcons.Star;
            return (
              <div key={item.id} className="text-center group">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1">{t(item.title)}</h4>
                <RichText value={t(item.description)} className="text-sm content-rich-text" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
