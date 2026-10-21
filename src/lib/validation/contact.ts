import { z } from 'zod'
import { interestTypes } from '@/lib/config/contact'

const interestValues = interestTypes.map((t) => t.value) as [
  (typeof interestTypes)[number]['value'],
  ...(typeof interestTypes)[number]['value'][],
]

// shared by the contact form and the server action (docs/05-data-model.md, inquiries)
export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120, 'That name is too long.'),
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.')),
  organisation: z.string().trim().max(160, 'Keep this shorter.'),
  interest: z.enum(interestValues, 'Choose what you are getting in touch about.'),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more.')
    .max(3000, 'Keep your message under 3,000 characters.'),
  // honeypot: hidden from people, so anything in it came from a bot
  website: z.string().max(0),
})

export type EnquiryFormValues = {
  name: string
  email: string
  organisation: string
  interest: string
  message: string
  website: string
}

export const emptyEnquiry: EnquiryFormValues = {
  name: '',
  email: '',
  organisation: '',
  interest: '',
  message: '',
  website: '',
}
