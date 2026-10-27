'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { adminLabel, requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Constants } from '@/lib/supabase/types'
import { emailConfigured, sendEmail } from '@/lib/email/resend'
import { statusEmail } from '@/lib/email/templates/member-status'
import { isEmailedStatus, statusTemplateName } from '@/lib/config/application-status'
import type { ActionResult } from '@/lib/actions/admin/admins'

const id = z.uuid()
const statusSchema = z.enum(Constants.public.Enums.application_status)

// what the confirm dialog shows before an email goes: who gets it, what it says, and whether they were already told
export type StatusPreview =
  | {
      ok: true
      to: string
      subject: string
      text: string
      // when the same email last went to this applicant, if it did
      alreadySentAt: string | null
      // false until the club's domain is verified in Resend
      configured: boolean
    }
  | { ok: false; message: string }

export async function previewStatusEmail(input: { id: string; status: string }): Promise<StatusPreview> {
  await requireAdmin()
  const parsed = z.object({ id, status: statusSchema }).safeParse(input)
  if (!parsed.success || !isEmailedStatus(parsed.data.status)) {
    return { ok: false, message: 'There is no email for that status.' }
  }
  const status = parsed.data.status

  const supabase = await createClient()
  const { data: application } = await supabase
    .from('applications')
    .select('full_name, email, reference')
    .eq('id', parsed.data.id)
    .maybeSingle()
  if (!application) return { ok: false, message: 'That application no longer exists.' }

  const { data: previous } = await supabase
    .from('email_log')
    .select('sent_at')
    .eq('application_id', parsed.data.id)
    .eq('template', statusTemplateName(status))
    .eq('ok', true)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const email = statusEmail(status, { name: application.full_name, reference: application.reference })
  return {
    ok: true,
    to: application.email,
    subject: email.subject,
    text: email.text,
    alreadySentAt: previous?.sent_at ?? null,
    configured: emailConfigured(),
  }
}

// saves the new status; with `notify`, also emails the applicant and records the result in email_log.
// a failed email never undoes the status change: the admin is told and can write to the applicant directly
export async function updateApplicationStatus(input: {
  id: string
  status: string
  notify?: boolean
}): Promise<ActionResult> {
  const me = await requireAdmin()
  const parsed = z.object({ id, status: statusSchema, notify: z.boolean().optional() }).safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That status is not valid.' }

  const supabase = await createClient()
  const { data: application, error } = await supabase
    .from('applications')
    .update({ status: parsed.data.status, status_changed_by: adminLabel(me) })
    .eq('id', parsed.data.id)
    .select('full_name, email, reference')
    .maybeSingle()
  if (error || !application) return { ok: false, message: 'Could not change the status. Try again.' }

  refresh()

  const status = parsed.data.status
  if (!parsed.data.notify || !isEmailedStatus(status)) return { ok: true, message: 'Status saved.' }

  const result = await sendEmail({
    to: application.email,
    email: statusEmail(status, { name: application.full_name, reference: application.reference }),
  })
  await supabase.from('email_log').insert({
    application_id: parsed.data.id,
    template: statusTemplateName(status),
    to_email: application.email,
    ok: result.ok,
    error: result.ok ? null : (result.error ?? 'unknown error'),
    sent_by: adminLabel(me),
  })

  return result.ok
    ? { ok: true, message: `Status saved. Email sent to ${application.email}.` }
    : { ok: true, message: `Status saved, but the email did not go: ${result.error ?? 'unknown error'} Write to the applicant directly.` }
}

export async function saveApplicationNotes(input: { id: string; notes: string }): Promise<ActionResult> {
  await requireAdmin()
  const parsed = z
    .object({ id, notes: z.string().max(5000, 'Notes are limited to 5,000 characters.') })
    .safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const notes = parsed.data.notes.trim()
  const { error } = await supabase
    .from('applications')
    .update({ notes: notes || null })
    .eq('id', parsed.data.id)
  if (error) return { ok: false, message: 'Could not save the notes. Try again.' }

  return { ok: true, message: 'Notes saved.' }
}
