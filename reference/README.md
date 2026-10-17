# Reference screenshots

This folder is gitignored (`/reference/*`, with this README kept via `!/reference/README.md`). Images here are **layout references only**.

## Rules for using them

- Use them for structure, proportions, spacing and hierarchy. Never copy colours, fonts, copy, logos or photographs.
- Colours, fonts and spacing always come from the tokens in `src/app/globals.css` (see `docs/03-design-system.md`).
- One or two references per section. Crop to the section instead of full-page captures.
- Where a screenshot conflicts with `docs/03-design-system.md` or the hard bans, the design system wins.

## Folders

```
reference/
  hero/      header + full-bleed hero layouts
  nav/       desktop header and full-screen mobile menu
  sections/  homepage sections: pillars list, membership preview, closing CTA
  cards/     leadership entries, partner lists (typographic, not shadowed cards)
  footer/    footer layout (the "mobbin footer")
  forms/     multi-step form, step indicator, closed state
  faq/       accordion
```

## Naming

`<area>-<nn>-<short-description>.png`, for example `hero-01-overlay-left-aligned.png`. Never leave default names like `Screenshot 2026-10-16.png`.

## Map each image to a section

Fill in this table whenever you add an image. Claude reads it before building the section.

| File | Use it for | Take | Ignore |
|------|-----------|------|--------|
| `hero/hero-01-....png` | Homepage hero | Layout of nav over image, text block position, button spacing | Colours, fonts, copy |
| `footer/footer-01-....png` | Site footer | Column structure, spacing | Colours, logos |
| `forms/form-01-....png` | Application form | Step indicator and field spacing | Colours |
| | | | |

## How to prompt with them

> Build the homepage hero. Read `reference/hero/hero-01-....png` and match its layout and proportions. Use our tokens and the copy in `docs/02-sitemap-content.md`. Then run the dev server, take a screenshot at 360px and 1280px, compare it with the reference and fix the differences.

## Notes for `.gitignore`

```
/reference/*
!/reference/README.md
.env*
!.env.example
```
