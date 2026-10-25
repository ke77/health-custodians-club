import type { Metadata } from 'next'
import { ApplicationWindowForm } from '@/components/admin/settings/application-window-form'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { getAdminSettings } from '@/lib/data/settings'
import { isoToAccraLocal } from '@/lib/validation/admin/settings'

export const metadata: Metadata = { title: 'Applications window' }

export default async function ApplicationWindowPage() {
  await requireAdmin()
  const settings = await getAdminSettings()

  return (
    <>
      <PageHeader
        title='Applications window'
        description='Open or close applications, set the cohort and an optional deadline. Changes show on the site within seconds.'
      />
      <div className='mt-10'>
        <ApplicationWindowForm
          initial={{
            applicationsOpen: settings.applicationsOpen,
            deadline: isoToAccraLocal(settings.applicationDeadline),
            cohort: settings.currentCohort,
          }}
        />
      </div>
    </>
  )
}
