/**
 * Shorms - Local-first multi-page form builder
 *
 * This library provides type-safe form schema management with versioning,
 * validation, and rendering capabilities for React applications.
 *
 * @packageDocumentation
 */

// ============================================================================
// Type Definitions
// ============================================================================

export { FieldType } from './types/field'
export type { FormField } from './types/field'
export type { FormState, FormPage } from './types/form-store'

// ============================================================================
// Schema Versioning
// ============================================================================

export {
  SCHEMA_VERSION,
  SUPPORTED_VERSIONS,
  SUPPORTED_FIELD_TYPES,
  validateSchema,
  isSupportedFieldType,
  getUnsupportedFields,
  migrateSchema,
  ensureVersion,
  type ValidationResult
} from './lib/versioning'

// ============================================================================
// Schema Generation
// ============================================================================

export {
  generateZodSchema,
  generateDefaultValues,
  getZodSchemaString
} from './lib/form-schema'

// ============================================================================
// Schema Adapters
// ============================================================================

export {
  formPagesToSchema,
  schemaToFormPages,
} from './lib/schema-adapter'

// ============================================================================
// Main Components (shadcn/ui styled - default)
// ============================================================================

/**
 * Builder - Form builder with shadcn/ui styling
 * Renderer - Form renderer with shadcn/ui styling
 * Viewer - Form viewer with shadcn/ui styling
 */
export { ShadcnBuilder as Builder } from './components/shorms/shadcn-builder'
export { ShadcnRenderer as Renderer } from './components/shorms/shadcn-renderer'
export { ShadcnViewer as Viewer } from './components/shorms/shadcn-viewer'

// ============================================================================
// Builder Utilities
// ============================================================================

export {
  useBuilderState,
  defaultFieldTemplates,
  fieldCategories,
  widthClasses,
  FieldLibrary,
  FormContext,
  PageTabs,
} from './components/shorms/builder'

export type {
  BuilderProps,
  BuilderState,
  FieldLibraryProps,
  FieldTemplate,
  FormContextProps,
  FormPage as BuilderFormPage,
  PageTabsProps,
} from './components/shorms/builder'

// ============================================================================
// Renderer Types
// ============================================================================

export type {
  RendererProps,
  FormStateAPI,
  FieldSuggestionState,
  BulkSuggestResponse,
  BackgroundJob,
  ShormsSchema,
  FormValues,
} from './components/shorms/renderer'

// ============================================================================
// Viewer Utilities
// ============================================================================

export {
  FieldDisplay,
  formatFieldValue,
  getValidationSummary,
  getFormStatistics,
  getFieldTypeLabel,
} from './components/shorms/viewer'

export type { ViewMode, ViewerMetadata, FormStatistics } from './components/shorms/viewer'
export type { ShadcnViewerProps as ViewerProps } from './components/shorms/shadcn-viewer'

// ============================================================================
// Headless Components (for custom UI implementations)
// ============================================================================

import { Builder as HeadlessBuilder } from './components/shorms/builder'
import { Renderer as HeadlessRenderer } from './components/shorms/renderer'
import { Viewer as HeadlessViewer } from './components/shorms/viewer'

/**
 * Headless components for building custom UI implementations
 *
 * @example
 * ```tsx
 * import { Headless } from 'shorms'
 *
 * // Use with your own UI library (DaisyUI, Chakra, etc.)
 * <Headless.Builder pages={pages} ... />
 * <Headless.Renderer pages={pages} ... />
 * <Headless.Viewer pages={pages} ... />
 * ```
 */
export const Headless = {
  Builder: HeadlessBuilder,
  Renderer: HeadlessRenderer,
  Viewer: HeadlessViewer,
} as const
