import * as React from "react"

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

interface FormFieldWrapperProps {
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
}

export function FormFieldWrapper({
  children,
  label,
  description,
  required = false,
}: FormFieldWrapperProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      <FormDescription>{description}</FormDescription>
      <FormMessage />
    </FormItem>
  )
}
