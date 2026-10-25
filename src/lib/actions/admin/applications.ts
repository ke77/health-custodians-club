'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { adminLabel, requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Constants } from '@/lib/supabase/types'
import type { ActionResult } from '@/lib/actions/admin/admins'

const id = z.uuid()

export async function updateApplicationStatus(input: { id: string; status: string }): Promise<ActionResult> {
  const me = await requireAdmin()
  const parsed = z
    .object({ id, status: z.enum(Constants.public.Enums.application_status) })
    .safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That status is not valid.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('applications')
    .update({ status: parsed.data.status, status_changed_by: adminLabel(me) })
    .eq('id', parsed.data.id)
  if (error) return { ok: false, message: 'Could not change the status. Try again.' }

  refresh()
  return { ok: true, message: 'Status saved.' }
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
