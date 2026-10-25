'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/admin/form-message'
import { requestCode, signInWithPassword, verifyCode } from '@/lib/actions/admin/auth'
import type { AuthResult } from '@/lib/actions/admin/auth'

type Stage = 'email' | 'code' | 'password'

const textButton =
  'rounded-xs text-small text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

/*
  one email field, then either a 6-digit code sent by email or a password.
  new admins always start with a code; they can set a password under "Your account" afterwards.
*/
export function LoginForm() {
  const [stage, setStage] = useState<Stage>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<AuthResult | null>(null)
  const [pending, startTransition] = useTransition()

  function run(action: () => Promise<AuthResult>, onOk?: () => void) {
    setResult(null)
    startTransition(async () => {
      const r = await action()
      // a successful sign-in redirects, so only failures and the code request come back here
      if (r.ok) onOk?.()
      else setResult(r)
    })
  }

  function sendCode() {
    run(
      () => requestCode({ email }),
      () => {
        setCode('')
        setStage('code')
      },
    )
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (stage === 'email') sendCode()
    if (stage === 'code') run(() => verifyCode({ email, code }))
    if (stage === 'password') run(() => signInWithPassword({ email, password }))
  }

  function back() {
    setResult(null)
    setStage('email')
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col gap-2'>
      {stage === 'email' && (
        <>
          <Input
            id='email'
            label='Email'
            type='email'
            autoComplete='email'
            inputMode='email'
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex flex-col gap-3'>
            <Button type='submit' variant='dark' disabled={pending} className='w-full'>
              {pending ? 'Sending…' : 'Email me a sign-in code'}
            </Button>
            <Button
              variant='outline'
              disabled={pending}
              onClick={() => {
                setResult(null)
                setStage('password')
              }}
              className='w-full border border-rule'
            >
              Use my password
            </Button>
          </div>
        </>
      )}

      {stage === 'code' && (
        <>
          <p className='mb-4 font-body text-base text-ink/70'>
            If <span className='font-medium text-ink'>{email}</span> belongs to an admin, a 6-digit code is on its
            way. It expires in 10 minutes. Check your spam folder too.
          </p>
          <Input
            id='code'
            label='Sign-in code'
            inputMode='numeric'
            autoComplete='one-time-code'
            pattern='[0-9]*'
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className='font-mono tracking-[0.4em]'
          />
          <Button type='submit' variant='dark' disabled={pending || code.length !== 6} className='w-full'>
            {pending ? 'Checking…' : 'Sign in'}
          </Button>
          <div className='mt-4 flex flex-wrap justify-between gap-3'>
            <button type='button' onClick={sendCode} disabled={pending} className={textButton}>
              Send a new code
            </button>
            <button type='button' onClick={back} className={textButton}>
              Use a different email
            </button>
          </div>
        </>
      )}

      {stage === 'password' && (
        <>
          <Input
            id='email'
            label='Email'
            type='email'
            autoComplete='username'
            inputMode='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            autoComplete='current-password'
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' variant='dark' disabled={pending} className='w-full'>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
          <div className='mt-4 flex flex-wrap justify-between gap-3'>
            <button type='button' onClick={sendCode} disabled={pending} className={textButton}>
              Forgot it? Email me a code
            </button>
            <button type='button' onClick={back} className={textButton}>
              Back
            </button>
          </div>
        </>
      )}

      <FormMessage result={result} className='mt-4' />
    </form>
  )
}
