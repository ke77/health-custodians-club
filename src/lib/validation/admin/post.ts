import { z } from 'zod'

// the kinds a post can be. outreach and event posts may carry a photo gallery
export const postKinds = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'training', label: 'Training' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'event', label: 'Event' },
  { value: 'news', label: 'News' },
  { value: 'article', label: 'Article' },
] as const

export type PostKind = (typeof postKinds)[number]['value']

// kinds that may show a gallery (used by the editor to offer the gallery block)
export const galleryKinds: PostKind[] = ['outreach', 'event']

// a tolerant url slug: lowercase words joined by single hyphens
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// turn a title into a slug; the editor seeds the slug from the title but lets the admin edit it
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const galleryImage = z.object({
  path: z.string().min(1),
  alt: z.string().trim().max(200).default(''),
})

// what the editor sends on every save. body is tiptap json (an object); gallery is optional
export const postSchema = z.object({
  title: z.string().trim().min(1, 'Give the post a title.').max(200, 'Keep the title under 200 characters.'),
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is needed for the post URL.')
    .max(80, 'Keep the slug short.')
    .regex(slugPattern, 'Use lowercase letters, numbers and hyphens only.'),
  kind: z.enum(['announcement', 'training', 'outreach', 'event', 'news', 'article']),
  excerpt: z.string().trim().max(300, 'Keep the excerpt under 300 characters.').optional().default(''),
  coverPath: z.string().trim().optional().default(''),
  coverAlt: z.string().trim().max(200).optional().default(''),
  // tiptap document json; validated as an object, its inner shape is tiptap's concern
  body: z.record(z.string(), z.unknown()),
  gallery: z.array(galleryImage).max(40, 'That is a lot of photos; keep a gallery under 40.').default([]),
})

export type PostInput = z.input<typeof postSchema>
export type PostValues = z.output<typeof postSchema>
