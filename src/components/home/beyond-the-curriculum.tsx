import type { ComponentType } from 'react'
import {
  Megaphone,
  Compass,
  Languages,
  Microscope,
  Stethoscope,
  GraduationCap,
} from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

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
        <Reveal>
          <h2 className='heading-section text-ink'>
            Beyond the curriculum
          </h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            A health degree teaches the science, but rarely teaches you how to lead a team, design a small study, or explain a diagnosis in Twi. That is where we come in.
          </p>
        </Reveal>

        <ul className='mt-14 md:mt-20 grid grid-cols-1 gap-x-18 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
          {skills.map(({ title, Icon, description }, i) => (
            // stagger by column so each row of three settles left to right
            <Reveal key={title} as='li' index={i % 3} className='flex gap-4'>
              {/* <span className='flex size-10 shrink-0 items-center justify-center rounded-md bg-ink text-paper'>
                <Icon className='size-5' aria-hidden />
              </span> */}
              <div className='flex flex-col gap-2'>
                <h3 className='font-body text-md md:text-lg font-semibold text-ink'>
                  {title}
                </h3>
                <p className='font-body text-base md:text-md text-ink/70 leading-[1.6em]'>{description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
