import type { Metadata } from 'next'
import { BannerForm } from '@/components/admin/settings/banner-form'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { getAdminSettings } from '@/lib/data/settings'

export const metadata: Metadata = { title: 'Announcement banner' }

export default async function BannerSettingsPage() {
  await requireAdmin()
  const settings = await getAdminSettings()

  return (
    <>
      <PageHeader
        title='Announcement banner'
        description='A short strip across the top of every public page. Switch it off to hide it.'
      />
      <div className='mt-10'>
        <BannerForm
          initial={{
            bannerOn: settings.bannerOn,
            bannerText: settings.bannerText ?? '',
            bannerLink: settings.bannerLink ?? '',
          }}
        />
      </div>
    </>
  )
}
