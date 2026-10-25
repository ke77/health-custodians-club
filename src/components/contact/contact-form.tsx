'use client'

import { useEffect, useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { TurnstileWidget } from '@/components/ui/turnstile'
import { SET_INTEREST_EVENT } from '@/components/contact/write-to-us-link'
import { sendEnquiry } from '@/lib/actions/send-enquiry'
import { interestTypes } from '@/lib/config/contact'
import type { InterestType } from '@/lib/config/contact'
import { emptyEnquiry, enquirySchema } from '@/lib/validation/contact'
import type { EnquiryFormValues } from '@/lib/validation/contact'

type Status = 'idle' | 'sending' | 'sent' | 'rate_limited' | 'turnstile' | 'failed'
type Name = FieldPath<EnquiryFormValues>

const problemMessage: Record<'rate_limited' | 'turnstile' | 'failed', string> = {
  rate_limited: 'That is a few messages in a short time. Please wait a few minutes and try again.',
  turnstile: 'We could not confirm you are human. Tick the box below, then send again.',
  failed: 'Something went wrong on our side. Please try again in a moment.',
}

export function ContactForm() {
  const { register, control, getValues, setValue, setError, clearErrors, setFocus, reset } = useForm<EnquiryFormValues>({
    defaultValues: emptyEnquiry,
  })
  // errors through useFormState so the React Compiler cannot hold on to a stale copy
  const { errors } = useFormState({ control })
  const [status, setStatus] = useState<Status>('idle')
  const [token, setToken] = useState<string | null>(null)

  // a "write to us" link on the page preselects the interest
  useEffect(() => {
    const onSet = (e: Event) => {
      setValue('interest', (e as CustomEvent<InterestType>).detail)
      clearErrors('interest')
    }
    window.addEventListener(SET_INTEREST_EVENT, onSet)
    return () => window.removeEventListener(SET_INTEREST_EVENT, onSet)
  }, [setValue, clearErrors])

  const reg = (name: Name) => register(name, { onChange: () => clearErrors(name) })

  async function onSubmit() {
    const result = enquirySchema.safeParse(getValues())
    if (!result.success) {
      const seen = new Set<string>()
      for (const issue of result.error.issues) {
        const path = String(issue.path[0])
        if (seen.has(path)) continue
        seen.add(path)
        setError(path as Name, { type: 'manual', message: issue.message })
      }
      setFocus(String(result.error.issues[0].path[0]) as Name)
      return
    }
    setStatus('sending')
    try {
      const sent = await sendEnquiry(getValues(), token ?? undefined)
      if (sent.ok) {
        reset(emptyEnquiry)
        setStatus('sent')
      } else if (sent.reason === 'rate_limited' || sent.reason === 'turnstile') {
        setStatus(sent.reason)
      } else {
        setStatus('failed')
      }
    } catch {
      setStatus('failed')
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit()
      }}
      className='relative flex flex-col gap-5'
    >
      <Input id='name' label='Your name' autoComplete='name' error={errors.name?.message} {...reg('name')} />
      <Input
        id='email'
        type='email'
        label='Email'
        autoComplete='email'
        inputMode='email'
        error={errors.email?.message}
        {...reg('email')}
      />
      <Input
        id='organisation'
        label='Organisation (optional)'
        autoComplete='organization'
        error={errors.organisation?.message}
        {...reg('organisation')}
      />
      <Select
        id='interest'
        label='Getting in touch about'
        placeholder='Choose one'
        options={[...interestTypes]}
        error={errors.interest?.message}
        {...reg('interest')}
      />
      <Textarea id='message' label='Message' rows={7} error={errors.message?.message} {...reg('message')} />

      {/* honeypot: off-screen and skipped by keyboards and screen readers; people never fill it */}
      <div aria-hidden className='absolute -left-[10000px] size-px overflow-hidden'>
        <label htmlFor='website'>Website</label>
        <input id='website' tabIndex={-1} autoComplete='off' {...register('website')} />
      </div>

      <TurnstileWidget onToken={setToken} />

      {status === 'sent' && (
        <p role='status' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
          Thank you. Your message is with us, and we will reply by email.
        </p>
      )}
      {(status === 'rate_limited' || status === 'turnstile' || status === 'failed') && (
        <p role='alert' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
          {problemMessage[status]}
        </p>
      )}

      <div className='mt-2'>
        <Button type='submit' variant='dark' disabled={status === 'sending'} className='w-full py-4'>
          {status === 'sending' ? (
            'Sending…'
          ) : (
            <>
              Submit
              <ArrowUpRight className='size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
