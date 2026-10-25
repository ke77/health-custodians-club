import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'

/*
  a simple sliding-window limit backed by the rate_limit_events table. records each attempt and refuses once
  too many land inside the window. old rows are cleaned up by the keep-alive cron. fails open on a database
  error, so a limiter outage never blocks a real applicant.
*/
export async function rateLimit(key: string, action: string, max: number, windowSeconds: number) {
  try {
    const supabase = createServiceClient()
    const since = new Date(Date.now() - windowSeconds * 1000).toISOString()
    const { count } = await supabase
      .from('rate_limit_events')
      .select('id', { count: 'exact', head: true })
      .eq('key', key)
      .eq('action', action)
      .gte('created_at', since)

    if ((count ?? 0) >= max) return { ok: false as const }

    await supabase.from('rate_limit_events').insert({ key, action })
    return { ok: true as const }
  } catch {
    return { ok: true as const }
  }
}
