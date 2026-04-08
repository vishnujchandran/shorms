import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Field, type FieldProps } from "./field"

export const SortableField = React.memo(({ formField, form, onDelete, onEdit }: FieldProps) => {
  const sortableId = formField.id || formField.name

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <Field
      formField={formField}
      form={form}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      onDelete={onDelete}
      onEdit={onEdit}
      dragHandleRef={setActivatorNodeRef}
      dragHandleAttributes={attributes}
      dragHandleListeners={listeners}
    />
  )
})

SortableField.displayName = "SortableField"
