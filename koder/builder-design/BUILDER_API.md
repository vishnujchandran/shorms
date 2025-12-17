# Builder API Design v1.0.0
**Date:** 2025-12-16
**Philosophy:** Controlled component pattern - state is managed externally, Builder is a pure UI component

---

## Design Principles

1. **Controlled Component** - All state passed via props, changes via callbacks
2. **No Internal State Management** - No Zustand, Redux, or other global state
3. **Composable** - Can be used standalone or composed with other components
4. **Framework Agnostic Logic** - Core logic separate from React-specific code
5. **Drag-and-Drop Support** - Built-in support for field and page reordering
6. **TypeScript First** - Full type safety for all APIs

---

## Core Types

```typescript
// Form data structure (same as current app)
interface FormPage {
  id: string
  title?: string
  fields: FormField[]
}

interface FormField {
  id: string
  type: string
  name: string
  label: string
  placeholder?: string
  description?: string
  validation?: FieldValidation
  options?: FieldOption[]
  config?: Record<string, any>
}

// Builder state (controlled from outside)
interface BuilderState {
  pages: FormPage[]
  activePageId: string
}

// Field template for field library
interface FieldTemplate {
  type: string
  name: string
  label: string
  description?: string
  Icon: React.ComponentType<{ className?: string }>
  defaultConfig?: Partial<FormField>
}
```

---

## Main Builder Component

### Props

```typescript
interface BuilderProps {
  // Required: Controlled state
  pages: FormPage[]
  activePageId: string

  // Required: State change callbacks
  onPagesChange: (pages: FormPage[]) => void
  onActivePageChange: (pageId: string) => void

  // Optional: Page operations callbacks
  onPageAdd?: () => void
  onPageDelete?: (pageId: string) => void
  onPageRename?: (pageId: string, title: string) => void
  onPageReorder?: (pages: FormPage[]) => void

  // Optional: Field operations callbacks
  onFieldAdd?: (field: FormField) => void
  onFieldUpdate?: (fieldId: string, updates: Partial<FormField>) => void
  onFieldDelete?: (fieldId: string) => void
  onFieldReorder?: (pageId: string, fields: FormField[]) => void

  // Optional: UI configuration
  width?: "sm" | "md" | "lg" | "xl" | "full" | number
  showFieldLibrary?: boolean  // default: true for width >= 1024px
  showFormContext?: boolean   // default: true for width >= 1536px
  fieldTemplates?: FieldTemplate[]  // default: built-in fields

  // Optional: Feature flags
  features?: {
    dragDrop?: boolean        // default: true
    pageManagement?: boolean  // default: true
    fieldSearch?: boolean     // default: true
    commandPalette?: boolean  // default: true
  }

  // Optional: Styling
  className?: string
}
```

### Usage Example

```typescript
function App() {
  const [pages, setPages] = useState<FormPage[]>([
    { id: 'page1', title: 'Contact', fields: [] }
  ])
  const [activePageId, setActivePageId] = useState('page1')

  const handleFieldAdd = (field: FormField) => {
    setPages(pages.map(page =>
      page.id === activePageId
        ? { ...page, fields: [...page.fields, field] }
        : page
    ))
  }

  return (
    <Builder
      pages={pages}
      activePageId={activePageId}
      onPagesChange={setPages}
      onActivePageChange={setActivePageId}
      onFieldAdd={handleFieldAdd}
      width="lg"
    />
  )
}
```

---

## Field Library Component

### Props

```typescript
interface FieldLibraryProps {
  // Field templates to display
  fieldTemplates: FieldTemplate[]

  // Callback when field is selected
  onFieldSelect: (template: FieldTemplate) => void

  // Optional: Search configuration
  searchPlaceholder?: string
  showSearch?: boolean

  // Optional: Styling
  className?: string
  width?: number  // default: 280px
}
```

### Default Field Templates

```typescript
const defaultFieldTemplates: FieldTemplate[] = [
  {
    type: 'INPUT',
    name: 'Text Input',
    label: 'Text Input',
    description: 'Single line text field',
    Icon: Type,
    defaultConfig: {
      placeholder: 'Enter text...',
    }
  },
  // ... more templates
]
```

---

## Form Context Component

### Props

```typescript
interface FormContextProps {
  // Data to display
  pages: FormPage[]
  activePageId: string

  // Optional: Styling
  className?: string
  width?: number  // default: 380px

  // Optional: Custom sections
  sections?: {
    statistics?: boolean    // default: true
    currentPage?: boolean   // default: true
    tips?: boolean          // default: true
  }
}
```

---

## ShadcnBuilder Wrapper

High-level component that integrates everything with shadcn/ui styling.

### Props

```typescript
interface ShadcnBuilderProps extends BuilderProps {
  // Additional shadcn-specific features
  theme?: 'light' | 'dark' | 'system'

  // Field editing
  onFieldEdit?: (field: FormField) => void
  renderFieldEditor?: (field: FormField, onChange: (updates: Partial<FormField>) => void) => React.ReactNode
}
```

---

## Helper Functions/Hooks

### useBuilderState Hook

