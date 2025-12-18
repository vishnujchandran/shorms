'use client'

import { Suspense } from 'react'
import { FormApp } from '@/components/form-app'

function BuilderContent() {
  return <FormApp mode="builder" />
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BuilderContent />
    </Suspense>
  )
}
