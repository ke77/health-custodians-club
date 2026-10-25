import 'server-only'
import type { Email } from '@/lib/email/resend'
import { escapeHtml, p, wrap } from '@/lib/email/layout'

const interestLabels: Record<string, string> = {
  adviser: 'Becoming an adviser',
  partner: 'Partnering or sponsoring',
  professional: 'Supporting as a health professional',
  alumni: 'Alumni',
  member: 'Joining as a member',
  other: 'Something else',
}

// enquiry notification to the club (docs/04). the reply-to is set to the sender so a reply reaches them.
export function contactNotification(input: {
  name: string
  email: string
  organisation: string | null
  interest: string
  message: string
}): Email {
  const rows = [
    ['Name', input.name],
    ['Email', input.email],
    ['Organisation', input.organisation || '—'],
    ['About', interestLabels[input.interest] ?? input.interest],
  ]
  return {
    subject: `New enquiry: ${interestLabels[input.interest] ?? input.interest}`,
    html: wrap(
      rows.map(([k, v]) => p(`<strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}`)).join('') +
        p('<strong>Message:</strong>') +
        p(escapeHtml(input.message).replace(/\n/g, '<br>')),
    ),
    text:
      rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${input.message}`,
  }
}
