# 04. Application form, emails and waiting list

Route: `/membership/apply`. Decisions and open items: `docs/01-decisions.md` (D30 to D40, O01 to O05, O09, O10, O15, O16).
The form has **no document upload and no social media links**. Student ID is typed.

## Behaviour

- Seven steps. A simple row of numbered steps shows progress (mono numerals, current step in teal).
- Per-step validation with React Hook Form and Zod. Errors in plain language, announced via `aria-live`.
- Draft autosaved to `localStorage` on the applicant's device. Clear it after a successful submit. Wrap storage access in try/catch.
- Review step shows every answer with "Edit" links back to the step.
- Mobile first: one question group at a time, large touch targets, no horizontal scroll at 360px.
- Applicants cannot submit when the window is closed (see "Closed state").

## Steps and fields

| Step | Fields | Rules |
|------|--------|-------|
| 1. Personal | Full name, email, phone (Ghana format, +233), WhatsApp number (checkbox "same as phone"), gender (optional), date of birth | Email lowercased and trimmed. Phone normalised to `+233XXXXXXXXX`. Age sanity check on DOB (not under 16, not over 60), no exact-age gatekeeping |
| 2. Academic | Level (200 to 600), institution (searchable select of Ghanaian tertiary institutions plus "Other" opening a text field), programme (list below, plus "Other health-related" opening a text field), student ID number (typed), current CGPA, CWA (optional) | Level at least 200. CGPA required, 0.00 to 4.00, minimum 2.80, stated on the page. CWA optional, no threshold enforced (O04). Note shown: academic details will be verified with the institution |
| 3. Location and languages | Home region, current region (16 regions), languages spoken (multi-select) with proficiency each (basic, conversational, fluent) | Short note: language is central to HCC's mission. Languages: English, Twi, Ga, Ewe, Fante, Dagbani, Hausa, Dagaare, Gonja, Nzema, Other. At least one language required |
| 4. Interests | Areas of interest (multi-select), interest in an executive or regional head role (optional, yes/no and which), hours available per month | Areas: community outreach, research, health communication, leadership, school programmes, market outreach, rural health, content and media, events |
| 5. Skills | Optional skills | Graphic design, content creation, video editing, social media management. May be left empty |
| 6. Short answers | (a) Why do you want to join HCC? (b) Describe a health gap you have observed in your community. What would you do about it? (c) What skills or experience do you bring? | 150 to 200 words each. Live word counter. Count words, not characters |
| 7. Review and consent | Summary with Edit links, consent to data processing, truthfulness declaration, "How did you hear about us?" | Consent references Ghana's Data Protection Act, 2012 (Act 843). Data used only for membership administration. Both checkboxes required |

**Eligible programmes** (D32): Medicine, Nursing, Midwifery, Pharmacy, Physician Assistantship, Medical Laboratory Science, Public Health, Nutrition and Dietetics, Physiotherapy, Radiography and Medical Imaging, Dentistry, Optometry, Biomedical Science, Clinical Psychology, Other health-related. General Psychology is not eligible.

**Institutions**: store the list in `src/lib/config/institutions.ts` as a typed constant. Confirm the list with the club.

## Submission pipeline

A single server action, `src/lib/actions/submit-application.ts`, runs these steps in order and stops on the first failure:

