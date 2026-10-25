import { z } from 'zod'

export const partnerSchema = z.object({
  name: z.string().trim().min(1, 'Add the partner’s name.').max(120, 'Keep the name short.'),
  url: z.union([z.literal(''), z.string().trim().url('Enter a full URL, e.g. https://…')]),
  logoPath: z.string().trim().optional().default(''),
  published: z.boolean(),
})

export type PartnerInput = z.input<typeof partnerSchema>
