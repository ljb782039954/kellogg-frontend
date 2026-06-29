import type { Translation } from "@core/types";

export interface TestimonialContent {
  id: number;
  name: Translation;
  role?: Translation;
  content: Translation;
  avatar?: string;
}

export interface TestimonialsContent {
  title?: Translation;
  subtitle?: Translation;
  items?: TestimonialContent[];
}
