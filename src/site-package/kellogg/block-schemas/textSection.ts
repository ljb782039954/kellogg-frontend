import type { Translation } from "../types";

export interface TextSectionContent {
  title?: Translation;
  content?: Translation;
  alignment?: "left" | "center" | "right";
  paddingY?: "small" | "medium" | "large";
  backgroundColor?: string;
}
