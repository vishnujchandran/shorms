'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UsingLibraryPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Using Shorms Library</h1>
          <p className="mt-2 text-muted-foreground">
            This page demonstrates the extracted Shorms library components
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Main App</Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Renderer Demo */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Renderer Component</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            ✅ Phase 1 Complete - Production Ready
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Display forms with validation and multi-page support
          </p>
          <Link href="/using-library/renderer-demo">
            <Button>View Renderer Demo</Button>
          </Link>
        </div>

        {/* Builder Demo */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Builder Component</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            ✅ Phase 2 Complete - Production Ready
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Create and edit forms with drag-and-drop
          </p>
          <Link href="/using-library/builder-demo">
            <Button>View Builder Demo</Button>
          </Link>
        </div>

        {/* Viewer Demo */}
        <div className="rounded-lg border p-6 bg-green-50">
          <h2 className="mb-4 text-xl font-semibold">Viewer Component</h2>
          <p className="mb-4 text-sm text-green-700 font-medium">
            ✅ Phase 3 Complete - Production Ready
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Read-only display for schemas and submissions
          </p>
          <Link href="/using-library/viewer-demo">
            <Button>View Viewer Demo</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Comparison</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Main App (/):</strong> Uses tightly-coupled Zustand store
            with FormEditor component
          </p>
          <p>
            <strong>Library Route (/using-library):</strong> Uses extracted,
            standalone components with controlled state
          </p>
        </div>
      </div>
    </div>
  )
}
