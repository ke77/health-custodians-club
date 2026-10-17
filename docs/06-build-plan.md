# 06. Build plan

Tick items off (`[x]`) as they are finished. Items marked **GATE** mean: stop and wait for Kelvin's approval before continuing.
Phase 1 target: live before school resumes on 26 October 2026. If time runs short, cut in this order: Privacy/Terms polish, OG images, Blog styling. Do not cut the application pipeline or the open/closed switch.

## Phase 1

### 0. Plan (no code)
- [x] Read `CLAUDE.md` and all `docs/`. List conflicts and gaps. Output the final sitemap, component inventory, database schema and a short design rationale.
- [x] **GATE**: Kelvin approves the plan.

### 1. Scaffold
- [x] Create the Next.js app (App Router, TypeScript strict, Tailwind v4, pnpm, `src/` directory, `@/*` alias). Add `typecheck` script.
- [x] Install daisyUI, react-hook-form, zod, `@hookform/resolvers`, lucide-react, react-icons, resend, Supabase packages. Use latest versions.
- [x] Folder structure from `CLAUDE.md`. `.env.example`. Confirm `/reference/` is in `.gitignore`.
- [x] Remind Kelvin to add the logo under `public/brand/` (needed in Step 3 for the header, not yet).

### 2. Design system
- [x] Tokens in `src/app/globals.css`: colours, fonts (`next/font`), fluid type scale, spacing, radius.
- [x] Custom daisyUI theme using only the tokens.
- [x] Components from `docs/03-design-system.md` on a `/styleguide` route (dev-only: 404s in production). Ghana map and header/footer built later with their inputs.
- [x] Contrast check on every pairing. **GATE**: Kelvin approves the styleguide.

### 3. Homepage only
- [x] Header and full-screen mobile menu, footer (footer rendered in `layout.tsx`; navbar used inside the hero).
- [ ] Hero (done), What HCC does, Beyond the curriculum, Where we work, Membership preview, FAQ preview, Closing CTA. One section per task, each with its reference screenshots.
- [ ] Mobile pass at 360px, then desktop.
- [ ] **GATE**: Kelvin approves the homepage layout and design. Do not build other pages before this.

### 4. Copy review
- [ ] Output all real copy for Home, About, Programs, Membership, Contact, Partners, FAQ, 404 for review. **GATE**: Kelvin and the club approve.

### 5. Remaining pages
- [ ] About (story, vision, mission, executives, regional reps, Board, Ghana map and list).
- [ ] Programs.
- [ ] Membership (eligibility, journey ladder, cohort model).
- [ ] Contact (pitches, details from settings; form wired in step 7).
- [ ] Partners, Blog ("Coming soon"), FAQ, Privacy, Terms, 404.
- [ ] Metadata, Open Graph images, `sitemap.xml`, `robots.txt`, favicon set, JSON-LD.

### 6. Database
- [ ] Migrations for Phase 1 tables in `docs/05-data-model.md`, enums, RLS, `is_admin()`, `next_reference()`.
- [ ] `seed.sql` with settings and neutral starter content. Public pages read from the database.
- [ ] Keep-alive cron route and `vercel.json`.

### 7. Application flow end to end
- [ ] Zod schemas shared by client and server.
- [ ] Seven-step form with draft autosave and review.
- [ ] `submit-application` server action (pipeline in `docs/04-application-form.md`): window check, honeypot, Turnstile, rate limit, insert, reference number, emails.
- [ ] Resend client and templates. Success page.
- [ ] Closed state and waiting-list form and action.
- [ ] Contact form action and emails.
- [ ] Test: duplicate email, closed window, invalid CGPA, level below 200, word limits, email failure, bot (honeypot) submission.

### 8. Admin dashboard (lean)
- [ ] Magic-link sign-in. Only emails in `admins`. Screen to add and remove admin emails.
- [ ] Applications table: search, filters, detail view, status workflow, notes, typed student ID, CSV export of the filtered set.
- [ ] Settings screen: open/closed switch, deadline, cohort label.
- [ ] No public link to the dashboard yet.

### 9. Quality pass
- [ ] Accessibility (WCAG 2.1 AA): keyboard, focus, labels, aria-live errors, contrast.
- [ ] Performance: Lighthouse 95+ on mobile, LCP under 2s on a mid-range Android over 3G/4G.
- [ ] Security: RLS verified per table, service-role key server-only, CSP headers.
- [ ] Analytics without a cookie banner (Vercel Analytics or Plausible).
- [ ] Report the results to Kelvin.

### 10. Handoff and launch
- [ ] `README.md` for developers: setup, env vars, migrations, deploy, how to edit content in Supabase until Phase 2 editors exist.
- [ ] `HANDBOOK.md` for non-technical executives: log in, open/close applications, review and export applicants, add or remove admin emails when a new executive team takes over.
- [ ] One-page "if something breaks" checklist (including the keep-alive cron).
- [ ] All accounts (Vercel, Supabase, Resend, Turnstile, domain) under the club's own email.
- [ ] Domain bought and verified in Resend. Production env vars set.
- [ ] Launch checklist: test application on a real phone, confirmation and admin emails arrive, closed state works, redirects, 404, sitemap submitted.

## Phase 2 (step by step, tested each time)

- [ ] Leadership editor: executives, regional reps, Board of Advisors (photos, names, roles, order). Public bucket and policies.
- [ ] Partners editor.
- [ ] FAQ editor (add, edit, reorder).
- [ ] Site settings editor: contact details, social links, announcement banner.
- [ ] Blog editor (standalone, installable on a phone as a web app) and `/blog` listing and post pages.
- [ ] Activities and gallery.
- [ ] Enquiries inbox with handled status.
- [ ] Automatic status emails (accepted, rejected, waitlisted), templates from the club.
- [ ] "Notify waiting list" action.
- [ ] Admin login link added to the header, far right.
- [ ] Update `HANDBOOK.md`.

## Waiting on the club (track here)

- [ ] Hero wording and hero image
- [ ] About story paragraphs
- [ ] Final executive positions
- [ ] Social media handles, official email, phone and WhatsApp numbers
- [ ] FAQ questions and answers
- [ ] Programme structure and legal course (with legal counsel)
- [ ] Academic standards per university (CGPA and CWA)
- [ ] Application opening and closing dates, cohort name
- [ ] Domain name and account holder
- [ ] Privacy Policy and Terms content
- [ ] Photographs and leader headshots
- [ ] Answers to open items O01 to O16 in `docs/01-decisions.md`
