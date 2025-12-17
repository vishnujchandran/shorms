import { fields } from '@/lib/constants'
import type { FieldTemplate } from './types'

/**
 * Convert existing field definitions to FieldTemplate format
 */
export const defaultFieldTemplates: FieldTemplate[] = fields.map((field) => ({
  type: field.type,
  name: field.name,
  label: field.label,
  description: field.description,
  Icon: field.Icon,
  defaultConfig: {
    placeholder: field.placeholder,
    description: field.description,
    // @ts-expect-error - choices exist on some field types
    choices: field.choices,
    // @ts-expect-error - min/max/step exist on slider
    min: field.min,
    // @ts-expect-error
    max: field.max,
    // @ts-expect-error
    step: field.step,
    default: field.default,
  },
}))

/**
 * Default width classes for builder
 */
export const widthClasses = {
  sm: 'max-w-2xl', // 672px - Not recommended: field controls may overflow
  md: 'max-w-3xl', // 768px - Recommended minimum
  lg: 'max-w-5xl', // 1024px
  xl: 'max-w-7xl', // 1280px
  full: 'max-w-full',
}

/**
 * Field categories for organization
 */
export const fieldCategories = [
  {
    name: 'Text Input',
    types: ['INPUT', 'TEXTAREA', 'EMAIL'],
  },
  {
    name: 'Numbers & Dates',
    types: ['NUMBER_INPUT', 'SLIDER', 'DATE'],
  },
  {
    name: 'Selection',
    types: ['SELECT', 'RADIO_GROUP', 'COMBOBOX'],
  },
  {
    name: 'Toggles',
    types: ['CHECKBOX', 'SWITCH'],
  },
  {
    name: 'Special',
    types: ['FILE_UPLOAD'],
  },
]
