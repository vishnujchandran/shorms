import * as React3 from 'react';
import { ForwardRefExoticComponent, RefAttributes, ReactNode } from 'react';
import { LucideProps, LucideIcon } from 'lucide-react';
import * as z from 'zod';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare enum FieldType {
    INPUT = "INPUT",
    TEXTAREA = "TEXTAREA",
    NUMBER_INPUT = "NUMBER_INPUT",
    EMAIL = "EMAIL",
    CHECKBOX = "CHECKBOX",
    SELECT = "SELECT",
    DATE = "DATE",
    RADIO_GROUP = "RADIO_GROUP",
    SWITCH = "SWITCH",
    COMBOBOX = "COMBOBOX",
    SLIDER = "SLIDER",
    FILE_UPLOAD = "FILE_UPLOAD"
}
interface FormFieldBaseType {
    id?: string;
    type: FieldType;
    name: string;
    label: string;
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    description?: string;
    placeholder?: string;
    default?: string | number | boolean | Date;
    registryDependencies: string[];
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        regex?: string;
        errorMessage?: string;
        maxFileSize?: number;
    };
}
interface InputFormFieldType extends FormFieldBaseType {
    type: FieldType.INPUT;
    maxChars?: number;
}
interface TextareaFormFieldType extends FormFieldBaseType {
    type: FieldType.TEXTAREA;
    maxChars?: number;
}
interface NumberInputFormFieldType extends FormFieldBaseType {
    type: FieldType.NUMBER_INPUT;
    min?: number;
    max?: number;
}
interface EmailFormFieldType extends FormFieldBaseType {
    type: FieldType.EMAIL;
}
interface CheckboxFormFieldType extends FormFieldBaseType {
    type: FieldType.CHECKBOX;
}
interface ChoiceItem {
    value: any;
    label: string;
}
interface SelectFormFieldType extends FormFieldBaseType {
    type: FieldType.SELECT;
    choices: ChoiceItem[];
}
interface DateFormFieldType extends FormFieldBaseType {
    type: FieldType.DATE;
}
interface RadioGroupFormFieldType extends FormFieldBaseType {
    type: FieldType.RADIO_GROUP;
    choices: ChoiceItem[];
}
interface SwitchFormFieldType extends FormFieldBaseType {
    type: FieldType.SWITCH;
}
interface ComboboxFormFieldType extends FormFieldBaseType {
    type: FieldType.COMBOBOX;
    choices: ChoiceItem[];
}
interface SliderFormFieldType extends FormFieldBaseType {
    type: FieldType.SLIDER;
    min: number;
    max: number;
    step: number;
}
interface FileUploadFormFieldType extends FormFieldBaseType {
    type: FieldType.FILE_UPLOAD;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
}
type FormField$1 = InputFormFieldType | TextareaFormFieldType | NumberInputFormFieldType | EmailFormFieldType | CheckboxFormFieldType | SelectFormFieldType | DateFormFieldType | RadioGroupFormFieldType | SwitchFormFieldType | ComboboxFormFieldType | SliderFormFieldType | FileUploadFormFieldType;

interface FormPage$2 {
    id: string;
    title?: string;
    fields: FormField$1[];
}
type FormState = {
    pages: FormPage$2[];
    setPages: (pages: FormPage$2[]) => void;
    activePageId: string;
    setActivePage: (id: string) => void;
    addPage: () => void;
    deletePage: (id: string) => void;
    updatePageTitle: (id: string, title: string) => void;
    deleteFormField: (id?: string) => void;
    addFormField: (formField: FormField$1) => void;
    selectedFormField?: string;
    setSelectedFormField: (id?: string) => void;
    isEditFormFieldOpen: boolean;
    setIsEditFormFieldOpen: (open: boolean) => void;
    updateFormField: (formField: FormField$1) => void;
    clearFormFields: () => void;
};

declare const SCHEMA_VERSION = "1.0";
declare const SUPPORTED_VERSIONS: string[];
declare const SUPPORTED_FIELD_TYPES: readonly ["INPUT", "TEXTAREA", "EMAIL", "NUMBER_INPUT", "SELECT", "RADIO_GROUP", "CHECKBOX", "SWITCH", "COMBOBOX", "SLIDER", "DATE", "FILE_UPLOAD"];

