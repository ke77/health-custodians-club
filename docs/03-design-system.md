# 03. Design system

Direction: minimalist, editorial, calm, like a well-made public-health report. Generous white space, strong typography, real photographs, thin dividing lines, very little decoration. Credible to a professor or sponsor, fresh to a 20-year-old.

All values below are defined once as tokens in `src/app/globals.css` (Tailwind v4 `@theme` plus a custom daisyUI theme). Components use token classes only. A change to a colour or font is made in that one file.

## Colour tokens

| Token | Hex | Use |
|-------|-----|-----|
| `paper` | `#FFFFFF` | Page background |
| `ink` | `#17191A` | Main text, occasional dark band |
| `muted` | `#5B5E5C` | Secondary text, captions |
| `teal` | `#1F5A57` | The single accent: buttons, links, small labels, map, journey diagram |
| `sand` | `#F3EFE6` | Form fields only |
| `cream` | `#E6C56B` | Secondary button fill (ink text). Works on both paper and ink backgrounds. |
| `cream-soft` | `#FAF1D9` | Section-background wash (e.g. Beyond the curriculum). Chosen to blend into surrounding paper. |
| `rule` | ink at about 12% opacity | Hairline dividers |

Contrast (computed, WCAG AA needs 4.5:1 for body text, 3:1 for large text and UI):
- ink on paper 17.6, muted on paper 6.6, teal on paper 7.9, paper on teal 7.9
- ink on sand 15.4, muted on sand 5.7, teal on sand 6.9
- paper on ink 17.6
- **muted on ink is 2.7: fails.** On dark bands use paper for text, never muted.

Dark band: ink background with paper text. Maximum one or two per page.
The hero image overlay is the only gradient allowed (dark, linear).

## Typography

| Role | Font | Notes |
|------|------|-------|
| Display and headings | Newsreader | Large sizes, tight leading |
| Body and UI | Hanken Grotesk | Warm humanist grotesque, civic and readable. Used for paragraphs, buttons and UI text |
| Labels and metadata | IBM Plex Mono | Small, uppercase, letter-spaced. Section numbers ("§ 02 / Mission"), form step counters, table headers |

Self-host with `next/font`. Fluid type scale with `clamp()`, tokenised (`--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small`, `--text-label`). Body at least 16px on phones. Line length 60 to 75 characters for prose. British spelling.

## Layout and spacing

- Mobile first. Design at 360px, then scale up. Test 360, 768, 1280.
- Section width: every section from the header to the footer uses the `container-site` utility — `width: 91vw`, centred (`margin-inline: auto`), capped at `--container-wide` (80rem). One narrow token (`--container-prose`) caps prose measure. A 12-column grid on desktop, single column on phones.
- Hero fills `min-h-[90vh]`.
- Spacing from a small token scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). No arbitrary pixel values in components.
- Sections separated by hairline rules and white space, not boxes or shadows.
- Photographs carry much of the design: full-screen hero, section images, leader headshots. Honest, documentary, natural light, everyday Ghanaian life and community health settings. No staged stock (no smiling doctors with stethoscopes).
- Radius: small and consistent. `--radius-sm` (3px) for form fields and cards; `--radius-md` (6px) for buttons (`rounded-md`). No heavy rounded cards, no drop shadows as decoration.

## Components to build first (on a `/styleguide` route, protected or removed before launch)

1. **Button** (`rounded-md`): primary (teal fill, paper text), secondary (cream fill, ink text — works on both paper and ink backgrounds, used for Apply CTAs), secondaryLight (paper outline, for dark backgrounds such as the hero and footer), link (teal text with underline-draw on hover + arrow nudge, no padding). Sizes: `md` default (`px-10 py-4`, generous, more horizontal than vertical), `sm` (`px-6 py-2.5`, for the compact navbar button). Arrow nudges 2 to 4px on hover. Visible focus ring in teal with offset (paper on dark backgrounds).
2. **Link**: underline draws on hover.
3. **Section header**: mono label ("§ 02 / Mission") above a serif heading, hairline rule.
4. **Input, Textarea, Select, Checkbox, Radio**: sand fill, visible labels (never placeholder-only), error text below linked with `aria-describedby`, errors announced via `aria-live`. Searchable select for institutions.
5. **Form step indicator**: row of numbered steps in mono (1 to 7), current step in teal, simple.
6. **Accordion** for FAQ.
7. **Person entry** for leadership: photo, name, role. Typographic, not a shadowed card.
8. **Journey ladder** diagram for Membership (HTML and CSS, teal).
9. **Ghana map** SVG (the one allowed custom SVG): region paths, keyboard-focusable, single teal highlight.
10. **Header, full-screen mobile menu, footer**.
11. **Word counter** for the short answers.

## Motion

Subtle and purposeful. Link underline draw, small arrow nudge on calls to action, map region highlight, form step transitions. Respect `prefers-reduced-motion`. No scroll-jacking, no everything-fades-in-on-scroll.

## Accessibility (WCAG 2.1 AA)

Semantic landmarks, visible brand-styled focus states, labelled inputs, errors in `aria-live`, keyboard-operable everywhere (menu, accordion, map, multi-step form), meaningful alt text, `lang="en"`, skip link, touch targets at least 44px.

## Performance

Lighthouse 95 or higher on mobile. Target LCP under 2s on a mid-range Android over 3G/4G. `next/image` for all images with correct sizes, `next/font`, minimal client JS on static pages, no heavy libraries.

## Hard bans (the generic AI-template tells)

- Purple or blue gradients, gradient text, glassmorphism, glowing blobs, mesh backgrounds.
- Hero plus three identical icon cards plus testimonial carousel plus pricing rhythm.
- Counters, stat cards, "10k+ lives touched" blocks.
- Emoji as icons. A generic icon on every card.
- Default `rounded-2xl shadow-lg` cards everywhere.
- Inter/Poppins-only typography.
- Kente patterns, flag-colour overload, stock "African" borders.
- Filler slogans ("Empowering the future of health, together").
- Heavy animation.
- Colours outside the token list. No default Tailwind palette in the UI.

## Icons

`react-icons` or `lucide-react` only, used sparingly (arrows, menu, close, social). No hand-drawn SVGs except the Ghana map.
