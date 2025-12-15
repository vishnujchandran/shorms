"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"
import { useShallow } from "zustand/shallow"

import { fields } from "@/lib/constants"
import { generateFieldId, generateFieldName } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"

import { FormState } from "@/types/form-store"

const selector = (state: FormState) => ({
  addFormField: state.addFormField,
})

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { addFormField } = useFormStore(useShallow(selector))

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="h-16">
        <div className="my-auto flex w-fit items-center gap-2">
          <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Logo className="size-4 invert" />
          </div>
          <span className="text-sm font-semibold">Shorms Builder</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fields</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fields.map((field) => (
                <SidebarMenuItem key={field.name}>
                  <SidebarMenuButton
                    onClick={() => {
                      const newFormField = {
                        ...field,
                        id: generateFieldId(),
                        name: generateFieldName(field.name),
                      }
                      addFormField(newFormField)
                    }}
                  >
                    <field.Icon />
                    <span>{field.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
