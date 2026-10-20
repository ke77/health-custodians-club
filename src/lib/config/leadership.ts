/*
  the Executive Committee shown on /about.
  PLACEHOLDER names, photos and social links: Kelvin replaces them. the shape mirrors the `people` table
  (docs/05-data-model.md: type, name, role, photo_path, sort_order, published, plus socials) so the
  dashboard can take over without touching the components.
*/
export type SocialPlatform = 'linkedin' | 'instagram' | 'x' | 'facebook' | 'email'

export type Person = {
  id: string
  type: 'executive' | 'adviser'
  name: string
  role: string
  // path under public/ or a storage url; null shows the initials placeholder
  photoPath: string | null
  socials: { platform: SocialPlatform; href: string }[]
  sortOrder: number
  published: boolean
}

const placeholderSocials: Person['socials'] = [
  { platform: 'linkedin', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
]

export const people: Person[] = [
  { id: 'exec-1', type: 'executive', name: 'Ama Mensah', role: 'President', photoPath: null, socials: placeholderSocials, sortOrder: 1, published: true },
  { id: 'exec-2', type: 'executive', name: 'Kwame Owusu', role: 'Vice President', photoPath: null, socials: placeholderSocials, sortOrder: 2, published: true },
  { id: 'exec-3', type: 'executive', name: 'Efua Asante', role: 'General Secretary', photoPath: null, socials: placeholderSocials, sortOrder: 3, published: true },
  { id: 'exec-4', type: 'executive', name: 'Yaw Boateng', role: 'Financial Secretary', photoPath: null, socials: placeholderSocials, sortOrder: 4, published: true },
  { id: 'exec-5', type: 'executive', name: 'Akosua Darko', role: 'Organising Secretary', photoPath: null, socials: placeholderSocials, sortOrder: 5, published: true },
  { id: 'exec-6', type: 'executive', name: 'Kofi Agyeman', role: 'Public Relations Officer', photoPath: null, socials: placeholderSocials, sortOrder: 6, published: true },
]

// published executives in display order: the one query the page needs
export function getExecutives() {
  return people
    .filter((p) => p.type === 'executive' && p.published)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}
