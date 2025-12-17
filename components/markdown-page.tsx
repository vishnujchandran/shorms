'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { codeToHtml } from 'shiki'
import { ArrowLeft, Check, Copy, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [html, setHtml] = React.useState<string | null>(null)
  const [error, setError] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const code = String(children).replace(/\n$/, '')
  const match = /language-(\w+)/.exec(className || '')
  const lang = match ? match[1] : 'text'

  React.useEffect(() => {
    codeToHtml(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
      .then(setHtml)
      .catch((err) => {
        console.error('Shiki error:', err)
        setError(true)
      })
  }, [code, lang])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!html || error) {
    return (
      <pre className="rounded-lg border bg-muted/50 p-4 overflow-x-auto">
        <code className="text-sm font-mono whitespace-pre">{code}</code>
      </pre>
    )
  }

  return (
    <div className="not-prose group relative my-4">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md border bg-background/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <div
        className="[&_pre]:rounded-lg [&_pre]:border [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

interface MarkdownPageProps {
  content: string
  filename: string
  title: string
  description?: string
}

export function MarkdownPage({ content, filename, title, description }: MarkdownPageProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <h1 className="text-sm font-semibold">{title}</h1>
              <p className="text-xs text-muted-foreground">{filename}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Markdown
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        {description && (
          <p className="mb-8 text-lg text-muted-foreground">{description}</p>
        )}
        <article
          className={cn(
            'prose prose-neutral dark:prose-invert max-w-none',
            // Headings
            'prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight',
            'prose-h1:text-3xl prose-h1:border-b prose-h1:pb-4 prose-h1:mb-6',
            'prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2',
            'prose-h3:text-xl prose-h3:mt-8',
            // Paragraphs and lists
            'prose-p:leading-7',
            'prose-li:my-1',
            // Code
            'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
            'prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted/50',
            // Links
            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
            // Tables
            'prose-table:border prose-th:border prose-th:px-4 prose-th:py-2 prose-th:bg-muted/50',
            'prose-td:border prose-td:px-4 prose-td:py-2',
            // Blockquotes
            'prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:not-italic',
            // HR
            'prose-hr:my-8'
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, node, ...props }) {
                // Check if this is a code block (has language class) or inline code
                const isCodeBlock = /language-(\w+)/.test(className || '')
                if (isCodeBlock) {
                  // Will be handled by pre component
                  return <code className={className} {...props}>{children}</code>
                }
                // Inline code
                return (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              pre({ children, node }) {
                // Get the code element's props
                const codeChild = React.Children.toArray(children)[0]
                if (React.isValidElement(codeChild)) {
                  const { className, children: codeContent } = codeChild.props
                  return <CodeBlock className={className}>{codeContent}</CodeBlock>
                }
                return <pre>{children}</pre>
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
