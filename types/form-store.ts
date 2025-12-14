import type { FormField } from "@/types/field"

export interface FormPage {
  id: string
  title?: string
  fields: FormField[]
}

export type FormState = {
  pages: FormPage[]
  setPages: (pages: FormPage[]) => void
  activePageId: string
  setActivePage: (id: string) => void
  addPage: () => void
  deletePage: (id: string) => void
  updatePageTitle: (id: string, title: string) => void

  deleteFormField: (id?: string) => void
  addFormField: (formField: FormField) => void
  selectedFormField?: string
  setSelectedFormField: (id?: string) => void
  isEditFormFieldOpen: boolean
  setIsEditFormFieldOpen: (open: boolean) => void
  updateFormField: (formField: FormField) => void
  clearFormFields: () => void // This might need to clear all pages or reset to initial state
}
