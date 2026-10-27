import { connection } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

/*
  runs once a day from Vercel's cron (vercel.json). two jobs:
  - touches the database, so Supabase's free plan never pauses the project for inactivity (it pauses after about a week)
  - deletes rate-limit records older than a day, so that table does not grow forever
  Vercel sends `Authorization: Bearer $CRON_SECRET`; anything else is refused.
*/
export async function GET(request: Request) {
  await connection()

  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()
  const { error: pingError } = await supabase.from('settings').select('id').eq('id', 1).single()
  if (pingError) {
    console.error('keep-alive query failed', pingError.message)
    return new Response('Database check failed', { status: 500 })
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { error: cleanError } = await supabase.from('rate_limit_events').delete().lt('created_at', cutoff)
  if (cleanError) console.error('rate-limit cleanup failed', cleanError.message)

  return Response.json({ ok: true })
}
