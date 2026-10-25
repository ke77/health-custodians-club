'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { TurnstileWidget } from '@/components/ui/turnstile'
import { joinWaitlist } from '@/lib/actions/join-waitlist'

const messages: Record<'invalid' | 'rate_limited' | 'turnstile' | 'error', string> = {
  invalid: 'Enter a valid email address.',
  rate_limited: 'That is a few tries in a short time. Please wait a few minutes.',
  turnstile: 'We could not confirm you are human. Try the box above again.',
  error: 'Something went wrong. Please try again in a moment.',
}

// shown when applications are closed: joins the waiting list for the next cohort
export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = await joinWaitlist({ email, website }, token ?? undefined)
      if (r.ok) setDone(true)
      else setError(messages[r.reason])
    })
  }

  if (done) {
    return (
      <p role='status' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
        Thank you. We will email you when applications open. You can close this page.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col gap-4'>
      <Input
        id='waitlist-email'
        label='Email'
        type='email'
        autoComplete='email'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
      />
      {/* honeypot: visually hidden, ignored by people, filled only by bots */}
      <div aria-hidden className='absolute left-[-9999px]' tabIndex={-1}>
        <label htmlFor='waitlist-website'>Website</label>
        <input
          id='waitlist-website'
          type='text'
          tabIndex={-1}
          autoComplete='off'
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <TurnstileWidget onToken={setToken} />
      <Button type='submit' variant='primary' disabled={pending} className='self-start px-8 py-3.5 text-ink'>
        {pending ? 'Adding you…' : 'Notify me when applications open'}
      </Button>
    </form>
  )
}
