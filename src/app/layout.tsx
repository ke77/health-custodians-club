import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { MotionProvider } from '@/components/layout/motion-provider'
import { PageLoader } from '@/components/layout/page-loader'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Health Custodians Club',
  description:
    'Health Custodians Club trains health students to close the gap between how people live and what they know about their health.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      data-theme='hcc'
      // lets next.js switch off css smooth scrolling during route changes, so new pages start at the top instantly
      data-scroll-behavior='smooth'
      className={`${newsreader.variable} ${hankenGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        {/* the public site and the dashboard each add their own chrome: app/(site)/layout.tsx, app/admin/layout.tsx */}
        <MotionProvider>{children}</MotionProvider>
        {/* usePathname can suspend on dynamic routes, so it gets its own boundary and never blocks a page */}
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
      </body>
    </html>
  )
}
