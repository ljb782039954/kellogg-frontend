import type { Translation } from "@core/types";

export interface ImageTextContent {
  title?: Translation;
  content?: Translation;
  image?: string;
  imagePosition?: "left" | "right";
  buttonText?: Translation;
  buttonLink?: string;
}
