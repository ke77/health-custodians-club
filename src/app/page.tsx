import { Hero } from '@/components/home/hero'
import { WhatWeDo } from '@/components/home/what-we-do'
import { BeyondTheCurriculum } from '@/components/home/beyond-the-curriculum'
import { WhereWeWork } from '@/components/home/where-we-work'
import { MembershipPreview } from '@/components/home/membership-preview'
import { FaqSection } from '@/components/faq/faq-section'
import { ClosingCta } from '@/components/home/closing-cta'
import { homepageFaqs } from '@/lib/config/faqs'

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <BeyondTheCurriculum />
      <WhereWeWork />
      <MembershipPreview />
      <FaqSection
        items={homepageFaqs}
        intro='Quick answers about the club and how to get involved.'
        more={{ href: '/membership#faq', label: 'More questions' }}
      />
      <ClosingCta />
    </>
  )
}
