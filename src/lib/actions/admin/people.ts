'use server'

import { updateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { peopleTag } from '@/lib/data/people'
import { personSchema } from '@/lib/validation/admin/person'
import type { PersonInput, PersonType } from '@/lib/validation/admin/person'
import type { ActionResult } from '@/lib/actions/admin/admins'
import type { Json } from '@/lib/supabase/types'

export async function createPerson(type: PersonType): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { count } = await supabase.from('people').select('id', { count: 'exact', head: true }).eq('type', type)
  const { error } = await supabase.from('people').insert({
    type,
    name: 'New name',
    role: 'Role',
    socials: [],
    sort_order: count ?? 0,
    published: false,
  })
  if (error) return { ok: false, message: 'Could not add. Try again.' }
  updateTag(peopleTag)
  return { ok: true }
}

export async function updatePerson(id: string, input: PersonInput): Promise<ActionResult> {
  await requireAdmin()
  const parsed = personSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('people')
    .update({
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      photo_path: parsed.data.photoPath || null,
      published: parsed.data.published,
      socials: parsed.data.socials as Json,
    })
    .eq('id', id)
  if (error) return { ok: false, message: 'Could not save. Try again.' }
  updateTag(peopleTag)
  return { ok: true, message: 'Saved.' }
}

export async function deletePerson(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('people').delete().eq('id', id)
  if (error) return { ok: false, message: 'Could not delete. Try again.' }
  updateTag(peopleTag)
  return { ok: true }
}

export async function movePerson(id: string, type: PersonType, direction: 'up' | 'down'): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('people')
    .select('id')
    .eq('type', type)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (!rows) return { ok: false, message: 'Could not reorder. Try again.' }

  const ids = rows.map((r) => r.id)
  const index = ids.indexOf(id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || target < 0 || target >= ids.length) return { ok: true }
  ;[ids[index], ids[target]] = [ids[target], ids[index]]

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase.from('people').update({ sort_order: i }).eq('id', ids[i])
    if (error) return { ok: false, message: 'Could not reorder. Try again.' }
  }
  updateTag(peopleTag)
  return { ok: true }
}
