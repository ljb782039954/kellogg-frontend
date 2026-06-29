import type { NavLink, Translation } from "@core/types";

export interface CtaBannerValues {
  primaryButton?: NavLink;
  secondaryButton?: NavLink;
  backgroundImage?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
}

export interface CtaBannerContent {
  title?: Translation;
  subtitle?: Translation;
  values?: CtaBannerValues;
}
