import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AdminPwa } from '@/components/admin/admin-pwa'

// the dashboard is private: never indexed, and no public link to it until Phase 2 (D19).
// the manifest is linked here and only here, so only the dashboard offers to be installed as an app
export const metadata: Metadata = {
  title: { default: 'Dashboard | Health Custodians Club', template: '%s | HCC dashboard' },
  robots: { index: false, follow: false },
  manifest: '/admin.webmanifest',
  icons: { icon: '/favicon.ico', apple: '/pwa/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'HCC Dashboard', statusBarStyle: 'default' },
}

// colours the phone's status bar to match the dashboard's white header
export const viewport: Viewport = { themeColor: '#ffffff' }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdminPwa />
    </>
  )
}
