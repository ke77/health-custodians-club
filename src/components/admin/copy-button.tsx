'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// copies a value (student ID, email) for cross-checking with regional representatives
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked (http or old browser): the value is still on screen to select by hand
    }
  }

  return (
    <button
      type='button'
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
        className,
      )}
    >
      {copied ? <Check className='size-4' aria-hidden /> : <Copy className='size-4' aria-hidden />}
    </button>
  )
}