interface ShormsSchema$1 {
    version: string;
    metadata?: {
        createdAt?: string;
        createdBy?: string;
        description?: string;
    };
    pages: FormPage$2[];
}

interface ValidationResult$1 {
    valid: boolean;
    errors: string[];
    warnings: string[];
    unknownFieldTypes: string[];
}
declare function validateSchema(schema: any): ValidationResult$1;
declare function isSupportedFieldType(type: string): boolean;
declare function getUnsupportedFields(schema: ShormsSchema$1): string[];

declare function migrateSchema(schema: any, fromVersion?: string, toVersion?: string): ShormsSchema$1;
declare function ensureVersion(schema: any): ShormsSchema$1;

declare function generateZodSchema(formFields: FormField$1[]): z.ZodObject<{
    [x: string]: z.ZodType<any, any, z.core.$ZodTypeInternals<any, any>>;
}, z.core.$strip>;
declare const generateDefaultValues: (formFields: FormField$1[]) => Record<string, any>;
declare const getZodSchemaString: (formFields: FormField$1[]) => string;

/**
 * Shorms Renderer - Type Definitions
 * Based on API Design v3.1.0
 */

interface ShormsSchema {
    version: string;
    pages: FormPage$1[];
    validation?: {
        crossField?: CrossFieldValidation[];
    };
    metadata?: Record<string, any>;
}
interface FormPage$1 {
    id: string;
    title?: string;
    description?: string;
    fields: FormField[];
}
interface FormField {
    id: string;
    type: string;
    name: string;
    label: string;
    description?: string;
    required?: boolean;
    defaultValue?: any;
    showIf?: ConditionalLogic | ((values: FormValues) => boolean);
    dependsOn?: string[];
    validation?: FieldValidation$1;
    suggest?: FieldSuggestion;
    config?: Record<string, any>;
    metadata?: Record<string, any>;
}
type ConditionalLogic = {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
} | {
    and: ConditionalLogic[];
} | {
    or: ConditionalLogic[];
};
type FormValues = Record<string, any>;
interface FieldValidation$1 {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
    email?: boolean;
    url?: boolean;
    phone?: boolean | {
        defaultCountry?: string;
    };
    validate?: (value: any, values: FormValues) => true | string;
    validateAsync?: (value: any, context: ValidationContext) => Promise<ValidationResult | true | string>;
    debounce?: number;
    cacheResults?: boolean;
    cacheTtl?: number;
}
interface ValidationContext {
    fieldId: string;
    allValues: FormValues;
    schema: ShormsSchema;
}
interface ValidationResult {
    valid: boolean;
    message?: string;
    severity?: 'error' | 'warning' | 'info';
    blocking?: boolean;
    autoFix?: any;
}
interface CrossFieldValidation {
    fields: string[];
    validate: (values: Pick<FormValues, string>) => ValidationResult | true | string;
}
interface FieldSuggestion {
    preserveBothValues?: boolean;
    minConfidence?: number;
    ttl?: number;
}
interface SuggestionResult {
    suggestedValue: any;
    confidence?: number;
    reason?: string;
    source?: {
        type: 'document-analysis' | 'field-inference' | 'external-api' | 'ai-model';
        documentName?: string;
        pageNumber?: number;
        modelName?: string;
        extractedFrom?: string;
    };
    metadata?: Record<string, any>;
}
interface BulkSuggestResponse {
    immediate?: {
        suggestions: Record<string, SuggestionResult>;
    };
    job?: {
        jobId: string;
        affectedFields: string[];
        estimatedDuration?: number;
        estimatedFieldCount?: number;
    };
}
type SuggestionStatus = 'none' | 'expecting' | 'loading' | 'available' | 'reviewing' | 'accepted' | 'dismissed';
interface FieldSuggestionState {
    userValue: any;
    suggestedValue: any;
    originalSuggestedValue: any;
    activeValue: 'user' | 'suggested';
    suggestedValueModified: boolean;
    status: SuggestionStatus;
    confidence: number;
    reason: string;
    timestamp: number;
    expiresAt?: number;
    source?: {
        type: string;
        documentName?: string;
        pageNumber?: number;
        modelName?: string;
        extractedFrom?: string;
    };
    error?: string;
}
interface BackgroundJob {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'partial' | 'cancelled';
    progress: number;
    partialResults: Partial<FormValues>;
    fieldsCompleted: string[];
    fieldsPending: string[];
    newUpdates?: Array<{
        fieldId: string;
        value: any;
        confidence: number;
        timestamp: number;
    }>;
    errors?: Record<string, string>;
    startedAt: number;
    estimatedTimeRemaining?: number;
    completedAt?: number;
}
interface FormStateAPI {
    values: Record<string, any>;
    getValue(fieldId: string): any;
    setValue(fieldId: string, value: any, source?: 'user' | 'suggested' | 'system'): void;
    isDirty: boolean;
    dirtyFields: Set<string>;
    hasUnsavedChanges: boolean;
    isValid: boolean;
    errors: Record<string, string>;
    getFieldValidation(fieldId: string): ValidationResult | null;
    getSuggestionState(fieldId: string): FieldSuggestionState | null;
    getPendingSuggestions(): string[];
    getSuggestionCount(): number;
    getPageBadges(pageId: string): PageBadges;
    getExpectingFields(): string[];
    getLoadingFields(): string[];
    acceptSuggestion(fieldId: string): void;
    dismissSuggestion(fieldId: string): void;
    toggleValue(fieldId: string): void;
    markAsReviewed(fieldId: string): void;
    resetToOriginalSuggestion(fieldId: string): void;
    acceptAllSuggestions(): void;
    acceptAllOnPage(pageId: string): void;
    dismissAllOnPage(pageId: string): void;
    canUndo: boolean;
    canRedo: boolean;
    undo(): void;
    redo(): void;
    clearHistory(): void;
    lastSavedAt?: number;
    isDraftSaved: boolean;
    activeJobId?: string;
    cancelJob(jobId: string): Promise<void>;
    metadata: {
        startedAt: number;
        submittedAt?: number;
        duration?: number;
        aiAssistedFields: string[];
        userEditedFields: string[];
    };
    reset(): void;
    markClean(): void;
    getChanges(): FieldChange[];
}
interface PageBadges {
    errors: number;
    warnings: number;
    suggestions: number;
}
interface HistoryEntry {
    timestamp: number;
    type: 'field-edit' | 'accept-suggestion' | 'dismiss-suggestion' | 'toggle-value' | 'bulk-accept';
    fieldIds: string[];
    description: string;
}
interface FieldChange {
    fieldId: string;
    from: any;
    to: any;
    timestamp: number;
    source: 'user' | 'suggested' | 'system';
}
interface RendererFeatures {
    stateManagement?: boolean;
    autoSave?: {
        enabled: boolean;
        interval: number;
    };
    backgroundJobs?: {
        blocking: boolean;
        pollInterval: number;
    };
}
interface RendererProps {
    schema: ShormsSchema;
    onSubmit: (values: FormValues) => void | Promise<void>;
    formStateRef?: React.Ref<FormStateAPI>;
    features?: RendererFeatures;
    maxHistorySize?: number;
    onSuggest?: (fieldId: string, currentValue: any, context: FormValues) => Promise<SuggestionResult>;
    onBulkSuggest?: (files: File[], schema: ShormsSchema, currentValues: FormValues) => Promise<BulkSuggestResponse>;
    onJobProgress?: (jobId: string) => Promise<BackgroundJob>;
    onJobCancel?: (jobId: string) => Promise<void>;
    onSaveDraft?: (values: FormValues, changes: FieldChange[]) => Promise<void>;
    initialValues?: FormValues;
    initialJobId?: string;
    onDirtyStateChange?: (isDirty: boolean, dirtyFields: string[]) => void;
    onUndo?: (entry: HistoryEntry) => void;
    onRedo?: (entry: HistoryEntry) => void;
    renderField?: (field: FormField, value: any, onChange: (value: any) => void) => ReactNode;
    renderPage?: (page: FormPage$1, children: ReactNode) => ReactNode;
    renderProgress?: (current: number, total: number, progress: number) => ReactNode;
    renderNavigation?: (props: NavigationProps) => ReactNode;
}
interface NavigationProps {
    currentPageIndex: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
    isLastPage: boolean;
}

