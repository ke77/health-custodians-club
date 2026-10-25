import 'server-only'

/*
  verifies a Cloudflare Turnstile token with the secret key. if no secret is configured (before the club sets
  Turnstile up) verification is skipped, so forms still work in development; set the keys to enforce it.
*/
export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = (await res.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}

// so the client can decide whether to render the widget
export const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
