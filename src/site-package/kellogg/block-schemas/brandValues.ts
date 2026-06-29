import type { Translation } from "@core/types";

export interface BrandValueContent {
  id: number;
  icon: string;
  title: Translation;
  description: Translation;
}

export interface BrandValuesContent {
  title?: Translation;
  subtitle?: Translation;
  items?: BrandValueContent[];
}
