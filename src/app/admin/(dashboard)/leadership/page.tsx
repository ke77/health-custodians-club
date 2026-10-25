import type { Metadata } from 'next'
import { PersonManager } from '@/components/admin/leadership/person-manager'
import { RegionManager } from '@/components/admin/leadership/region-manager'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { listPeople } from '@/lib/data/admin/people'
import { listRegions } from '@/lib/data/admin/regions'

export const metadata: Metadata = { title: 'Leadership' }

export default async function LeadershipPage() {
  await requireAdmin()
  const [people, regions] = await Promise.all([listPeople(), listRegions()])

  return (
    <>
      <PageHeader
        title='Leadership'
        description='The Executive Committee and Board of Advisers shown on the About page, and each region with its head.'
      />
      <div className='mt-10 flex flex-col gap-16'>
        <PersonManager type='executive' people={people} />
        <PersonManager type='adviser' people={people} />
        <RegionManager regions={regions} />
      </div>
    </>
  )
}
