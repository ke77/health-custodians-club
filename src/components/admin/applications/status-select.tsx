'use client'

import { useState, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { FormMessage } from '@/components/admin/form-message'
import { updateApplicationStatus } from '@/lib/actions/admin/applications'
import type { ActionResult } from '@/lib/actions/admin/admins'
import { selectableStatuses } from '@/lib/config/application-status'
import type { ApplicationStatus } from '@/lib/config/application-status'
import { cn } from '@/lib/utils/cn'

// changes save straight away; a wrong choice is undone by choosing again
export function StatusSelect({ id, status }: { id: string; status: ApplicationStatus }) {
  const [value, setValue] = useState(status)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function change(next: ApplicationStatus) {
    const previous = value
    setValue(next)
    setResult(null)
    startTransition(async () => {
      const r = await updateApplicationStatus({ id, status: next })
      if (!r.ok) setValue(previous)
      setResult(r)
    })
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor='status' className='font-mono text-label uppercase text-muted'>
        Status
      </label>
      <div className='relative'>
        <select
          id='status'
          value={value}
          disabled={pending}
          onChange={(e) => change(e.target.value as ApplicationStatus)}
          className={cn(
            'min-h-11 w-full appearance-none rounded-sm bg-sand px-4 pr-10 font-body text-base font-medium text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-60',
          )}
        >
          {selectableStatuses(status).map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted' aria-hidden />
      </div>
      <FormMessage result={result} />
    </div>
  )
}
