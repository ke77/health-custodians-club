'use client'

import { useEffect, useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/buttons'
import { SET_INTEREST_EVENT } from '@/components/contact/write-to-us-link'
import { sendEnquiry } from '@/lib/actions/send-enquiry'
import { interestTypes } from '@/lib/config/contact'
import type { InterestType } from '@/lib/config/contact'
import { emptyEnquiry, enquirySchema } from '@/lib/validation/contact'
import type { EnquiryFormValues } from '@/lib/validation/contact'

type Status = 'idle' | 'sending' | 'sent' | 'not_connected' | 'failed'
type Name = FieldPath<EnquiryFormValues>

export function ContactForm() {
  const { register, control, getValues, setValue, setError, clearErrors, setFocus, reset } = useForm<EnquiryFormValues>({
    defaultValues: emptyEnquiry,
  })
  // errors through useFormState so the React Compiler cannot hold on to a stale copy
  const { errors } = useFormState({ control })
  const [status, setStatus] = useState<Status>('idle')

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
      const sent = await sendEnquiry(getValues())
      if (sent.ok) {
        reset(emptyEnquiry)
        setStatus('sent')
      } else {
        setStatus(sent.reason === 'not_connected' ? 'not_connected' : 'failed')
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
      className='relative flex flex-col gap-4'
    >
      <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
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
      </div>
      <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
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
      </div>
      <Textarea id='message' label='Message' rows={7} error={errors.message?.message} {...reg('message')} />

      {/* honeypot: off-screen and skipped by keyboards and screen readers; people never fill it */}
      <div aria-hidden className='absolute -left-[10000px] size-px overflow-hidden'>
        <label htmlFor='website'>Website</label>
        <input id='website' tabIndex={-1} autoComplete='off' {...register('website')} />
      </div>

      {status === 'sent' && (
        <p role='status' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
          Thank you. Your message is with us, and we will reply by email.
        </p>
      )}
      {status === 'not_connected' && (
        <p role='status' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
          Your message is ready, but we cannot receive messages online just yet. Please try again soon.
        </p>
      )}
      {status === 'failed' && (
        <p role='alert' className='rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'>
          Something went wrong on our side. Please try again in a moment.
        </p>
      )}

      <div className='mt-2'>
        <Button type='submit' variant='primary' disabled={status === 'sending'} className='px-8 py-3.5 text-ink' arrow>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
