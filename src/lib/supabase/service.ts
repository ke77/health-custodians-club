import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl } from '@/lib/supabase/env'
import type { Database } from '@/lib/supabase/types'

/*
  service-role client: bypasses RLS. server only, never imported by a client component.
  used for public form inserts (applications, waitlist, enquiries) and for creating or deleting admin logins.
*/
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY.')

  return createClient<Database>(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
