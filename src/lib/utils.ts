import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const baseUrl: NonNullable<string> =
  import.meta.env.VITE_API_URL + '/api' || "http://localhost:5500/api"
  ;
