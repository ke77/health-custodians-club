'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export type HeroSlide = {
  src: string
  // where the photo is anchored when cropped to the hero, e.g. 'right bottom'
  position?: string
}

type Props = {
  slides: HeroSlide[]
  // time each photo stays before fading to the next
  intervalMs?: number
  // length of the cross-fade itself
  fadeMs?: number
}

/*
  the hero's background: photos stacked on top of each other, cross-fading from one to the next on a timer,
  looping forever. no controls or indicators. the fade is switched off for reduced motion (the photo just changes).
*/
export function HeroCarousel({ slides, intervalMs = 6000, fadeMs = 1400 }: Props) {
  const count = slides.length
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (count < 2) return
    const tick = setInterval(() => setActive((i) => (i + 1) % count), intervalMs)
    return () => clearInterval(tick)
  }, [count, intervalMs])

  return (
    <div aria-hidden className='absolute inset-0 overflow-hidden'>
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=''
          fill
          sizes='100vw'
          // the first photo is on screen at load; the rest are fetched early but without competing for it
          priority={i === 0}
          loading='eager'
          fetchPriority={i === 0 ? 'high' : 'low'}
          className={cn('object-cover motion-safe:transition-opacity motion-safe:ease-in-out', i === active ? 'opacity-100' : 'opacity-0')}
          style={{ objectPosition: slide.position ?? 'center', transitionDuration: `${fadeMs}ms` }}
        />
      ))}
    </div>
  )
}
