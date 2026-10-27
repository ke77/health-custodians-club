import type { Enums } from '@/lib/supabase/types'

export type ApplicationStatus = Enums<'application_status'>

/*
  O01: no interview for the current cohort. the status stays in the database enum; flip this to offer it again
  in the dashboard (the journey ladder tags the interview as optional for the same reason).
*/
export const interviewStepEnabled = false

// in the order a reviewer moves through them
export const applicationStatuses: { value: ApplicationStatus; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'rejected', label: 'Rejected' },
]

// what the status picker offers; a row already marked interview still shows its status
export function selectableStatuses(current?: ApplicationStatus) {
  return applicationStatuses.filter((s) => interviewStepEnabled || s.value !== 'interview' || s.value === current)
}

// the statuses that have an applicant email. the dashboard asks before sending one of these (templates/member-status.ts)
export const emailedStatuses = ['accepted', 'rejected', 'waitlisted'] as const
export type EmailedStatus = (typeof emailedStatuses)[number]

export function isEmailedStatus(status: string): status is EmailedStatus {
  return (emailedStatuses as readonly string[]).includes(status)
}

// the name stored in email_log for a status email
export const statusTemplateName = (status: EmailedStatus) => `status_${status}`

export function statusLabel(status: ApplicationStatus) {
  return applicationStatuses.find((s) => s.value === status)?.label ?? status
}
