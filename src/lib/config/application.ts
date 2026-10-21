import { regions } from '@/lib/config/regions'

// option lists for the application form (docs/04-application-form.md). one source for the form, the schema and the review step

export const levels = ['200', '300', '400', '500', '600'] as const

// eligible programmes (D32). General Psychology is not eligible
export const programmes = [
  'Medicine',
  'Nursing',
  'Midwifery',
  'Pharmacy',
  'Physician Assistantship',
  'Medical Laboratory Science',
  'Public Health',
  'Nutrition and Dietetics',
  'Physiotherapy',
  'Radiography and Medical Imaging',
  'Dentistry',
  'Optometry',
  'Biomedical Science',
  'Clinical Psychology',
  'Other health-related',
] as const

/*
  Ghanaian tertiary institutions with health-sciences programmes. TO CONFIRM WITH THE CLUB (docs/04).
  'Other' opens a text field, so a missing institution never blocks an applicant.
*/
export const institutions = [
  'Accra College of Medicine',
  'Accra Technical University',
  'Catholic University of Ghana',
  'Central University',
  'Christian Service University',
  'Ensign Global College',
  'Family Health University College',
  'Garden City University College',
  'Ho Technical University',
  'Kumasi Technical University',
  'Kwame Nkrumah University of Science and Technology',
  'Methodist University Ghana',
  'Pentecost University',
  'Presbyterian University, Ghana',
  'Radford University College',
  'University for Development Studies',
  'University of Cape Coast',
  'University of Ghana',
  'University of Health and Allied Sciences',
  'Valley View University',
  'A Nursing or Midwifery Training College',
  'Other',
] as const

export const regionNames = regions.map((r) => r.name) as [string, ...string[]]

export const languages = [
  'English',
  'Twi',
  'Ga',
  'Ewe',
  'Fante',
  'Dagbani',
  'Hausa',
  'Dagaare',
  'Gonja',
  'Nzema',
  'Other',
] as const

export const proficiencies = [
  { value: 'basic', label: 'Basic' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'fluent', label: 'Fluent' },
] as const

export const genders = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const

export const interestAreas = [
  'Community outreach',
  'Research',
  'Health communication',
  'Leadership',
  'School programmes',
  'Market outreach',
  'Rural health',
  'Content and media',
  'Events',
] as const

export const leadershipOptions = [
  { value: 'none', label: 'Not at the moment' },
  { value: 'executive', label: 'Yes, an executive role' },
  { value: 'regional_head', label: 'Yes, a regional head role' },
] as const

// stored as the upper bound in hours (applications.hours_per_month is a smallint)
export const hoursOptions = [
  { value: '4', label: 'Up to 4 hours a month' },
  { value: '8', label: '5 to 8 hours a month' },
  { value: '12', label: '9 to 12 hours a month' },
  { value: '16', label: 'More than 12 hours a month' },
] as const

export const skillOptions = [
  'Graphic design',
  'Content creation',
  'Video editing',
  'Social media management',
] as const

export const heardAboutOptions = [
  'Social media',
  'A friend or classmate',
  'A club member',
  'A lecturer or my department',
  'Other',
] as const

export const minimumCgpa = 2.8

/*
  one grade field takes either scale, told apart by size: up to 4.00 is a CGPA, 10 to 100 is a CWA
  (KNUST and others). the CWA minimum is still open (O04), so no CWA threshold is enforced yet.
*/
export const gradeScales = {
  cgpa: { max: 4 },
  cwa: { min: 10, max: 100 },
} as const

export function gradeScaleOf(value: string): 'cgpa' | 'cwa' | null {
  const n = Number(value)
  if (value.trim() === '' || Number.isNaN(n)) return null
  if (n >= 0 && n <= gradeScales.cgpa.max) return 'cgpa'
  if (n >= gradeScales.cwa.min && n <= gradeScales.cwa.max) return 'cwa'
  return null
}
