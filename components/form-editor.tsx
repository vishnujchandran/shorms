"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useShallow } from "zustand/shallow"

import { generateDefaultValues, generateZodSchema } from "@/lib/form-schema"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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

interface SortablePageTabProps {
  page: { id: string; title?: string; fields: FormField[] }
  index: number
  isActive: boolean
  canDelete: boolean
  onSelect: () => void
  onDelete: () => void
  onRename: (title: string) => void
}

function SortablePageTab({
  page,
  index,
  isActive,
  canDelete,
  onSelect,
  onDelete,
  onRename,
}: SortablePageTabProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id })
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(page.title || "")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSave = () => {
    if (editValue.trim()) {
      onRename(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditValue(page.title || "")
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all hover:bg-accent hover:shadow",
        isActive && "border-primary bg-primary/5 font-semibold shadow"
      )}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="min-w-[60px] max-w-[120px] bg-transparent px-1 outline-none"
        />
      ) : (
        <span
          className="max-w-[120px] truncate"
          onDoubleClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          {page.title || `Page ${index + 1}`}
        </span>
      )}

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 h-4 w-4 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

export function FormEditor() {
  const [isMounted, setIsMounted] = React.useState(false)
  const [activeFormField, setActiveFormField] =
    React.useState<FormField | null>(null)
  const [activePageDragId, setActivePageDragId] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

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

  const handlePageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id)
      const newIndex = pages.findIndex((p) => p.id === over.id)
      const newPages = arrayMove(pages, oldIndex, newIndex)
      setPages(newPages)
    }
    setActivePageDragId(null)
  }

  const handlePageDragStart = (event: DragStartEvent) => {
    setActivePageDragId(event.active.id as string)
  }

  return (
    <div className="flex h-full min-h-[600px] flex-col">
      {/* Page Tabs */}
      {isMounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handlePageDragEnd}
          onDragStart={handlePageDragStart}
        >
          <div className="flex items-center gap-2 overflow-x-auto border-b bg-muted/30 p-3">
            <SortableContext
              items={pages.map((p) => p.id)}
              strategy={horizontalListSortingStrategy}
            >
              {pages.map((page, index) => (
                <SortablePageTab
                  key={page.id}
                  page={page}
                  index={index}
                  isActive={activePageId === page.id}
                  canDelete={pages.length > 1}
                  onSelect={() => setActivePage(page.id)}
                  onDelete={() => deletePage(page.id)}
                  onRename={(title) => updatePageTitle(page.id, title)}
                />
              ))}
            </SortableContext>
            <Button variant="outline" size="sm" onClick={addPage} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
          <DragOverlay>
            {activePageDragId && (
              <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1.5 text-sm opacity-80 shadow-lg">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <span>
                  {pages.find((p) => p.id === activePageDragId)?.title ||
                    `Page ${pages.findIndex((p) => p.id === activePageDragId) + 1}`}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto border-b p-2">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-sm hover:bg-muted/50",
                activePageId === page.id && "bg-muted font-medium"
              )}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
              <span className="max-w-[120px] truncate">
                {page.title || `Page ${index + 1}`}
              </span>
            </div>
          ))}
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Page
          </Button>
        </div>
      )}

      {isMounted ? (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          {currentFields.length !== 0 ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8"
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
                <Button type="submit" size="lg" className="mt-2">
                  Submit Form
                </Button>
              </form>
            </Form>
          ) : (
            <div className="grid place-items-center py-20">
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No fields yet</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Get started by selecting field types from the sidebar to build your form
                </p>
              </div>
            </div>
          )}
        </DndContext>
      ) : (
        currentFields.length !== 0 ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8"
            >
              {currentFields.map((formField) => (
                <Field formField={formField} key={formField.name} />
              ))}
              <Button type="submit" size="lg" className="mt-2">
                Submit Form
              </Button>
            </form>
          </Form>
        ) : (
          <div className="grid place-items-center py-20">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No fields yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Get started by selecting field types from the sidebar to build your form
              </p>
            </div>
          </div>
        )
      )}
    </div>
  )
}
