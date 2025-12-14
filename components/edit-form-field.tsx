"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import { useShallow } from "zustand/shallow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { RenderEditFormFieldInputs } from "@/components/render-edit-form-field-inputs"
import { ValidationSettings } from "@/components/validation-settings"

import { FormState } from "@/types/form-store"

const selector = (state: FormState) => ({
  isEditFormFieldOpen: state.isEditFormFieldOpen,
  setIsEditFormFieldOpen: state.setIsEditFormFieldOpen,
  selectedFormField: state.selectedFormField,
  updateFormField: state.updateFormField,
  pages: state.pages,
})

export function EditFormField() {
  const {
    isEditFormFieldOpen,
    setIsEditFormFieldOpen,
    selectedFormField,
    updateFormField,
    pages,
  } = useFormStore(useShallow(selector))

  const selectedField = React.useMemo(() => {
    for (const page of pages) {
      const field = page.fields.find((f) => f.id === selectedFormField)
      if (field) return field
    }
    return undefined
  }, [selectedFormField, pages])

  return (
    <Sheet
      open={isEditFormFieldOpen}
      onOpenChange={setIsEditFormFieldOpen}
      modal={false}
    >
      {selectedFormField && selectedField && (
        <SheetContent withOverlay={false} className="sm:max-w-[614px]">
          <SheetHeader>
            <SheetTitle>Edit {selectedField.name} Field</SheetTitle>
            <SheetDescription>Update info about this field.</SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="space-y-6">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="your field label..."
                value={selectedField.label}
                onChange={(e) =>
                  updateFormField({
                    ...selectedField,
                    label: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="your field description..."
                value={selectedField.description}
                onChange={(e) =>
                  updateFormField({
                    ...selectedField,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="your field name..."
                value={selectedField.name}
                onChange={(e) =>
                  updateFormField({
                    ...selectedField,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <RenderEditFormFieldInputs selectedField={selectedField} />
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Validation</h4>
              <ValidationSettings selectedField={selectedField} />
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  )
}
