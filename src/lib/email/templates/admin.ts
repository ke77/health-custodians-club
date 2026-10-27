import 'server-only'
import type { Email } from '@/lib/email/resend'
import { escapeHtml, p, wrap } from '@/lib/email/layout'

// notices about the dashboard itself, sent to admin@ when someone is added or removed as an admin

export function adminAdded(input: { email: string; name: string | null; addedBy: string; dashboardUrl: string }): Email {
  const who = input.name ? `${input.name} (${input.email})` : input.email
  return {
    subject: `Dashboard: ${input.email} was added as an admin`,
    html: wrap(
      p(`<strong>${escapeHtml(who)}</strong> was added as an admin by ${escapeHtml(input.addedBy)}.`) +
        p('They can now sign in to the dashboard with an emailed code.') +
        p(`If this was not expected, remove them under Settings, Admins: <a href="${escapeHtml(input.dashboardUrl)}" style="color:#0163a2;">open the dashboard</a>.`),
    ),
    text:
      `${who} was added as an admin by ${input.addedBy}.\n\n` +
      `They can now sign in to the dashboard with an emailed code.\n\n` +
      `If this was not expected, remove them under Settings, Admins: ${input.dashboardUrl}`,
  }
}

export function adminRemoved(input: { email: string; removedBy: string }): Email {
  return {
    subject: `Dashboard: ${input.email} was removed as an admin`,
    html: wrap(
      p(`<strong>${escapeHtml(input.email)}</strong> was removed as an admin by ${escapeHtml(input.removedBy)}.`) +
        p('Their login has been deleted and any open session has ended.'),
    ),
    text:
      `${input.email} was removed as an admin by ${input.removedBy}.\n\n` +
      `Their login has been deleted and any open session has ended.`,
  }
}
