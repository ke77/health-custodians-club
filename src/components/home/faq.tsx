import { Accordion } from '@/components/ui/accordion'
import { Reveal } from '@/components/ui/reveal'
import { faqs } from '@/lib/config/faqs'

// every FAQ lives here: there is no separate /faq page, so nothing links out of this section
export function Faq() {
  return (
    <section id='faq' className='bg-paper'>
      <div className='container-site grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:sticky lg:top-24 lg:self-start'>
          <h2 className='heading-section text-ink'>
            Frequently asked questions
          </h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            Quick answers about the club, membership and our work. If your
            question is not here, write to us.
          </p>
        </Reveal>

        <Reveal index={1}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  )
}
