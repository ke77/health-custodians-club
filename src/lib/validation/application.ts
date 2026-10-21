import { z } from 'zod'
import {
  genders,
  hoursOptions,
  heardAboutOptions,
  institutions,
  interestAreas,
  languages,
  leadershipOptions,
  levels,
  gradeScaleOf,
  minimumCgpa,
  programmes,
  regionNames,
  skillOptions,
} from '@/lib/config/application'

/*
  the application schema, shared by the form (step by step) and the server action (all steps).
  one schema per step, each with its own cross-field rules, because an object refinement only runs
  once every field in that object parses: a single big schema could not check step 1 while step 6 is empty.
*/

export function countWords(text: string) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

// accepts 024 123 4567, 24 123 4567 or +233 24 123 4567 and returns +233241234567
export function normaliseGhanaPhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.startsWith('+233')) return digits
  if (digits.startsWith('233')) return `+${digits}`
  if (digits.startsWith('0')) return `+233${digits.slice(1)}`
  return `+233${digits}`
}

const ghanaPhone = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${label}.`)
    .transform(normaliseGhanaPhone)
    .refine((v) => /^\+233[2-5]\d{8}$/.test(v), `Enter a valid Ghanaian ${label}, for example 024 123 4567.`)

const words = (min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((v) => countWords(v) >= min, `Write at least ${min} words.`)
    .refine((v) => countWords(v) <= max, `Keep it to ${max} words or fewer.`)

function ageOn(date: Date, today = new Date()) {
  let age = today.getFullYear() - date.getFullYear()
  const m = today.getMonth() - date.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age -= 1
  return age
}

const valuesOf = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]

export const personalSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name.').max(120, 'That name is too long.'),
    email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address.')),
    phone: ghanaPhone('phone number'),
    whatsappSame: z.boolean(),
    whatsapp: z.string().trim(),
    gender: z.union([z.enum(valuesOf(genders)), z.literal('')]),
    dateOfBirth: z
      .string()
      .min(1, 'Enter your date of birth.')
      .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date.')
      .refine((v) => {
        const age = ageOn(new Date(v))
        return age >= 16 && age <= 60
      }, 'Check the year of your date of birth.'),
  })
  .superRefine((v, ctx) => {
    if (v.whatsappSame) return
    const parsed = ghanaPhone('WhatsApp number').safeParse(v.whatsapp)
    if (!parsed.success) {
      ctx.addIssue({ code: 'custom', path: ['whatsapp'], message: parsed.error.issues[0].message })
    }
  })

export const academicSchema = z
  .object({
    level: z.enum(levels, 'Choose your level.'),
    institution: z.enum(institutions, 'Choose your institution from the list.'),
    institutionOther: z.string().trim(),
    programme: z.enum(programmes, 'Choose your programme.'),
    programmeOther: z.string().trim(),
    studentId: z.string().trim().min(3, 'Enter your student ID number.').max(40, 'That ID looks too long.'),
    // CGPA or CWA, whichever the institution uses (see gradeScaleOf)
    grade: z
      .string()
      .trim()
      .min(1, 'Enter your CGPA or CWA.')
      .refine(
        (v) => /^\d{1,3}(\.\d{1,2})?$/.test(v) && gradeScaleOf(v) !== null,
        'Enter a CGPA out of 4.00 (for example 3.25) or a CWA out of 100 (for example 68.5).',
      )
      .refine(
        (v) => gradeScaleOf(v) !== 'cgpa' || Number(v) >= minimumCgpa,
        `The minimum CGPA is ${minimumCgpa.toFixed(2)}.`,
      ),
  })
  .superRefine((v, ctx) => {
    if (v.institution === 'Other' && v.institutionOther.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['institutionOther'], message: 'Enter the name of your institution.' })
    }
    if (v.programme === 'Other health-related' && v.programmeOther.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['programmeOther'], message: 'Enter the name of your programme.' })
    }
  })

export const locationSchema = z
  .object({
    homeRegion: z.enum(regionNames, 'Choose your home region.'),
    currentRegion: z.enum(regionNames, 'Choose the region you are in now.'),
    languages: z
      .array(
        z.object({
          language: z.enum(languages),
          level: z.enum(['basic', 'conversational', 'fluent'], 'Choose how well you speak it.'),
        }),
      )
      .min(1, 'Choose at least one language.'),
    languageOther: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    if (v.languages.some((l) => l.language === 'Other') && v.languageOther.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['languageOther'], message: 'Name the other language you speak.' })
    }
  })

export const interestsSchema = z.object({
  interests: z.array(z.enum(interestAreas)).min(1, 'Choose at least one area.'),
  leadership: z.enum(valuesOf(leadershipOptions)),
  hoursPerMonth: z.enum(valuesOf(hoursOptions), 'Choose how much time you can give.'),
  committed: z.enum(['yes', 'no'], 'Choose yes or no.'),
})

export const skillsSchema = z.object({
  skills: z.array(z.enum(skillOptions)),
})

export const answersSchema = z.object({
  answerMotivation: words(150, 200),
  answerHealthGap: words(150, 200),
  answerSkills: words(150, 200),
  answerBalance: words(70, 100),
})

export const reviewSchema = z
  .object({
    heardAbout: z.enum(heardAboutOptions, 'Tell us how you heard about us.'),
    heardAboutOther: z.string().trim(),
    consent: z.literal(true, 'You need to agree before you submit.'),
    truthful: z.literal(true, 'You need to confirm this before you submit.'),
    // honeypot: hidden from people, so anything in it came from a bot
    website: z.string().max(0),
  })
  .superRefine((v, ctx) => {
    if (v.heardAbout === 'Other' && v.heardAboutOther.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['heardAboutOther'], message: 'Tell us where you heard about us.' })
    }
  })

export const stepSchemas = [
  personalSchema,
  academicSchema,
  locationSchema,
  interestsSchema,
  skillsSchema,
  answersSchema,
  reviewSchema,
] as const

// what the form holds while it is being filled in: raw strings (empty until chosen) and plain booleans
export type ApplicationFormValues = {
  fullName: string
  email: string
  phone: string
  whatsappSame: boolean
  whatsapp: string
  gender: string
  dateOfBirth: string
  level: string
  institution: string
  institutionOther: string
  programme: string
  programmeOther: string
  studentId: string
  grade: string
  homeRegion: string
  currentRegion: string
  languages: { language: string; level: string }[]
  languageOther: string
  interests: string[]
  leadership: string
  hoursPerMonth: string
  committed: string
  skills: string[]
  answerMotivation: string
  answerHealthGap: string
  answerSkills: string
  answerBalance: string
  heardAbout: string
  heardAboutOther: string
  consent: boolean
  truthful: boolean
  website: string
}

export const emptyApplication: ApplicationFormValues = {
  fullName: '',
  email: '',
  phone: '',
  whatsappSame: true,
  whatsapp: '',
  gender: '',
  dateOfBirth: '',
  level: '',
  institution: '',
  institutionOther: '',
  programme: '',
  programmeOther: '',
  studentId: '',
  grade: '',
  homeRegion: '',
  currentRegion: '',
  languages: [],
  languageOther: '',
  interests: [],
  leadership: 'none',
  hoursPerMonth: '',
  committed: '',
  skills: [],
  answerMotivation: '',
  answerHealthGap: '',
  answerSkills: '',
  answerBalance: '',
  heardAbout: '',
  heardAboutOther: '',
  consent: false,
  truthful: false,
  website: '',
}

export type Application = z.output<typeof personalSchema> &
  z.output<typeof academicSchema> &
  z.output<typeof locationSchema> &
  z.output<typeof interestsSchema> &
  z.output<typeof skillsSchema> &
  z.output<typeof answersSchema> &
  z.output<typeof reviewSchema>

// runs every step schema; on success returns the merged, normalised application
export function parseApplication(input: unknown):
  | { success: true; data: Application }
  | { success: false; issues: z.core.$ZodIssue[] } {
  const data: Record<string, unknown> = {}
  const issues: z.core.$ZodIssue[] = []
  for (const schema of stepSchemas) {
    const result = schema.safeParse(input)
    if (result.success) Object.assign(data, result.data)
    else issues.push(...result.error.issues)
  }
  return issues.length ? { success: false, issues } : { success: true, data: data as Application }
}
