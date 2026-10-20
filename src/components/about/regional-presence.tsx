import { RegionMap } from '@/components/about/region-map'
import { Reveal } from '@/components/ui/reveal'
import { ghanaDotSize, ghanaDotsPath, ghanaViewBox } from '@/lib/config/ghana-map'
import { regions } from '@/lib/config/regions'

// layout from reference/screenshots/map.png, narrowed to Ghana: a dot map with one pin per region
export function RegionalPresence() {
  const count = regions.filter((r) => r.present).length

  return (
    <section id='regions' className='bg-ink text-paper'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal>
          <h2 className='heading-section text-paper'>
            In all {count} regions of Ghana
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
                aria-label={`Map of Ghana marking the club in all ${count} regions`}
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
      </div>
    </section>
  )
}
