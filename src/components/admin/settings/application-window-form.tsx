'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/admin/form-message'
import { updateApplicationWindow } from '@/lib/actions/admin/settings'
import type { ActionResult } from '@/lib/actions/admin/admins'
import { cn } from '@/lib/utils/cn'

type Props = {
  initial: { applicationsOpen: boolean; deadline: string; cohort: string }
}

export function ApplicationWindowForm({ initial }: Props) {
  const [open, setOpen] = useState(initial.applicationsOpen)
  const [deadline, setDeadline] = useState(initial.deadline)
  const [cohort, setCohort] = useState(initial.cohort)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => setResult(await updateApplicationWindow({ applicationsOpen: open, deadline, cohort })))
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex max-w-xl flex-col gap-8'>
      {/* the open/closed switch */}
      <div className='flex items-start justify-between gap-6 border-b border-rule pb-6'>
        <span className='flex flex-col gap-1'>
          <span className='font-body text-base font-medium text-ink'>Applications are {open ? 'open' : 'closed'}</span>
          <span className='font-body text-small text-muted'>
            When closed, the apply page shows a waiting-list form instead.
          </span>
        </span>
        <button
          type='button'
          role='switch'
          aria-checked={open}
          aria-label='Applications open'
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
            open ? 'bg-teal' : 'bg-ink/20',
          )}
        >
          <span className={cn('inline-block size-5 rounded-full bg-paper transition-transform', open ? 'translate-x-6' : 'translate-x-1')} />
        </button>
      </div>

      <Input
        id='cohort'
        label='Current cohort'
        hint='Shown on confirmations and stored with each application, for example 2026/27.'
        value={cohort}
        onChange={(e) => setCohort(e.target.value)}
        required
      />

      <Input
        id='deadline'
        label='Deadline (optional)'
        hint='Accra time. After this, the apply page refuses new applications even if the switch is on. Leave empty for no deadline.'
        type='datetime-local'
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <div className='flex flex-wrap items-center gap-4'>
        <Button type='submit' variant='dark' disabled={pending} className='px-6'>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <FormMessage result={result} />
      </div>
    </form>
  )
}
