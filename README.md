# Health Custodians Club website

Public website, application system and admin dashboard for the Health Custodians Club (Ghana).
Live at https://healthcustodiansclub.com. Built with Next.js (App Router), TypeScript, Tailwind CSS v4 + daisyUI, Supabase (Postgres, Auth, Storage), Resend, Cloudflare Turnstile and Vercel.

## Run it locally

```bash
pnpm install
cp .env.example .env.local   # then fill it in (see below)
pnpm dev                     # http://localhost:3000
```

Before sending work anywhere: `pnpm typecheck`, `pnpm lint` and `pnpm build`.

## Environment variables

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live domain, `https://healthcustodiansclub.com`. Used for links inside emails and link previews. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project URL and the publishable key. Safe in the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key. Server only. Never share it or prefix it with `NEXT_PUBLIC`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (bot check on public forms). |
| `RESEND_API_KEY` | Resend API key. |
| `EMAIL_FROM` | `Health Custodians Club <info@healthcustodiansclub.com>`. Leave blank until the domain is verified in Resend: with it blank, nothing is emailed and the dashboard says so. |
| `REPLY_TO_EMAIL` | Optional. Where replies to the club's emails go. Defaults to `info@healthcustodiansclub.com`. |
| `CRON_SECRET` | Protects the daily keep-alive route. Same value in Vercel. |
| `RATE_LIMIT_SALT` | Long random string used to hash IP addresses before rate limiting. |

Set every variable in Vercel too (Project → Settings → Environment Variables), then redeploy.

## Database

Migrations are in `supabase/migrations/`, applied in order:

1. `…_core.sql`: admins, settings, applications, waiting list, enquiries, RLS, `is_admin()`.
2. `…_content.sql`: people, regions, partners, posts, FAQs (unused), the `media` storage bucket and its policies.
3. `…_post_kinds.sql`: adds the `news` and `article` post kinds.
4. `…_email_log.sql`: the record of status emails sent to applicants.

Apply with `pnpm dlx supabase db push --linked`, or, if your network blocks the database port, paste each file into the Supabase **SQL Editor** and run it. After a schema change, regenerate types:
`pnpm dlx supabase gen types typescript --project-id bbjophwgvgkcxyjprfsl --schema public > src/lib/supabase/types.ts`
(then put the two comment lines back at the top).

**`supabase/verify.sql`** is a read-only launch check. Paste it into the SQL Editor: every row should say OK.

## Who edits what

| In the dashboard (`/admin`) | In the code (ask the developer) |
|---|---|
| Applications, waiting list, enquiries, blog, leadership and regions, partners, announcement banner, applications window, admins | FAQs (`src/lib/config/faqs.ts`), contact email, phone numbers and social links (`src/lib/config/contact.ts`), page copy, brand colours (`src/app/globals.css`) |

## Email

Sent through Resend from `info@healthcustodiansclub.com` once the domain is verified. Three aliases, set up in ImprovMX and all forwarding to the club Gmail, are defined in `src/lib/config/contact.ts` (`clubEmails`):

| Address | Used for |
|---|---|
| `contact@` | The public contact address (contact page), and where contact-form messages are reported |
| `admin@` | Dashboard notices: an admin added or removed |
| `info@` | Everything else: new membership applications, the sender and reply-to of the club's emails |

To send as one of them from Gmail, use Gmail's "Send mail as" with Resend's SMTP (`smtp.resend.com`, port 465, user `resend`, password = the Resend API key). Templates are in `src/lib/email/templates/`; the sender is `src/lib/email/resend.ts`. Admin sign-in codes are sent by Supabase Auth, which has its own SMTP setting (point it at Resend too, sender `admin@healthcustodiansclub.com`).

## The dashboard as a phone app

`/admin` is installable: `public/admin.webmanifest` (scope `/admin`), `public/admin-sw.js` (offline screen only), icons in `public/pwa/`. Admins install it from **Account → Dashboard app**. It needs the production site over HTTPS.

## Deploy

Push to the repo connected to Vercel. Keep the daily cron in `vercel.json` (it stops the free Supabase project pausing). Auth settings that matter in Supabase: sign-ups **off**, Site URL set to the live domain.
