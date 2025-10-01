import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export ID utilities for convenience
export { generateId, generateShortId, isValidCuid2, createId } from './id';
