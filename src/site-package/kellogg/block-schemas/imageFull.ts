import type { Translation } from "../types";

export interface ImageFullContent {
  image?: string;
  description?: Translation;
  alt?: Translation;
  width?: "small" | "medium" | "large" | "full";
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}
