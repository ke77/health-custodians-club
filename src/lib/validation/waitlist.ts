import { z } from 'zod'

// the "notify me" form when applications are closed (docs/04)
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.')),
  // honeypot: hidden from people, so anything in it came from a bot
  website: z.string().max(0),
})

export type WaitlistFormValues = { email: string; website: string }
