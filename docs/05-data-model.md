# 05. Data model (Supabase)

Migrations live in `supabase/migrations/` as SQL files, with `supabase/seed.sql` for starter content. Every table has `created_at` and `updated_at` (trigger-maintained). Use enums for status, region and programme. **RLS is enabled on every table.**

## Access model

- Public visitors never read or write tables directly. Public pages read through server-side code. Public forms write through server actions that use the **service-role key, server-only** (`SUPABASE_SERVICE_ROLE_KEY`, never `NEXT_PUBLIC_`).
- Public content tables (`people`, `regional_reps`, `faqs`, `partners`, `posts`, `settings` public fields) may have a read-only policy for `anon` limited to published rows. Applications, waitlist, inquiries and admins have **no** anon policies.
- Admins authenticate with Supabase email magic link. A user is an admin only if their email exists in `admins`. Admin policies check that through a `security definer` helper `is_admin()`.
- Public pages read content with ISR and `revalidateTag`, so edits show within seconds.

## Tables

### Phase 1

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `admins` | Approved dashboard emails | `id`, `email` (unique, lowercase), `added_by`, `created_at` |
| `settings` | Single row of site settings | `applications_open` (bool), `application_deadline` (timestamptz, nullable), `current_cohort` (text, e.g. `2026/27`), `contact_email`, `phones` (jsonb), `whatsapp` (jsonb), `socials` (jsonb), `banner_text`, `banner_link`, `banner_on` |
| `applications` | One row per application | see below |
| `waitlist` | "Notify me" emails when closed | `id`, `email`, `cohort`, `notified_at`, `created_at`. Unique on `(cohort, lower(email))` |
| `inquiries` | Contact form messages | `id`, `name`, `email`, `interest` (enum), `message`, `status` (new, handled), `created_at` |
| `reference_counters` | Atomic reference numbers | `year` (pk), `last_number` |
| `rate_limit_events` | Simple rate limiting | `id`, `key` (hashed IP or email), `action`, `created_at`. Index on `(key, action, created_at)`. Clean up old rows with the cron job |
| `people` | Executives and advisers | `id`, `type` (`executive` or `adviser`), `name`, `role`, `photo_path`, `bio`, `sort_order`, `published` |
| `regional_reps` | Region representatives | `id`, `region` (enum, unique), `name`, `institution`, `photo_path`, `published` |
| `faqs` | FAQ entries | `id`, `question`, `answer`, `sort_order`, `published` |
| `partners` | Sponsors and partners | `id`, `name`, `logo_path`, `url`, `sort_order`, `published` |

Phase 1 reads `people`, `regional_reps`, `faqs`, `partners` and `settings` from the database so Phase 2 only adds editing screens. Until then, edit them in the Supabase table editor (O12).

### Phase 2

| Table | Purpose |
|-------|---------|
| `posts` | Blog: `id`, `slug`, `title`, `excerpt`, `body` (markdown or rich text), `cover_path`, `kind` (announcement, training, outreach, event), `published_at`, `status` |
| `activities` | Activities and gallery entries with images |
| `email_log` (optional) | Record of status emails sent |

## `applications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid pk | |
| `reference` | text unique | `HCC-YYYY-XXXX`, generated in the database |
| `cohort` | text | from `settings.current_cohort` at submit time |
| `status` | enum | submitted, under_review, shortlisted, interview, accepted, rejected, waitlisted |
| `full_name`, `email`, `phone`, `whatsapp` | text | email stored lowercase |
| `gender` | enum nullable | male, female, prefer_not_to_say |
| `date_of_birth` | date | |
| `level` | smallint | check `level >= 200` |
| `institution`, `institution_other` | text | |
| `programme` (enum), `programme_other` | | |
| `student_id` | text | typed, for cross-checking |
| `cgpa` | numeric(3,2) | check `cgpa >= 2.80 and cgpa <= 4.00` |
| `cwa` | numeric(5,2) nullable | |
| `home_region`, `current_region` | enum | the 16 regions |
| `languages` | jsonb | see below |
| `interests` | text[] | |
| `leadership_interest` | text nullable | executive, regional head, none |
| `hours_per_month` | smallint | |
| `skills` | text[] | optional skills |
| `answer_motivation`, `answer_health_gap`, `answer_skills` | text | 150 to 200 words |
| `heard_about` | text | |
| `consent_at` | timestamptz | consent to data processing |
| `notes` | text | private admin notes |
| `ip_hash` | text | hashed, for rate limiting and abuse review only |

Unique index: `(cohort, lower(email))`. Index `status`, `cohort`, `created_at`.

## What JSONB is, and why `languages` uses it

JSONB is a Postgres column type that stores structured JSON and can be queried and indexed. Each applicant speaks a different set of languages, each with a proficiency level, for example:

```json
[
  { "language": "Twi", "level": "fluent" },
  { "language": "Ewe", "level": "conversational" }
]
```

You could model this with a separate `application_languages` table (one row per language), which is the more rigid, normalised option. For this project JSONB is simpler: one insert, one read, no joins, and the data is only displayed and exported, not heavily analysed. Validate the shape with Zod before inserting and with a Postgres `check` on `jsonb_typeof(languages) = 'array'`. If the club later wants queries like "all fluent Dagbani speakers", Postgres can still query inside JSONB (`languages @> '[{"language":"Dagbani"}]'`).

## Reference numbers

A Postgres function `next_reference(year int)` increments `reference_counters.last_number` for that year in a single atomic statement (insert on conflict do update returning) and returns `HCC-YYYY-XXXX`, zero-padded to four digits. Call it inside the insert so two simultaneous applications can never share a number.

## Storage

Phase 1 needs **no storage bucket** because there is no ID upload (D34). Phase 2 adds a public bucket for leader photos, partner logos and blog images, with admin-only write policies.

## Keep-alive (Supabase free tier can pause when idle)

1. Route: `src/app/api/cron/keep-alive/route.ts`. It checks the `Authorization: Bearer ${CRON_SECRET}` header, runs a trivial query with the server client (for example, select one row from `settings`), deletes old `rate_limit_events` rows, and returns 200.
2. Schedule in `vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/keep-alive", "schedule": "0 6 * * *" }]
}
```

3. Set `CRON_SECRET` in Vercel project environment variables. Vercel sends it automatically as the bearer token for cron calls. Confirm the current cron limits for the Hobby plan in Vercel's docs.
4. Document this in the README and the "if something breaks" checklist.

## Environment variables

Keep `.env.example` current (no real values). Never commit `.env.local`.

| Variable | Scope |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | public |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | server only |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public |
| `TURNSTILE_SECRET_KEY` | server only |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`, `CONTACT_NOTIFY_EMAIL` | server only |
| `CRON_SECRET` | server only |
| `RATE_LIMIT_SALT` | server only (for hashing IPs) |

## Security checklist

RLS on all tables, service-role key server-only, Zod on every server action, Turnstile plus honeypot plus rate limiting on all public forms, CSP and security headers in `next.config`, hashed IPs only, no student ID or phone numbers in logs, applicant data used only for membership administration (Ghana Data Protection Act, 2012, Act 843). Decide data retention with the club (open question) and document it.
