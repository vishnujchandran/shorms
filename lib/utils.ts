import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique field ID
 * Uses nanoid for collision-resistant IDs
 */
export function generateFieldId(): string {
  return nanoid(10)
}

/**
 * Generate a unique field name based on the field type
 * Format: fieldType_uniqueId (e.g., "email_abc123xyz")
 */
export function generateFieldName(fieldType: string): string {
  const sanitized = fieldType.toLowerCase().replaceAll(" ", "_")
  return `${sanitized}_${nanoid(8)}`
}
