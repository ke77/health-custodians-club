// shapes the public site and the dashboard share, read from the database (docs/05-data-model.md)

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'x'

export type SocialLink = { platform: SocialPlatform; href: string }

export type Settings = {
  applicationsOpen: boolean
  applicationDeadline: string | null
  currentCohort: string
  contactEmail: string | null
  phones: string[]
  whatsapp: string[]
  socials: SocialLink[]
  bannerText: string | null
  bannerLink: string | null
  bannerOn: boolean
}
