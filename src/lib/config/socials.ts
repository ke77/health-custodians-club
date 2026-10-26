import type { ComponentType } from 'react'
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import { contactDetails } from '@/lib/config/contact'
import type { SocialPlatform } from '@/lib/config/contact'

// the label and icon for each platform. the links themselves are in lib/config/contact.ts
export const socialMeta: Record<SocialPlatform, { label: string; Icon: ComponentType<{ className?: string }> }> = {
  instagram: { label: 'Instagram', Icon: FaInstagram },
  facebook: { label: 'Facebook', Icon: FaFacebookF },
  linkedin: { label: 'LinkedIn', Icon: FaLinkedinIn },
  whatsapp: { label: 'WhatsApp', Icon: FaWhatsapp },
}

export type SocialIcon = { label: string; href: string; Icon: ComponentType<{ className?: string }> }

// the icons for the footer and the coming-soon pages, in the order they are listed in contactDetails
export const socialIcons: SocialIcon[] = contactDetails.socials
  .filter((s) => s.href)
  .map((s) => ({ ...socialMeta[s.platform], href: s.href }))
