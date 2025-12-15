# Shorms Integration Guide for LLM Agents

This guide is specifically designed for LLM agents (AI coding assistants) to understand how to integrate Shorms form schemas into Next.js/React projects.

## What is Shorms?

Shorms is a local-first, multi-page form builder that generates:
- **JSON schemas** describing form structure and validation
- **React components** with built-in validation using Zod and React Hook Form
- **shadcn/ui-based** UI components for consistent styling
- Its built as a simple/native alternative for SurveyJS

## Quick Start: Integration Checklist

When a user asks you to integrate a Shorms form into their project:

1. ✅ Check if they have the required dependencies
2. ✅ Import or create the form schema JSON
3. ✅ Generate or copy the React component code
4. ✅ Add the component to their desired page/route
5. ✅ Handle form submission
6. ✅ Test the form

---

## Understanding the JSON Schema

### Schema Structure

```json
[
  {
    "id": "page_unique_id",
    "title": "Page Name (optional)",
    "fields": [
      {
        "id": "field_unique_id",
        "type": "FIELD_TYPE",
        "name": "field_name",
        "label": "Field Label",
        "description": "Optional description",
        "placeholder": "Placeholder text",
        "validation": {
          "required": true,
          "min": 3,
          "max": 100,
          "regex": "^[A-Za-z]+$",
          "errorMessage": "Custom error message",
          "maxFileSize": 5
        }
      }
    ]
  }
]
```

### Field Types

 | Type           | Description         | Validation Options                 |
 | ------         | -------------       | -------------------                |
 | `INPUT`        | Single-line text    | min/max length, regex, required    |
 | `TEXTAREA`     | Multi-line text     | min/max length, regex, required    |
 | `EMAIL`        | Email input         | required, custom error             |
 | `NUMBER_INPUT` | Numeric input       | min/max value, required            |
 | `SELECT`       | Dropdown select     | required, choices array            |
 | `RADIO_GROUP`  | Radio buttons       | required, choices array            |
 | `CHECKBOX`     | Single checkbox     | -                                  |
 | `SWITCH`       | Toggle switch       | -                                  |
 | `COMBOBOX`     | Searchable dropdown | choices array                      |
 | `SLIDER`       | Range slider        | min, max, step values              |
 | `DATE`         | Date picker         | required                           |
 | `FILE_UPLOAD`  | File input          | maxFileSize (MB), accept, multiple |

### Validation Object

```typescript
validation?: {
  required?: boolean           // Mark field as required
  min?: number                // For text: min length, For numbers: min value
  max?: number                // For text: max length, For numbers: max value
  regex?: string              // Regex pattern (text fields only)
  errorMessage?: string       // Custom error message
  maxFileSize?: number        // Max file size in MB (file uploads only)
}
```

---

## Integration Methods

### Method 1: Using JSON Schema Directly

**When to use:** You want to build forms dynamically from JSON at runtime.

```typescript
import { FormRunner } from '@/components/form-runner'
import formSchema from '@/data/my-form-schema.json'

export default function MyFormPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <FormRunner
        schema={formSchema}
        onSubmit={(data) => {
          console.log('Form submitted:', data)
          // Handle form submission
        }}
      />
    </div>
  )
}
```

### Method 2: Using Generated Code

**When to use:** You want a static form component with full control.

1. **Export the form from Shorms Builder**
2. **Copy the generated React component code**
3. **Create a new component file** (e.g., `components/contact-form.tsx`)
4. **Paste the generated code**
5. **Customize the onSubmit handler**

```typescript
// components/contact-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
// ... other imports

const formSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000)
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement your submission logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields go here */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## Required Dependencies

Ensure the target project has these dependencies installed:

```json
{
  "dependencies": {
    "react-hook-form": "^7.53.1",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.23.8",
    "@radix-ui/react-*": "^1.0.0+",
    "lucide-react": "^0.400.0+",
    "next": "14.0.0+"
  }
}
```

### shadcn/ui Components

The form will require specific shadcn/ui components based on field types used. Check the `registryDependencies` array in each field to see what's needed.

**Common components:**
```bash
npx shadcn-ui@latest add form input label button
npx shadcn-ui@latest add textarea select checkbox switch
npx shadcn-ui@latest add radio-group slider calendar
```

---

## Handling Form Submissions

### Basic Submission

```typescript
function onSubmit(values: z.infer<typeof formSchema>) {
  console.log('Form data:', values)

  // Show success message
  alert('Form submitted successfully!')
}
```

### API Submission

```typescript
async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })

    if (!response.ok) throw new Error('Submission failed')

    const result = await response.json()
    console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### With Loading State

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsSubmitting(true)
  try {
    await submitToAPI(values)
    // Show success toast
  } catch (error) {
    // Show error toast
  } finally {
    setIsSubmitting(false)
  }
}

// In JSX:
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

---

## Multi-Page Forms

### Using FormRunner (Recommended)

The `FormRunner` component handles multi-page navigation automatically:

```typescript
import { FormRunner } from '@/components/form-runner'

export default function RegistrationPage() {
  return (
    <FormRunner
      schema={multiPageSchema}
      onSubmit={async (data) => {
        // All pages are validated and combined here
        await registerUser(data)
      }}
    />
  )
}
```

**Features:**
- Automatic page navigation (Previous/Next/Submit buttons)
- Per-page validation
- Progress indicator
- Combined data from all pages on final submit

### Manual Implementation

If you need custom multi-page logic:

```typescript
const [currentPage, setCurrentPage] = useState(0)

const form = useForm({
  resolver: zodResolver(generateZodSchema(schema[currentPage].fields))
})

async function handleNext() {
  const isValid = await form.trigger()
  if (isValid) {
    setCurrentPage(prev => prev + 1)
  }
}

function handlePrevious() {
  setCurrentPage(prev => prev - 1)
}
```

