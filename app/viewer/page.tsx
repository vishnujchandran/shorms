'use client'

import { Suspense } from 'react'
import { FormApp } from '@/components/form-app'

function ViewerContent() {
  return <FormApp mode="viewer" />
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ViewerContent />
    </Suspense>
  )
}
