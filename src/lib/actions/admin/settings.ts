'use server'

import { updateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { settingsTag } from '@/lib/data/settings'
import { createClient } from '@/lib/supabase/server'
import { accraLocalToIso, applicationWindowSchema } from '@/lib/validation/admin/settings'
import type { ApplicationWindowInput } from '@/lib/validation/admin/settings'
import type { ActionResult } from '@/lib/actions/admin/admins'

export async function updateApplicationWindow(input: ApplicationWindowInput): Promise<ActionResult> {
  await requireAdmin()
  const parsed = applicationWindowSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .update({
      applications_open: parsed.data.applicationsOpen,
      application_deadline: accraLocalToIso(parsed.data.deadline),
      current_cohort: parsed.data.cohort,
    })
    .eq('id', 1)

  if (error) return { ok: false, message: 'Could not save. Try again.' }

  // the public apply page and anything else reading settings refreshes right away
  updateTag(settingsTag)
  return { ok: true, message: 'Saved.' }
}
