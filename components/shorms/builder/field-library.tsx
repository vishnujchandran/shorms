'use client'

import * as React from 'react'
import { SearchCode } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { fieldCategories } from './constants'
import type { FieldLibraryProps, FieldTemplate } from './types'

/**
 * Field library sidebar component
 * Displays available field templates organized by category
 */
export function FieldLibrary({
  fieldTemplates,
  onFieldSelect,
  searchPlaceholder = 'Search fields...',
  showSearch = true,
  className,
  width = 280,
}: FieldLibraryProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return fieldCategories

    const query = searchQuery.toLowerCase()
    return fieldCategories
      .map((category) => ({
        ...category,
        types: category.types.filter((type) => {
          const template = fieldTemplates.find((f) => f.type === type)
          return (
            template?.name.toLowerCase().includes(query) ||
            template?.description?.toLowerCase().includes(query)
          )
        }),
      }))
      .filter((category) => category.types.length > 0)
  }, [searchQuery, fieldTemplates])

  return (
    <div
      className={cn('flex h-full flex-col border-r bg-muted/20', className)}
      style={{ width: `${width}px` }}
    >
      {/* Search */}
      {showSearch && (
        <div className="shrink-0 p-4">
          <div className="relative">
            <SearchCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Field Categories */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {filteredCategories.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No fields found
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.name}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.name}
                </h3>
                <div className="space-y-2">
                  {category.types.map((type) => {
                    const template = fieldTemplates.find((f) => f.type === type)
                    if (!template) return null

                    return (
                      <button
                        key={template.type}
                        onClick={() => onFieldSelect(template)}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:bg-accent hover:shadow-md'
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                          <template.Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-sm font-medium leading-none">
                            {template.name}
                          </div>
                          {template.description && (
                            <div className="text-xs text-muted-foreground">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
