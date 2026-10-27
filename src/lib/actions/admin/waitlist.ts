'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { emailConfigured, sendBatch } from '@/lib/email/resend'
import { waitlistOpened } from '@/lib/email/templates/waitlist'
import { formatDateTime } from '@/lib/utils/format'
import type { ActionResult } from '@/lib/actions/admin/admins'

/*
  emails everyone on a cohort's waiting list who has not been told yet, in batches of 100, and stamps notified_at
  on exactly the people whose email went. safe to press twice: anyone already notified is skipped, and a partly
  failed run can simply be run again to retry the rest.
  guarded so the wrong email cannot go out: applications must be open, and only for the current cohort.
*/
export async function notifyWaitlist(input: { cohort: string }): Promise<ActionResult> {
  await requireAdmin()
  const parsed = z.object({ cohort: z.string().trim().min(1).max(20) }).safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That cohort is not valid.' }
  const { cohort } = parsed.data

  if (!emailConfigured()) {
    return { ok: false, message: 'Email sending is not set up yet, so nothing was sent.' }
  }

  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('applications_open, application_deadline, current_cohort')
    .eq('id', 1)
    .single()
  if (!settings) return { ok: false, message: 'Could not read the settings. Try again.' }

  if (cohort !== settings.current_cohort) {
    return { ok: false, message: `Only the current cohort (${settings.current_cohort}) can be notified.` }
  }
  if (!settings.applications_open) {
    return { ok: false, message: 'Applications are closed. Open them under Applications window first, then notify.' }
  }

  const { data: entries } = await supabase
    .from('waitlist')
    .select('id, email')
    .eq('cohort', cohort)
    .is('notified_at', null)
  if (!entries || entries.length === 0) return { ok: false, message: 'Everyone on this list has already been told.' }

  const deadline =
    settings.application_deadline && new Date(settings.application_deadline).getTime() > Date.now()
      ? formatDateTime(settings.application_deadline)
      : null
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
  const email = waitlistOpened({ cohort, applyUrl: `${siteUrl}/membership/apply`, deadline })

  const { sentKeys, failed, error } = await sendBatch(entries.map((e) => ({ key: e.id, to: e.email, email })))

  // mark exactly the people whose email went, so a retry only covers the rest
  for (let i = 0; i < sentKeys.length; i += 100) {
    await supabase
      .from('waitlist')
      .update({ notified_at: new Date().toISOString() })
      .in('id', sentKeys.slice(i, i + 100))
  }

  refresh()

  if (failed > 0) {
    return {
      ok: false,
      message: `Emailed ${sentKeys.length} of ${entries.length}. ${failed} did not go${error ? ` (${error})` : ''}. Run it again to retry those.`,
    }
  }
  return { ok: true, message: `Emailed ${sentKeys.length} ${sentKeys.length === 1 ? 'person' : 'people'}.` }
}
