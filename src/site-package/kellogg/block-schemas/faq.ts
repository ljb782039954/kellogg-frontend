import type { Translation } from "../types";

export interface FAQItemContent {
  id: number;
  question: Translation;
  answer: Translation;
}

export interface FAQContent {
  title?: Translation;
  subtitle?: Translation;
  items?: FAQItemContent[];
}
