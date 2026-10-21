'use client'

import { useWatch } from 'react-hook-form'
import { genders, gradeScaleOf, hoursOptions, leadershipOptions, proficiencies } from '@/lib/config/application'
import type { ApplicationFormValues } from '@/lib/validation/application'
import type { StepMeta } from '@/components/membership/apply/form-progress'

type Row = { label: string; value: string; long?: boolean }

const labelOf = (list: readonly { value: string; label: string }[], value: string) =>
  list.find((o) => o.value === value)?.label ?? ''

const orDash = (v: string) => (v.trim() ? v : '—')

function sections(v: ApplicationFormValues): Row[][] {
  return [
    [
      { label: 'Full name', value: v.fullName },
      { label: 'Email', value: v.email },
      { label: 'Phone', value: v.phone },
      { label: 'WhatsApp', value: v.whatsappSame ? 'Same as phone' : v.whatsapp },
      { label: 'Date of birth', value: v.dateOfBirth },
      { label: 'Gender', value: labelOf(genders, v.gender) },
    ],
    [
      { label: 'Institution', value: v.institution === 'Other' ? v.institutionOther : v.institution },
      { label: 'Programme', value: v.programme === 'Other health-related' ? v.programmeOther : v.programme },
      { label: 'Level', value: v.level ? `Level ${v.level}` : '' },
      { label: 'Student ID', value: v.studentId },
      { label: gradeScaleOf(v.grade) === 'cwa' ? 'CWA' : 'CGPA', value: v.grade },
    ],
    [
      { label: 'Home region', value: v.homeRegion },
      { label: 'Current region', value: v.currentRegion },
      {
        label: 'Languages',
        value: v.languages
          .map((l) => `${l.language === 'Other' ? v.languageOther || 'Other' : l.language} (${labelOf(proficiencies, l.level).toLowerCase() || 'level not set'})`)
          .join(', '),
      },
    ],
    [
      { label: 'Areas', value: v.interests.join(', ') },
      { label: 'Committed', value: v.committed === 'yes' ? 'Yes' : v.committed === 'no' ? 'No' : '' },
      { label: 'Time', value: labelOf(hoursOptions, v.hoursPerMonth) },
      { label: 'Leadership', value: labelOf(leadershipOptions, v.leadership) },
    ],
    [{ label: 'Skills', value: v.skills.length ? v.skills.join(', ') : 'None chosen' }],
    [
      { label: 'Why HCC', value: v.answerMotivation, long: true },
      { label: 'A health gap', value: v.answerHealthGap, long: true },
      { label: 'Skills and experience', value: v.answerSkills, long: true },
      { label: 'Balancing commitments', value: v.answerBalance, long: true },
    ],
  ]
}

type Props = {
  steps: readonly StepMeta[]
  onEdit: (step: number) => void
}

// every answer, grouped by step, with a way back to change it
export function ReviewSummary({ steps, onEdit }: Props) {
  const values = useWatch<ApplicationFormValues>() as ApplicationFormValues

  return (
    <div className='flex flex-col'>
      {sections(values).map((rows, i) => (
        <section key={steps[i].title} aria-labelledby={`review-${i}`} className='border-t border-rule py-6 first:border-t-0 first:pt-0'>
          <div className='flex items-baseline justify-between gap-4'>
            <h3 id={`review-${i}`} className='flex items-baseline gap-3 font-body text-base font-semibold text-ink'>
              <span className='font-mono text-label font-normal tabular-nums text-muted'>{String(i + 1).padStart(2, '0')}</span>
              {steps[i].title}
            </h3>
            <button
              type='button'
              onClick={() => onEdit(i)}
              className='cursor-pointer font-body text-small font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
            >
              Edit<span className='sr-only'> {steps[i].title}</span>
            </button>
          </div>
          <dl className='mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)]'>
            {rows.map((r) => (
              <div key={r.label} className='contents'>
                <dt className='font-mono text-label uppercase text-muted sm:pt-0.5'>{r.label}</dt>
                <dd className={r.long ? 'whitespace-pre-line font-body text-small text-ink/80 leading-[1.7]' : 'font-body text-base text-ink'}>
                  {orDash(r.value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
