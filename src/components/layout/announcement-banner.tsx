import Link from 'next/link'
import { getSettings } from '@/lib/data/settings'

// a thin strip at the very top of every public page, edited under Settings → Announcement banner.
// renders nothing when switched off or empty, so it never leaves a blank bar.
export async function AnnouncementBanner() {
  const { bannerOn, bannerText, bannerLink } = await getSettings()
  if (!bannerOn || !bannerText) return null

  const content = <span className='font-body text-small md:text-base'>{bannerText}</span>

  return (
    <div className='bg-ink text-paper'>
      <div className='container-site flex items-center justify-center gap-2 py-2 text-center'>
        {bannerLink ? (
          <Link
            href={bannerLink}
            className='underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  )
}
