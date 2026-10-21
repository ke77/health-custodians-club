import { Image as ImageIcon } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

/*
type Setting = {
  number: string
  label: string
  description: string
}

const settings: Setting[] = [
  {
    number: '01',
    label: 'Schools',
    description:
      'Teenagers, before kidney-harming habits set in and quietly stay.',
  },
  {
    number: '02',
    label: 'Marketplaces',
    description:
      'Traders breathing open-air pollution through long, loud days.',
  },
  {
    number: '03',
    label: 'Rural communities',
    description:
      'Places where the nearest hospital is hours away, if it is reachable at all.',
  },
  {
    number: '04',
    label: 'Underserved settings',
    description:
      'Wherever people are left out of the health conversation entirely.',
  },
]
*/

export function WhereWeWork() {
  return (
    <section id='where-we-work' className='bg-paper'>
      <div className='container-site py-28 sm:py-42'>
        <div className='grid gap-14 lg:grid-cols-2 lg:items-center md:gap-20'>
          <Reveal className='order-first md:order-last relative flex aspect-[2/2] flex-col items-center justify-center gap-3 rounded-md lg:order-first'>
            <ImageIcon className='size-10 text-muted' aria-hidden />
            <span className='font-mono text-label uppercase text-muted'>
              Photo to come
            </span>
          </Reveal>

          <Reveal index={1} className='flex flex-col gap-y-2 md:gap-y-4 items-start'>
            <h2 className='heading-section text-ink'>
              We work in settings where health knowledge is needed most.
            </h2>
            <p className='mt-6 max-w-[var(--container-prose)] font-body text-base md:text-body text-muted leading-[1.9em]'>
              Members work in the places where day-to-day life shapes health:
              schools before habits set in, marketplaces where traders breathe
              open-air pollution, and rural communities where a clinic is hours
              away. Through regional representatives, outreaches are planned
              across all 16 regions of Ghana.
            </p>
          </Reveal>
        </div>

        {/*
        <ul className='mt-20 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-4'>
          {settings.map(({ number, label, description }) => (
            <li
              key={number}
              className='flex flex-col gap-3 border-b border-rule py-8 pr-8 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:pl-8 sm:first:pl-0 lg:py-10'
            >
              <span className='font-mono text-label tabular-nums text-teal'>
                {number}
              </span>
              <h3 className='font-display text-h3 text-ink'>{label}</h3>
              <p className='font-body text-base text-muted'>{description}</p>
            </li>
          ))}
        </ul>
        */}
      </div>
    </section>
  )
}
