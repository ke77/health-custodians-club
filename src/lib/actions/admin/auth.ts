'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { adminEmail, codeSchema, passwordSignInSchema } from '@/lib/validation/admin/auth'

export type AuthResult = { ok: true } | { ok: false; message: string }

// one wording for every failure, so the sign-in page never reveals whether an email is an admin
const wrongDetails = 'That did not work. Check your details and try again.'

async function isListedAdmin(email: string) {
  const { data } = await createServiceClient().from('admins').select('id').eq('email', email).maybeSingle()
  return Boolean(data)
}

export async function requestCode(input: { email: string }): Promise<AuthResult> {
  const parsed = adminEmail.safeParse(input.email)
  if (!parsed.success) return { ok: false, message: 'Enter a valid email address.' }
  const email = parsed.data

  // only listed admins get an email; everyone else sees the same "check your inbox" screen
  if (!(await isListedAdmin(email))) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
  if (error) {
    console.error('sign-in code failed', error.status, error.code)
    return {
      ok: false,
      message:
        error.status === 429
          ? 'Too many codes requested. Wait a few minutes, then try again.'
          : 'We could not send a code right now. Try again in a few minutes, or use your password.',
    }
  }
  return { ok: true }
}

export async function verifyCode(input: { email: string; code: string }): Promise<AuthResult> {
  const parsed = codeSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: 'email',
  })
  if (error) return { ok: false, message: 'That code is wrong or has expired. Request a new one.' }

  return finishSignIn(data.user?.email)
}

export async function signInWithPassword(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = passwordSignInSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { ok: false, message: wrongDetails }

  return finishSignIn(data.user?.email)
}

// a valid login is not enough: the email must still be on the admins list
async function finishSignIn(email: string | undefined): Promise<AuthResult> {
  if (!email || !(await isListedAdmin(email.toLowerCase()))) {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { ok: false, message: wrongDetails }
  }
  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
