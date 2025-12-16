/**
 * ShadcnViewer Component
 * High-level wrapper around Viewer with shadcn/ui styling
 */

'use client'

import React from 'react'
import { Viewer, type ViewerProps } from './viewer'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

export interface ShadcnViewerProps extends ViewerProps {
  // Export functionality
  onExport?: () => void
  showExportButton?: boolean

  // Print functionality
  onPrint?: () => void
  showPrintButton?: boolean
}

export function ShadcnViewer({
  onExport,
  showExportButton = false,
  onPrint,
  showPrintButton = false,
  ...viewerProps
}: ShadcnViewerProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      {(showExportButton || showPrintButton) && (
        <div className="flex justify-end gap-2">
          {showExportButton && onExport && (
            <Button onClick={onExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          {showPrintButton && (
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          )}
        </div>
      )}

      {/* Viewer component */}
      <Viewer {...viewerProps} />
    </div>
  )
}
