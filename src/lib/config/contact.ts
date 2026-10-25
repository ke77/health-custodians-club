/*
  contact page content. details mirror the settings row (docs/05-data-model.md: contact_email, phones,
  whatsapp, socials) and stay empty until the club supplies them: the page shows "to come" instead of
  inventing anything. no physical location is shown (O11, and the club is not tied to one campus).
*/
export type SocialLink = { platform: 'instagram' | 'facebook' | 'linkedin' | 'x'; href: string }

export const contactDetails: {
  email: string | null
  // where the club operates. left empty (O11 showed no location); added back on request, shows "To come" until set
  location: string | null
  phones: string[]
  whatsapp: string[]
  socials: SocialLink[]
} = {
  email: null,
  location: null,
  phones: [],
  whatsapp: [],
  socials: [],
}

// the interest types a message can carry (docs/02-sitemap-content.md, Contact)
export const interestTypes = [
  { value: 'adviser', label: 'Becoming an adviser' },
  { value: 'partner', label: 'Partnering or sponsoring' },
  { value: 'professional', label: 'Supporting as a health professional' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'member', label: 'Joining as a member' },
  { value: 'other', label: 'Something else' },
] as const

export type InterestType = (typeof interestTypes)[number]['value']

// a short pitch for each audience (DRAFT: two sentences each, no claims beyond the founding document)
export const audiences: { interest: InterestType; title: string; pitch: string }[] = [
  {
    interest: 'adviser',
    title: 'Advisers',
    pitch:
      'Help shape the next generation of health leaders. Advisers guide the executives on strategy, open doors to partnerships and mentor the people who run the club.',
  },
  {
    interest: 'partner',
    title: 'Partners and sponsors',
    pitch:
      'Help health knowledge reach more people. We are building partnerships with institutions and organisations that want to support health education and outreach across Ghana.',
  },
  {
    interest: 'professional',
    title: 'Health professionals',
    pitch:
      'Share what you know with students who will carry it further. Professionals support the club as mentors, speakers and guides on community outreach.',
  },
  {
    interest: 'alumni',
    title: 'Alumni',
    pitch:
      'Stay close after graduation. Mentor new members, join outreach in your region and help keep the work going.',
  },
  {
    interest: 'member',
    title: 'Aspiring members',
    pitch:
      'Studying a health science at Level 200 or above? Read about membership, or ask us anything before you apply.',
  },
]
