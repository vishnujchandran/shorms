import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { EditFormField } from "@/components/edit-form-field"
import { FormEditor } from "@/components/form-editor"
import { HeaderActions } from "@/components/header-actions"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarLeft } from "@/components/sidebar-left"

export default async function Home() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset className="overflow-x-hidden px-4">
        <header className="sticky top-0 flex h-14 shrink-0 items-center justify-between gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-1">
            <ModeToggle />
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-md border shadow-sm">
          <div className="flex items-center gap-1.5 border-b p-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            <HeaderActions />
          </div>
          <FormEditor />
        </div>
        <EditFormField />
        <footer className="mb-4 mt-8 text-center text-muted-foreground">
          <p>Shorms - Local-first form builder for shadcn/ui</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
