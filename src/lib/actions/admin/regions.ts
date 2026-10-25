'use server'

import { updateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { regionsTag } from '@/lib/data/regions'
import { regionSchema } from '@/lib/validation/admin/region'
import type { RegionInput } from '@/lib/validation/admin/region'
import type { ActionResult } from '@/lib/actions/admin/admins'
import type { Database } from '@/lib/supabase/types'

type RegionName = Database['public']['Enums']['region']

export async function updateRegion(region: RegionName, input: RegionInput): Promise<ActionResult> {
  await requireAdmin()
  const parsed = regionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from('regions')
    .update({
      active: parsed.data.active,
      head_name: parsed.data.headName || null,
      head_institution: parsed.data.headInstitution || null,
      head_photo_path: parsed.data.headPhotoPath || null,
      head_published: parsed.data.headPublished,
    })
    .eq('region', region)
  if (error) return { ok: false, message: 'Could not save. Try again.' }
  updateTag(regionsTag)
  return { ok: true, message: 'Saved.' }
}
