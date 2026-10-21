'use server'

import { enquirySchema } from '@/lib/validation/contact'

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; fields: string[] }
  | { ok: false; reason: 'not_connected' }

/*
  validates on the server (never trust the client) and checks the honeypot.
  saving to `inquiries` and emailing the club (CONTACT_NOTIFY_EMAIL) land with the database and email tasks;
  until then this returns not_connected so nothing pretends to be sent.
*/
export async function sendEnquiry(input: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input)
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]
    return { ok: false, reason: 'invalid', fields }
  }
  return { ok: false, reason: 'not_connected' }
}
