import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function zodValidationParser(result: any) {
  return result.error.issues.map((issue: any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }))
}
