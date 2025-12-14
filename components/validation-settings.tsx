"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import { useShallow } from "zustand/shallow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { FieldType, type FormField } from "@/types/field"

interface ValidationSettingsProps {
  selectedField: FormField
}

export function ValidationSettings({ selectedField }: ValidationSettingsProps) {
  const updateFormField = useFormStore(
    useShallow((state) => state.updateFormField)
  )

  const handleValidationChange = (key: string, value: any) => {
    updateFormField({
      ...selectedField,
      validation: {
        ...selectedField.validation,
        [key]: value,
      },
    })
  }

  const showRegex = [
    FieldType.INPUT,
    FieldType.TEXTAREA,
    FieldType.EMAIL,
  ].includes(selectedField.type)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Required</Label>
          <p className="text-sm text-muted-foreground">
            Mark this field as required.
          </p>
        </div>
        <Switch
          checked={selectedField.validation?.required || false}
          onCheckedChange={(checked) =>
            handleValidationChange("required", checked)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="errorMessage">Custom Error Message</Label>
        <Input
          id="errorMessage"
          placeholder="e.g. This field is required"
          value={selectedField.validation?.errorMessage || ""}
          onChange={(e) =>
            handleValidationChange("errorMessage", e.target.value)
          }
        />
      </div>

      {showRegex && (
        <div className="space-y-2">
          <Label htmlFor="regex">Regex Pattern</Label>
          <Input
            id="regex"
            placeholder="e.g. ^[A-Za-z]+$"
            value={selectedField.validation?.regex || ""}
            onChange={(e) => handleValidationChange("regex", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Regular expression for validation.
          </p>
        </div>
      )}
    </div>
  )
}
