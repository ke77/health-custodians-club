import 'server-only'
import type { Email } from '@/lib/email/resend'
import { box, escapeHtml, p, wrap } from '@/lib/email/layout'
import type { EmailedStatus } from '@/lib/config/application-status'

/*
  DRAFT copy, for the club to review before it is relied on. sent from the dashboard when an admin moves an
  application to accepted, rejected or waitlisted (docs/04, O10). no fees, no dates and no interview promised.
*/

type Input = { name: string; reference: string }

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name

function build(input: Input, subject: string, paragraphs: string[], closing = 'Warm regards,\nThe Health Custodians Club team'): Email {
  const first = firstName(input.name)
  const htmlBody =
    p(`Hello ${escapeHtml(first)},`) +
    paragraphs.map((text) => p(escapeHtml(text))).join('') +
    box(escapeHtml(input.reference)) +
    p(escapeHtml(closing).replace('\n', '<br>'))
  return {
    subject,
    html: wrap(htmlBody),
    text: `Hello ${first},\n\n${paragraphs.join('\n\n')}\n\nYour reference: ${input.reference}\n\n${closing}`,
  }
}

export function statusEmail(status: EmailedStatus, input: Input): Email {
  switch (status) {
    case 'accepted':
      return build(input, 'Welcome to the Health Custodians Club', [
        'We are glad to tell you that your application to join the Health Custodians Club has been accepted. Welcome.',
        'We will email you again with the details of what happens next. Please keep an eye on your inbox, and on your spam folder too.',
        'If you have any questions in the meantime, reply to this email and quote your reference number.',
      ])
    case 'rejected':
      return build(input, 'Your application to the Health Custodians Club', [
        'Thank you for applying to join the Health Custodians Club, and for the time you put into your application.',
        'After reading it carefully, we are not able to offer you a place in this cohort. This is not a judgement of your potential. You are welcome to apply again when applications next open.',
        'We would be glad to have you follow the club’s work in the meantime.',
      ])
    case 'waitlisted':
      return build(input, 'Your application to the Health Custodians Club', [
        'Thank you for applying to join the Health Custodians Club.',
        'We have placed your application on our waiting list. That means we could not offer you a place in this round, but we would like to keep your application in view. If a place becomes available we will contact you by email.',
        'You do not need to do anything for now.',
      ])
  }
}
