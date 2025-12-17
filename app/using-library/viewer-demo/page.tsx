/**
 * Viewer Demo Page
 * Demonstrates the Viewer component with different modes and options
 */

'use client'

import { Viewer, type ViewMode, type FormPage } from '@/index'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Import example form schemas
import feedbackSurvey from '@/examples/feedback-survey.json'

// Example submission data
const exampleSubmission = {
  respondent_name: 'John Doe',
  respondent_email: 'john.doe@example.com',
  customer_type: 'returning',
  overall_satisfaction: 9,
  product_quality: 8,
  customer_service: 9,
  value_for_money: 4,
  what_liked: 'Great product quality and excellent customer service. Very satisfied with my purchase.',
  what_improve: 'Shipping could be faster. Also, the website could be more mobile-friendly.',
  would_recommend: 'yes',
  allow_followup: true,
}

export default function ViewerDemoPage() {
  const [mode, setMode] = useState<ViewMode>('detailed')
  const [showSubmission, setShowSubmission] = useState(true)
  const [showValidation, setShowValidation] = useState(true)
  const [showFieldTypes, setShowFieldTypes] = useState(true)

  const handleExport = () => {
    const data = {
      schema: feedbackSurvey,
      submission: showSubmission ? exampleSubmission : undefined,
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-view-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Viewer Demo</h1>
              <p className="text-gray-600 mt-2">
                Using the extracted Viewer component from the library
              </p>
            </div>
            <Link href="/using-library">
              <Button variant="outline">← Back to Demos</Button>
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Library Mode:</strong> This page demonstrates the standalone Viewer component
              that can display form schemas and submitted data in multiple view modes.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">View Options</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={mode === 'detailed' ? 'default' : 'outline'}
                  onClick={() => setMode('detailed')}
                >
                  Detailed
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'compact' ? 'default' : 'outline'}
                  onClick={() => setMode('compact')}
                >
                  Compact
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'summary' ? 'default' : 'outline'}
                  onClick={() => setMode('summary')}
                >
                  Summary
                </Button>
              </div>
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showSubmission}
                    onChange={(e) => setShowSubmission(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show submission data</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showValidation}
                    onChange={(e) => setShowValidation(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show validation rules</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showFieldTypes}
                    onChange={(e) => setShowFieldTypes(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show field types</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Viewer Component */}
        <Viewer
          pages={feedbackSurvey as FormPage[]}
          submissionData={showSubmission ? exampleSubmission : undefined}
          mode={mode}
          showValidation={showValidation}
          showFieldTypes={showFieldTypes}
          showPageNavigation={true}
          showMetadata={true}
          metadata={{
            title: 'Customer Feedback Survey',
            description: 'A comprehensive survey form to collect customer feedback and satisfaction ratings',
            createdAt: '2025-12-01T10:00:00Z',
            updatedAt: '2025-12-15T14:30:00Z',
            submittedAt: showSubmission ? '2025-12-16T15:45:00Z' : undefined,
            submittedBy: showSubmission ? 'john.doe@example.com' : undefined,
          }}
          width="full"
          showExportButton={true}
          showPrintButton={true}
          onExport={handleExport}
        />

        {/* Info */}
        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">About This Demo</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              The Viewer component provides a read-only display for form schemas and submission data.
              It supports three view modes:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Detailed:</strong> Complete information with full validation rules and descriptions
              </li>
              <li>
                <strong>Compact:</strong> Condensed view with essential information
              </li>
              <li>
                <strong>Summary:</strong> High-level statistics and metadata only
              </li>
            </ul>
            <p className="mt-4">
              Use cases: Form inspection, submission viewing, documentation, debugging, form comparison
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Library Mode - No Zustand Required | All Three Components Complete</p>
        </div>
      </div>
    </div>
  )
}
