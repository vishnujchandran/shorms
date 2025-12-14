"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { generateDefaultValues, generateZodSchema } from "@/lib/form-schema"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { renderFormFieldComponent } from "@/components/render-form-field-component"

import { FormPage } from "@/types/form-store"

interface FormRunnerProps {
  schema: FormPage[]
  onComplete?: (values: any) => void
}

export function FormRunner({ schema, onComplete }: FormRunnerProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const { toast } = useToast()

  // Flatten all fields to generate the complete schema and default values
  const allFields = React.useMemo(
    () => schema.flatMap((p) => p.fields),
    [schema]
  )

  const formSchema = React.useMemo(
    () => generateZodSchema(allFields),
    [allFields]
  )
  const defaultValues = React.useMemo(
    () => generateDefaultValues(allFields),
    [allFields]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  // Reset form when schema changes
  React.useEffect(() => {
    form.reset(defaultValues)
    setCurrentPageIndex(0)
  }, [schema, defaultValues, form])

  const currentPage = schema[currentPageIndex]
  const isLastPage = currentPageIndex === schema.length - 1
  const isFirstPage = currentPageIndex === 0

  // Calculate progress
  const progress = ((currentPageIndex + 1) / schema.length) * 100

  const handleNext = async () => {
    const fieldsToValidate = currentPage.fields.map((f) => f.name)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      setCurrentPageIndex((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setCurrentPageIndex((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (onComplete) {
      onComplete(values)
    } else {
      toast({
        title: "Form Submitted",
        description: (
          <pre className="mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4">
            <code className="overflow-auto text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      })
    }
  }

  if (!currentPage) {
    return <div>No pages defined</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentPage.title || `Page ${currentPageIndex + 1}`}</span>
          <span>
            Step {currentPageIndex + 1} of {schema.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {currentPage.fields.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No fields on this page.
              </div>
            )}
            {currentPage.fields.map((formField) => (
              <FormField
                key={formField.name}
                control={form.control}
                name={formField.name}
                render={({ field }) =>
                  renderFormFieldComponent({ field, formField })
                }
              />
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isFirstPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {isLastPage ? (
              <Button type="submit">
                Submit
                <Check className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
