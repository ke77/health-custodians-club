import type { JourneyStep } from '@/components/membership/journey-ladder'

/*
  the membership journey shown on the homepage preview and /membership.
  the interview is tagged optional: whether a cohort has one is still open (O01).
*/
export const membershipJourney: JourneyStep[] = [
  { title: 'Apply', caption: 'A short seven-step form, open for each cohort.' },
  { title: 'Review', caption: 'We read every answer and check details with regional representatives.' },
  { title: 'Interview', caption: 'Some cohorts include a short conversation. We will tell you if yours does.', optional: true },
  { title: 'Admission', caption: 'Accepted members receive a welcome email with next steps.' },
  { title: 'Cohort', caption: 'Two years of Saturday training and community outreach.' },
  { title: 'Graduation', caption: 'An official certificate for every member who completes the cohort.' },
  { title: 'Alumni', caption: 'Stay close, mentor the next intake, keep the work going.' },
]
