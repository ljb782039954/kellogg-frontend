import type { Translation } from "../types";

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