---

## File Upload Handling

When forms include `FILE_UPLOAD` fields:

### Client-Side

```typescript
// The form will receive File objects
function onSubmit(values: z.infer<typeof formSchema>) {
  const file = values.file_field as File
  console.log('File:', file.name, file.size, file.type)

  // Create FormData for upload
  const formData = new FormData()
  formData.append('file', file)

  // Upload to your API
  await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
}
```

### Server-Side (Next.js API Route)

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // Process the file
  // Save to storage, cloud, etc.

  return NextResponse.json({ success: true })
}
```

---

## Validation Error Handling

### Default Error Display

Shorms forms automatically display validation errors below each field.

### Custom Error Messages

```typescript
// In the schema:
{
  "validation": {
    "required": true,
    "min": 8,
    "errorMessage": "Password must be at least 8 characters long"
  }
}
```

### Programmatic Error Setting

```typescript
// Set server-side errors after submission
if (emailExists) {
  form.setError('email', {
    type: 'manual',
    message: 'This email is already registered'
  })
}
```

---

## Common Integration Patterns

### Pattern 1: Contact Form

```typescript
// pages/contact.tsx
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <ContactForm />
    </div>
  )
}
```

### Pattern 2: Modal/Dialog Form

```typescript
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FormRunner } from '@/components/form-runner'

export function AddUserDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <FormRunner
          schema={userFormSchema}
          onSubmit={async (data) => {
            await addUser(data)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
```

### Pattern 3: Form with Success/Error States

```typescript
const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

async function onSubmit(values) {
  try {
    await submitForm(values)
    setStatus('success')
  } catch (error) {
    setStatus('error')
  }
}

if (status === 'success') {
  return <div>Thank you! Your form has been submitted.</div>
}

if (status === 'error') {
  return <div>Sorry, something went wrong. Please try again.</div>
}

return <FormRunner schema={schema} onSubmit={onSubmit} />
```

---

## TypeScript Type Generation

Generate TypeScript types from your schema:

```typescript
import { z } from 'zod'
import { generateZodSchema } from '@/lib/form-schema'
import schema from '@/data/form-schema.json'

// Generate Zod schema
const zodSchema = generateZodSchema(schema[0].fields)

// Infer TypeScript type
type FormData = z.infer<typeof zodSchema>

// Use in your functions
async function processForm(data: FormData) {
  // data is fully typed
  console.log(data.email, data.full_name)
}
```

---

## Testing Forms

### Example Test (Jest + React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from '@/components/contact-form'

test('submits form with valid data', async () => {
  const mockSubmit = jest.fn()
  render(<ContactForm onSubmit={mockSubmit} />)

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  })

  fireEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      // ... other fields
    })
  })
})
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load form for better initial page load
import dynamic from 'next/dynamic'

const ContactForm = dynamic(() => import('@/components/contact-form'), {
  loading: () => <div>Loading form...</div>
})
```

### Memoization

```typescript
import { useMemo } from 'react'

function MyFormPage() {
  const schema = useMemo(() => require('@/data/form.json'), [])

  return <FormRunner schema={schema} onSubmit={handleSubmit} />
}
```

---

## Troubleshooting

### "Component X not found"

**Solution:** Install missing shadcn/ui components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Validation not working

**Solution:** Ensure `zodResolver` is configured:
```typescript
const form = useForm({
  resolver: zodResolver(formSchema), // Don't forget this!
})
```

### TypeScript errors on generated code

**Solution:** Ensure all dependencies are installed and types are available:
```bash
npm install @types/react @types/react-dom
```

---

## Best Practices

1. **Always validate on the server** - Client-side validation is for UX, not security
2. **Use environment variables** for API endpoints
3. **Handle loading and error states** - Provide feedback to users
4. **Sanitize inputs** before displaying or storing
5. **Test forms thoroughly** - Especially validation rules
6. **Use TypeScript** - Leverage type inference from Zod schemas
7. **Version your schemas** - If forms change over time
8. **Document custom validations** - Especially regex patterns

---

## Example Workflow for LLM Agents

When a user asks: "Add a contact form to my Next.js app"

1. **Determine requirements:** Ask about fields needed, validation rules
2. **Use example schema:** Start with `examples/contact-form.json` as a template
3. **Check dependencies:** Verify react-hook-form, zod, shadcn/ui are installed
4. **Generate component:** Create a new file with the form component
5. **Add submission handler:** Implement the onSubmit function
6. **Integrate into page:** Add the form to the appropriate route
7. **Test:** Verify the form renders and submits correctly

---

## Additional Resources

- **Example Forms:** See `/examples` directory for ready-to-use schemas
- **Form Runner Component:** `/components/form-runner.tsx`
- **Schema Generator:** `/lib/form-schema.ts`
- **Validation Logic:** `/lib/form-schema.ts` - `generateZodSchema` function

---

## Quick Reference: Field Type Mapping

```typescript
// Schema → React Component
{
  "type": "INPUT"        → <Input />
  "type": "TEXTAREA"     → <Textarea />
  "type": "EMAIL"        → <Input type="email" />
  "type": "NUMBER_INPUT" → <Input type="number" />
  "type": "SELECT"       → <Select />
  "type": "RADIO_GROUP"  → <RadioGroup />
  "type": "CHECKBOX"     → <Checkbox />
  "type": "SWITCH"       → <Switch />
  "type": "COMBOBOX"     → <Combobox />
  "type": "SLIDER"       → <Slider />
  "type": "DATE"         → <DatePicker />
  "type": "FILE_UPLOAD"  → <Input type="file" />
}
```

---

**Last Updated:** December 2025
**Shorms Version:** 0.1.0
