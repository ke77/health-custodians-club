import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Newsreader, Public_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
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
      className={`${newsreader.variable} ${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <div className='flex flex-1 flex-col'>{children}</div>
        <Footer />
      </body>
    </html>
  )
}
