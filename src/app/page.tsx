import { Hero } from '@/components/home/hero'
import { WhatWeDo } from '@/components/home/what-we-do'
import { BeyondTheCurriculum } from '@/components/home/beyond-the-curriculum'
import { WhereWeWork } from '@/components/home/where-we-work'
import { MembershipPreview } from '@/components/home/membership-preview'

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <BeyondTheCurriculum />
      <WhereWeWork />
      <MembershipPreview />
    </>
  )
}
