import type { JourneyStep } from '@/components/membership/journey-ladder'

// the membership journey shown on the homepage preview and the Membership page
export const membershipJourney: JourneyStep[] = [
  { title: 'Apply', caption: 'A short seven-step form, open for each cohort.' },
  { title: 'Review', caption: 'Admins read every answer and cross-check with regional reps.' },
  { title: 'Admission', caption: 'Accepted members receive a welcome email with next steps.' },
  { title: 'Cohort', caption: 'Two years of Saturday training and community outreach.' },
  { title: 'Certificate', caption: 'An official certificate on graduation.' },
  { title: 'Alumni', caption: 'Stay close, mentor the next intake, keep the work going.' },
]
