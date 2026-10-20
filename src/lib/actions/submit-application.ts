'use server'

import { parseApplication } from '@/lib/validation/application'

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; reason: 'invalid'; fields: string[] }
  | { ok: false; reason: 'not_connected' }

/*
  pipeline from docs/04-application-form.md. done here: validation of every step (never trust the client)
  and the honeypot. still to come with the database task: window check, Turnstile, rate limit, insert with
  reference number, and the Resend emails. until then this returns not_connected, so nothing pretends to be saved.
*/
export async function submitApplication(input: unknown): Promise<SubmitResult> {
  const parsed = parseApplication(input)

  if (!parsed.success) {
    // a filled honeypot fails validation too; bots get the same answer as anyone with a bad field
    const fields = [...new Set(parsed.issues.map((i) => String(i.path[0])))]
    return { ok: false, reason: 'invalid', fields }
  }

  return { ok: false, reason: 'not_connected' }
}
