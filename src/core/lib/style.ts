import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 鍚堝苟 Tailwind 绫诲悕
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
