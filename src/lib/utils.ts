import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// next/image can only optimize local files and hosts listed in next.config.mjs.
// Anything else (e.g. a URL pasted into the admin) is passed through unoptimized.
export function canOptimizeImage(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("/")) return !src.includes("?");
  try {
    const { hostname } = new URL(src);
    return hostname === "firebasestorage.googleapis.com" || hostname.endsWith(".firebasestorage.app");
  } catch {
    return false;
  }
}
