'use server'

import { updateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { partnersTag } from '@/lib/data/partners'
import { partnerSchema } from '@/lib/validation/admin/partner'
import type { PartnerInput } from '@/lib/validation/admin/partner'
import type { ActionResult } from '@/lib/actions/admin/admins'

export async function createPartner(): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { count } = await supabase.from('partners').select('id', { count: 'exact', head: true })
  const { error } = await supabase
    .from('partners')
    .insert({ name: 'New partner', sort_order: count ?? 0, published: false })
  if (error) return { ok: false, message: 'Could not add the partner. Try again.' }
  updateTag(partnersTag)
  return { ok: true }
}

export async function updatePartner(id: string, input: PartnerInput): Promise<ActionResult> {
  await requireAdmin()
  const parsed = partnerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('partners')
    .update({
      name: parsed.data.name,
      url: parsed.data.url || null,
      logo_path: parsed.data.logoPath || null,
      published: parsed.data.published,
    })
    .eq('id', id)
  if (error) return { ok: false, message: 'Could not save. Try again.' }
  updateTag(partnersTag)
  return { ok: true, message: 'Saved.' }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) return { ok: false, message: 'Could not delete. Try again.' }
  updateTag(partnersTag)
  return { ok: true }
}

export async function movePartner(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('partners')
    .select('id')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (!rows) return { ok: false, message: 'Could not reorder. Try again.' }

  const ids = rows.map((r) => r.id)
  const index = ids.indexOf(id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || target < 0 || target >= ids.length) return { ok: true }
  ;[ids[index], ids[target]] = [ids[target], ids[index]]

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase.from('partners').update({ sort_order: i }).eq('id', ids[i])
    if (error) return { ok: false, message: 'Could not reorder. Try again.' }
  }
  updateTag(partnersTag)
  return { ok: true }
}
