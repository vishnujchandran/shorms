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
  const rendererRef = React.useRef<any>(null)
  const navPropsRef = React.useRef<NavigationProps | null>(null)
  const mountedRef = React.useRef(false)
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0)

  React.useEffect(() => {
    mountedRef.current = true
    // Flush any nav props captured before mount
    if (navPropsRef.current) forceUpdate()
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Custom field renderer using shadcn components - memoized to prevent unnecessary re-renders
  const renderField = React.useCallback(
    (field: ShormsFormField, value: any, onChange: (value: any) => void) => {
      const isRequired = field.validation?.required ?? field.required ?? false
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
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
      const isRequired = field.validation?.required ?? field.required ?? false
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
              required={isRequired}
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
              required={isRequired}
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
              required={isRequired}
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

        case "file": {
          const accept =
            (field.config?.accept as string | undefined) ||
            (field as any).accept ||
            undefined
          const multiple =
            (field.config?.multiple as boolean | undefined) ||
            (field as any).multiple ||
            false

          return (
            <Input
              id={field.name}
              name={field.name}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={(e) => {
                const files = e.target.files
                const payload = multiple ? files : files?.[0]
                onChange(payload)
              }}
              required={field.required}
            />
          )
        }

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

  // Capture navigation props from Renderer, trigger re-render when page changes
  const renderNavigation = React.useCallback(
    (navProps: NavigationProps) => {
      const prev = navPropsRef.current
      navPropsRef.current = navProps
      if (
        mountedRef.current &&
        (!prev ||
          prev.currentPageIndex !== navProps.currentPageIndex ||
          prev.totalPages !== navProps.totalPages)
      ) {
        queueMicrotask(forceUpdate)
      }
      return null
    },
    [forceUpdate]
  )

  // Handle submit from external toolbar
  const handleToolbarSubmit = React.useCallback(() => {
    rendererRef.current?.submit()
  }, [])

  // Read navigation state directly from ref (kept fresh by renderNavigation)
  const nav = navPropsRef.current
  const totalPages = nav?.totalPages ?? (props.schema?.pages?.length || 1)
  const currentIndex = nav?.currentPageIndex ?? 0
  const isFirst = currentIndex === 0
  const isLast = currentIndex >= totalPages - 1

  const showPrevious = totalPages > 1 && !isFirst
  const showNext = totalPages > 1 && !isLast

  // Calculate progress for toolbar (show 0–100% even for single-page forms)
  const progress = ((currentIndex + 1) / Math.max(totalPages, 1)) * 100

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
        <div className="pb-6">
          <Renderer
            {...props}
            ref={rendererRef}
            renderField={renderField}
            renderPage={renderPage}
            renderProgress={renderProgress}
            renderNavigation={renderNavigation}
          />
        </div>
      </div>

      {/* Fixed toolbar at bottom */}
      {totalPages > 0 && (
        <div className="shrink-0 border-t bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Left: Previous button - only show on multi-page forms, not first page */}
            {showPrevious && (
              <Button
                type="button"
                variant="outline"
                onClick={nav?.onPrevious}
                disabled={!nav}
                className="w-32"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {/* Center: Progress bar */}
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Right: Next button - only show on multi-page forms, not on last page */}
            {showNext && (
              <Button
                type="button"
                onClick={nav?.onNext}
                disabled={!nav}
                className="w-32"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {/* Right: Submit button - show on last page or single-page forms */}
            {!showNext && totalPages > 0 && (
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
