'use client'

import { ShadcnBuilder } from '@/components/shorms/shadcn-builder'
import { useBuilderState } from '@/components/shorms/builder'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function BuilderDemoPage() {
  const builder = useBuilderState()

  const handleSave = () => {
    console.log('Saving form...', builder.pages)
    toast({
      title: 'Form Saved!',
      description: `Saved ${builder.pages.length} pages with ${builder.pages.reduce((acc, p) => acc + p.fields.length, 0)} total fields`,
    })
  }

  const handleExport = () => {
    const json = JSON.stringify(builder.pages, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'form-schema.json'
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: 'Exported!',
      description: 'Form schema downloaded as JSON',
    })
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Builder Demo</h1>
          <p className="text-sm text-muted-foreground">
            Using the extracted Builder component (library mode)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
          <Link href="/using-library">
            <Button variant="ghost" size="sm">
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Builder */}
      <div className="flex-1 overflow-hidden">
        <ShadcnBuilder
          pages={builder.pages}
          activePageId={builder.activePageId}
          onPagesChange={builder.setPages}
          onActivePageChange={builder.setActivePageId}
          onPageAdd={builder.addPage}
          onPageDelete={builder.deletePage}
          onPageRename={builder.updatePageTitle}
          onPageReorder={builder.reorderPages}
          onFieldAdd={builder.addField}
          onFieldUpdate={builder.updateField}
          onFieldDelete={builder.deleteField}
          onFieldReorder={builder.reorderFields}
          width="full"
        />
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {builder.pages.length} {builder.pages.length === 1 ? 'page' : 'pages'} •{' '}
            {builder.pages.reduce((acc, p) => acc + p.fields.length, 0)} total fields
          </span>
          <span>Library Mode - No Zustand Required</span>
        </div>
      </div>
    </div>
  )
}
