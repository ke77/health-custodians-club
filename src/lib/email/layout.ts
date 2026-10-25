import 'server-only'

// a plain, brand-coloured HTML shell for every email. minimal markup, so it renders the same everywhere.
export function wrap(bodyHtml: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#17191a;line-height:1.6;">
<div style="max-width:560px;margin:0 auto;">
<p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#17191a;">Health Custodians Club</p>
${bodyHtml}
<hr style="border:none;border-top:1px solid #e5e2db;margin:28px 0 16px;">
<p style="margin:0;font-size:12px;color:#5b5e5c;">Health Custodians Club. You are receiving this because you contacted us or applied to join.</p>
</div></body></html>`
}

// an email paragraph with consistent spacing
export const p = (text: string) => `<p style="margin:0 0 16px;font-size:15px;color:#17191a;">${text}</p>`

// a boxed callout, used for the reference number
export const box = (text: string) =>
  `<p style="margin:0 0 20px;padding:14px 18px;background:#f3efe6;border-radius:3px;font-family:'Courier New',monospace;font-size:18px;color:#17191a;">${text}</p>`

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
