import type { Translation } from "@core/types";

export interface GalleryItemContent {
  src: string;
  caption?: Translation;
}

export interface GalleryContent {
  title?: Translation;
  subtitle?: Translation;
  items?: GalleryItemContent[];
}
