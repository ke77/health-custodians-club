import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { ScrollToTop } from '@/components/layout/scroll-to-top'

// chrome for every public page. the dashboard (app/admin) has its own
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className='flex flex-1 flex-col'>{children}</div>
      <Footer />
      <ScrollToTop />
    </>
  )
}
