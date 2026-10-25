import type { Metadata } from 'next'
import { ComingSoon } from '@/components/layout/coming-soon'

export const metadata: Metadata = {
  title: 'Programmes',
  description: 'The Health Custodians Club programmes are on their way.',
}

export default function ProgramsPage() {
  return (
    <ComingSoon
      label='Programmes'
      image='/hero-image.jpg'
      blurb='Our training, outreach and mentorship programmes are being shaped. Follow us to hear when they open.'
    />
  )
}
