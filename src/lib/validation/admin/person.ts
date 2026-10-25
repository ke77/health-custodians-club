import { z } from 'zod'

export type PersonType = 'executive' | 'adviser'

export const personTypeLabels: Record<PersonType, { singular: string; plural: string }> = {
  executive: { singular: 'Executive', plural: 'Executive Committee' },
  adviser: { singular: 'Adviser', plural: 'Board of Advisers' },
}

// the social platforms a member card can show (mirrors components/about/member-card.tsx)
export const personSocialPlatforms = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
] as const

export type PersonSocialPlatform = (typeof personSocialPlatforms)[number]['value']

const social = z.object({
  platform: z.enum(['linkedin', 'instagram', 'x', 'facebook', 'email']),
  href: z.string().trim().min(1, 'Add the link or leave the row out.').max(300),
})

export const personSchema = z.object({
  name: z.string().trim().min(1, 'Add a name.').max(120),
  role: z.string().trim().min(1, 'Add a role.').max(120),
  bio: z.string().trim().max(600, 'Keep the bio under 600 characters.').optional().default(''),
  photoPath: z.string().trim().optional().default(''),
  published: z.boolean(),
  socials: z.array(social).max(5),
})

export type PersonInput = z.input<typeof personSchema>

export type PersonSocial = { platform: PersonSocialPlatform; href: string }

const validPlatforms: PersonSocialPlatform[] = ['linkedin', 'instagram', 'x', 'facebook', 'email']

// read the people.socials jsonb back into a typed list, dropping anything malformed.
// lives here (no server imports) so both the editor and the public readers can use it
export function parseSocials(value: unknown): PersonSocial[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return []
    const { platform, href } = item as Record<string, unknown>
    if (typeof platform !== 'string' || typeof href !== 'string') return []
    if (!validPlatforms.includes(platform as PersonSocialPlatform)) return []
    return [{ platform: platform as PersonSocialPlatform, href }]
  })
}