/**
 * Schema Adapter - Convert between legacy FormPage[] and new ShormsSchema
 * This allows gradual migration from old to new renderer
 */

/**
 * Convert legacy FormPage[] to new ShormsSchema format
 */
declare function formPagesToSchema(pages: FormPage$2[]): ShormsSchema;
/**
 * Convert new ShormsSchema to legacy FormPage[] format
 * Useful for backwards compatibility
 * Note: Returns partial FormField type without Icon and registryDependencies
 */
declare function schemaToFormPages(schema: ShormsSchema): FormPage$2[];

/**
 * Form page structure
 */
interface FormPage {
    id: string;
    title?: string;
    fields: FormField$1[];
}
/**
 * Builder state (controlled from outside)
 */
interface BuilderState {
    pages: FormPage[];
    activePageId: string;
}
/**
 * Field template for field library
 */
interface FieldTemplate {
    type: string;
    name: string;
    label: string;
    description?: string;
    Icon: LucideIcon;
    defaultConfig?: Partial<FormField$1>;
}
/**
 * Builder component props (controlled component)
 */
interface BuilderProps {
    pages: FormPage[];
    activePageId: string;
    onPagesChange: (pages: FormPage[]) => void;
    onActivePageChange: (pageId: string) => void;
    onPageAdd?: () => void;
    onPageDelete?: (pageId: string) => void;
    onPageRename?: (pageId: string, title: string) => void;
    onPageReorder?: (pages: FormPage[]) => void;
    onFieldAdd?: (field: FormField$1) => void;
    onFieldUpdate?: (fieldId: string, updates: Partial<FormField$1>) => void;
    onFieldDelete?: (fieldId: string) => void;
    onFieldEdit?: (fieldId: string) => void;
    onFieldReorder?: (pageId: string, fields: FormField$1[]) => void;
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
    showFieldLibrary?: boolean;
    showFormContext?: boolean;
    fieldTemplates?: FieldTemplate[];
    features?: {
        dragDrop?: boolean;
        pageManagement?: boolean;
        fieldSearch?: boolean;
        commandPalette?: boolean;
    };
    renderCommandPalette?: () => React.ReactNode;
    className?: string;
}
/**
 * Field Library component props
 */
