/**
 * Viewer Component Types
 * Read-only display for form schemas and submissions
 */

import type { FormPage } from '@/types/form-store'

/**
 * View modes for the Viewer component
 */
export type ViewMode = 'detailed' | 'compact' | 'summary'

/**
 * Form metadata
 */
export interface ViewerMetadata {
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  submittedAt?: string
  submittedBy?: string
}

/**
 * Form statistics
 */
export interface FormStatistics {
  totalPages: number
  totalFields: number
  requiredFields: number
  fieldTypes: Record<string, number>
}

/**
 * Main Viewer component props
 */
export interface ViewerProps {
  // Required: Form schema
  pages: FormPage[]

  // Optional: Submission data to display
  submissionData?: Record<string, any>

  // Optional: View mode
  mode?: ViewMode

  // Optional: Display options
  showValidation?: boolean
  showFieldTypes?: boolean
  showPageNavigation?: boolean
  showMetadata?: boolean

  // Optional: Metadata
  metadata?: ViewerMetadata

  // Optional: Styling
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  // Optional: Toolbar callbacks
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  showToolbar?: boolean
}

/**
 * Field display props
 */
export interface FieldDisplayProps {
  field: any // FormField type
  value?: any
  mode: ViewMode
  showValidation: boolean
  showFieldType: boolean
}

/**
 * Page display props
 */
export interface PageDisplayProps {
  page: FormPage
  submissionData?: Record<string, any>
  mode: ViewMode
  showValidation: boolean
  showFieldTypes: boolean
}
