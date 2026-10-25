'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/admin/form-message'
import { setMyPassword, updateMyName } from '@/lib/actions/admin/admins'
import type { ActionResult } from '@/lib/actions/admin/admins'
import { minPasswordLength } from '@/lib/validation/admin/auth'

export function NameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => setResult(await updateMyName({ name })))
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col'>
      <Input
        id='my-name'
        label='Your name'
        hint='Shown to other admins, for example next to status changes.'
        autoComplete='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className='flex flex-wrap items-center gap-4'>
        <Button type='submit' variant='dark' disabled={pending} className='px-6'>
          {pending ? 'Saving…' : 'Save name'}
        </Button>
        <FormMessage result={result} />
      </div>
    </form>
  )
}

export function PasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => {
      const r = await setMyPassword({ password, confirm })
      setResult(r)
      if (r.ok) {
        setPassword('')
        setConfirm('')
      }
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col'>
      <Input
        id='new-password'
        label='New password'
        hint={`At least ${minPasswordLength} characters. A short sentence is easy to remember.`}
        type='password'
        autoComplete='new-password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        id='confirm-password'
        label='Type it again'
        type='password'
        autoComplete='new-password'
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <div className='flex flex-wrap items-center gap-4'>
        <Button type='submit' variant='dark' disabled={pending} className='px-6'>
          {pending ? 'Saving…' : 'Save password'}
        </Button>
        <FormMessage result={result} />
      </div>
    </form>
  )
}
