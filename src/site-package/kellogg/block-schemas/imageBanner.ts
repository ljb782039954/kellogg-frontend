import type { Translation } from "../types";

export interface ImageBannerContent {
  image?: string;
  title?: Translation;
  subtitle?: Translation;
  buttonText?: Translation;
  linkUrl?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}
