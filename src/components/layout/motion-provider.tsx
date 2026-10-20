'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

// reduced-motion users get opacity only: motion drops every transform for them
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>
}
