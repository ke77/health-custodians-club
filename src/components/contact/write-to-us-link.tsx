'use client'

import { MoveRight } from 'lucide-react'
import type { InterestType } from '@/lib/config/contact'

// the contact form listens for this to preselect its interest type
export const SET_INTEREST_EVENT = 'hcc:set-interest'

// jumps to the message form and preselects the interest; without javascript it still scrolls to the form
export function WriteToUsLink({ interest, audience }: { interest: InterestType; audience: string }) {
  return (
    <a
      href='#send-a-message'
      onClick={() => window.dispatchEvent(new CustomEvent<InterestType>(SET_INTEREST_EVENT, { detail: interest }))}
      className='group inline-flex items-center gap-2 rounded-xs font-body text-base font-medium text-ink/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/90'
    >
      <span className='[background-image:linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]'>
        Write to us
      </span>
      <span className='sr-only'> as {audience.toLowerCase()}</span>
      <MoveRight className='size-5 transition-transform group-hover:translate-x-1' aria-hidden />
    </a>
  )
}
