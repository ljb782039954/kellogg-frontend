import { Mail } from "lucide-react";
import RichText from "@/runtime/components/RichText";
import type { Language } from '@/cms/types';
import InquiryFormContainer from './InquiryFormContainer';

export interface InquirySectionProps {
  titleText?: string;
  subtitleText?: string;
  lang: Language;
  pageContent?: any;
}

export default function Inquiry({
  titleText = "",
  subtitleText = "",
  lang,
  pageContent,
}: InquirySectionProps) {
  return (
    <section className="px-6 py-12 bg-ink-strong text-on-dark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div>
          <div className="w-12 h-12 border border-on-dark-border flex items-center justify-center mb-6">
            <Mail className="w-5 h-5" />
          </div>
          {titleText && <h2 className="font-luxury-heading text-3xl md:text-5xl font-light leading-tight">{titleText}</h2>}
          {subtitleText && <RichText value={subtitleText} className="mt-5 text-sm md:text-base leading-7 text-on-dark-soft" />}
        </div>

        <InquiryFormContainer lang={lang} pageContent={pageContent} />
      </div>
    </section>
  );
}
