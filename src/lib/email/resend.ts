import 'server-only'
import { Resend } from 'resend'

export type Email = { subject: string; html: string; text: string }

type SendArgs = { to: string; email: Email; replyTo?: string }

/*
  one place that talks to Resend. if the API key or sender is not set yet (before the club's domain is
  verified) it logs and reports a soft failure instead of throwing, so a saved application is never lost to
  an email problem. the caller decides what a failure means (for applications, nothing: the row is saved).
*/
export async function sendEmail({ to, email, replyTo }: SendArgs): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.warn('email not sent: RESEND_API_KEY or EMAIL_FROM is not set')
    return { ok: false }
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo,
    })
    if (error) {
      console.error('email send failed', error.name, error.message)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error('email send threw', err instanceof Error ? err.message : err)
    return { ok: false }
  }
}
