import 'server-only'
import type { Email } from '@/lib/email/resend'
import { box, escapeHtml, p, wrap } from '@/lib/email/layout'
import type { Tables } from '@/lib/supabase/types'

/*
  DRAFT copy (docs/04-application-form.md). no fees mentioned, no interview promised, no dates.
  applicant confirmation and the club notification.
*/

export function applicationReceived(input: { name: string; reference: string; email: string }): Email {
  const name = escapeHtml(input.name.split(' ')[0] || input.name)
  const ref = escapeHtml(input.reference)
  return {
    subject: 'We have received your application',
    html: wrap(
      p(`Hello ${name},`) +
        p('Thank you. Your application to join the Health Custodians Club is in. Your reference number is:') +
        box(ref) +
        p('Please keep it. We read every application and check academic details with our regional representatives, then contact you by email.') +
        p('If you do not hear from us within a few weeks, write to us and quote your reference number.') +
        p('Warm regards,<br>The Health Custodians Club team'),
    ),
    text:
      `Hello ${input.name.split(' ')[0] || input.name},\n\n` +
      `Thank you. Your application to join the Health Custodians Club is in.\n\n` +
      `Reference number: ${input.reference}\n\n` +
      `Please keep it. We read every application and check academic details with our regional representatives, then contact you by email. ` +
      `If you do not hear from us within a few weeks, write to us and quote your reference number.\n\n` +
      `Warm regards,\nThe Health Custodians Club team`,
  }
}

export function adminNewApplication(
  input: { application: Pick<Tables<'applications'>, 'reference' | 'full_name' | 'programme' | 'institution' | 'level' | 'current_region'>; dashboardUrl: string },
): Email {
  const a = input.application
  const lines = [
    ['Name', a.full_name],
    ['Programme', a.programme],
    ['Institution', a.institution],
    ['Level', String(a.level)],
    ['Region', a.current_region],
  ]
  return {
    subject: `New application: ${a.reference}`,
    html: wrap(
      p('A new application has arrived.') +
        lines.map(([k, v]) => p(`<strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}`)).join('') +
        p(`<a href="${input.dashboardUrl}" style="color:#1f5a57;">Open it in the dashboard</a>`),
    ),
    text:
      `New application: ${a.reference}\n\n` +
      lines.map(([k, v]) => `${k}: ${v}`).join('\n') +
      `\n\nOpen it in the dashboard: ${input.dashboardUrl}`,
  }
}
