import { z } from 'zod'

export const adminEmail = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.'))

export const codeSchema = z.object({
  email: adminEmail,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code from the email.'),
})

export const passwordSignInSchema = z.object({
  email: adminEmail,
  password: z.string().min(1, 'Enter your password.'),
})

export const minPasswordLength = 10

export const setPasswordSchema = z
  .object({
    password: z.string().min(minPasswordLength, `Use at least ${minPasswordLength} characters.`).max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'The two passwords do not match.' })

export const addAdminSchema = z.object({
  email: adminEmail,
  name: z.string().trim().max(80, 'Keep the name under 80 characters.'),
})