1. Check the application window is open (`settings.applications_open` and deadline not passed). If closed, return a typed `closed` result.
2. Honeypot field must be empty.
3. Verify the Cloudflare Turnstile token server-side (POST to Turnstile's `siteverify` endpoint with the secret key).
4. Rate limit by hashed IP and by email (see `docs/05-data-model.md`, `rate_limit_events`).
5. Parse the payload with the shared Zod schema from `src/lib/validation/application.ts`. Never trust client validation.
6. Enforce business rules the schema cannot: CGPA at least 2.80, level at least 200, programme in the eligible list.
7. Insert into `applications` using the server-only Supabase client (service role). The unique index on `(cohort, lower(email))` rejects duplicates. Map that error to a friendly "You have already applied this cohort" result.
8. Generate the reference number `HCC-YYYY-XXXX` in the database (atomic counter, no race conditions).
9. Send the applicant confirmation and the admin notification through Resend. If email fails, still return success (the application is saved) and log the failure.
10. Return `{ ok: true, reference }`. The client redirects to `/membership/apply/success?ref=HCC-2026-0001`.

Sketch (style reference only):

```ts
'use server'

import { applicationSchema } from '@/lib/validation/application'

export async function submitApplication(input: unknown) {
  // order matters: cheap checks first, database last
  const settings = await getSettings()
  if (!settings.applicationsOpen) return { ok: false, reason: 'closed' } as const

  const parsed = applicationSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid' } as const

  // turnstile, rate limit, insert, emails follow
}
```

## Success page

Shows the reference number, a short confirmation, and next steps. **Next steps copy is a DRAFT (O09), flag it in the task report:**

> Thank you. Your application is in. Your reference number is HCC-2026-0001. Please keep it. We will review applications and contact you by email, so check your inbox and spam folder. If you do not hear from us within a few weeks, write to us and quote your reference number.

Do not promise dates or an interview.

## Emails (Resend)

Wiring, all server-side:

- `src/lib/email/resend.ts`: creates the Resend client from `RESEND_API_KEY` and exports `sendEmail({ to, subject, react | html })`.
- `src/lib/email/templates/`: one file per template (`application-received.tsx`, `admin-new-application.tsx`, `contact-notification.tsx`, `waitlist-confirmation.tsx`, `member-accepted.tsx`). Plain, minimal HTML in the brand colours. Always include a plain-text version.
- Env vars: `RESEND_API_KEY`, `EMAIL_FROM` (e.g. `HCC <hello@yourdomain>`), `ADMIN_NOTIFY_EMAIL` (applications), `CONTACT_NOTIFY_EMAIL` (enquiries). Addresses are club-owned and still to be supplied.
- **Launch blocker:** Resend's test sender only delivers to the account owner's own address. To email applicants, the club's domain must be bought and verified in Resend (SPF and DKIM DNS records). The domain is still undecided.
- All accounts (Resend, Supabase, Vercel, Turnstile, domain) are created under the club's own email, not the developer's.

Templates (DRAFT copy):

1. **Application received (to applicant)** Subject: "We have received your application". Body: thanks, reference number, what happens next (review, then we email you), contact address, no fees mentioned, no interview promised.
2. **New application (to club)** Subject: "New application: HCC-2026-0001". Body: name, programme, institution, level, region, link to the dashboard record.
3. **Contact enquiry (to club)**: name, email, interest category, message, link to dashboard (Phase 2 inbox).
4. **Waiting list confirmation (to subscriber)** Subject: "You are on the HCC waiting list". Body: we will email you when applications open.
5. **Newly accepted member (Phase 2, drafted now)**: welcome, what happens next, first session details placeholder. Sent manually until status emails are automated (O10).

## Closed state and waiting list ("notify me")

When `settings.applications_open` is false or the deadline has passed, `/membership/apply` shows:

- a short closed message,
- the deadline date from settings,
- a box to join the waiting list with an email address.

How it is wired, end to end:

1. **Table**: `waitlist (id, email, cohort, notified_at, created_at)` with a unique index on `(cohort, lower(email))`. RLS on, no public policies.
2. **Component**: `src/components/membership/waitlist-form.tsx` (client component, React Hook Form, email field, honeypot, Turnstile).
3. **Action**: `src/lib/actions/join-waitlist.ts` validates with Zod, verifies Turnstile, rate limits, inserts with the service-role client, treats a duplicate as success (do not reveal whether an email is already listed), then sends the "waiting list confirmation" email.
4. **When applications reopen**: Phase 1, an admin exports the list as CSV from the dashboard and emails people directly. Phase 2 option: a "Notify waiting list" button that sends one templated Resend email per row in batches and stamps `notified_at`.
5. **Privacy**: waiting-list emails are used only to say applications are open. Mention this next to the field and in the privacy policy.

## Admin side (Phase 1)

Applications table with search, filters (status, region, programme, institution, cohort, date), detail view of every answer, status workflow (submitted, under review, shortlisted, interview (hidden while O01 holds), accepted, rejected, waitlisted), private notes, typed student ID shown for cross-checking with regional representatives, CSV export of the filtered set. Details in `docs/05-data-model.md` and `docs/06-build-plan.md`.
