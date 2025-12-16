/**
 * Viewer Utility Functions
 */

import type { FormPage } from '@/types/form-store'
import type { FormField } from '@/types/field'
import type { FormStatistics } from './types'
import { FieldType } from '@/types/field'

// Validation type from the field
type FieldValidation = NonNullable<FormField['validation']>

/**
 * Format a field value for display based on field type
 */
export function formatFieldValue(field: FormField, value: any): string {
  if (value === null || value === undefined || value === '') {
    return '(No value provided)'
  }

  switch (field.type) {
    case FieldType.CHECKBOX:
    case FieldType.SWITCH:
      return value ? '✓ Yes' : '✗ No'

    case FieldType.DATE:
      try {
        return new Date(value).toLocaleDateString()
      } catch {
        return String(value)
      }

    case FieldType.FILE_UPLOAD:
      if (typeof value === 'object' && value.name) {
        const size = value.size ? ` (${formatFileSize(value.size)})` : ''
        return `${value.name}${size}`
      }
      return String(value)

    case FieldType.SELECT:
    case FieldType.RADIO_GROUP:
    case FieldType.COMBOBOX:
      // Try to find the label from options or choices
      const choices = (field as any).choices || (field as any).options
      if (choices && Array.isArray(choices)) {
        const option = choices.find((opt: any) => opt.value === value)
        if (option) {
          return option.label
        }
      }
      return String(value)

    case FieldType.SLIDER:
    case FieldType.NUMBER_INPUT:
      return typeof value === 'number' ? value.toLocaleString() : String(value)

    case FieldType.INPUT:
    case FieldType.TEXTAREA:
    case FieldType.EMAIL:
    default:
      return String(value)
  }
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get validation rules as human-readable strings
 */
export function getValidationSummary(validation?: FieldValidation): string[] {
  if (!validation) return []

  const rules: string[] = []

  if (validation.required) {
    rules.push('Required')
  }

  if (validation.min !== undefined) {
    rules.push(`Min: ${validation.min}`)
  }

  if (validation.max !== undefined) {
    rules.push(`Max: ${validation.max}`)
  }

  if (validation.regex) {
    rules.push(`Pattern: ${validation.regex}`)
  }

  if (validation.maxFileSize) {
    rules.push(`Max file size: ${validation.maxFileSize}MB`)
  }

  if (validation.errorMessage) {
    rules.push(`Error: ${validation.errorMessage}`)
  }

  return rules
}

/**
 * Get form statistics
 */
export function getFormStatistics(pages: FormPage[]): FormStatistics {
  const stats: FormStatistics = {
    totalPages: pages.length,
    totalFields: 0,
    requiredFields: 0,
    fieldTypes: {}
  }

  pages.forEach((page) => {
    page.fields.forEach((field) => {
      stats.totalFields++

      if (field.validation?.required) {
        stats.requiredFields++
      }

      const fieldType = field.type
      stats.fieldTypes[fieldType] = (stats.fieldTypes[fieldType] || 0) + 1
    })
  })

  return stats
}

/**
 * Get field type display name
 */
export function getFieldTypeLabel(fieldType: string): string {
  const labels: Record<string, string> = {
    [FieldType.INPUT]: 'Text Input',
    [FieldType.TEXTAREA]: 'Textarea',
    [FieldType.EMAIL]: 'Email',
    [FieldType.NUMBER_INPUT]: 'Number',
    [FieldType.CHECKBOX]: 'Checkbox',
    [FieldType.SELECT]: 'Select',
    [FieldType.RADIO_GROUP]: 'Radio Group',
    [FieldType.SLIDER]: 'Slider',
    [FieldType.DATE]: 'Date',
    [FieldType.SWITCH]: 'Switch',
    [FieldType.FILE_UPLOAD]: 'File Upload',
    [FieldType.COMBOBOX]: 'Combobox',
  }

  return labels[fieldType] || fieldType
}

/**
 * Format date for display
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A'

  try {
    return new Date(dateString).toLocaleString()
  } catch {
    return dateString
  }
}

/**
 * Get width class for width prop
 */
export function getWidthClass(width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'): string {
  const widthMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full'
  }

  return widthMap[width || 'lg']
}
