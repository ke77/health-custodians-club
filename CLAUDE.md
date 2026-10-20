# HCC Website (Health Custodians Club)

Public website and application system for the Health Custodians Club (HCC), a health-sciences club in Ghana.
One-off freelance build by Kelvin (kobbycodes). Club executives (contact: Amponsah Felix) run the site after handoff, so keep everything simple and maintainable.
Two phases. Phase 1 is an MVP that must be live before school resumes on 26 October 2026. Phase 2 finishes the dashboard step by step.

## Read on demand (do not load all of these every time)

- Scope, audiences, tone: `docs/00-project-brief.md`
- Every decision and its status (Agreed / Discussed / Proposed / Open): `docs/01-decisions.md`
- Pages, sections and draft copy: `docs/02-sitemap-content.md`
- Tokens, type, components, bans: `docs/03-design-system.md`
- Application form, emails, waiting list: `docs/04-application-form.md`
- Supabase schema, RLS, cron, env vars: `docs/05-data-model.md`
- Ordered tasks and approval gates: `docs/06-build-plan.md` (tick items off as you finish them)
- Screenshot references (gitignored): `reference/README.md`
- Club's original founding text (source of truth, don't copy verbatim): `docs/source/founding-document.md`

## Stack

Next.js (App Router) + TypeScript strict, Tailwind CSS v4 + daisyUI (custom theme only), Supabase (Postgres, Auth for admins only, RLS), Resend, Zod, React Hook Form, Cloudflare Turnstile, Vercel (Analytics and a daily cron).
Use the latest stable versions. Verify framework APIs against current docs instead of relying on memory (Next.js, Tailwind v4, daisyUI, Supabase SSR, Resend).
Package manager: pnpm. Add a `typecheck` script (`tsc --noEmit`).

## Commands

- `pnpm dev`: dev server
- `pnpm build`: production build
- `pnpm lint` and `pnpm typecheck`: run both before saying a task is done

## Content rules (hard)

- Never say or imply the club is student-founded, or tied to one campus or university. It must read as an established organisation.
- Never show membership fees or dues anywhere.
- Never invent past events, partners, sponsors, numbers, statistics or testimonials.
- Missing content (executives, advisers, partners, FAQs, contact details, photos) renders a graceful empty state and is stored in the database so it can be edited later. Never lorem ipsum.
- British and Ghanaian spelling (organisation, programme). Short, warm, direct sentences.
- The everyday scenarios in the founding document shape the writing. Weave them into prose. Never show them as cards or lists.
- If a task touches an item marked Open in `docs/01-decisions.md`, use the stated default and tell me, or ask me if no default exists.

## Design rules (details in `docs/03-design-system.md`)

- Minimalist and editorial. White page, ink text, cream `#FAF1D9` for primary buttons and washes, teal held in reserve. Sand `#F3EFE6` for form fields only.
- Every section sits in `container-site` (88vw, capped at 86rem). Section h2s use the `heading-section` utility. Dark bands are `bg-ink text-paper`.
- Fonts: Newsreader (headings), Hanken Grotesk (body and UI), IBM Plex Mono (small labels). Self-host via `next/font`.
- All colours, fonts and spacing live as tokens in `src/app/globals.css`. Never hardcode a hex, font name or magic spacing value in a component.
- No generic AI-template tells: no gradients (other than the hero's dark image overlay), glass, glow, mesh backgrounds, emoji icons, rows of identical icon cards, stat counters, testimonial carousels, filler slogans, kente patterns, flag-colour overload.
- Icons come from `react-icons` or `lucide-react` only. The Ghana map is the one allowed custom SVG.
- Motion is subtle: `motion` library, timings in `src/lib/config/motion.ts`. Wrap section content blocks in `<Reveal>` (not the hero), plus link underline draw and small arrow nudge. Respect `prefers-reduced-motion`.
- Mobile first. Design and test at 360px width first. Every component is responsive by default.
- Reference screenshots show layout, spacing and structure only. Never copy their colours, fonts, copy or imagery.

## Code style (mine, follow exactly)

- TypeScript with proper types. No `any` unless unavoidable.
- Single quotes unless double quotes are unavoidable.
- No semicolons at the end of lines. Add a leading semicolon only where ASI genuinely requires it.
- Comments only where the code is not self-explanatory. Every comment starts with a lowercase letter.
- Server Components by default. Add `'use client'` only when needed.
- Validate all input with Zod on the server, even if the client validates too. Share schemas between client and server.
- Never expose secrets to the client. The Supabase service-role key is server-only.

## Structure

```
src/
  app/            routes, layouts, globals.css, api/cron/keep-alive
  components/     ui/ layout/ home/ about/ programs/ membership/ contact/ partners/ faq/ blog/ admin/
  lib/            supabase/ email/ validation/ actions/ config/ utils/
supabase/         migrations/ and seed.sql
public/brand/     logo files (the logo exists; remind me to add it before building the header)
docs/             project documents (above)
reference/        gitignored screenshots
```

Group components by the page they belong to (the About sections live in `components/about/`). Shared primitives live in `components/ui/`.

## Workflow

1. Plan first. For any task bigger than one component, show a short plan and wait for my go-ahead.
2. One page or section per task. Build the homepage first, then stop and ask for my approval before any other page.
3. Show me the final copy for review before final polish.
4. Run `pnpm typecheck` and `pnpm lint` (and `pnpm build` for larger tasks). Report what changed and anything you assumed.
5. Tick the item off in `docs/06-build-plan.md`.
6. Do not commit or push unless I ask.
7. If you are unsure about anything, ask me instead of guessing.
