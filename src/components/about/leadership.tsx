import { MemberCard } from '@/components/about/member-card'
import { Reveal } from '@/components/ui/reveal'
import { getAdvisers, getExecutives } from '@/lib/data/people'
import type { Person } from '@/lib/config/leadership'

function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <ul className='mt-14 md:mt-20 grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-3 sm:gap-x-10 md:gap-y-20'>
      {people.map((person, i) => (
        <Reveal key={person.id} as='li' index={i % 3}>
          <MemberCard person={person} />
        </Reveal>
      ))}
    </ul>
  )
}

export async function Leadership() {
  const [executives, advisers] = await Promise.all([getExecutives(), getAdvisers()])

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
          <PeopleGrid people={executives} />
        ) : (
          <p className='mt-14 font-body text-base text-muted'>
            Applications for executive roles open with membership.
          </p>
        )}

        {advisers.length > 0 && (
          <div className='mt-24 sm:mt-32'>
            <Reveal>
              <h2 className='heading-section text-ink'>Board of Advisers</h2>
              <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
                Experienced professionals who guide the club&rsquo;s direction and open doors for its members.
              </p>
            </Reveal>
            <PeopleGrid people={advisers} />
          </div>
        )}
      </div>
    </section>
  )
}
