import type { Metadata } from 'next'
import { MembershipIntro } from '@/components/membership/membership-intro'
import { CohortAndRegions, MembershipProcess } from '@/components/membership/membership-details'
import { FaqSection } from '@/components/faq/faq-section'
import { ClosingCta } from '@/components/home/closing-cta'
import { faqGroups } from '@/lib/config/faqs'

export const metadata: Metadata = {
  title: 'Membership | Health Custodians Club',
  description:
    'Who can join Health Custodians Club, how the application and two-year cohort work, regional heads, and answers to common questions.',
}

export default function MembershipPage() {
  return (
    <>
      <MembershipIntro />
      <MembershipProcess />
      <CohortAndRegions />
      <FaqSection
        groups={faqGroups}
        intro='Everything about applying and membership first, then questions about the club and its work.'
      />
      {/* extra air above the band on this page, where the FAQ ends close to it */}
      <ClosingCta className='mt-16 md:mt-28' />
    </>
  )
}
