import { z } from 'zod'

export const bannerSchema = z
  .object({
    bannerOn: z.boolean(),
    bannerText: z.string().trim().max(160, 'Keep the banner under 160 characters.'),
    // a full URL or a site-relative path (/membership/apply); empty means no link
    bannerLink: z
      .string()
      .trim()
      .refine((v) => v === '' || v.startsWith('/') || /^https?:\/\//.test(v), 'Enter a full URL, a /path, or leave it empty.'),
  })
  .refine((v) => !v.bannerOn || v.bannerText.length > 0, {
    message: 'Add the banner text before switching it on.',
    path: ['bannerText'],
  })

export type BannerInput = z.input<typeof bannerSchema>
