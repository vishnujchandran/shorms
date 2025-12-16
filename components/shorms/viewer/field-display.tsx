/**
 * Field Display Component
 * Displays individual form field with validation and optional submission value
 */

import React from 'react'
import type { FormField } from '@/types/field'
import type { ViewMode } from './types'
import {
  formatFieldValue,
  getValidationSummary,
  getFieldTypeLabel,
} from './utils'

interface FieldDisplayProps {
  field: FormField
  value?: any
  mode: ViewMode
  showValidation: boolean
  showFieldType: boolean
}

export function FieldDisplay({
  field,
  value,
  mode,
  showValidation,
  showFieldType,
}: FieldDisplayProps) {
  const validationRules = getValidationSummary(field.validation)
  const hasValue = value !== undefined && value !== null && value !== ''

  if (mode === 'summary') {
    // Summary mode: minimal display
    return (
      <div className="py-1 text-sm">
        <span className="font-medium">{field.label}</span>
        {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </div>
    )
  }

  if (mode === 'compact') {
    // Compact mode: single line with key info
    return (
      <div className="py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{field.label}</span>
              {field.validation?.required && (
                <span className="text-red-500 text-xs">*</span>
              )}
              {showFieldType && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {getFieldTypeLabel(field.type)}
                </span>
              )}
            </div>
            {showValidation && validationRules.length > 0 && (
              <div className="text-xs text-gray-600">
                {validationRules.join(' • ')}
              </div>
            )}
          </div>
          {hasValue && (
            <div className="text-sm font-mono bg-blue-50 px-3 py-1 rounded border border-blue-200">
              {formatFieldValue(field, value)}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Detailed mode: full information
  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4 bg-white">
      {/* Field header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {field.label}
            {field.validation?.required && (
              <span className="text-red-500">*</span>
            )}
          </h4>
          {field.description && (
            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
          )}
        </div>
        {showFieldType && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
            {getFieldTypeLabel(field.type)}
          </span>
        )}
      </div>

      {/* Field details */}
      <div className="space-y-2 text-sm">
        {field.placeholder && (
          <div className="text-gray-600">
            <span className="font-medium">Placeholder:</span> {field.placeholder}
          </div>
        )}

        {/* Validation rules */}
        {showValidation && validationRules.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Validation:</span>
            <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
              {validationRules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Options for select/radio fields */}
        {(() => {
          const choices = (field as any).choices || (field as any).options
          if (choices && choices.length > 0) {
            return (
              <div>
                <span className="font-medium text-gray-700">Options:</span>
                <ul className="list-disc list-inside ml-2 mt-1 text-gray-600">
                  {choices.map((option: any, idx: number) => (
                    <li key={idx}>
                      {option.label} ({option.value})
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          return null
        })()}

        {/* Submitted value */}
        {hasValue && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="font-medium text-gray-700">Submitted Value:</span>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded font-mono text-blue-900">
              {formatFieldValue(field, value)}
            </div>
          </div>
        )}

        {!hasValue && value !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="font-medium text-gray-500">
              No value submitted
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
