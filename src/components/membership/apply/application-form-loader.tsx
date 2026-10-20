'use client'

import dynamic from 'next/dynamic'

// the form reads its saved draft from this device's storage, which only exists in the browser
export const ApplicationFormLoader = dynamic(
  () => import('@/components/membership/apply/application-form').then((m) => m.ApplicationForm),
  {
    ssr: false,
    loading: () => (
      <p className='font-mono text-label uppercase text-muted' role='status'>
        Loading the form…
      </p>
    ),
  },
)
