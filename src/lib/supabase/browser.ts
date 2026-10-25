import { createBrowserClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env'
import type { Database } from '@/lib/supabase/types'

/*
  browser client, used only for uploading images to Storage from the editor. it carries the admin's
  session cookie, so Storage RLS still runs as that admin (is_admin() must pass to write).
*/
export function createBrowserSupabase() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey())
}
