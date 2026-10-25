import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env'
import type { Database } from '@/lib/supabase/types'

// the signed-in admin's client: reads the session cookie, so every query runs under RLS as that user
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // called from a server component, where cookies are read-only. proxy.ts refreshes the session instead
        }
      },
    },
  })
}
