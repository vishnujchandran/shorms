import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { FormState } from "@/types/form-store"

const INITIAL_PAGE_ID = "page-1"

export const useFormStore = create<FormState>()(
  persist(
    immer((set) => ({
      isEditFormFieldOpen: false,
      pages: [{ id: INITIAL_PAGE_ID, fields: [] }],
      activePageId: INITIAL_PAGE_ID,
      setPages: (pages) => set({ pages }),

      setActivePage: (id) => set({ activePageId: id }),

      addPage: () => {
        const newPageId = `page-${Date.now()}`
        set((state) => {
          state.pages.push({ id: newPageId, fields: [] })
          state.activePageId = newPageId
        })
      },

      deletePage: (id) => {
        set((state) => {
          if (state.pages.length <= 1) return // Prevent deleting the last page

          const index = state.pages.findIndex((p) => p.id === id)
          if (index !== -1) {
            state.pages.splice(index, 1)
            // If we deleted the active page, switch to the previous one or the first one
            if (state.activePageId === id) {
              state.activePageId = state.pages[Math.max(0, index - 1)].id
            }
          }
        })
      },

      updatePageTitle: (id, title) => {
        set((state) => {
          const page = state.pages.find((p) => p.id === id)
          if (page) {
            page.title = title
          }
        })
      },

      addFormField: (formField) => {
        set((state) => {
          const activePage = state.pages.find(
            (p) => p.id === state.activePageId
          )
          if (activePage) {
            activePage.fields.push(formField)
          }
        })
      },

      deleteFormField: (id) => {
        set((state) => {
          state.pages.forEach((page) => {
            page.fields = page.fields.filter((f) => f.id !== id)
          })
        })
      },

      setSelectedFormField: (formField) => {
        set({ selectedFormField: formField })
      },

      setIsEditFormFieldOpen: (open) => {
        set({ isEditFormFieldOpen: open })
      },

      updateFormField: (formField) => {
        set((state) => {
          for (const page of state.pages) {
            const field = page.fields.find((f) => f.id === formField.id)
            if (field) {
              Object.assign(field, formField)
              break
            }
          }
        })
      },

      clearFormFields: () => {
        set({
          pages: [{ id: INITIAL_PAGE_ID, fields: [] }],
          activePageId: INITIAL_PAGE_ID,
          selectedFormField: undefined,
        })
      },
    })),
    {
      name: "form-storage",
      partialize: (state) => ({ pages: state.pages }),
    }
  )
)
