import type { ComponentType } from 'react'
import {
  Megaphone,
  Compass,
  Languages,
  Microscope,
  Stethoscope,
  GraduationCap,
} from 'lucide-react'

type Skill = {
  title: string
  description: string
  Icon: ComponentType<{ className?: string }>
}

const skills: Skill[] = [
  {
    title: 'Communication',
    Icon: Megaphone,
    description:
      'Explaining diagnoses, risks and prevention in language people actually use.',
  },
  {
    title: 'Leadership',
    Icon: Compass,
    description:
      'Running teams, chairing meetings and taking responsibility well.',
  },
  {
    title: 'Local languages',
    Icon: Languages,
    description:
      'Serving patients in Twi, Ga, Ewe, Dagbani and the languages they speak.',
  },
  {
    title: 'Research methods',
    Icon: Microscope,
    description:
      'Framing a question, gathering evidence, drawing honest conclusions.',
  },
  {
    title: 'Disease studies',
    Icon: Stethoscope,
    description:
      'Deeper reading on the conditions members meet in community work.',
  },
  {
    title: 'Mentorship',
    Icon: GraduationCap,
    description:
      'Guidance from senior members and visiting health professionals.',
  },
]

export function BeyondTheCurriculum() {
  return (
    <section id='beyond-the-curriculum' className='bg-cream/20'>
      <div className='container-site py-24 sm:py-32'>
        <h2 className='w-[95%] max-w-full text-wrap md:max-w-[24ch] font-bold font-sans text-h1 text-ink tracking-[.03em] leading-9 md:leading-14'>
          A health degree teaches the science. HCC teaches the rest.
        </h2>
        <p className='mt-6 max-w-[var(--container-prose)] font-body text-base text-ink/70'>
          It rarely teaches you how to explain a diagnosis in Twi, lead a team,
          or design a small study. That is where we come in.
        </p>

        <ul className='mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
          {skills.map(({ title, Icon, description }) => (
            <li key={title} className='flex gap-4'>
              <span className='flex size-10 shrink-0 items-center justify-center rounded-md bg-ink text-paper'>
                <Icon className='size-5' aria-hidden />
              </span>
              <div className='flex flex-col gap-2'>
                <h3 className='font-body text-base font-semibold text-ink'>
                  {title}
                </h3>
                <p className='font-body text-base text-ink/70'>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
