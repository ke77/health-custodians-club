import type { Metadata } from 'next'
import { AboutIntro } from '@/components/about/about-intro'
import { Leadership } from '@/components/about/leadership'
import { RegionalPresence } from '@/components/about/regional-presence'

export const metadata: Metadata = {
  title: 'About | Health Custodians Club',
  description:
    'Who we are: the gap Health Custodians Club closes, our mission and vision, the Executive Committee, and our presence in all 16 regions of Ghana.',
}

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <Leadership />
      <RegionalPresence />
    </>
  )
}
