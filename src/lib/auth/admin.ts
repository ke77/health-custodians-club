import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Admin = { id: string; email: string; name: string | null }

/*
  the data access layer for the dashboard: the one place that decides who is an admin.
  a session alone is not enough; the email must also be on the admins list (RLS lets only admins read it,
  so anyone else gets null). cached per request, so pages and actions can call it freely.
*/
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const email = data?.claims?.email
  if (!email) return null

  const { data: admin } = await supabase
    .from('admins')
    .select('id, email, name')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  return admin
})

// call at the top of every admin page and server action
export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect('/admin/login')
  return admin
}

// how an admin is named in the dashboard and in "changed by" lines
export function adminLabel(admin: Pick<Admin, 'email' | 'name'>) {
  return admin.name?.trim() || admin.email
}
