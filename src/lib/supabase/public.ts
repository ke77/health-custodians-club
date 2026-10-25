import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env'
import type { Database } from '@/lib/supabase/types'

/*
  cookie-less anon client for public page reads (settings, people, faqs, partners, posts).
  it carries no session, so it is safe inside a `'use cache'` function, where cookies() cannot be read.
  reads are limited by RLS to what anon may see (published rows, public settings).
*/
export function createPublicClient() {
  return createClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
