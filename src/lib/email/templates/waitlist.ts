import 'server-only'
import type { Email } from '@/lib/email/resend'
import { escapeHtml, p, wrap } from '@/lib/email/layout'

// confirmation to someone who joined the waiting list (docs/04)
export function waitlistConfirmation(input: { cohort: string }): Email {
  const cohort = escapeHtml(input.cohort)
  return {
    subject: 'You are on the HCC waiting list',
    html: wrap(
      p('Thank you. You are on the waiting list for the Health Custodians Club.') +
        p(`We will email you when applications for the ${cohort} cohort open. We use your email only for this.`) +
        p('Warm regards,<br>The Health Custodians Club team'),
    ),
    text:
      `Thank you. You are on the waiting list for the Health Custodians Club.\n\n` +
      `We will email you when applications for the ${input.cohort} cohort open. We use your email only for this.\n\n` +
      `Warm regards,\nThe Health Custodians Club team`,
  }
}
