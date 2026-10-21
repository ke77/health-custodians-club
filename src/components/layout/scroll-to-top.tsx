'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { easeOut, scrollTop } from '@/lib/config/motion'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key='scroll-to-top'
          type='button'
          aria-label='Back to top'
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
          }
          initial={{ opacity: 0, y: scrollTop.distance }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: scrollTop.distance }}
          transition={{ duration: scrollTop.duration, ease: easeOut }}
          // the faint paper ring keeps the ink button visible over the ink bands
          className='group fixed right-5 bottom-13 md:right-4 md:bottom-4 z-30 flex size-11 md:size-13 items-center justify-center rounded-full bg-ink/85 text-paper shadow-float transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:right-6 sm:bottom-6 cursor-pointer'
        >
          <ArrowUp
            className='size-5 transition-transform group-hover:-translate-y-0.5'
            aria-hidden
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
