import 'server-only'
import type { Email } from '@/lib/email/resend'
import { escapeHtml, p, wrap } from '@/lib/email/layout'

// sent to everyone on the waiting list when applications reopen (the dashboard's "Notify waiting list" button).
// DRAFT copy. the deadline line only appears when one is set; no fees and no promises about places
export function waitlistOpened(input: { cohort: string; applyUrl: string; deadline: string | null }): Email {
  const cohort = escapeHtml(input.cohort)
  const deadlineHtml = input.deadline ? p(`Applications close on ${escapeHtml(input.deadline)}.`) : ''
  const deadlineText = input.deadline ? `Applications close on ${input.deadline}.\n\n` : ''
  return {
    subject: 'Applications to the Health Custodians Club are open',
    html: wrap(
      p('Hello,') +
        p(`You asked us to tell you when applications open. Applications for the ${cohort} cohort are now open.`) +
        deadlineHtml +
        p(`<a href="${escapeHtml(input.applyUrl)}" style="color:#0163a2;">Apply to join the club</a>`) +
        p('This is the only email we will send you about this. Thank you for your patience.') +
        p('Warm regards,<br>The Health Custodians Club team'),
    ),
    text:
      `Hello,\n\n` +
      `You asked us to tell you when applications open. Applications for the ${input.cohort} cohort are now open.\n\n` +
      deadlineText +
      `Apply to join the club: ${input.applyUrl}\n\n` +
      `This is the only email we will send you about this. Thank you for your patience.\n\n` +
      `Warm regards,\nThe Health Custodians Club team`,
  }
}

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
