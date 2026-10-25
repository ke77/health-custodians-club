'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/actions/admin/admins'

const schema = z.object({ id: z.uuid(), status: z.enum(['new', 'handled']) })

export async function setInquiryStatus(input: { id: string; status: 'new' | 'handled' }): Promise<ActionResult> {
  await requireAdmin()
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That is not valid.' }

  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').update({ status: parsed.data.status }).eq('id', parsed.data.id)
  if (error) return { ok: false, message: 'Could not update. Try again.' }

  refresh()
  return { ok: true }
}
