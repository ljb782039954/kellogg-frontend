import type { Translation } from "@core/types";

export interface FeatureListItemContent {
  icon: string;
  title: Translation;
  description: Translation;
}

export interface FeatureListContent {
  title?: Translation;
  subtitle?: Translation;
  items?: FeatureListItemContent[];
}
