import { z } from 'zod'

export const regionSchema = z.object({
  active: z.boolean(),
  headName: z.string().trim().max(120).optional().default(''),
  headInstitution: z.string().trim().max(160).optional().default(''),
  headPhotoPath: z.string().trim().optional().default(''),
  headPublished: z.boolean(),
})

export type RegionInput = z.input<typeof regionSchema>
