import 'server-only'
import { Resend } from 'resend'
import { clubEmails } from '@/lib/config/contact'

export type Email = { subject: string; html: string; text: string }

type SendArgs = { to: string; email: Email; replyTo?: string }

// where replies to the club's emails go: info@, which forwards to the club inbox
const defaultReplyTo = () => process.env.REPLY_TO_EMAIL || clubEmails.info

// true once RESEND_API_KEY and EMAIL_FROM are set (they need the club's verified domain)
export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

/*
  one place that talks to Resend. if the API key or sender is not set yet (before the club's domain is
  verified) it logs and reports a soft failure instead of throwing, so a saved application is never lost to
  an email problem. the caller decides what a failure means (for applications, nothing: the row is saved).
*/
export async function sendEmail({ to, email, replyTo }: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.warn('email not sent: RESEND_API_KEY or EMAIL_FROM is not set')
    return { ok: false, error: 'Email sending is not set up yet.' }
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: replyTo ?? defaultReplyTo(),
    })
    if (error) {
      console.error('email send failed', error.name, error.message)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.error('email send threw', err instanceof Error ? err.message : err)
    return { ok: false, error: 'The email service could not be reached.' }
  }
}

const BATCH_SIZE = 100 // Resend's limit per batch call

/*
  sends one email each to many people through Resend's batch API (100 per call). each person gets their own
  message, so no one sees anyone else's address. returns the `key` of every message that went, so the caller
  can mark exactly those. a failed batch is skipped (and reported), never retried blindly.
*/
export async function sendBatch(
  messages: { key: string; to: string; email: Email }[],
): Promise<{ sentKeys: string[]; failed: number; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) return { sentKeys: [], failed: messages.length, error: 'Email sending is not set up yet.' }

  const resend = new Resend(apiKey)
  const replyTo = defaultReplyTo()
  const sentKeys: string[] = []
  let failed = 0
  let firstError: string | undefined

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const chunk = messages.slice(i, i + BATCH_SIZE)
    try {
      const { error } = await resend.batch.send(
        chunk.map((m) => ({ from, to: m.to, subject: m.email.subject, html: m.email.html, text: m.email.text, replyTo })),
      )
      if (error) {
        failed += chunk.length
        firstError ??= error.message
        console.error('email batch failed', error.name, error.message)
        continue
      }
      sentKeys.push(...chunk.map((m) => m.key))
    } catch (err) {
      failed += chunk.length
      firstError ??= 'The email service could not be reached.'
      console.error('email batch threw', err instanceof Error ? err.message : err)
    }
  }

  return { sentKeys, failed, error: firstError }
}
