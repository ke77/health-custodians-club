import { z } from 'zod'

// times are entered and shown in Accra time (Ghana is GMT all year), stored as timestamptz
export const applicationWindowSchema = z.object({
  applicationsOpen: z.boolean(),
  // a datetime-local string (YYYY-MM-DDTHH:MM) or empty for no deadline
  deadline: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v), 'Enter a valid date and time.'),
  cohort: z
    .string()
    .trim()
    .min(1, 'Enter a cohort label, for example 2026/27.')
    .max(20, 'Keep the cohort label short.'),
})

export type ApplicationWindowInput = z.input<typeof applicationWindowSchema>

// Accra is GMT, so the entered wall time is the UTC time: append seconds and Z
export function accraLocalToIso(local: string): string | null {
  if (!local) return null
  return `${local}:00.000Z`
}

// the reverse, for seeding the form: take the Accra wall time from a stored ISO
export function isoToAccraLocal(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 16)
}
