'use server'

import { refresh } from 'next/cache'
import { adminLabel, requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { addAdminSchema, setPasswordSchema } from '@/lib/validation/admin/auth'
import { clubEmails } from '@/lib/config/contact'
import { sendEmail } from '@/lib/email/resend'
import { adminAdded, adminRemoved } from '@/lib/email/templates/admin'

export type ActionResult = { ok: true; message?: string } | { ok: false; message: string }

/*
  adding an admin creates their login too (sign-ups are off in supabase), so they can sign in with a code
  straight away and set a password afterwards.
*/
export async function addAdmin(input: { email: string; name: string }): Promise<ActionResult> {
  const me = await requireAdmin()
  const parsed = addAdminSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }
  const { email, name } = parsed.data

  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('admins')
    .insert({ email, name: name || null, added_by: adminLabel(me) })
    .select('id')
    .single()

  if (error) {
    return {
      ok: false,
      message: error.code === '23505' ? `${email} is already an admin.` : 'Could not add that admin. Try again.',
    }
  }

  const service = createServiceClient()
  const { data: created, error: authError } = await service.auth.admin.createUser({ email, email_confirm: true })

  if (created?.user) {
    await service.from('admins').update({ user_id: created.user.id }).eq('id', row.id)
  } else if (authError && authError.code !== 'email_exists') {
    // without a login the new admin could never sign in, so undo the row rather than leave it half-made
    await service.from('admins').delete().eq('id', row.id)
    console.error('create admin login failed', authError.status, authError.code)
    return { ok: false, message: 'Could not create a login for that email. Try again.' }
  }

  refresh()

  // tell admin@ who was added. a failed email never undoes the change
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
  await sendEmail({
    to: clubEmails.admin,
    email: adminAdded({ email, name: name || null, addedBy: adminLabel(me), dashboardUrl: `${siteUrl}/admin/settings/admins` }),
  })

  return { ok: true, message: `${email} can now sign in.` }
}

export async function removeAdmin(id: string): Promise<ActionResult> {
  const me = await requireAdmin()
  const supabase = await createClient()

  const { data: target } = await supabase.from('admins').select('id, email, user_id').eq('id', id).maybeSingle()
  if (!target) return { ok: false, message: 'That admin no longer exists.' }
  if (target.id === me.id) return { ok: false, message: 'You cannot remove yourself. Ask another admin to do it.' }

  const { count } = await supabase.from('admins').select('id', { count: 'exact', head: true })
  if ((count ?? 0) <= 1) return { ok: false, message: 'The dashboard needs at least one admin.' }

  const { error } = await supabase.from('admins').delete().eq('id', id)
  if (error) return { ok: false, message: 'Could not remove that admin. Try again.' }

  // also delete their login, which ends any session they still have open
  if (target.user_id) {
    const { error: authError } = await createServiceClient().auth.admin.deleteUser(target.user_id)
    if (authError) console.error('delete admin login failed', authError.status, authError.code)
  }

  refresh()
  await sendEmail({ to: clubEmails.admin, email: adminRemoved({ email: target.email, removedBy: adminLabel(me) }) })
  return { ok: true, message: `${target.email} has been removed.` }
}

export async function updateMyName(input: { name: string }): Promise<ActionResult> {
  const me = await requireAdmin()
  const name = String(input.name ?? '').trim()
  if (name.length > 80) return { ok: false, message: 'Keep the name under 80 characters.' }

  const supabase = await createClient()
  const { error } = await supabase.from('admins').update({ name: name || null }).eq('id', me.id)
  if (error) return { ok: false, message: 'Could not save your name. Try again.' }

  refresh()
  return { ok: true, message: 'Name saved.' }
}

export async function setMyPassword(input: { password: string; confirm: string }): Promise<ActionResult> {
  await requireAdmin()
  const parsed = setPasswordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) {
    const message =
      error.code === 'same_password'
        ? 'That is already your password.'
        : error.code === 'weak_password'
          ? 'That password is too easy to guess. Try a longer one.'
          : error.code === 'reauthentication_needed'
            ? 'For safety, sign out and back in with a code, then set your password.'
            : 'Could not save your password. Try again.'
    return { ok: false, message }
  }

  return { ok: true, message: 'Password saved. You can now sign in with it.' }
}
