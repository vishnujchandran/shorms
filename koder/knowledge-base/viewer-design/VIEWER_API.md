# Viewer API Design v1.0.0
**Date:** 2025-12-16
**Philosophy:** Read-only display component for form schemas and submissions

---

## Design Principles

1. **Read-Only** - Display only, no editing capabilities
2. **Multiple View Modes** - Detailed, compact, and summary views
3. **Submission Display** - Show submitted form data with proper formatting
4. **Schema Inspection** - Display form structure, fields, and validation
5. **Type-Safe** - Full TypeScript support
6. **Flexible** - Can display schema only or schema + submission data

---

## Core Types

```typescript
// View modes
type ViewMode = 'detailed' | 'compact' | 'summary'

// Viewer props
interface ViewerProps {
  // Required: Form schema
  pages: FormPage[]

  // Optional: Submission data to display
  submissionData?: Record<string, any>

  // Optional: View mode
  mode?: ViewMode  // default: 'detailed'

  // Optional: Display options
  showValidation?: boolean      // Show validation rules (default: true)
  showFieldTypes?: boolean      // Show field type badges (default: true)
  showPageNavigation?: boolean  // Show page tabs (default: true for multi-page)
  showMetadata?: boolean        // Show metadata like created date (default: true)

  // Optional: Metadata
  metadata?: {
    title?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    submittedAt?: string
    submittedBy?: string
  }

  // Optional: Styling
  className?: string
  width?: "sm" | "md" | "lg" | "xl" | "full"
}
```

---

## View Modes

### Detailed Mode (default)

Shows complete information:
- All pages with full field details
- Validation rules displayed
- Field types shown with badges
- Descriptions and placeholders
- If submission data provided: values shown inline with fields

**Use Case:** Form inspection, debugging, documentation

### Compact Mode

Shows condensed information:
- All fields listed with basic info
- Validation rules summarized
- Less spacing, more content per screen
- If submission data provided: values shown in compact format

**Use Case:** Quick overview, comparing forms

### Summary Mode

Shows high-level information only:
- Page titles and field counts
- Total field count, required fields count
- Validation summary
- If submission data provided: key-value list only

**Use Case:** Dashboard, form list, quick glance

---

## Usage Examples

### Basic Usage - Schema Only

```typescript
import { Viewer } from 'shorms'

function FormSchemaViewer() {
  return (
    <Viewer
      pages={formPages}
      mode="detailed"
    />
  )
}
```

### Display Submission Data

```typescript
import { Viewer } from 'shorms'

function SubmissionViewer() {
  const submissionData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello world'
  }

  return (
    <Viewer
      pages={formPages}
      submissionData={submissionData}
      metadata={{
        submittedAt: '2025-12-16T10:30:00Z',
        submittedBy: 'john@example.com'
      }}
      mode="detailed"
    />
  )
}
```

### Summary View

```typescript
import { Viewer } from 'shorms'

function FormSummary() {
  return (
    <Viewer
      pages={formPages}
      mode="summary"
      showFieldTypes={false}
    />
  )
}
```

### Using ShadcnViewer Wrapper

```typescript
import { ShadcnViewer } from 'shorms'

function MyViewer() {
  return (
    <ShadcnViewer
      pages={formPages}
      submissionData={data}
      mode="detailed"
      width="lg"
    />
  )
}
```

---

## Component Structure

```
components/shorms/viewer/
├── viewer.tsx              # Core Viewer component
├── detailed-view.tsx       # Detailed mode implementation
├── compact-view.tsx        # Compact mode implementation
├── summary-view.tsx        # Summary mode implementation
├── field-display.tsx       # Individual field display
├── submission-display.tsx  # Submission data formatting
├── types.ts               # TypeScript types
├── utils.ts               # Helper functions
└── index.ts               # Public exports

components/shorms/
└── shadcn-viewer.tsx      # Shadcn wrapper (high-level)
```

---

## Field Display Logic

### Schema Only Mode

For each field, display:
- Field label (with required indicator if applicable)
- Field type badge
- Description (if present)
- Placeholder text (if present)
- Validation rules:
  - Required
  - Min/max length
  - Min/max value
  - Pattern (regex)
  - Custom messages
- Options (for select, radio, etc.)

### Schema + Submission Mode

For each field, display:
- All schema information (as above)
- **Submitted value** (highlighted/formatted)
- Value type indicator
- Empty state if no value submitted

---

## Value Formatting

Different field types formatted differently:

```typescript
// Text fields
INPUT, TEXTAREA, EMAIL -> Display as text with quotes

// Number fields
NUMBER_INPUT, SLIDER -> Display with number formatting

// Boolean fields
CHECKBOX, SWITCH -> Display as Yes/No or ✓/✗

// Select fields
SELECT, RADIO_GROUP, COMBOBOX -> Display selected option label

// Date fields
DATE_PICKER -> Display formatted date

// File fields
FILE_UPLOAD -> Display file name and size

// Arrays
Multiple values -> Display as list
```

---

## Metadata Display

If metadata provided, show:
- Form title and description
- Created date
- Last updated date
- Submission date (if viewing submission)
- Submitted by (if viewing submission)

---

## Responsive Behavior

### Desktop (>= 1024px)
- Side-by-side layout for schema + submission
- Full field details visible
- Page tabs horizontal

### Tablet (768px - 1023px)
- Stacked layout
- Condensed field display
- Scrollable page tabs

### Mobile (< 768px)
- Single column
- Accordion-style pages
- Minimal field info
- Expandable details

---

## ShadcnViewer Wrapper

High-level component with shadcn/ui styling:

```typescript
interface ShadcnViewerProps extends ViewerProps {
  // Additional shadcn-specific features
  theme?: 'light' | 'dark' | 'system'

  // Export functionality
  onExport?: () => void
  showExportButton?: boolean

  // Print functionality
  onPrint?: () => void
  showPrintButton?: boolean
}
```

---

## Helper Functions

### formatFieldValue()

```typescript
function formatFieldValue(
  field: FormField,
  value: any
): string | React.ReactNode
```

Formats submission values based on field type.

### getValidationSummary()

```typescript
function getValidationSummary(
  validation?: FieldValidation
): string[]
```

Returns array of human-readable validation rules.

### getFormStatistics()

```typescript
function getFormStatistics(
  pages: FormPage[]
): {
  totalPages: number
  totalFields: number
  requiredFields: number
  fieldTypes: Record<FieldType, number>
}
```

Returns form statistics for summary view.

---

## Examples in Different Modes

### Detailed Mode Output

```
┌─────────────────────────────────────────┐
│ Contact Form                            │
│ Created: Dec 16, 2025                   │
├─────────────────────────────────────────┤
│                                         │
│ [Page 1: Contact Information]          │
│                                         │
│ Full Name *                             │
│ Type: Text Input                        │
│ Description: Enter your full name      │
│ Validation:                             │
│   • Required                            │
│   • Min length: 2 characters           │
│   • Max length: 100 characters         │
│ Value: "John Doe"                       │
│                                         │
│ Email Address *                         │
│ Type: Email                             │
│ Validation:                             │
│   • Required                            │
│   • Valid email format                 │
│ Value: "john@example.com"              │
│                                         │
│ Message *                               │
│ Type: Textarea                          │
│ Validation:                             │
│   • Required                            │
│   • Min length: 10 characters          │
│ Value: "Hello, I would like..."        │
│                                         │
└─────────────────────────────────────────┘
```

### Compact Mode Output

```
Contact Form | 3 fields | 3 required
─────────────────────────────────────
Full Name * [Text] | Value: "John Doe"
  • Required • Min: 2 • Max: 100

Email Address * [Email] | Value: "john@example.com"
  • Required • Valid email

Message * [Textarea] | Value: "Hello, I would..."
  • Required • Min: 10 chars
```

### Summary Mode Output

```
┌──────────────────────────────────┐
│ Contact Form                     │
├──────────────────────────────────┤
│ Pages: 1                         │
│ Total Fields: 3                  │
│ Required Fields: 3               │
│                                  │
│ Field Types:                     │
│   • Text Input: 1                │
│   • Email: 1                     │
│   • Textarea: 1                  │
│                                  │
│ Submission Date: Dec 16, 2025    │
└──────────────────────────────────┘
```

---

## Benefits of This Design

1. **Flexible** - Multiple view modes for different use cases
2. **Read-Only** - Safe for displaying sensitive schemas
3. **Type-Safe** - Full TypeScript support
4. **Composable** - Can be used standalone or in dashboards
5. **Accessible** - Proper semantic HTML and ARIA labels
6. **Responsive** - Works on all screen sizes

---

## Implementation Plan

1. ✅ Design API (this document)
2. Create types.ts
3. Create utils.ts with helper functions
4. Create field-display.tsx
5. Create submission-display.tsx
6. Create detailed-view.tsx
7. Create compact-view.tsx
8. Create summary-view.tsx
9. Create main viewer.tsx
10. Create shadcn-viewer.tsx wrapper
11. Export from index.ts
12. Create demo page
13. Test all view modes

---

**Status:** Design Complete - Ready for Implementation
**Next Step:** Create folder structure and begin implementation