interface FieldLibraryProps {
    fieldTemplates: FieldTemplate[];
    onFieldSelect: (template: FieldTemplate) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;
    className?: string;
    width?: number;
}
/**
 * Form Context component props
 */
interface FormContextProps {
    pages: FormPage[];
    activePageId: string;
    className?: string;
    width?: number;
    sections?: {
        statistics?: boolean;
        currentPage?: boolean;
        tips?: boolean;
    };
}
/**
 * Page tabs component props
 */
interface PageTabsProps {
    pages: FormPage[];
    activePageId: string;
    onPageSelect: (pageId: string) => void;
    onPageAdd?: () => void;
    onPageDelete?: (pageId: string) => void;
    onPageRename?: (pageId: string, title: string) => void;
    onPageReorder?: (pages: FormPage[]) => void;
    dragDropEnabled?: boolean;
    showCommandPalette?: boolean;
    showLeftSidebar?: boolean;
    className?: string;
    renderCommandPalette?: () => React.ReactNode;
}

/**
 * Main Builder component (controlled)
 * A library-ready form builder with no internal global state
 */
declare function Builder({ pages, activePageId, onPagesChange, onActivePageChange, onPageAdd, onPageDelete, onPageRename, onPageReorder, onFieldAdd, onFieldUpdate, onFieldDelete, onFieldEdit, onFieldReorder, width, showFieldLibrary, showFormContext, fieldTemplates, features, renderCommandPalette, className, }: BuilderProps): react_jsx_runtime.JSX.Element;

