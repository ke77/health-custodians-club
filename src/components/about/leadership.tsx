import { MemberCard } from '@/components/about/member-card'
import { Reveal } from '@/components/ui/reveal'
import { getExecutives } from '@/lib/config/leadership'

export function Leadership() {
  const executives = getExecutives()

  return (
    <section id='leadership' className='bg-paper'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal>
          <h2 className='heading-section text-ink'>The Executive Committee</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            The committee leads the club&rsquo;s work and its members across the
            regions. Executive roles are by appointment, based on the commitment
            members show.
          </p>
        </Reveal>

        {executives.length > 0 ? (
          <ul className='mt-14 md:mt-20 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 sm:gap-x-10 md:gap-y-20'>
            {executives.map((person, i) => (
              <Reveal key={person.id} as='li' index={i % 3}>
                <MemberCard person={person} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className='mt-14 font-body text-base text-muted'>
            Applications for executive roles open with membership.
          </p>
        )}
      </div>
    </section>
  )
}
