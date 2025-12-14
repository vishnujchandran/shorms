"use client"

import * as React from "react"
import { useFormStore } from "@/stores/form"

import { generateFormCode } from "@/lib/generate-form-code"
import { Skeleton } from "@/components/ui/skeleton"
import { CopyBtn } from "@/components/copy-btn"
import { highlight } from "@/components/shared"

export function CodeBlock() {
  const [nodes, setNodes] = React.useState(
    <Skeleton className="h-48 w-full rounded-t-none" />
  )
  const pages = useFormStore((state) => state.pages)
  const formCode = generateFormCode(pages)

  React.useLayoutEffect(() => {
    void highlight(formCode).then(setNodes)
  }, [formCode])

  return (
    <div className="relative [&>pre]:max-h-[650px] [&>pre]:overflow-x-auto [&>pre]:rounded-b-md [&>pre]:p-4">
      <CopyBtn value={formCode} />
      {nodes}
    </div>
  )
}
