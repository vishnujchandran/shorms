'use client'

import * as React from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FilePlus, GripVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FieldCommandPalette } from '@/components/field-command-palette'
import { cn } from '@/lib/utils'

import type { FormPage, PageTabsProps } from './types'

interface SortablePageTabProps {
  page: FormPage
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
  const [editValue, setEditValue] = React.useState(page.title || '')
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
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(page.title || '')
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-all hover:bg-accent/50 hover:shadow-md',
        isActive &&
          'border-primary bg-primary/10 font-semibold shadow-md ring-1 ring-primary/20'
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

/**
 * Page tabs component for managing form pages
 * Supports drag-drop reordering and inline editing
 */
export function PageTabs({
  pages,
  activePageId,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageRename,
  onPageReorder,
  dragDropEnabled = true,
  showCommandPalette = false,
  showLeftSidebar = false,
  className,
  renderCommandPalette,
}: PageTabsProps) {
  const [isMounted, setIsMounted] = React.useState(false)
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

  const handlePageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && onPageReorder) {
      const oldIndex = pages.findIndex((p) => p.id === active.id)
      const newIndex = pages.findIndex((p) => p.id === over.id)
      const newPages = arrayMove(pages, oldIndex, newIndex)
      onPageReorder(newPages)
    }
    setActivePageDragId(null)
  }

  const handlePageDragStart = (event: DragStartEvent) => {
    setActivePageDragId(event.active.id as string)
  }

  const TabContent = () => (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto md:gap-3">
      {pages.map((page, index) => (
        <SortablePageTab
          key={page.id}
          page={page}
          index={index}
          isActive={activePageId === page.id}
          canDelete={pages.length > 1}
          onSelect={() => onPageSelect(page.id)}
          onDelete={() => onPageDelete?.(page.id)}
          onRename={(title) => onPageRename?.(page.id, title)}
        />
      ))}
    </div>
  )

  if (!isMounted || !dragDropEnabled) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2.5 md:gap-3 md:px-4 md:py-3',
          className
        )}
      >
        {!showLeftSidebar && showCommandPalette && (
          <>
            {renderCommandPalette ? renderCommandPalette() : <FieldCommandPalette />}
            <div className="h-6 w-px bg-border" />
          </>
        )}
        <TabContent />
        <div className="h-6 w-px bg-border" />
        {onPageAdd && (
          <Button
            variant="outline"
            size="icon"
            onClick={onPageAdd}
            className="shrink-0"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handlePageDragEnd}
      onDragStart={handlePageDragStart}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2.5 md:gap-3 md:px-4 md:py-3',
          className
        )}
      >
        {!showLeftSidebar && showCommandPalette && (
          <>
            {renderCommandPalette ? renderCommandPalette() : <FieldCommandPalette />}
            <div className="h-6 w-px bg-border" />
          </>
        )}
        <SortableContext
          items={pages.map((p) => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          <TabContent />
        </SortableContext>
        <div className="h-6 w-px bg-border" />
        {onPageAdd && (
          <Button
            variant="outline"
            size="icon"
            onClick={onPageAdd}
            className="shrink-0"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        )}
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
  )
}
