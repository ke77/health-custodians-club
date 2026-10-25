import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { Logo } from '@/components/layout/logo'
import { getAdmin } from '@/lib/auth/admin'

export const metadata: Metadata = { title: 'Sign in' }

// already signed in as an admin: skip the form
async function RedirectIfSignedIn() {
  if (await getAdmin()) redirect('/admin')
  return null
}

export default function LoginPage() {
  return (
    <main className='flex min-h-dvh flex-col bg-paper px-6'>
      <div className='py-4'>
        <Logo href='/admin' label='Dashboard home' wordmark='HCC Dashboard' />
      </div>
      <div className='mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-24'>
        <Suspense fallback={null}>
          <RedirectIfSignedIn />
        </Suspense>
        <h1 className='font-display text-h1 text-ink'>Sign in</h1>
        <p className='mt-4 mb-10 font-body text-base text-ink/70'>
          For club executives. Use the email address the club added for you.
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
