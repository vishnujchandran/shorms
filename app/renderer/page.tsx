'use client'

import { Suspense } from 'react'
import { FormApp } from '@/components/form-app'

function RendererContent() {
  return <FormApp mode="renderer" />
}

export default function RendererPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <RendererContent />
    </Suspense>
  )
}
