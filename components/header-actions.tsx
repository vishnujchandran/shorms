"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import { Download, Trash2, Upload } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FormPreviewDialog } from "@/components/form-preview-dialog"

import { FormPage } from "@/types/form-store"

export function HeaderActions() {
  const { toast } = useToast()
  const pages = useFormStore((state) => state.pages)
  const setPages = useFormStore((state) => state.setPages)
  const clearFormFields = useFormStore((state) => state.clearFormFields)
  const setActivePage = useFormStore((state) => state.setActivePage)

  const [importOpen, setImportOpen] = React.useState(false)
  const [importJson, setImportJson] = React.useState("")

  const handleExport = () => {
    const dataStr = JSON.stringify(pages, null, 2)
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "shorms-schema.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      description: "Schema exported successfully!",
    })
  }

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson)

      // Basic validation
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid schema: Root must be an array of pages")
      }

      if (parsed.length > 0 && !parsed[0].id) {
        throw new Error("Invalid schema: Pages must have IDs")
      }

      setPages(parsed as FormPage[])
      if (parsed.length > 0) {
        setActivePage(parsed[0].id)
      }

      setImportOpen(false)
      setImportJson("")
      toast({
        description: "Schema imported successfully!",
      })
    } catch (e) {
      toast({
        title: "Import Failed",
        description: (e as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <FormPreviewDialog />

      <Button
        size="sm"
        variant="outline"
        onClick={clearFormFields}
        title="Clear Form"
      >
        <Trash2 className="mr-2 size-4" />
        Clear
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleExport}
        title="Export Schema"
      >
        <Download className="mr-2 size-4" />
        Export
      </Button>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" title="Import Schema">
            <Upload className="mr-2 size-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Schema</DialogTitle>
            <DialogDescription>
              Paste your Shorms JSON schema here. This will overwrite current
              form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              className="min-h-[200px] font-mono text-xs"
              placeholder='[ { "id": "page-1", "fields": [...] } ]'
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleImport}>Import Schema</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
