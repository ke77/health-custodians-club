'use client'

import { useRef, useState, useTransition } from 'react'
import { saveApplicationNotes } from '@/lib/actions/admin/applications'
import { cn } from '@/lib/utils/cn'

type State = 'idle' | 'saving' | 'saved' | 'error'

const stateText: Record<State, string> = {
  idle: 'Saved when you click away.',
  saving: 'Saving…',
  saved: 'Saved.',
  error: 'Could not save. Click away again to retry.',
}

// private notes for reviewers; never shown to the applicant. saves on blur, only when something changed
export function NotesField({ id, initial }: { id: string; initial: string }) {
  const [notes, setNotes] = useState(initial)
  const [state, setState] = useState<State>('idle')
  const [, startTransition] = useTransition()
  const lastSaved = useRef(initial)

  function save() {
    if (notes === lastSaved.current) return
    const value = notes
    setState('saving')
    startTransition(async () => {
      const r = await saveApplicationNotes({ id, notes: value })
      if (r.ok) lastSaved.current = value
      setState(r.ok ? 'saved' : 'error')
    })
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor='notes' className='font-mono text-label uppercase text-muted'>
        Private notes
      </label>
      <textarea
        id='notes'
        rows={6}
        maxLength={5000}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value)
          if (state !== 'saving') setState('idle')
        }}
        onBlur={save}
        aria-describedby='notes-state'
        placeholder='For example: student ID checked with the Ashanti rep.'
        className='min-h-11 resize-y rounded-sm bg-sand px-4 py-3 font-body text-base leading-relaxed text-ink placeholder:text-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
      />
      <p id='notes-state' aria-live='polite' className={cn('text-small', state === 'error' ? 'text-error' : 'text-muted')}>
        {stateText[state]}
      </p>
    </div>
  )
}
