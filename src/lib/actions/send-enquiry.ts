'use server'

import { hashedIp } from '@/lib/actions/request-meta'
import { rateLimit } from '@/lib/actions/rate-limit'
import { verifyTurnstile } from '@/lib/actions/turnstile'
import { clubEmails } from '@/lib/config/contact'
import { sendEmail } from '@/lib/email/resend'
import { contactNotification } from '@/lib/email/templates/contact'
import { createServiceClient } from '@/lib/supabase/service'
import type { Database } from '@/lib/supabase/types'
import { enquirySchema } from '@/lib/validation/contact'

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; fields: string[] }
  | { ok: false; reason: 'rate_limited' | 'turnstile' | 'error' }

type Interest = Database['public']['Enums']['inquiry_interest']

/*
  validates on the server, checks the honeypot and Turnstile, rate limits, saves to inquiries, then notifies the
  club. the enquiry is saved even if the notification email fails, so nothing is lost.
*/
export async function sendEnquiry(input: unknown, token?: string): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input)
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]
    return { ok: false, reason: 'invalid', fields }
  }

  const ipHash = await hashedIp()
  if (!(await verifyTurnstile(token, ipHash))) return { ok: false, reason: 'turnstile' }

  const limited = await rateLimit(ipHash ?? parsed.data.email, 'enquiry', 5, 60 * 60)
  if (!limited.ok) return { ok: false, reason: 'rate_limited' }

  const { name, email, organisation, interest, message } = parsed.data
  const supabase = createServiceClient()
  const { error } = await supabase.from('inquiries').insert({
    name,
    email,
    organisation: organisation || null,
    interest: interest as Interest,
    message,
  })
  if (error) {
    console.error('enquiry insert failed', error.code, error.message)
    return { ok: false, reason: 'error' }
  }

  try {
    await sendEmail({
      to: clubEmails.contact,
      email: contactNotification({ name, email, organisation: organisation || null, interest, message }),
      replyTo: email,
    })
  } catch (err) {
    console.error('enquiry email failed', err instanceof Error ? err.message : err)
  }

  return { ok: true }
}
