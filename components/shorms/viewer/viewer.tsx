/**
 * Viewer Component
 * Read-only display for form schemas and submissions
 */

'use client'

import React, { useState } from 'react'
import type { ViewerProps, ViewMode } from './types'
import { FieldDisplay } from './field-display'
import {
  getFormStatistics,
  formatDate,
  getWidthClass,
  getFieldTypeLabel,
} from './utils'

export function Viewer({
  pages,
  submissionData,
  mode = 'detailed',
  showValidation = true,
  showFieldTypes = true,
  showPageNavigation = true,
  showMetadata = true,
  metadata,
  className = '',
  width = 'lg',
  onPrevious,
  onNext,
  onSubmit,
  showToolbar = true,
}: ViewerProps) {
  const [activePage, setActivePage] = useState(0)
  const stats = getFormStatistics(pages)

  // Summary mode: show statistics only
  if (mode === 'summary') {
    return (
      <div className={`${getWidthClass(width)} mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          {/* Metadata */}
          {showMetadata && metadata?.title && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {metadata.title}
              </h2>
              {metadata.description && (
                <p className="text-gray-600 mt-2">{metadata.description}</p>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Form Statistics
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Pages</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalPages}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Total Fields</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalFields}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Required Fields</dt>
                  <dd className="text-2xl font-bold text-red-600">
                    {stats.requiredFields}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Optional Fields</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalFields - stats.requiredFields}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Field types breakdown */}
            {Object.keys(stats.fieldTypes).length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Field Types
                </h4>
                <ul className="space-y-1">
                  {Object.entries(stats.fieldTypes).map(([type, count]) => (
                    <li key={type} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {getFieldTypeLabel(type)}
                      </span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata dates */}
            {showMetadata && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Information
                </h4>
                <dl className="space-y-1 text-sm">
                  {metadata?.createdAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Created</dt>
                      <dd className="text-gray-900">
                        {formatDate(metadata.createdAt)}
                      </dd>
                    </div>
                  )}
                  {metadata?.updatedAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Last Updated</dt>
                      <dd className="text-gray-900">
                        {formatDate(metadata.updatedAt)}
                      </dd>
                    </div>
                  )}
                  {metadata?.submittedAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Submitted</dt>
                      <dd className="text-gray-900">
                        {formatDate(metadata.submittedAt)}
                      </dd>
                    </div>
                  )}
                  {metadata?.submittedBy && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Submitted By</dt>
                      <dd className="text-gray-900">{metadata.submittedBy}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Detailed or Compact mode
  const currentPage = pages[activePage]
  const shouldShowPageNav = showPageNavigation && pages.length > 1

  return (
    <div className={`${getWidthClass(width)} mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header with metadata */}
        {showMetadata && metadata && (
          <div className="p-6 border-b border-gray-200">
            {metadata.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {metadata.title}
              </h2>
            )}
            {metadata.description && (
              <p className="text-gray-600 mb-4">{metadata.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {metadata.createdAt && (
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {formatDate(metadata.createdAt)}
                </div>
              )}
              {metadata.submittedAt && (
                <div>
                  <span className="font-medium">Submitted:</span>{' '}
                  {formatDate(metadata.submittedAt)}
                </div>
              )}
              {metadata.submittedBy && (
                <div>
                  <span className="font-medium">By:</span> {metadata.submittedBy}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page navigation */}
        {shouldShowPageNav && (
          <div className="px-6 pt-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(index)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    index === activePage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page.title || `Page ${index + 1}`}
                  <span className="ml-2 text-xs opacity-75">
                    ({page.fields.length} fields)
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="p-6">
          {currentPage && (
            <>
              {/* Page title for detailed mode */}
              {mode === 'detailed' && (
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {currentPage.title || `Page ${activePage + 1}`}
                </h3>
              )}

              {/* Fields */}
              {currentPage.fields.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No fields in this page
                </div>
              ) : (
                <div>
                  {currentPage.fields.map((field) => (
                    <FieldDisplay
                      key={field.id}
                      field={field}
                      value={submissionData?.[field.name]}
                      mode={mode}
                      showValidation={showValidation}
                      showFieldType={showFieldTypes}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with stats */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex justify-between">
            <div>
              {stats.totalPages} page{stats.totalPages !== 1 ? 's' : ''} •{' '}
              {stats.totalFields} field{stats.totalFields !== 1 ? 's' : ''} •{' '}
              {stats.requiredFields} required
            </div>
            {shouldShowPageNav && (
              <div>
                Page {activePage + 1} of {pages.length}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Toolbar */}
        {showToolbar && (
          <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  if (onPrevious) {
                    onPrevious()
                  } else if (activePage > 0) {
                    setActivePage(activePage - 1)
                  }
                }}
                disabled={activePage === 0}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activePage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <button
                onClick={() => {
                  const isLastPage = activePage === pages.length - 1
                  if (isLastPage) {
                    onSubmit?.()
                  } else if (onNext) {
                    onNext()
                  } else {
                    setActivePage(activePage + 1)
                  }
                }}
                className="px-6 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {activePage === pages.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
