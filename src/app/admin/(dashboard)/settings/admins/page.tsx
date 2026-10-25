import type { Metadata } from 'next'
import { AddAdminForm } from '@/components/admin/add-admin-form'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { PageHeader } from '@/components/admin/page-header'
import { removeAdmin } from '@/lib/actions/admin/admins'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Admins' }

export default async function AdminsPage() {
  const me = await requireAdmin()
  const supabase = await createClient()
  const { data: admins } = await supabase
    .from('admins')
    .select('id, email, name, added_by, created_at')
    .order('created_at', { ascending: true })

  const list = admins ?? []

  return (
    <>
      <PageHeader
        title='Admins'
        description='Everyone here can sign in to this dashboard and do everything in it. When a new executive team takes over, add the new emails first, then remove the old ones.'
      />

      <section aria-labelledby='current-admins' className='mt-10'>
        <h2 id='current-admins' className='font-mono text-label uppercase text-muted'>
          {list.length} {list.length === 1 ? 'admin' : 'admins'}
        </h2>
        <ul className='mt-4 divide-y divide-rule border-y border-rule'>
          {list.map((admin) => {
            const isMe = admin.id === me.id
            return (
              <li key={admin.id} className='flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0'>
                  <p className='truncate font-body text-base font-medium text-ink'>
                    {admin.name || admin.email}
                    {isMe && <span className='ml-2 font-mono text-label uppercase text-muted'>You</span>}
                  </p>
                  {admin.name && <p className='truncate text-small text-ink/70'>{admin.email}</p>}
                  <p className='mt-1 text-small text-muted'>
                    Added {formatDate(admin.created_at)}
                    {admin.added_by && ` by ${admin.added_by}`}
                  </p>
                </div>
                {!isMe && list.length > 1 && (
                  <ConfirmButton
                    label='Remove'
                    ariaLabel={`Remove ${admin.email}`}
                    title='Remove this admin?'
                    body={
                      <>
                        <span className='font-medium text-ink'>{admin.email}</span> will be signed out and will no
                        longer be able to open the dashboard. You can add them again later.
                      </>
                    }
                    confirmLabel='Remove admin'
                    onConfirm={removeAdmin.bind(null, admin.id)}
                    className='self-start sm:self-auto'
                  />
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby='add-admin' className='mt-14 max-w-2xl'>
        <h2 id='add-admin' className='font-body text-md font-semibold text-ink'>
          Add an admin
        </h2>
        <p className='mt-2 mb-6 font-body text-base text-ink/70'>
          They sign in with a code sent to this email, and can set a password afterwards.
        </p>
        <AddAdminForm />
      </section>
    </>
  )
}
