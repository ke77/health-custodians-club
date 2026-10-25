import { genders, hoursOptions, leadershipOptions, proficiencies } from '@/lib/config/application'
import type { Tables } from '@/lib/supabase/types'

// how stored application values read in the dashboard and the CSV export (one place, so both always agree)

type Application = Tables<'applications'>

const labelOf = (list: readonly { value: string; label: string }[], value: string | null | undefined) =>
  list.find((o) => o.value === value)?.label ?? ''

export const institutionOf = (a: Pick<Application, 'institution' | 'institution_other'>) =>
  a.institution === 'Other' && a.institution_other ? a.institution_other : a.institution

export const programmeOf = (a: Pick<Application, 'programme' | 'programme_other'>) =>
  a.programme === 'Other health-related' && a.programme_other ? a.programme_other : a.programme

export function gradeOf(a: Pick<Application, 'cgpa' | 'cwa'>) {
  if (a.cgpa !== null) return { scale: 'CGPA', value: Number(a.cgpa).toFixed(2) }
  if (a.cwa !== null) return { scale: 'CWA', value: String(Number(a.cwa)) }
  return { scale: 'CGPA', value: '' }
}

type Language = { language: string; level: string }

function isLanguageList(value: unknown): value is Language[] {
  return (
    Array.isArray(value) &&
    value.every((l) => typeof l === 'object' && l !== null && 'language' in l && 'level' in l)
  )
}

export function languagesOf(a: Pick<Application, 'languages' | 'language_other'>) {
  if (!isLanguageList(a.languages)) return ''
  return a.languages
    .map((l) => {
      const name = l.language === 'Other' ? a.language_other || 'Other' : l.language
      return `${name} (${labelOf(proficiencies, l.level).toLowerCase() || l.level})`
    })
    .join(', ')
}

export const genderOf = (a: Pick<Application, 'gender'>) => labelOf(genders, a.gender)
export const hoursOf = (a: Pick<Application, 'hours_per_month'>) => labelOf(hoursOptions, String(a.hours_per_month))
export const leadershipOf = (a: Pick<Application, 'leadership_interest'>) =>
  labelOf(leadershipOptions, a.leadership_interest ?? 'none')
export const heardAboutOf = (a: Pick<Application, 'heard_about' | 'heard_about_other'>) =>
  a.heard_about === 'Other' && a.heard_about_other ? `Other: ${a.heard_about_other}` : a.heard_about

export type DetailRow = { label: string; value: string; long?: boolean; mono?: boolean }

// every answer, grouped the way the applicant met the questions (the form's step titles)
export function applicationSections(a: Application): { title: string; rows: DetailRow[] }[] {
  const grade = gradeOf(a)
  return [
    {
      title: 'About you',
      rows: [
        { label: 'Full name', value: a.full_name },
        { label: 'Email', value: a.email },
        { label: 'Phone', value: a.phone, mono: true },
        { label: 'WhatsApp', value: a.whatsapp === a.phone ? 'Same as phone' : a.whatsapp, mono: a.whatsapp !== a.phone },
        { label: 'Date of birth', value: a.date_of_birth },
        { label: 'Gender', value: genderOf(a) },
      ],
    },
    {
      title: 'Your studies',
      rows: [
        { label: 'Institution', value: institutionOf(a) },
        { label: 'Programme', value: programmeOf(a) },
        { label: 'Level', value: `Level ${a.level}` },
        { label: 'Student ID', value: a.student_id, mono: true },
        { label: grade.scale, value: grade.value, mono: true },
      ],
    },
    {
      title: 'Region and languages',
      rows: [
        { label: 'Home region', value: a.home_region },
        { label: 'Current region', value: a.current_region },
        { label: 'Languages', value: languagesOf(a) },
      ],
    },
    {
      title: 'Interests and commitment',
      rows: [
        { label: 'Areas', value: a.interests.join(', ') },
        { label: 'Committed', value: a.committed ? 'Yes' : 'No' },
        { label: 'Time', value: hoursOf(a) },
        { label: 'Leadership', value: leadershipOf(a) },
      ],
    },
    {
      title: 'Skills',
      rows: [{ label: 'Skills', value: a.skills.length ? a.skills.join(', ') : 'None chosen' }],
    },
    {
      title: 'Short answers',
      rows: [
        { label: 'Why HCC', value: a.answer_motivation, long: true },
        { label: 'A health gap', value: a.answer_health_gap, long: true },
        { label: 'Skills and experience', value: a.answer_skills, long: true },
        { label: 'Balancing commitments', value: a.answer_balance, long: true },
      ],
    },
    {
      title: 'Review and submit',
      rows: [{ label: 'Heard about us', value: heardAboutOf(a) }],
    },
  ]
}
