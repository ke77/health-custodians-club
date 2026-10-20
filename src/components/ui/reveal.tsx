'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { easeOut, reveal } from '@/lib/config/motion'

type Props = {
  children: ReactNode
  // stagger position inside a group (0, 1, 2…), multiplied by the stagger token
  index?: number
  as?: 'div' | 'li'
  className?: string
}

// fades content up once as it scrolls into view. one per content block, never on the hero (LCP)
export function Reveal({ children, index = 0, as = 'div', className }: Props) {
  const Tag = as === 'li' ? motion.li : motion.div

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reveal.distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: reveal.margin }}
      transition={{
        duration: reveal.duration,
        ease: easeOut,
        delay: index * reveal.stagger,
      }}
    >
      {children}
    </Tag>
  )
}
