import { Accordion } from '@/components/ui/accordion'
import type { AccordionItem } from '@/components/ui/accordion'
import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'

type Props = {
  items?: AccordionItem[]
  groups?: { label: string; items: AccordionItem[] }[]
  intro: string
  more?: { href: string; label: string }
}

export function FaqSection({ items, groups, intro, more }: Props) {
  const lists = groups ?? [{ label: '', items: items ?? [] }]

  return (
    <section id='faq' className='bg-paper'>
      <div className='container-site grid gap-12 py-24 md:py-36 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] md:gap-52'>
        <Reveal className='flex flex-col items-start lg:sticky lg:top-24 lg:self-start md:w-[48ch]'>
          <h2 className='heading-section text-ink'>Frequently asked questions</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-lg text-ink/70'>
            {intro}
          </p>
          {more && (
            <div className='mt-8'>
              <Button href={more.href} variant='link' arrow>
                {more.label}
              </Button>
            </div>
          )}
        </Reveal>

        <Reveal index={1} className='flex flex-col gap-14'>
          {lists.map((list, i) => (
            <div key={list.label || i}>
              {/*{list.label && (
                <h3 className='mb-2 font-body text-muted'>{list.label}</h3>
              )}*/}
              <Accordion items={list.items} defaultOpen={i === 0 ? 0 : null} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
