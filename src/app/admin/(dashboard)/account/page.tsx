import type { Metadata } from 'next'
import { NameForm, PasswordForm } from '@/components/admin/account-forms'
import { InstallApp } from '@/components/admin/install-app'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'

export const metadata: Metadata = { title: 'Your account' }

export default async function AccountPage() {
  const me = await requireAdmin()

  return (
    <>
      <PageHeader title='Your account' description={<>Signed in as {me.email}.</>} />

      <div className='mt-10 grid max-w-2xl gap-14'>
        <section aria-labelledby='name-heading'>
          <h2 id='name-heading' className='mb-6 font-body text-md font-semibold text-ink'>
            Name
          </h2>
          <NameForm initialName={me.name ?? ''} />
        </section>

        <section aria-labelledby='password-heading' className='border-t border-rule pt-10'>
          <h2 id='password-heading' className='font-body text-md font-semibold text-ink'>
            Password
          </h2>
          <p className='mt-2 mb-6 font-body text-base text-ink/70'>
            Optional. With a password you can sign in without waiting for an email code. If you forget it, sign in
            with a code and set a new one here.
          </p>
          <PasswordForm />
        </section>

        <section aria-labelledby='install-heading' className='border-t border-rule pt-10'>
          <h2 id='install-heading' className='font-body text-md font-semibold text-ink'>
            Dashboard app
          </h2>
          <p className='mt-2 mb-6 font-body text-base text-ink/70'>
            Add the dashboard to your phone&rsquo;s home screen. It opens full-screen like an app and keeps you signed
            in.
          </p>
          <InstallApp />
        </section>
      </div>
    </>
  )
}
