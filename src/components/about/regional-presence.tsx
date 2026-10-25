import Image from 'next/image'
import { RegionMap } from '@/components/about/region-map'
import { Reveal } from '@/components/ui/reveal'
import { ghanaDotSize, ghanaDotsPath, ghanaViewBox } from '@/lib/config/ghana-map'
import { getRegionalHeads, getRegions } from '@/lib/data/regions'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// layout from reference/screenshots/map.png, narrowed to Ghana: a dot map with one pin per region
export async function RegionalPresence() {
  const [regions, heads] = await Promise.all([getRegions(), getRegionalHeads()])
  const count = regions.filter((r) => r.present).length

  return (
    <section id='regions' className='bg-ink/95 text-white'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal>
          <h2 className='heading-section text-paper'>
            {count === 0
              ? 'Across Ghana'
              : `In ${count === 16 ? 'all 16' : count} region${count === 1 ? '' : 's'} of Ghana`}
          </h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-paper/80'>
            Members are organised by region, with a presiding head in each one.
            Outreach reaches schools, markets and rural communities in every part
            of the country.
          </p>
        </Reveal>

        <Reveal index={1} className='mt-14 md:mt-20'>
          <RegionMap
            regions={regions}
            map={
              <svg
                viewBox={`0 0 ${ghanaViewBox.width} ${ghanaViewBox.height}`}
                role='img'
                aria-label={`Map of Ghana marking the club in ${count} region${count === 1 ? '' : 's'}`}
                className='absolute inset-0 size-full'
              >
                <path
                  d={ghanaDotsPath}
                  fill='none'
                  strokeWidth={ghanaDotSize}
                  strokeLinecap='round'
                  className='stroke-paper/20'
                />
              </svg>
            }
          />
        </Reveal>

        {heads.length > 0 && (
          <div className='mt-24 sm:mt-32'>
            <Reveal>
              <h3 className='heading-section text-paper'>Regional heads</h3>
            </Reveal>
            <ul className='mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
              {heads.map((head, i) => (
                <Reveal key={head.region} as='li' index={i % 3} className='flex items-center gap-4'>
                  <div className='relative size-16 shrink-0 overflow-hidden rounded-full bg-paper/10'>
                    {head.photoUrl ? (
                      <Image src={head.photoUrl} alt={head.name} fill sizes='64px' className='object-cover' />
                    ) : (
                      <span aria-hidden className='absolute inset-0 flex items-center justify-center font-display text-md text-paper/50'>
                        {initials(head.name)}
                      </span>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-mono text-label uppercase text-paper/60'>{head.region}</span>
                    <span className='font-body text-base font-semibold text-paper'>{head.name}</span>
                    {head.institution && <span className='font-body text-small text-paper/70'>{head.institution}</span>}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