/**
 * Field library sidebar component
 * Displays available field templates organized by category
 */
declare function FieldLibrary({ fieldTemplates, onFieldSelect, searchPlaceholder, showSearch, className, width, }: FieldLibraryProps): react_jsx_runtime.JSX.Element;

/**
 * Form context sidebar component
 * Displays statistics and information about the current form
 */
declare function FormContext({ pages, activePageId, className, width, sections, }: FormContextProps): react_jsx_runtime.JSX.Element;

/**
 * Page tabs component for managing form pages
 * Supports drag-drop reordering and inline editing
 */
declare function PageTabs({ pages, activePageId, onPageSelect, onPageAdd, onPageDelete, onPageRename, onPageReorder, dragDropEnabled, showCommandPalette, showLeftSidebar, className, renderCommandPalette, }: PageTabsProps): react_jsx_runtime.JSX.Element;

/**
 * Hook for managing Builder state
 * Provides a convenient way to manage form pages and fields without Zustand
 * Automatically persists to localStorage
 *
 * @param initialPages - Optional initial pages (defaults to single empty page)
 * @returns Builder state and operations
 */
declare function useBuilderState(initialPages?: FormPage[]): {
    pages: FormPage[];
    activePageId: string;
    onPagesChange: React3.Dispatch<React3.SetStateAction<FormPage[]>>;
    onActivePageChange: React3.Dispatch<React3.SetStateAction<string>>;
    onPageAdd: () => void;
    onPageDelete: (pageId: string) => void;
    onPageRename: (pageId: string, title: string) => void;
    onPageReorder: (newPages: FormPage[]) => void;
    onFieldAdd: (field: FormField$1) => void;
    onFieldUpdate: (fieldId: string, updates: Partial<FormField$1>) => void;
    onFieldDelete: (fieldId: string) => void;
    onFieldReorder: (pageId: string, newFields: FormField$1[]) => void;
    getActivePage: () => FormPage;
    getActiveFields: () => FormField$1[];
    reset: (newPages?: FormPage[]) => void;
};

/**
 * Convert existing field definitions to FieldTemplate format
 */
declare const defaultFieldTemplates: FieldTemplate[];
/**
 * Default width classes for builder
 */
declare const widthClasses: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
};
/**
 * Field categories for organization
 */
declare const fieldCategories: {
    name: string;
    types: string[];
}[];

/**
 * ShadcnBuilder - High-level wrapper around Builder with shadcn/ui styling
 * This component provides the same interface as Builder but with additional
 * conveniences and defaults optimized for shadcn/ui projects
 *
 * Includes TooltipProvider to support tooltip functionality in field components
 *
 * @example
 * ```tsx
 * import { ShadcnBuilder, useBuilderState } from 'shorms'
 *
 * function App() {
 *   const builder = useBuilderState()
 *
 *   return (
 *     <ShadcnBuilder
 *       pages={builder.pages}
 *       activePageId={builder.activePageId}
 *       onPagesChange={builder.onPagesChange}
 *       onActivePageChange={builder.onActivePageChange}
 *       onPageAdd={builder.onPageAdd}
 *       onPageDelete={builder.onPageDelete}
 *       onPageRename={builder.onPageRename}
 *       onFieldAdd={builder.onFieldAdd}
 *       width="full"
 *     />
 *   )
 * }
 * ```
 */
declare function ShadcnBuilder(props: BuilderProps): react_jsx_runtime.JSX.Element;
declare namespace ShadcnBuilder {
    var displayName: string;
}

interface ShadcnRendererProps extends Omit<RendererProps, 'renderField' | 'renderPage' | 'renderProgress' | 'schema'> {
    className?: string;
    title?: string;
    description?: string;
    schema?: ShormsSchema;
    pages?: FormPage$2[];
}
declare function ShadcnRenderer({ className, title, description, schema, pages, ...props }: ShadcnRendererProps): react_jsx_runtime.JSX.Element;

