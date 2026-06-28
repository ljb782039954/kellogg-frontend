import type { NavLink, Translation } from "../types";

export interface CarouselItemContent {
  id: number;
  image: string;
  title: Translation;
  subtitle?: Translation;
  cta?: Translation;
  link: NavLink;
}

export interface CarouselContent {
  autoPlay?: boolean;
  interval?: number;
  items?: CarouselItemContent[];
}
