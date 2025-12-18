/**
 * ShadcnViewer Component
 * High-level wrapper with same shell structure as ShadcnRenderer
 */

'use client'

import * as React from 'react'
import type { FormPage } from '@/types/form-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ShadcnViewerProps {
  pages: FormPage[]
  submissionData?: Record<string, any>
  mode?: 'detailed' | 'compact'
  showValidation?: boolean
  showFieldTypes?: boolean
  showPageNavigation?: boolean
  showMetadata?: boolean
  className?: string
  title?: string
  description?: string
}

export function ShadcnViewer({
  pages,
  submissionData,
  mode = 'detailed',
  showValidation = true,
  showFieldTypes = true,
  showPageNavigation = true,
  showMetadata = false,
  className,
  title,
  description,
}: ShadcnViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const currentPage = pages[currentPageIndex]
  const totalPages = pages.length

  const canGoPrevious = currentPageIndex > 0
  const canGoNext = currentPageIndex < totalPages - 1
  const isLastPage = currentPageIndex === totalPages - 1

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentPageIndex(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      setCurrentPageIndex(prev => prev + 1)
    }
  }

  // Calculate progress
  const progress = totalPages > 1
    ? (currentPageIndex / (totalPages - 1)) * 100
    : 100

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Navbar - fixed at top */}
      {(title || description) && (
        <div className="shrink-0 px-6 py-4 border-b bg-background">
          {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Page title */}
          {currentPage && (
            <div className="space-y-6">
              {mode === 'detailed' && (
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {currentPage.title || `Page ${currentPageIndex + 1}`}
                  </h2>
                </div>
              )}

              {/* Fields */}
              {currentPage.fields.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No fields in this page
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPage.fields.map((field) => (
                    <FieldView
                      key={field.id}
                      field={field}
                      value={submissionData?.[field.name]}
                      showType={showFieldTypes}
                      showValidation={showValidation}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed toolbar at bottom */}
      <div className="shrink-0 px-6 py-4 border-t bg-background">
        <div className="flex items-center gap-4">
          {/* Left: Previous button */}
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`w-32 ${!canGoPrevious ? 'invisible' : ''}`}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {/* Center: Progress bar */}
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Right: Next button */}
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLastPage}
            className={`w-32 ${isLastPage ? 'invisible' : ''}`}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Field display component with shadcn styling
function FieldView({
  field,
  value,
  showType,
  showValidation,
}: {
  field: any
  value?: any
  showType: boolean
  showValidation: boolean
}) {
  const displayValue = value !== undefined && value !== null && value !== ''
    ? String(value)
    : '—'

  return (
    <div className="space-y-2 p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-2">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {showType && (
          <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
            {field.type}
          </span>
        )}
      </div>

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <div className="text-sm text-foreground">
        {displayValue}
      </div>

      {showValidation && field.validation && (
        <div className="text-xs text-muted-foreground">
          {field.validation.min !== undefined && <span>Min: {field.validation.min} </span>}
          {field.validation.max !== undefined && <span>Max: {field.validation.max} </span>}
          {field.validation.pattern && <span>Pattern: {field.validation.pattern}</span>}
        </div>
      )}
    </div>
  )
}
