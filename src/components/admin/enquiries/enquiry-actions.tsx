'use client'

import { useTransition } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { setInquiryStatus } from '@/lib/actions/admin/inquiries'
import { cn } from '@/lib/utils/cn'

const button =
  'inline-flex items-center gap-1.5 rounded-xs text-small text-ink/70 hover:text-ink disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

// toggles an enquiry between new and handled
export function MarkButton({ id, status }: { id: string; status: 'new' | 'handled' }) {
  const [pending, startTransition] = useTransition()
  const next = status === 'new' ? 'handled' : 'new'

  return (
    <button
      type='button'
      disabled={pending}
      onClick={() => startTransition(() => setInquiryStatus({ id, status: next }).then(() => undefined))}
      className={cn(button, status === 'new' && 'font-medium text-ink')}
    >
      {status === 'new' ? (
        <>
          <Check className='size-4' aria-hidden /> Mark handled
        </>
      ) : (
        <>
          <RotateCcw className='size-3.5' aria-hidden /> Mark new
        </>
      )}
    </button>
  )
}