interface ShadcnViewerProps {
    pages: FormPage$2[];
    submissionData?: Record<string, any>;
    mode?: 'detailed' | 'compact';
    showValidation?: boolean;
    showFieldTypes?: boolean;
    showPageNavigation?: boolean;
    showMetadata?: boolean;
    className?: string;
    title?: string;
    description?: string;
}
declare function ShadcnViewer({ pages, submissionData, mode, showValidation, showFieldTypes, showPageNavigation, showMetadata, className, title, description, }: ShadcnViewerProps): react_jsx_runtime.JSX.Element;

/**
 * Viewer Component Types
 * Read-only display for form schemas and submissions
 */

/**
 * View modes for the Viewer component
 */
type ViewMode = 'detailed' | 'compact' | 'summary';
/**
 * Form metadata
 */
interface ViewerMetadata {
    title?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    submittedAt?: string;
    submittedBy?: string;
}
/**
 * Form statistics
 */
interface FormStatistics {
    totalPages: number;
    totalFields: number;
    requiredFields: number;
    fieldTypes: Record<string, number>;
}
/**
 * Main Viewer component props
 */
interface ViewerProps {
    pages: FormPage$2[];
    submissionData?: Record<string, any>;
    mode?: ViewMode;
    showValidation?: boolean;
    showFieldTypes?: boolean;
    showPageNavigation?: boolean;
    showMetadata?: boolean;
    metadata?: ViewerMetadata;
    className?: string;
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    onPrevious?: () => void;
    onNext?: () => void;
    onSubmit?: () => void;
    showToolbar?: boolean;
}

declare function Viewer({ pages, submissionData, mode, showValidation, showFieldTypes, showPageNavigation, showMetadata, metadata, className, width, onPrevious, onNext, onSubmit, showToolbar, }: ViewerProps): react_jsx_runtime.JSX.Element;

interface FieldDisplayProps {
    field: FormField$1;
    value?: any;
    mode: ViewMode;
    showValidation: boolean;
    showFieldType: boolean;
}
declare function FieldDisplay({ field, value, mode, showValidation, showFieldType, }: FieldDisplayProps): react_jsx_runtime.JSX.Element;

/**
 * Viewer Utility Functions
 */

type FieldValidation = NonNullable<FormField$1['validation']>;
/**
 * Format a field value for display based on field type
 */
declare function formatFieldValue(field: FormField$1, value: any): string;
/**
 * Get validation rules as human-readable strings
 */
declare function getValidationSummary(validation?: FieldValidation): string[];
/**
 * Get form statistics
 */
declare function getFormStatistics(pages: FormPage$2[]): FormStatistics;
/**
 * Get field type display name
 */
declare function getFieldTypeLabel(fieldType: string): string;

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
declare const Headless: {
    readonly Builder: typeof Builder;
    readonly Renderer: React3.ForwardRefExoticComponent<undefined & React3.RefAttributes<any>>;
    readonly Viewer: typeof Viewer;
};

export { type BackgroundJob, ShadcnBuilder as Builder, type FormPage as BuilderFormPage, type BuilderProps, type BuilderState, type BulkSuggestResponse, FieldDisplay, FieldLibrary, type FieldLibraryProps, type FieldSuggestionState, type FieldTemplate, FieldType, FormContext, type FormContextProps, type FormField$1 as FormField, type FormPage$2 as FormPage, type FormState, type FormStateAPI, type FormStatistics, type FormValues, Headless, PageTabs, type PageTabsProps, ShadcnRenderer as Renderer, type RendererProps, SCHEMA_VERSION, SUPPORTED_FIELD_TYPES, SUPPORTED_VERSIONS, type ShormsSchema, type ValidationResult$1 as ValidationResult, type ViewMode, ShadcnViewer as Viewer, type ViewerMetadata, type ShadcnViewerProps as ViewerProps, defaultFieldTemplates, ensureVersion, fieldCategories, formPagesToSchema, formatFieldValue, generateDefaultValues, generateZodSchema, getFieldTypeLabel, getFormStatistics, getUnsupportedFields, getValidationSummary, getZodSchemaString, isSupportedFieldType, migrateSchema, schemaToFormPages, useBuilderState, validateSchema, widthClasses };
