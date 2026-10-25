'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { accordion, easeOut } from '@/lib/config/motion'
import { cn } from '@/lib/utils/cn'

export type AccordionItem = {
  question: string
  answer: string
  // optional follow-up link shown under the answer
  link?: { href: string; label: string }
}

type Props = {
  items: AccordionItem[]
  // index open on first render; null starts with everything closed
  defaultOpen?: number | null
  className?: string
}

/*
  one answer open at a time. each question is a button inside an h3 that controls its answer region.
  the plus turns into a cross on a soft filled circle when open (layout from reference/screenshots/faq.png).
*/
export function Accordion({ items, defaultOpen = 0, className }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open === i
        const buttonId = `${baseId}-q-${i}`
        const panelId = `${baseId}-a-${i}`

        return (
          <div key={item.question} className='border-b border-rule'>
            <h3>
              <button
                id={buttonId}
                type='button'
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className='group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-body text-base font-semibold text-ink md:text-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen ? 'bg-primary/40 text-ink' : 'text-ink/60 group-hover:text-ink',
                  )}
                >
                  <motion.span
                    className='flex'
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: accordion.duration, ease: easeOut }}
                  >
                    <Plus className='size-4' strokeWidth={2} />
                  </motion.span>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role='region'
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: accordion.duration, ease: easeOut }}
                  className='overflow-hidden'
                >
                  <div className='flex max-w-[60ch] flex-col items-start gap-3 pb-6 md:pr-12'>
                    <p className='font-body text-base text-ink/70 leading-[1.7]'>
                      {item.answer}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className='font-body text-base font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                      >
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
