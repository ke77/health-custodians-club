import type { Metadata } from 'next'
import { Audiences, ContactSection } from '@/components/contact/contact-sections'

export const metadata: Metadata = {
  title: 'Contact | Health Custodians Club',
  description:
    'Get in touch with Health Custodians Club: advisers, partners, sponsors, health professionals, alumni and students who want to join.',
}

export default function ContactPage() {
  return (
    <>
      <Audiences />
      <ContactSection />
    </>
  )
}