```typescript
function useBuilderState(initialPages?: FormPage[]) {
  const [pages, setPages] = useState<FormPage[]>(initialPages || [
    { id: nanoid(), title: 'Page 1', fields: [] }
  ])
  const [activePageId, setActivePageId] = useState(pages[0]?.id)

  // Page operations
  const addPage = useCallback(() => {
    const newPage: FormPage = {
      id: nanoid(),
      title: `Page ${pages.length + 1}`,
      fields: []
    }
    setPages([...pages, newPage])
    setActivePageId(newPage.id)
  }, [pages])

  const deletePage = useCallback((pageId: string) => {
    if (pages.length === 1) return
    const newPages = pages.filter(p => p.id !== pageId)
    setPages(newPages)
    if (activePageId === pageId) {
      setActivePageId(newPages[0].id)
    }
  }, [pages, activePageId])

  const updatePageTitle = useCallback((pageId: string, title: string) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, title } : p))
  }, [pages])

  const reorderPages = useCallback((newPages: FormPage[]) => {
    setPages(newPages)
  }, [])

  // Field operations
  const addField = useCallback((field: FormField) => {
    setPages(pages.map(page =>
      page.id === activePageId
        ? { ...page, fields: [...page.fields, field] }
        : page
    ))
  }, [pages, activePageId])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setPages(pages.map(page => ({
      ...page,
      fields: page.fields.map(f =>
        f.id === fieldId ? { ...f, ...updates } : f
      )
    })))
  }, [pages])

  const deleteField = useCallback((fieldId: string) => {
    setPages(pages.map(page => ({
      ...page,
      fields: page.fields.filter(f => f.id !== fieldId)
    })))
  }, [pages])

  const reorderFields = useCallback((pageId: string, newFields: FormField[]) => {
    setPages(pages.map(page =>
      page.id === pageId ? { ...page, fields: newFields } : page
    ))
  }, [pages])

  return {
    // State
    pages,
    activePageId,
    setPages,
    setActivePageId,

    // Page operations
    addPage,
    deletePage,
    updatePageTitle,
    reorderPages,

    // Field operations
    addField,
    updateField,
    deleteField,
    reorderFields,
  }
}
```

### Usage with Hook

```typescript
function App() {
  const builder = useBuilderState()

  return (
    <Builder
      pages={builder.pages}
      activePageId={builder.activePageId}
      onPagesChange={builder.setPages}
      onActivePageChange={builder.setActivePageId}
      onPageAdd={builder.addPage}
      onPageDelete={builder.deletePage}
      onPageRename={builder.updatePageTitle}
      onFieldAdd={builder.addField}
      onFieldUpdate={builder.updateField}
      onFieldDelete={builder.deleteField}
    />
  )
}
```

---

## File Structure

```
components/shorms/builder/
├── builder.tsx              # Core Builder component (controlled)
├── field-library.tsx        # Field library sidebar
├── form-context.tsx         # Form context sidebar
├── page-tabs.tsx            # Page management UI
├── field-list.tsx           # Field list with drag-drop
├── types.ts                 # TypeScript types
├── use-builder-state.ts    # State management hook
├── constants.ts             # Default field templates
└── index.ts                 # Public exports

components/shorms/
└── shadcn-builder.tsx       # Shadcn wrapper (high-level)
```

---

## Migration Path

### Current App (Zustand-based)

```typescript
// app/page.tsx
function HomePage() {
  return <FormEditor width="full" />
}
```

### New Library-based App

```typescript
// app/using-library/builder-demo/page.tsx
'use client'

import { ShadcnBuilder } from '@/components/shorms/shadcn-builder'
import { useBuilderState } from '@/components/shorms/builder'

function BuilderDemoPage() {
  const builder = useBuilderState()

  const handleSave = () => {
    console.log('Save form:', builder.pages)
    // Could call API, save to localStorage, etc.
  }

  return (
    <div>
      <ShadcnBuilder
        pages={builder.pages}
        activePageId={builder.activePageId}
        onPagesChange={builder.setPages}
        onActivePageChange={builder.setActivePageId}
        onPageAdd={builder.addPage}
        onPageDelete={builder.deletePage}
        onPageRename={builder.updatePageTitle}
        onFieldAdd={builder.addField}
        onFieldUpdate={builder.updateField}
        onFieldDelete={builder.deleteField}
        width="full"
      />
      <Button onClick={handleSave}>Save Form</Button>
    </div>
  )
}
```

---

## Benefits of This Design

1. **No Global State** - Builder doesn't need Zustand or any global state
2. **Reusable** - Can be used in any React app
3. **Testable** - Easy to test with controlled props
4. **Flexible** - Users can manage state however they want (Zustand, Redux, Context, useState)
5. **Composable** - Can mix and match components
6. **Type Safe** - Full TypeScript support

---

## Implementation Plan

1. ✅ Design API (this document)
2. Create `components/shorms/builder/` structure
3. Extract `page-tabs.tsx` from FormEditor
4. Extract `field-list.tsx` from FormEditor
5. Extract `field-library.tsx` from FieldLibrarySidebar
6. Extract `form-context.tsx` from FormContextSidebar
7. Create main `builder.tsx` component
8. Create `use-builder-state.ts` hook
9. Create `shadcn-builder.tsx` wrapper
10. Test in `/using-library/builder-demo`
11. Update main app to use new Builder (optional)
12. Write Playwright tests

---

**Status:** Design Complete - Ready for Implementation
**Next Step:** Create folder structure and begin extraction
