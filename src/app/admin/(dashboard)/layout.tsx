import { Suspense } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { AdminShell } from '@/components/admin/admin-shell'
import { adminLabel, requireAdmin } from '@/lib/auth/admin'
import { countNewApplications } from '@/lib/data/admin/applications'
import { countNewInquiries } from '@/lib/data/admin/inquiries'

// every screen here depends on who is signed in, so let navigations wait on the server
export const instant = false

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

// avatar circle with the admin's initial, then their name; links to the account screen (reference layout)
async function AccountBadge() {
  const admin = await requireAdmin()
  const label = adminLabel(admin)
  return (
    <Link
      href='/admin/account'
      className='inline-flex items-center gap-2.5 rounded-lg text-small text-ink hover:text-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
    >
      <span
        aria-hidden
        className='flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-small text-paper'
      >
        {initial(label)}
      </span>
      <span className='max-w-40 truncate font-medium'>{label}</span>
    </Link>
  )
}

// applications nobody has opened a review on yet
async function NewApplications() {
  await requireAdmin()
  const count = await countNewApplications()
  if (!count) return null
  return (
    <span className='font-mono text-label text-muted tabular-nums'>
      {count}
      <span className='sr-only'> new</span>
    </span>
  )
}

// enquiries nobody has marked handled yet
async function NewEnquiries() {
  await requireAdmin()
  const count = await countNewInquiries()
  if (!count) return null
  return (
    <span className='font-mono text-label text-muted tabular-nums'>
      {count}
      <span className='sr-only'> new</span>
    </span>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell
      badges={{
        '/admin/applications': (
          <Suspense fallback={null}>
            <NewApplications />
          </Suspense>
        ),
        '/admin/enquiries': (
          <Suspense fallback={null}>
            <NewEnquiries />
          </Suspense>
        ),
      }}
      account={
        <Suspense fallback={null}>
          <AccountBadge />
        </Suspense>
      }
    >
      <Suspense fallback={<p className='font-mono text-label uppercase text-muted'>Loading…</p>}>{children}</Suspense>
    </AdminShell>
  )
}
