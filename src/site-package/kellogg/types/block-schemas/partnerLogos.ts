import type { Translation } from "@core/types";

export interface PartnerLogoContent {
  id?: string;
  logo: string;
  name: string;
  color?: string;
  link?: string;
}

export interface PartnerLogosContent {
  title?: Translation;
  subtitle?: Translation;
  items?: PartnerLogoContent[];
}
