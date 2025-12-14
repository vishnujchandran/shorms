"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FormRunner } from "@/components/form-runner"

export function FormPreviewDialog() {
  const [open, setOpen] = React.useState(false)
  const pages = useFormStore((state) => state.pages)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="gap-2">
          <Play className="size-4" />
          Run Form
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-w-3xl flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Form Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6 pt-2">
          <FormRunner schema={pages} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
