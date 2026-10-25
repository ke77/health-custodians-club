'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/admin/form-message'
import { addAdmin } from '@/lib/actions/admin/admins'
import type { ActionResult } from '@/lib/actions/admin/admins'

export function AddAdminForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => {
      const r = await addAdmin({ email, name })
      setResult(r)
      if (r.ok) {
        setEmail('')
        setName('')
      }
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className='grid gap-x-6 sm:grid-cols-2'>
      <Input
        id='admin-email'
        label='Email'
        type='email'
        autoComplete='off'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id='admin-name'
        label='Name (optional)'
        autoComplete='off'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className='flex flex-wrap items-center gap-4 sm:col-span-2'>
        <Button type='submit' variant='dark' disabled={pending} className='px-6'>
          {pending ? 'Adding…' : 'Add admin'}
        </Button>
        <FormMessage result={result} />
      </div>
    </form>
  )
}
