'use server'

import { hashedIp } from '@/lib/actions/request-meta'
import { rateLimit } from '@/lib/actions/rate-limit'
import { verifyTurnstile } from '@/lib/actions/turnstile'
import { getSettings } from '@/lib/data/settings'
import { sendEmail } from '@/lib/email/resend'
import { waitlistConfirmation } from '@/lib/email/templates/waitlist'
import { createServiceClient } from '@/lib/supabase/service'
import { waitlistSchema } from '@/lib/validation/waitlist'

export type WaitlistResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'rate_limited' | 'turnstile' | 'error' }

/*
  joins the waiting list for the current cohort. a duplicate is treated as success, so the form never reveals
  whether an email is already listed. the confirmation email is best-effort.
*/
export async function joinWaitlist(input: unknown, token?: string): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid' }

  const ipHash = await hashedIp()
  if (!(await verifyTurnstile(token, ipHash))) return { ok: false, reason: 'turnstile' }

  const limited = await rateLimit(ipHash ?? parsed.data.email, 'waitlist', 5, 60 * 60)
  if (!limited.ok) return { ok: false, reason: 'rate_limited' }

  const settings = await getSettings()
  const cohort = settings.currentCohort || 'next'
  const supabase = createServiceClient()
  const { error } = await supabase.from('waitlist').insert({ email: parsed.data.email, cohort })

  // a duplicate (unique on cohort + email) is a success: never reveal whether the email was already there
  if (error && error.code !== '23505') {
    console.error('waitlist insert failed', error.code, error.message)
    return { ok: false, reason: 'error' }
  }

  if (!error) {
    try {
      await sendEmail({ to: parsed.data.email, email: waitlistConfirmation({ cohort }) })
    } catch (err) {
      console.error('waitlist email failed', err instanceof Error ? err.message : err)
    }
  }

  return { ok: true }
}
