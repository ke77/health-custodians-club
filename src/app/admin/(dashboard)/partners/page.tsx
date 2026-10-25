import type { Metadata } from 'next'
import { PartnerManager } from '@/components/admin/partners/partner-manager'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { listPartners } from '@/lib/data/admin/partners'

export const metadata: Metadata = { title: 'Partners' }

export default async function PartnersPage() {
  await requireAdmin()
  const partners = await listPartners()

  return (
    <>
      <PageHeader
        title='Partners'
        description='Partners and supporters shown on the public partners page. Add a logo and a link, then publish.'
      />
      <div className='mt-10'>
        <PartnerManager partners={partners} />
      </div>
    </>
  )
}
