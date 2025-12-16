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

/**
 * Field types and form structure definitions
 */
export { FieldType } from './types/field'
export type { FormField } from './types/field'
export type { FormState, FormPage } from './types/form-store'

// Note: ShormsSchema is not available in legacy types
// Use the new Renderer types for the full schema with versioning

// ============================================================================
// Schema Versioning
// ============================================================================

/**
 * Schema versioning system for forward compatibility
 *
 * - validateSchema: Validate schema structure and field types
 * - migrateSchema: Migrate schemas between versions
 * - isSupportedFieldType: Check if field type is supported
 * - getUnsupportedFields: Find unsupported fields in schema
 */
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

/**
 * Zod schema generation utilities
 *
 * - generateZodSchema: Generate Zod validation schema from form fields
 * - generateDefaultValues: Generate default values for form fields
 * - getZodSchemaString: Get string representation of Zod schema
 */
export {
  generateZodSchema,
  generateDefaultValues,
  getZodSchemaString
} from './lib/form-schema'

// ============================================================================
// React Components
// ============================================================================

/**
 * Shorms Renderer - Form rendering component with validation and suggestions
 *
 * Note: The Renderer uses a new API design (v3.1.0) with extensible field types
 * and advanced features like state management, suggestions, and background jobs.
 *
 * For the new API types, import from '@/components/shorms/renderer' or see API_DESIGN.md
 */
export { Renderer } from './components/shorms/renderer'
export { ShadcnRenderer } from './components/shorms/shadcn-renderer'
export type {
  // Note: These types from the new renderer may conflict with legacy types above
  // Use qualified imports if needed: import type { FormField as RendererFormField } from '@/components/shorms/renderer'
  RendererProps,
  FormStateAPI,
  FieldSuggestionState,
  BulkSuggestResponse,
  BackgroundJob,
  ShormsSchema,
  FormValues,
} from './components/shorms/renderer'

// ============================================================================
// Schema Adapters
// ============================================================================

/**
 * Schema adapter utilities for converting between legacy and new formats
 *
 * - formPagesToSchema: Convert legacy FormPage[] to new ShormsSchema
 * - schemaToFormPages: Convert new ShormsSchema to legacy FormPage[]
 */
export {
  formPagesToSchema,
  schemaToFormPages,
} from './lib/schema-adapter'

// ============================================================================
// Builder Components (Phase 2 - Complete)
// ============================================================================

/**
 * Form Builder - Interactive form builder component with no internal global state
 *
 * - Builder: Main controlled builder component
 * - ShadcnBuilder: High-level wrapper with shadcn/ui styling
 * - useBuilderState: Convenience hook for state management
 * - FieldLibrary: Field template sidebar
 * - FormContext: Form statistics sidebar
 * - PageTabs: Page management UI
 */
export {
  Builder,
  FieldLibrary,
  FormContext,
  PageTabs,
  useBuilderState,
  defaultFieldTemplates,
  fieldCategories,
  widthClasses,
} from './components/shorms/builder'

export { ShadcnBuilder } from './components/shorms/shadcn-builder'

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
// Viewer Components (Phase 3 - Complete)
// ============================================================================

/**
 * Form Viewer - Read-only display for form schemas and submissions
 *
 * - Viewer: Main controlled viewer component
 * - ShadcnViewer: High-level wrapper with shadcn/ui styling
 * - Multiple view modes: detailed, compact, summary
 * - Display form submissions with formatted data
 */
export {
  Viewer,
  FieldDisplay,
  formatFieldValue,
  getValidationSummary,
  getFormStatistics,
  getFieldTypeLabel,
} from './components/shorms/viewer'

export { ShadcnViewer, type ShadcnViewerProps } from './components/shorms/shadcn-viewer'

export type {
  ViewMode,
  ViewerProps,
  ViewerMetadata,
  FormStatistics,
} from './components/shorms/viewer'
