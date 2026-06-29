import type { Translation } from "@core/types";

export interface StatisticContent {
  id: number;
  value: string;
  label: Translation;
}

export interface StatisticsContent {
  title?: Translation;
  subtitle?: Translation;
  items?: StatisticContent[];
}
