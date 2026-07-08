import { useState } from "react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FaqAccordionItemContent {
  question: Translation;
  answer: Translation;
}

export interface FaqAccordionContent {
  title?: Translation;
  items: FaqAccordionItemContent[];
}

export interface FaqAccordionProps {
  content?: FaqAccordionContent;
  lang?: Language;
  title?: string;
  items?: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FaqAccordion({ content, lang = "en", title, items = [] }: FaqAccordionProps) {
  const translate = createTranslate(lang);
  const resolvedTitle = content ? translate(content.title) : title;
  const resolvedItems = content
    ? content.items.map((item) => ({ question: translate(item.question), answer: translate(item.answer) }))
    : items;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      {resolvedTitle && (
        <h3 className="font-luxury-heading text-base md:text-lg lg:text-xl font-medium mb-8 text-center text-body">{resolvedTitle}</h3>
      )}
      <div className="space-y-0">
        {resolvedItems.map((faq, i) => (
          <div key={i} className="border-b border-border">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xs md:text-sm lg:text-base pr-4 text-body">{faq.question}</span>
              <span className="text-subtle text-sm flex-shrink-0">
                {open === i ? "-" : "+"}
              </span>
            </button>
            {open === i && (
              <p className="pb-4 text-xs md:text-sm lg:text-base text-subtle ">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



