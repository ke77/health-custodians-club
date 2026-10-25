import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// the dashboard is private: never indexed, and no public link to it until Phase 2 (D19)
export const metadata: Metadata = {
  title: { default: 'Dashboard | Health Custodians Club', template: '%s | HCC dashboard' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
