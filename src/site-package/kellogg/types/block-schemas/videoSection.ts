import type { Translation } from "@core/types";

export interface VideoSectionValues {
  videoUrl?: string;
  posterImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface VideoSectionContent {
  title?: Translation;
  subtitle?: Translation;
  videoUrl?: string;
  values?: VideoSectionValues;
}
