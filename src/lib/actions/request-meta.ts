import 'server-only'
import { createHash } from 'node:crypto'
import { headers } from 'next/headers'

/*
  a one-way hash of the caller's IP, used only for rate limiting and abuse review (never the raw IP).
  salted so the same IP cannot be recovered from the stored hash.
*/
export async function hashedIp(): Promise<string | null> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || ''
  if (!ip) return null
  const salt = process.env.RATE_LIMIT_SALT ?? ''
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}
