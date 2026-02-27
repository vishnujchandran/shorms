'use client'

import * as React from 'react'
import { Builder, type BuilderProps } from './builder'
import { TooltipProvider } from '@/components/ui/tooltip'

/**
 * ShadcnBuilder - High-level wrapper around Builder with shadcn/ui styling
 * This component provides the same interface as Builder but with additional
 * conveniences and defaults optimized for shadcn/ui projects
 *
 * Includes TooltipProvider to support tooltip functionality in field components
 *
 * @example
 * ```tsx
 * import { ShadcnBuilder, useBuilderState } from 'shorms'
 *
 * function App() {
 *   const builder = useBuilderState()
 *
 *   return (
 *     <ShadcnBuilder
 *       pages={builder.pages}
 *       activePageId={builder.activePageId}
 *       onPagesChange={builder.onPagesChange}
 *       onActivePageChange={builder.onActivePageChange}
 *       onPageAdd={builder.onPageAdd}
 *       onPageDelete={builder.onPageDelete}
 *       onPageRename={builder.onPageRename}
 *       onFieldAdd={builder.onFieldAdd}
 *       width="full"
 *     />
 *   )
 * }
 * ```
 */
export function ShadcnBuilder(props: BuilderProps) {
  return (
    <TooltipProvider>
      <Builder {...props} />
    </TooltipProvider>
  )
}

ShadcnBuilder.displayName = 'ShadcnBuilder'
