"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useShallow } from "zustand/shallow"

import { generateDefaultValues, generateZodSchema } from "@/lib/form-schema"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Field } from "@/components/field"
import { SortableField } from "@/components/sortable-field"

import { FormField } from "@/types/field"
import { FormState } from "@/types/form-store"

const selector = (state: FormState) => ({
  pages: state.pages,
  activePageId: state.activePageId,
  setPages: state.setPages,
  setActivePage: state.setActivePage,
  addPage: state.addPage,
  deletePage: state.deletePage,
  updatePageTitle: state.updatePageTitle,
})

export function FormEditor() {
  const [activeFormField, setActiveFormField] =
    React.useState<FormField | null>(null)

  const {
    pages,
    activePageId,
    setPages,
    setActivePage,
    addPage,
    deletePage,
    updatePageTitle,
  } = useFormStore(useShallow(selector))

  const activePage = React.useMemo(
    () => pages.find((p) => p.id === activePageId) || pages[0],
    [pages, activePageId]
  )

  const currentFields = React.useMemo(
    () => activePage?.fields || [],
    [activePage]
  )

  const formSchema = React.useMemo(
    () => generateZodSchema(currentFields),
    [currentFields]
  )
  const defaultValues = React.useMemo(
    () => generateDefaultValues(currentFields),
    [currentFields]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4">
          <code className="overflow-auto text-white">
            {JSON.stringify(values, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id && activePage) {
      const oldIndex = currentFields.findIndex(
        (field) => field.name === active.id
      )
      const newIndex = currentFields.findIndex(
        (field) => field.name === over.id
      )

      const newFields = arrayMove(currentFields, oldIndex, newIndex)

      const newPages = pages.map((p) => {
        if (p.id === activePage.id) {
          return { ...p, fields: newFields }
        }
        return p
      })

      setPages(newPages)
    }
    setActiveFormField(null)
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const formField = currentFields.find((field) => field.name === active.id)
    if (formField) {
      setActiveFormField(formField)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b p-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted/50",
              activePageId === page.id && "bg-muted font-medium"
            )}
            onClick={() => setActivePage(page.id)}
          >
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <span className="max-w-[100px] cursor-text truncate hover:underline">
                  {page.title || `Page ${index + 1}`}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2">
                <Input
                  value={page.title || ""}
                  placeholder={`Page ${index + 1}`}
                  onChange={(e) => updatePageTitle(page.id, e.target.value)}
                />
              </PopoverContent>
            </Popover>

            {pages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  deletePage(page.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addPage}>
          <Plus className="mr-2 h-4 w-4" />
          Add Page
        </Button>
      </div>

      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {currentFields.length !== 0 ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto flex w-3/4 flex-col gap-6 p-4"
            >
              <SortableContext
                items={currentFields.map((formField) => formField.name)}
                strategy={verticalListSortingStrategy}
              >
                {currentFields.map((formField) => (
                  <SortableField
                    formField={formField}
                    form={form}
                    key={formField.name}
                  />
                ))}
              </SortableContext>
              <DragOverlay className="bg-background">
                {activeFormField ? (
                  <Field formField={activeFormField} />
                ) : (
                  <></>
                )}
              </DragOverlay>
              <Button type="submit">Submit (Current Page)</Button>
            </form>
          </Form>
        ) : (
          <div className="grid place-items-center p-12">
            <h3 className="text-2xl font-semibold">No Fields on this page</h3>
            <p className="text-muted-foreground">
              Select fields from the sidebar...
            </p>
          </div>
        )}
      </DndContext>
    </div>
  )
}
