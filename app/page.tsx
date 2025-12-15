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
      <SidebarInset className="overflow-x-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-1 items-center gap-3">
            <SidebarTrigger />
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold">Form Builder</h1>
              <p className="text-xs text-muted-foreground">Design and preview your forms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HeaderActions />
            <div className="h-6 w-px bg-border" />
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto w-full max-w-5xl rounded-lg border bg-card shadow-sm">
            <FormEditor />
          </div>
        </div>
        <EditFormField />
        <footer className="border-t bg-muted/30 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Shorms - Local-first form builder powered by shadcn/ui
          </p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
