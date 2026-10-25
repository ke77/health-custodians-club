/*
  the shape of a person on the About page. the people themselves live in the `people` table and are edited
  under Dashboard → Leadership (docs/05-data-model.md); nothing is hard-coded here.
*/
export type SocialPlatform = 'linkedin' | 'instagram' | 'x' | 'facebook' | 'email'

export type Person = {
  id: string
  type: 'executive' | 'adviser'
  name: string
  role: string
  // a public storage url; null shows the initials placeholder
  photoPath: string | null
  socials: { platform: SocialPlatform; href: string }[]
  sortOrder: number
  published: boolean
}
