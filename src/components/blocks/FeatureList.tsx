import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Language, Translation } from "../../types";
import { createTranslate } from "../../lib/i18n";
import RichText from "../base/RichText";
import SectionHeader from "../base/SectionHeader";

export interface FeatureListItem {
  icon: string;
  title: Translation;
  description: Translation;
}

export interface FeatureListProps {
  title?: Translation;
  subtitle?: Translation;
  items?: FeatureListItem[];
  lang: Language;
}

export default function FeatureList({ title, subtitle, items = [], lang }: FeatureListProps) {
  const t = createTranslate(lang);
  if (items.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        {title && <SectionHeader lang={lang} title={title} subtitle={subtitle} theme="light" />}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 md:gap-6">
          {items.map((item, index) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] || LucideIcons.Star;
            return (
              <div key={`${item.icon}-${index}`} className="bg-gray-50 rounded-xl p-6 hover:bg-primary/5 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{t(item.title)}</h4>
                <RichText value={t(item.description)} className="text-sm text-gray-500 content-rich-text" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
