/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Shorms Renderer - Main Component
 * Renders forms with validation, suggestions, and state management
 */

"use client"

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { toast } from "@/hooks/use-toast"

import type { FormField, FormPage, RendererProps } from "./types"
import { useBackgroundJob } from "./use-background-job"
import { useFormState } from "./use-form-state"
import { useSuggestions } from "./use-suggestions"
import { useValidation } from "./use-validation"

export const Renderer = React.forwardRef<any, RendererProps>((props, ref) => {
  const {
    schema,
    onSubmit,
    formStateRef,
    features = {},
    maxHistorySize = 50,
    onSuggest,
    onBulkSuggest,
    onJobProgress,
    onJobCancel,
    onSaveDraft,
    initialValues,
    initialJobId,
    onDirtyStateChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUndo: _onUndo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRedo: _onRedo,
    renderField,
    renderPage,
    renderProgress,
    renderNavigation,
  } = props

  // Extract feature flags
  const { autoSave, backgroundJobs } = features

  // State: Current page
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  // Keep the current page index within the valid range even if the schema changes
  useEffect(() => {
    const lastValidIndex = Math.max(schema.pages.length - 1, 0)
    if (schema.pages.length === 0) {
      if (currentPageIndex !== 0) {
        setCurrentPageIndex(0)
      }
      return
    }

    if (currentPageIndex > lastValidIndex) {
      setCurrentPageIndex(lastValidIndex)
    }
  }, [schema.pages.length, currentPageIndex])

  const totalPages = schema.pages.length
  const hasPages = totalPages > 0
  const currentPage = hasPages ? schema.pages[currentPageIndex] : undefined
  const isFirstPage = currentPageIndex === 0
  const isLastPage = !hasPages || currentPageIndex === totalPages - 1

  // Navigation visibility rules (handles single-page + multi-page)
  const showPrevious = totalPages > 1 && !isFirstPage
  const showNext = totalPages > 1 && !isLastPage
  const showSubmit = totalPages === 1 || isLastPage

  // Debug navigation visibility (helps diagnose non-clickable submit button)
  useEffect(() => {
    console.info("[shorms] nav visibility", {
      showSubmit,
      showNext,
      showPrevious,
      isLastPage,
      currentPageIndex,
      totalPages,
      hasPages,
    })
  }, [
    showSubmit,
    showNext,
    showPrevious,
    isLastPage,
    currentPageIndex,
    totalPages,
    hasPages,
  ])

  // Ref for form element to allow external submit
  const formElementRef = useRef<HTMLFormElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)
  const onSubmitRef = useRef(onSubmit)

  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  // Debug submit button computed styles to detect pointer-events/opacity/layout issues
  useEffect(() => {
    const btn = submitButtonRef.current
    if (!btn) return

    // Defer to ensure layout is measured after render
    const id = requestAnimationFrame(() => {
      const styles = getComputedStyle(btn)
      const rect = btn.getBoundingClientRect()

      console.info("[shorms] submit button diagnostics", {
        disabled: btn.disabled,
        ariaDisabled: btn.getAttribute("aria-disabled"),
        pointerEvents: styles.pointerEvents,
        opacity: styles.opacity,
        display: styles.display,
        visibility: styles.visibility,
        rect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        },
        isConnected: btn.isConnected,
      })
    })

    return () => cancelAnimationFrame(id)
  }, [
    showSubmit,
    showNext,
    showPrevious,
    isLastPage,
    currentPageIndex,
    totalPages,
  ])

  // Initialize form state
  const formState = useFormState({
    schema,
    initialValues,
    maxHistorySize,
    onDirtyStateChange,
  })

  // Initialize validation
  const validation = useValidation({
    schema,
    formState,
  })

  // Initialize suggestions
  const suggestions = useSuggestions({
    schema,
    formState,
    onSuggest,
  })

  // Initialize background jobs
  const backgroundJob = useBackgroundJob({
    schema,
    formState,
    onJobProgress,
    onJobCancel,
    onBulkSuggest,
    pollInterval: backgroundJobs?.pollInterval || 2000,
    blocking: backgroundJobs?.blocking || false,
  })

  // Note: useImperativeHandle moved below after handlers are defined

  // Effect: Auto-save
  useEffect(() => {
    if (!autoSave?.enabled || !onSaveDraft) {
      return
    }

    const interval = setInterval(
      () => {
        if (formState.isDirty) {
          const changes = formState.getChanges()
          onSaveDraft(formState.values, changes)
            .then(() => {
              formState.markClean()
            })
            .catch((error) => {
              console.error("Auto-save failed:", error)
            })
        }
      },
      (autoSave.interval || 30) * 1000
    )

    return () => clearInterval(interval)
  }, [autoSave, onSaveDraft, formState])

  // Effect: Resume job on mount
  useEffect(() => {
    if (initialJobId && backgroundJob.resumeJob) {
      backgroundJob.resumeJob(initialJobId)
    }
  }, [initialJobId, backgroundJob])

  // Effect: Clear expired suggestions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      suggestions.clearExpiredSuggestions()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [suggestions])

  // Handler: Field value change
  const handleFieldChange = useCallback(
    async (fieldId: string, value: any, fieldType?: string) => {
      // Convert value based on field type
      let convertedValue = value
      if (fieldType === "number" && value !== "" && value !== null) {
        convertedValue = Number(value)
      }

      // Update value in state
      formState.setValue(fieldId, convertedValue, "user")

      // Run validation
      await validation.validateFieldDebounced(fieldId)
      // TODO: Update validation state in formState

      // Trigger suggestion if configured
      await suggestions.handleFieldChange(fieldId, value)

      // Trigger dependent field validations
      await validation.validateDependentFields(fieldId)

      // Trigger dependent field suggestions
      await suggestions.triggerDependentSuggestions(fieldId)
    },
    [formState, validation, suggestions]
  )

  // Handler: Page navigation
  const handleNextPage = useCallback(async () => {
    // Disallow navigation when already on the last page or when there is nowhere to go
    if (!hasPages || isLastPage) {
      return
    }

    // Validate current page
    const pageValidation = await validation.validatePage(currentPage!.id)

    // Check for blocking errors
    let hasBlockingErrors = false
    pageValidation.forEach((result) => {
      if (!result.valid && result.blocking) {
        hasBlockingErrors = true
      }
    })

    if (hasBlockingErrors || !currentPage) {
      // Notify user about required fields
      const missingFields: string[] = []
      pageValidation.forEach((result, fieldId) => {
        if (!result.valid && result.blocking) {
          missingFields.push(fieldId)
        }
      })

      // Show a toast with a short message and optional list of first few fields
      toast({
        title: "Please fill required fields",
        description:
          missingFields.length > 0
            ? `Missing: ${missingFields.slice(0, 3).join(", ")}${
                missingFields.length > 3 ? "…" : ""
              }`
            : undefined,
        duration: 4000,
      })
      return
    }

    // Navigate to next page
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }, [
    currentPageIndex,
    totalPages,
    currentPage,
    validation,
    hasPages,
    isLastPage,
  ])

  const handlePrevPage = useCallback(() => {
    if (!hasPages || isFirstPage) {
      return
    }

    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }, [currentPageIndex, hasPages, isFirstPage])

  // Handler: Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      console.info("[shorms] submit clicked", {
        isLastPage,
        currentPageIndex,
        totalPages,
      })

      // Only allow submission on the last page (or single-page forms)
      if (!isLastPage) {
        console.warn("[shorms] submit blocked: not last page")
        return
      }

      // Validate all fields
      const allValidation = await validation.validateAll()

      // Check for blocking errors
      let hasBlockingErrors = false
      const blockingFields: string[] = []
      allValidation.forEach((result) => {
        if (!result.valid && result.blocking) {
          hasBlockingErrors = true
          // allValidation is a Map<fieldId, result>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const fieldId = (result as any).fieldId || undefined
          if (fieldId) {
            blockingFields.push(fieldId)
          }
        }
      })

      if (hasBlockingErrors) {
        console.warn("[shorms] submit blocked: validation errors", {
          blockingFields,
        })
        const message =
          blockingFields.length > 0
            ? `Missing: ${blockingFields.slice(0, 3).join(", ")}${
                blockingFields.length > 3 ? "…" : ""
              }`
            : undefined
        toast({
          title: "Please fill required fields",
          description: message,
          duration: 4000,
        })
        return
      }

      // Run cross-field validation
      const crossFieldValidation = await validation.validateCrossField()
      const crossBlockingFields: string[] = []
      if (crossFieldValidation.size > 0) {
        let hasCrossFieldErrors = false
        crossFieldValidation.forEach((result, fieldId) => {
          if (!result.valid && result.blocking) {
            hasCrossFieldErrors = true
            crossBlockingFields.push(fieldId)
          }
        })

        if (hasCrossFieldErrors) {
          console.warn("[shorms] submit blocked: cross-field errors", {
            crossBlockingFields,
          })
          const message =
            crossBlockingFields.length > 0
              ? crossBlockingFields.slice(0, 3).join(", ")
              : undefined
          toast({
            title: "Please fix cross-field errors",
            description: message,
            duration: 4000,
          })
          return
        }
      }

      // Submit form
      try {
        // Aggregate form values per page (for debugging visibility)
        const aggregatedValues: Record<string, Record<string, any>> = {}
        schema.pages.forEach((page, index) => {
          const pageKey = `page${index + 1}`
          aggregatedValues[pageKey] = {}

          page.fields.forEach((field) => {
            aggregatedValues[pageKey][field.name] = formState.values[field.name]
          })
        })

        console.info("[shorms] submit passing values", {
          flatKeys: Object.keys(formState.values || {}),
          aggregatedPages: Object.keys(aggregatedValues || {}),
          onSubmitRefSet: !!onSubmitRef.current,
        })

        // Pass flat values to consumer so top-level keys are preserved
        await onSubmitRef.current(formState.values)

        // Mark as submitted
        // formState.metadata.submittedAt = Date.now()
      } catch (error) {
        console.error("Form submission error:", error)
      }
    },
    [formState, validation, currentPageIndex, totalPages, schema.pages]
  )

  // Expose form state, navigation, and submit API via ref
  useImperativeHandle(
    ref,
    () => ({
      ...formState,
      navigation: {
        currentPageIndex,
        totalPages,
        onPrevious: handlePrevPage,
        onNext: handleNextPage,
        canGoPrevious: showPrevious,
        canGoNext: showNext,
        isLastPage,
      },
      submit: () => {
        console.info("[shorms] imperative submit called", {
          currentPageIndex,
          totalPages,
          isLastPage,
          hasFormElement: !!formElementRef.current,
        })
        formElementRef.current?.requestSubmit()
      },
    }),
    [
      formState,
      currentPageIndex,
      totalPages,
      handlePrevPage,
      handleNextPage,
      showPrevious,
      showNext,
      isLastPage,
    ]
  )

  useImperativeHandle(
    formStateRef,
    () => ({
      ...formState,
      navigation: {
        currentPageIndex,
        totalPages,
        onPrevious: handlePrevPage,
        onNext: handleNextPage,
        canGoPrevious: showPrevious,
        canGoNext: showNext,
        isLastPage,
      },
      submit: () => {
        console.info("[shorms] formStateRef submit called", {
          currentPageIndex,
          totalPages,
          isLastPage,
          hasFormElement: !!formElementRef.current,
        })
        formElementRef.current?.requestSubmit()
      },
    }),
    [
      formState,
      currentPageIndex,
      totalPages,
      handlePrevPage,
      handleNextPage,
      showPrevious,
      showNext,
      isLastPage,
    ]
  )

  // Handler: Bulk file upload
  // Render field (default implementation)
  const renderFieldDefault = useCallback(
    (field: FormField, value: any) => {
      const isRequired = field.validation?.required ?? field.required ?? false
      return (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium">
            {field.label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>

          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={value || ""}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, field.type)
              }
              className="w-full rounded-md border px-3 py-2"
              required={isRequired}
              rows={4}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={
                field.type === "email"
                  ? "email"
                  : field.type === "number"
                    ? "number"
                    : "text"
              }
              value={value || ""}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, field.type)
              }
              className="w-full rounded-md border px-3 py-2"
              required={isRequired}
            />
          )}

          {/* Validation error */}
          {formState.errors[field.name] && (
            <p className="text-sm text-red-500">
              {formState.errors[field.name]}
            </p>
          )}

          {/* Suggestion indicator */}
          {formState.getSuggestionState(field.name)?.status === "available" && (
            <div className="text-sm text-blue-500">💡 Suggestion available</div>
          )}
        </div>
      )
    },
    [formState, handleFieldChange]
  )

  // Render page (default implementation)
  const renderPageDefault = useCallback(
    (page: FormPage, children: React.ReactNode) => {
      return (
        <div className="space-y-6">
          {page.title && <h2 className="text-2xl font-bold">{page.title}</h2>}
          {page.description && (
            <p className="text-muted-foreground">{page.description}</p>
          )}
          <div className="space-y-4">{children}</div>
        </div>
      )
    },
    []
  )

  // Render progress (default implementation)
  const renderProgressDefault = useCallback(
    (current: number, total: number, progress: number) => {
      return (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {current} of {total}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )
    },
    []
  )

  // Render current page fields
  const renderFields = useCallback(() => {
    if (!currentPage) {
      return <div>No page defined</div>
    }

    return currentPage.fields.map((field) => {
      // Check field conditional logic
      if (field.showIf) {
        if (typeof field.showIf === "function") {
          if (!field.showIf(formState.values)) {
            return null
          }
        } else {
          // TODO: Implement conditional logic evaluation
        }
      }

      const value = formState.getValue(field.name)

      if (renderField) {
        return renderField(field, value, (newValue) =>
          handleFieldChange(field.name, newValue)
        )
      }

      return renderFieldDefault(field, value)
    })
  }, [
    currentPage,
    formState,
    renderField,
    renderFieldDefault,
    handleFieldChange,
  ])

  // Calculate progress
  const progress = hasPages ? ((currentPageIndex + 1) / totalPages) * 100 : 100

  // Main render
  return (
    <div className="flex min-h-full w-full flex-col">
      {/* Progress indicator */}
      <div className="px-6 pt-6">
        {renderProgress
          ? renderProgress(currentPageIndex + 1, totalPages, progress)
          : renderProgressDefault(currentPageIndex + 1, totalPages, progress)}

        {/* Background job indicator */}
        {backgroundJob.jobInfo?.isActive && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analyzing your files...</p>
                <p className="text-sm text-muted-foreground">
                  {backgroundJob.jobInfo.fieldsCompleted} of{" "}
                  {backgroundJob.jobInfo.fieldsCompleted +
                    backgroundJob.jobInfo.fieldsPending}{" "}
                  fields completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {Math.round(backgroundJob.jobInfo.progress * 100)}%
                </p>
                {backgroundJob.jobInfo.estimatedTimeRemaining && (
                  <p className="text-xs text-muted-foreground">
                    ~
                    {Math.round(
                      backgroundJob.jobInfo.estimatedTimeRemaining / 60
                    )}
                    m remaining
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={() =>
                  backgroundJob.jobInfo &&
                  backgroundJob.cancelJob(backgroundJob.jobInfo.jobId)
                }
                className="text-sm text-red-500 hover:text-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form
        ref={formElementRef}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-1 flex-col px-6"
      >
        <div className="flex-1">
          {currentPage
            ? renderPage
              ? renderPage(currentPage, renderFields())
              : renderPageDefault(currentPage, renderFields())
            : renderPageDefault({ id: "empty", fields: [] }, renderFields())}
        </div>

        {/* Navigation */}
        {renderNavigation ? (
          renderNavigation({
            currentPageIndex,
            totalPages,
            onPrevious: handlePrevPage,
            onNext: handleNextPage,
            canGoPrevious: showPrevious,
            canGoNext: showNext,
            isLastPage,
          })
        ) : (
          <div className="mt-8 flex items-center justify-between gap-4 py-4">
            <div>
              {showPrevious && (
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="rounded-md border px-4 py-2"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {showNext && (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Next
                </button>
              )}

              {showSubmit && (
                <button
                  type="submit"
                  ref={submitButtonRef}
                  onClick={() =>
                    console.info("[shorms] submit button clicked (onClick)", {
                      isLastPage,
                      currentPageIndex,
                      totalPages,
                    })
                  }
                  className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
})

Renderer.displayName = "Renderer"
