'use client'

import { ShadcnRenderer } from '@/components/shorms/shadcn-renderer'
import { Button } from '@/components/ui/button'
import { formPagesToSchema } from '@/lib/schema-adapter'
import Link from 'next/link'
import { useState } from 'react'

// Example form schema
const examplePages = [
  {
    id: 'page1',
    title: 'Personal Info',
    fields: [
      {
        id: 'field1',
        type: 'INPUT',
        label: 'Full Name',
        name: 'fullName',
        placeholder: 'John Doe',
        required: true,
      },
      {
        id: 'field2',
        type: 'EMAIL',
        label: 'Email Address',
        name: 'email',
        placeholder: 'john@example.com',
        required: true,
      },
    ],
  },
  {
    id: 'page2',
    title: 'Preferences',
    fields: [
      {
        id: 'field3',
        type: 'TEXTAREA',
        label: 'Tell us about yourself',
        name: 'bio',
        placeholder: 'Share your story...',
        validation: { minLength: 50 },
      },
    ],
  },
]

export default function RendererDemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  const schema = formPagesToSchema(examplePages as any)

  const handleSubmit = (data: any) => {
    setFormData(data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container mx-auto p-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold">Form Submitted! ✅</h2>
          <pre className="rounded-lg bg-muted p-4 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
          <div className="mt-4 flex gap-4">
            <Button onClick={() => setSubmitted(false)}>Submit Again</Button>
            <Link href="/using-library">
              <Button variant="outline">Back to Library</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Renderer Demo</h1>
          <p className="text-sm text-muted-foreground">
            Using the extracted ShadcnRenderer component
          </p>
        </div>
        <Link href="/using-library">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl rounded-lg border p-6">
        <ShadcnRenderer schema={schema} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
