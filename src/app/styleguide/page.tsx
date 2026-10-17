import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { SectionHeader } from '@/components/ui/section-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio'
import { StepIndicator } from '@/components/ui/step-indicator'
import { Accordion } from '@/components/ui/accordion'
import { WordCounterField } from '@/components/ui/word-counter'
import { PersonEntry } from '@/components/about/person-entry'
import { JourneyLadder } from '@/components/membership/journey-ladder'

export const metadata = {
  title: 'Styleguide — HCC',
  robots: { index: false, follow: false },
}

const colours = [
  { name: 'paper', value: '#FFFFFF', cls: 'bg-paper border border-rule' },
  { name: 'ink', value: '#17191A', cls: 'bg-ink' },
  { name: 'muted', value: '#5B5E5C', cls: 'bg-muted' },
  { name: 'teal', value: '#1F5A57', cls: 'bg-teal' },
  { name: 'sand', value: '#F3EFE6', cls: 'bg-sand border border-rule' },
  { name: 'rule', value: 'ink 12%', cls: 'bg-rule border border-rule' },
]

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className='flex flex-col gap-6 border-t border-rule py-12'>
      <p className='font-mono text-label uppercase text-teal'>{title}</p>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className='mx-auto w-full max-w-[var(--container-wide)] px-4 py-16 sm:px-8'>
      <header className='flex flex-col gap-3 pb-6'>
        <p className='font-mono text-label uppercase text-muted'>
          Health Custodians Club
        </p>
        <h1 className='font-display text-display text-ink'>Styleguide</h1>
        <p className='max-w-[var(--container-prose)] font-body text-body text-muted'>
          Tokens and components from docs/03. Colours, fonts and spacing all come
          from tokens in globals.css. Type-scale values are provisional pending
          the section references.
        </p>
      </header>

      <Block title='Colour'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6'>
          {colours.map((c) => (
            <div key={c.name} className='flex flex-col gap-2'>
              <div className={`h-20 w-full rounded-sm ${c.cls}`} />
              <div className='flex flex-col'>
                <span className='font-mono text-label uppercase text-ink'>
                  {c.name}
                </span>
                <span className='font-mono text-label text-muted'>{c.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title='Type scale'>
        <div className='flex flex-col gap-4'>
          <p className='font-display text-display text-ink'>Display Newsreader</p>
          <p className='font-display text-h1 text-ink'>Heading 1 Newsreader</p>
          <p className='font-display text-h2 text-ink'>Heading 2 Newsreader</p>
          <p className='font-display text-h3 text-ink'>Heading 3 Newsreader</p>
          <p className='max-w-[var(--container-prose)] font-body text-body text-ink'>
            Body Public Sans. Most health problems are not sudden. They begin as
            small habits no one explained. This measure is held near sixty-eight
            characters for comfortable reading.
          </p>
          <p className='font-body text-small text-muted'>
            Small Public Sans — captions and secondary text.
          </p>
          <p className='font-mono text-label uppercase text-muted'>
            Label IBM Plex Mono — § 02 / Mission
          </p>
        </div>
      </Block>

      <Block title='Spacing'>
        <div className='flex flex-col gap-2'>
          {spacing.map((s) => (
            <div key={s} className='flex items-center gap-4'>
              <span className='w-10 font-mono text-label text-muted tabular-nums'>
                {s}
              </span>
              <span
                className='h-4 bg-teal'
                style={{ width: `${s}px` }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </Block>

      <Block title='Buttons (rounded-md)'>
        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='primary' arrow>
            Apply to join
          </Button>
          <Button variant='secondary'>What we do</Button>
          <Button variant='primary' disabled>
            Disabled
          </Button>
        </div>
        <div className='flex flex-wrap items-center gap-4 rounded-sm bg-ink p-6'>
          <Button variant='primary' arrow>
            What we do
          </Button>
          <Button variant='secondaryLight'>Apply to join</Button>
        </div>
      </Block>

      <Block title='Links'>
        <p className='font-body text-body text-ink'>
          Read more <TextLink href='#'>on the Programs page</TextLink>, or{' '}
          <TextLink href='#'>get in touch</TextLink>.
        </p>
      </Block>

      <Block title='Section header'>
        <SectionHeader label='§ 02 / Mission' title='What we work towards' />
      </Block>

      <Block title='Form controls'>
        <div className='grid gap-6 md:max-w-[var(--container-prose)]'>
          <Input id='sg-name' label='Full name' placeholder='Ama Mensah' />
          <Input
            id='sg-cgpa'
            label='Current CGPA'
            hint='Minimum 2.80 on a 4.00 scale.'
            defaultValue='1.9'
            error='CGPA must be at least 2.80.'
          />
          <Select
            id='sg-level'
            label='Level'
            placeholder='Select your level'
            options={[
              { value: '200', label: 'Level 200' },
              { value: '300', label: 'Level 300' },
              { value: '400', label: 'Level 400' },
            ]}
          />
          <Textarea
            id='sg-msg'
            label='Message'
            placeholder='How can we help?'
          />
          <RadioGroup
            name='sg-gender'
            legend='Gender (optional)'
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'na', label: 'Prefer not to say' },
            ]}
          />
          <Checkbox
            id='sg-consent'
            label='I consent to my data being used for membership administration.'
          />
        </div>
      </Block>

      <Block title='Word counter'>
        <div className='md:max-w-[var(--container-prose)]'>
          <WordCounterField
            label='Why do you want to join HCC?'
            hint='150 to 200 words.'
          />
        </div>
      </Block>

      <Block title='Form step indicator'>
        <StepIndicator
          steps={[
            'Personal',
            'Academic',
            'Location',
            'Interests',
            'Skills',
            'Answers',
            'Review',
          ]}
          current={2}
        />
      </Block>

      <Block title='Accordion'>
        <div className='md:max-w-[var(--container-prose)]'>
          <Accordion
            items={[
              {
                question: 'Who can apply?',
                answer:
                  'Tertiary students in the health sciences at Level 200 and above, with a minimum CGPA of 2.80.',
              },
              {
                question: 'What is the time commitment?',
                answer:
                  'Training runs in virtual sessions on Saturdays, with light assignments between sessions.',
              },
              {
                question: 'What happens after I apply?',
                answer:
                  'We review applications and contact you by email. Keep your reference number to hand.',
              },
            ]}
          />
        </div>
      </Block>

      <Block title='Person entry'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          <PersonEntry name='Name to come' role='President' />
          <PersonEntry name='Name to come' role='General Secretary' />
        </div>
      </Block>

      <Block title='Journey ladder'>
        <JourneyLadder
          steps={[
            'Apply',
            'Review',
            'Admission',
            'Two-year cohort',
            'Certificate',
            'Alumni',
          ]}
        />
      </Block>

      <Block title='Dark band'>
        <div className='rounded-sm bg-ink p-8'>
          <p className='font-mono text-label uppercase text-paper/70'>
            § Closing
          </p>
          <p className='mt-3 font-display text-h2 text-paper'>
            Ready to become a custodian?
          </p>
          <p className='mt-2 max-w-[var(--container-prose)] font-body text-body text-paper/80'>
            On dark bands, text is paper, never muted (muted on ink fails
            contrast).
          </p>
          <div className='mt-6'>
            <Button variant='primary' arrow>
              Apply to join
            </Button>
          </div>
        </div>
      </Block>
    </main>
  )
}
