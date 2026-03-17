/* eslint-disable react-hooks/exhaustive-deps */
"use client"

/**
 * Shadcn-styled Renderer Wrapper
 * Uses the core Renderer with shadcn/ui components for styling
 */
import * as React from "react"
import { format } from "date-fns"
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDownIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Checkbox } from "../ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Slider } from "../ui/slider"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { Renderer } from "./renderer"
import type {
  FormPage,
  NavigationProps,
  RendererProps,
  FormField as ShormsFormField,
} from "./renderer/types"

const normalizeFieldType = (type?: string): string => {
  if (!type) return "text"
  const lower = type.toLowerCase()
  switch (lower) {
    case "input":
      return "text"
    case "number_input":
      return "number"
    case "radio_group":
      return "radio"
    case "file_upload":
      return "file"
    case "searchable":
    case "searchable_dropdown":
      return "searchable"
    default:
      return lower
  }
}

interface ShadcnRendererProps
  extends Omit<RendererProps, "renderField" | "renderPage" | "renderProgress"> {
  className?: string
  title?: string
  description?: string
}

export function ShadcnRenderer({
  className,
  title,
  description,
  ...props
}: ShadcnRendererProps) {
  // State to track current page index and total pages
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(
    props.schema?.pages?.length ?? 1
  )

  const rendererRef = React.useRef<any>(null)
  const pendingNavProps = React.useRef<NavigationProps | null>(null)

  // Custom field renderer using shadcn components - memoized to prevent unnecessary re-renders
  const renderField = React.useCallback(
    (field: ShormsFormField, value: any, onChange: (value: any) => void) => {
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </Label>

          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}

          {renderFieldInput(field, value, onChange)}
        </div>
      )
    },
    []
  )

  // Render different input types with shadcn components - memoized to prevent unnecessary re-renders
  const renderFieldInput = React.useCallback(
    (field: ShormsFormField, value: any, onChange: (value: any) => void) => {
      // Extract common properties from config if available
      const placeholder = (field.config?.placeholder ||
        field.config?.placeholderText) as string | undefined
      const options = (field.config?.options || []) as Array<{
        label: string
        value: string
      }>

      const normalizedType = normalizeFieldType(field.type)

      switch (normalizedType) {
        case "text":
        case "email":
        case "url":
          return (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={field.required}
            />
          )

        case "number":
          return (
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          )

        case "textarea":
          return (
            <Textarea
              id={field.name}
              name={field.name}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={field.required}
              rows={4}
            />
          )

        case "select":
          return (
            <Select value={value || ""} onValueChange={onChange}>
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "searchable":
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !value && "text-muted-foreground"
                  )}
                >
                  {value
                    ? options?.find((option) => option.value === value)?.label
                    : placeholder || "Select an option"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder={placeholder || "Search options..."}
                  />
                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => onChange(option.value)}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )

        case "combobox": {
          const selected = options?.find((option) => option.value === value)
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selected && "text-muted-foreground"
                  )}
                >
                  {selected
                    ? selected.label
                    : placeholder || "Select an option"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder={placeholder || "Search..."} />
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => onChange(option.value)}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }

        case "radio":
          return (
            <RadioGroup value={value || ""} onValueChange={onChange}>
              {options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.name}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${field.name}-${option.value}`}
                    className="font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )

        case "checkbox":
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={!!value}
                onCheckedChange={onChange}
              />
              <Label htmlFor={field.name} className="font-normal">
                {placeholder || "Check this box"}
              </Label>
            </div>
          )

        case "switch":
          return (
            <div className="flex items-center space-x-2">
              <Switch
                id={field.name}
                checked={!!value}
                onCheckedChange={onChange}
              />
              <Label htmlFor={field.name} className="font-normal">
                {placeholder || "Toggle"}
              </Label>
            </div>
          )

        case "slider":
          return (
            <div className="space-y-2">
              <Slider
                id={field.name}
                value={[value || field.validation?.min || 0]}
                onValueChange={(vals) => onChange(vals[0])}
                min={field.validation?.min || 0}
                max={field.validation?.max || 100}
                step={1}
              />
              <div className="text-center text-sm text-muted-foreground">
                {value || field.validation?.min || 0}
              </div>
            </div>
          )

        case "date":
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? (
                    format(new Date(value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => onChange(date?.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )

        case "file":
          return (
            <Input
              id={field.name}
              name={field.name}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                onChange(file)
              }}
              required={field.required}
            />
          )

        default:
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              "[ShadcnRenderer] Unhandled field type encountered, defaulting to text input:",
              field.type,
              `(normalized as ${normalizedType})`,
              field
            )
          }
          return (
            <Input
              id={field.name}
              name={field.name}
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={field.required}
            />
          )
      }
    },
    []
  )

  // Custom page renderer - memoized to prevent unnecessary re-renders
  const renderPage = React.useCallback(
    (page: FormPage, children: React.ReactNode) => {
      if (!page) {
        return <div className="space-y-4">{children}</div>
      }
      return (
        <div className="space-y-6" key={page.id}>
          {page.title && (
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {page.title}
              </h2>
              {page.description && (
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              )}
            </div>
          )}
          <div className="space-y-4">{children}</div>
        </div>
      )
    },
    []
  )

  // Progress is now in the toolbar, return null here
  const renderProgress = React.useCallback(() => null, [])

  // Capture navigation props from Renderer, render nothing inside
  const renderNavigation = React.useCallback((props: NavigationProps) => {
    pendingNavProps.current = { ...props }
    return null // Don't render anything inside Renderer
  }, [])

  // Update navigation state from pending props after render
  React.useLayoutEffect(() => {
    const pending = pendingNavProps.current
    if (pending) {
      setCurrentPageIndex(pending.currentPageIndex)
      setTotalPages(pending.totalPages)
    }
  }, [pendingNavProps.current])

  // Handle submit from external toolbar
  const handleToolbarSubmit = React.useCallback(() => {
    rendererRef.current?.submit()
  }, [])

  // Derive navigation state from state (not from props to avoid timing issues)
  const toolbarNavProps = pendingNavProps.current
  const derivedTotalPages = totalPages
  const derivedCurrentIndex = currentPageIndex
  const derivedIsFirst = derivedCurrentIndex === 0
  const derivedIsLast = derivedCurrentIndex >= derivedTotalPages - 1

  // Previous button: show only on multi-page forms, not on first page
  const showPrevious = derivedTotalPages > 1 && !derivedIsFirst
  const derivedCanPrevious = derivedTotalPages > 1 && !derivedIsFirst

  // Next button: show only on multi-page forms, not on last page
  const showNext = derivedTotalPages > 1 && !derivedIsLast
  const derivedCanNext = derivedTotalPages > 1 && !derivedIsLast

  // Calculate progress for toolbar (show 0–100% even for single-page forms)
  const progress =
    ((derivedCurrentIndex + 1) / Math.max(derivedTotalPages, 1)) * 100

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {/* Navbar - fixed at top, edge to edge */}
      {(title || description) && (
        <div className="shrink-0 border-b bg-background px-6 py-4">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <Renderer
          {...props}
          ref={rendererRef}
          renderField={renderField}
          renderPage={renderPage}
          renderProgress={renderProgress}
          renderNavigation={renderNavigation}
        />
      </div>

      {/* Fixed toolbar at bottom */}
      {derivedTotalPages > 0 && (
        <div className="shrink-0 border-t bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Left: Previous button - only show on multi-page forms, not first page */}
            {showPrevious && (
              <Button
                type="button"
                variant="outline"
                onClick={toolbarNavProps?.onPrevious}
                disabled={!derivedCanPrevious || !toolbarNavProps}
                className="w-32"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {/* Center: Progress bar */}
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Right: Next button - only show on multi-page forms, not on last page */}
            {showNext && (
              <Button
                type="button"
                onClick={toolbarNavProps?.onNext}
                disabled={!derivedCanNext || !toolbarNavProps}
                className="w-32"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {/* Right: Submit button - show on last page or single-page forms */}
            {!showNext && derivedTotalPages > 0 && (
              <Button
                type="button"
                onClick={handleToolbarSubmit}
                className="w-32"
              >
                Submit
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
