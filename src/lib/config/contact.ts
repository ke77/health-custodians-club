/*
  the club's contact details, hard-coded on purpose: edit them here. every page that shows them (the footer,
  the contact page, the coming-soon pages) reads this one object.
  socials: replace each '#' with the club's real link. an empty string hides that icon everywhere.
  phones and whatsapp are plain numbers with the country code, e.g. '+233 24 000 0000'; empty shows "To come".
*/
/*
  the club's three addresses (ImprovMX forwards each to the club Gmail), and what each one is for:
  - contact: the public address on the contact page, and where messages from the contact form are reported
  - admin:   notices about the dashboard itself (an admin added or removed)
  - info:    everything else: new membership applications, and the address applicants see and reply to
  they are not secrets, so they live here instead of in environment variables.
*/
export const clubEmails = {
  contact: 'contact@healthcustodiansclub.com',
  admin: 'admin@healthcustodiansclub.com',
  info: 'info@healthcustodiansclub.com',
} as const

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'whatsapp'
export type SocialLink = { platform: SocialPlatform; href: string }

export const contactDetails: {
  email: string | null
  // where the club operates. empty shows "To come" (the club is not tied to one campus, O11)
  // location: string | null
  phones: string[]
  whatsapp: string[]
  socials: SocialLink[]
} = {
  email: clubEmails.contact,
  // location: null,
  phones: [],
  whatsapp: [],
  socials: [
    { platform: 'instagram', href: '#' },
    { platform: 'facebook', href: '#' },
    { platform: 'linkedin', href: '#' },
    { platform: 'whatsapp', href: '#' },
  ],
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
