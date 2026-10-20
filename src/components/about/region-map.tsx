'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { ghanaBounds, ghanaViewBox } from '@/lib/config/ghana-map'
import type { Region } from '@/lib/config/regions'
import { cn } from '@/lib/utils/cn'

type Props = {
  regions: Region[]
  // the static dot map, rendered on the server and passed in
  map: ReactNode
  className?: string
}

// percentage position of a coordinate inside the drawing (equirectangular, same bounds as the svg)
function position(lat: number, lon: number) {
  const { minLon, maxLon, minLat, maxLat } = ghanaBounds
  return {
    left: `${((lon - minLon) / (maxLon - minLon)) * 100}%`,
    top: `${((maxLat - lat) / (maxLat - minLat)) * 100}%`,
  }
}

/*
  dot map with a pin per region, plus the region list beside it (stacked list then map below lg).
  drawn for an ink band: paper pins and text, cream for the active region (teal is too dark on ink).
  a pin or a list entry lights up its partner: hover, or keyboard focus on the pin, shows the region label.
*/
export function RegionMap({ regions, map, className }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const present = regions.filter((r) => r.present)

  return (
    <div className={cn('grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center', className)}>
      <ul className='grid grid-cols-2 gap-x-8 gap-y-3 self-start'>
        {present.map((r) => (
          <li
            key={r.name}
            onMouseEnter={() => setActive(r.name)}
            onMouseLeave={() => setActive(null)}
            className='flex items-center gap-3 font-body text-base text-paper/80'
          >
            <span
              aria-hidden
              className={cn(
                'size-2 shrink-0 rounded-full transition-colors',
                active === r.name ? 'bg-cream' : 'bg-paper/40',
              )}
            />
            <span className={cn('transition-colors', active === r.name && 'text-cream')}>
              {r.name}
            </span>
          </li>
        ))}
      </ul>

      <div
        className='relative mx-auto w-full max-w-md'
        style={{ aspectRatio: `${ghanaViewBox.width} / ${ghanaViewBox.height}` }}
      >
        {map}
        <ul aria-label='Regions on the map'>
          {present.map((r) => {
            const isActive = active === r.name
            return (
              <li key={r.name} className='absolute' style={position(r.lat, r.lon)}>
                {/* the pin's tip sits on the regional capital */}
                <button
                  type='button'
                  aria-label={`${r.name} Region, ${r.capital}`}
                  onMouseEnter={() => setActive(r.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(r.name)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    'absolute bottom-0 left-1/2 flex size-11 -translate-x-1/2 items-end justify-center rounded-full focus-visible:outline-none',
                    isActive && 'z-10',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'relative mb-1 block size-5 rotate-45 rounded-[50%_50%_0_50%] shadow-button transition-[background-color,transform] duration-200',
                      isActive ? 'scale-125 bg-cream' : 'bg-paper/70',
                    )}
                  >
                    <span className='absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink' />
                  </span>
                </button>
                {isActive && (
                  <span
                    aria-hidden
                    className='pointer-events-none absolute bottom-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-sm bg-paper px-2.5 py-1.5 font-body text-small text-ink shadow-float'
                  >
                    {r.name}
                    <span className='text-ink/60'> &middot; {r.capital}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
