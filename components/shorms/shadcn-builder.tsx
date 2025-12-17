'use client'

import * as React from 'react'
import { Builder, type BuilderProps } from './builder'

/**
 * ShadcnBuilder - High-level wrapper around Builder with shadcn/ui styling
 * This component provides the same interface as Builder but with additional
 * conveniences and defaults optimized for shadcn/ui projects
 *
 * @example
 * ```tsx
 * import { ShadcnBuilder, useBuilderState } from '@/components/shorms'
 *
 * function App() {
 *   const builder = useBuilderState()
 *
 *   return (
 *     <ShadcnBuilder
 *       pages={builder.pages}
 *       activePageId={builder.activePageId}
 *       onPagesChange={builder.setPages}
 *       onActivePageChange={builder.setActivePageId}
 *       onPageAdd={builder.addPage}
 *       onPageDelete={builder.deletePage}
 *       onPageRename={builder.updatePageTitle}
 *       onFieldAdd={builder.addField}
 *       width="full"
 *     />
 *   )
 * }
 * ```
 */
export function ShadcnBuilder(props: BuilderProps) {
  return <Builder {...props} />
}

ShadcnBuilder.displayName = 'ShadcnBuilder'
