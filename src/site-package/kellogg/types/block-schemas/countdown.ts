import type { Translation } from "@core/types";

export interface CountdownValuesContent {
  endTime?: string;
  backgroundImage?: string;
}

export interface CountdownContent {
  title?: Translation;
  subtitle?: Translation;
  values?: CountdownValuesContent;
}
