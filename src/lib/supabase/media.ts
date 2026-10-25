import { supabaseUrl } from '@/lib/supabase/env'

// public url of a file in the media bucket, built without a client so server and browser code can both use it
export function mediaPublicUrl(path: string) {
  return `${supabaseUrl()}/storage/v1/object/public/media/${path}`
}
