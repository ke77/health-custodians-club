'use client'

import { Controller, get, useFormContext, useFormState, useWatch } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox } from '@/components/ui/combobox'
import { ChoiceTiles, LanguagePicker, WordCountField } from '@/components/membership/apply/controls'
import {
  genders,
  heardAboutOptions,
  hoursOptions,
  institutions,
  interestAreas,
  languages,
  leadershipOptions,
  levels,
  gradeScaleOf,
  minimumCgpa,
  proficiencies,
  programmes,
  regionNames,
  skillOptions,
} from '@/lib/config/application'
import { countWords } from '@/lib/validation/application'
import type { ApplicationFormValues } from '@/lib/validation/application'

type Name = FieldPath<ApplicationFormValues>

const asOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }))

// register a field so typing clears its error, and read its message.
// errors come from useFormState: it subscribes to error changes, which formState read through context
// does not do reliably once the React Compiler memoises the component
function useField() {
  const { register, clearErrors } = useFormContext<ApplicationFormValues>()
  const { errors } = useFormState<ApplicationFormValues>()
  return {
    errors,
    reg: (name: Name) => register(name, { onChange: () => clearErrors(name) }),
    err: (name: string) => get(errors, name)?.message as string | undefined,
  }
}

const grid = 'grid gap-x-6 gap-y-4 sm:grid-cols-2'

export function PersonalStep() {
  const { reg, err } = useField()
  const whatsappSame = useWatch<ApplicationFormValues, 'whatsappSame'>({ name: 'whatsappSame' })

  return (
    <div className='flex flex-col gap-4'>
      <Input id='fullName' label='Full name' autoComplete='name' error={err('fullName')} {...reg('fullName')} />
      <div className={grid}>
        <Input id='email' type='email' label='Email' autoComplete='email' inputMode='email' error={err('email')} {...reg('email')} />
        <Input
          id='phone'
          type='tel'
          label='Phone number'
          hint='A Ghanaian number, for example 024 123 4567.'
          autoComplete='tel'
          inputMode='tel'
          error={err('phone')}
          {...reg('phone')}
        />
      </div>
      <div className='-mt-2 mb-2'>
        <Checkbox id='whatsappSame' label='My WhatsApp number is the same' {...reg('whatsappSame')} />
      </div>
      {!whatsappSame && (
        <Input id='whatsapp' type='tel' label='WhatsApp number' inputMode='tel' error={err('whatsapp')} {...reg('whatsapp')} />
      )}
      <div className={grid}>
        <Input id='dateOfBirth' type='date' label='Date of birth' autoComplete='bday' error={err('dateOfBirth')} {...reg('dateOfBirth')} />
        <Select
          id='gender'
          label='Gender (optional)'
          placeholder='Choose one'
          options={[...genders]}
          error={err('gender')}
          {...reg('gender')}
        />
      </div>
    </div>
  )
}

export function AcademicStep() {
  const { reg, err } = useField()
  const { control, clearErrors } = useFormContext<ApplicationFormValues>()
  const [institution, programme] = useWatch<ApplicationFormValues, ['institution', 'programme']>({
    name: ['institution', 'programme'],
  })

  return (
    <div className='flex flex-col gap-4'>
      <Controller
        control={control}
        name='institution'
        render={({ field }) => (
          <Combobox
            id='institution'
            label='Institution'
            hint='Start typing to search. Choose Other if yours is not listed.'
            placeholder='Search institutions'
            options={institutions}
            pinned='Other'
            value={field.value}
            onChange={(v) => {
              field.onChange(v)
              clearErrors('institution')
            }}
            onBlur={field.onBlur}
            ref={field.ref}
            error={err('institution')}
          />
        )}
      />
      {institution === 'Other' && (
        <Input id='institutionOther' label='Name of your institution' error={err('institutionOther')} {...reg('institutionOther')} />
      )}

      <div className={grid}>
        <Select
          id='programme'
          label='Programme'
          placeholder='Choose your programme'
          options={asOptions(programmes)}
          error={err('programme')}
          {...reg('programme')}
        />
        <Select
          id='level'
          label='Level'
          placeholder='Choose your level'
          options={levels.map((l) => ({ value: l, label: `Level ${l}` }))}
          error={err('level')}
          {...reg('level')}
        />
      </div>
      {programme === 'Other health-related' && (
        <Input id='programmeOther' label='Name of your programme' error={err('programmeOther')} {...reg('programmeOther')} />
      )}

      <Input id='studentId' label='Student ID number' autoComplete='off' error={err('studentId')} {...reg('studentId')} />
      <Input
        id='grade'
        label='CGPA / CWA'
        hint={`Whichever your institution uses: a CGPA out of 4.00 (minimum ${minimumCgpa.toFixed(2)}), or a CWA out of 100.`}
        inputMode='decimal'
        error={err('grade')}
        {...reg('grade')}
      />
      {/* confirms which scale we read the number as, so a typo is easy to spot */}
      <GradeScaleNote />
    </div>
  )
}

function GradeScaleNote() {
  const grade = useWatch<ApplicationFormValues, 'grade'>({ name: 'grade' })
  const scale = gradeScaleOf(grade)
  if (!scale) return null
  return (
    <p className='-mt-3 font-mono text-label uppercase text-muted'>
      Read as {scale === 'cgpa' ? 'a CGPA, out of 4.00' : 'a CWA, out of 100'}
    </p>
  )
}

export function LocationStep() {
  const { reg, err, errors } = useField()
  const { control, clearErrors } = useFormContext<ApplicationFormValues>()
  const chosen = useWatch<ApplicationFormValues, 'languages'>({ name: 'languages' })
  const regionOptions = asOptions(regionNames)

  // errors on a ticked language with no level come back as languages.<index>.level
  const levelErrors = Object.fromEntries(
    chosen.map((l, i) => [l.language, get(errors, `languages.${i}.level`)?.message as string | undefined]),
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className={grid}>
        <Select id='homeRegion' label='Home region' placeholder='Choose a region' options={regionOptions} error={err('homeRegion')} {...reg('homeRegion')} />
        <Select
          id='currentRegion'
          label='Region you are in now'
          placeholder='Choose a region'
          options={regionOptions}
          error={err('currentRegion')}
          {...reg('currentRegion')}
        />
      </div>
      <Controller
        control={control}
        name='languages'
        render={({ field }) => (
          <LanguagePicker
            languages={languages}
            levels={proficiencies}
            value={field.value}
            onChange={(v) => {
              field.onChange(v)
              clearErrors('languages')
            }}
            error={err('languages')}
            levelErrors={levelErrors}
          />
        )}
      />
      {chosen.some((l) => l.language === 'Other') && (
        <Input id='languageOther' label='Other language' error={err('languageOther')} {...reg('languageOther')} />
      )}
    </div>
  )
}

export function InterestsStep() {
  const { reg, err } = useField()

  return (
    <div className='flex flex-col gap-4'>
      <ChoiceTiles
        name='interests'
        type='checkbox'
        legend='Areas you would like to work in'
        hint='Choose as many as you like.'
        options={asOptions(interestAreas)}
        columns={3}
        register={reg('interests')}
        error={err('interests')}
      />
      <ChoiceTiles
        name='committed'
        type='radio'
        legend='Will you be committed to club activities?'
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        register={reg('committed')}
        error={err('committed')}
      />
      <Select
        id='hoursPerMonth'
        label='Time you can give'
        placeholder='Choose one'
        options={[...hoursOptions]}
        error={err('hoursPerMonth')}
        {...reg('hoursPerMonth')}
      />
      <ChoiceTiles
        name='leadership'
        type='radio'
        legend='Interested in a leadership role? (optional)'
        hint='Executive and regional roles are by appointment, based on commitment.'
        options={leadershipOptions}
        columns={1}
        register={reg('leadership')}
        error={err('leadership')}
      />
    </div>
  )
}

export function SkillsStep() {
  const { reg, err } = useField()

  return (
    <ChoiceTiles
      name='skills'
      type='checkbox'
      legend='Skills you can offer (optional)'
      hint='Leave this empty if none apply.'
      options={asOptions(skillOptions)}
      register={reg('skills')}
      error={err('skills')}
    />
  )
}

const questions = [
  { name: 'answerMotivation', label: 'Why do you want to join HCC?', min: 150, max: 200 },
  {
    name: 'answerHealthGap',
    label: 'Describe a health gap you have seen in your community. What would you do about it?',
    min: 150,
    max: 200,
  },
  { name: 'answerSkills', label: 'What skills or experience do you bring?', min: 150, max: 200 },
  {
    name: 'answerBalance',
    label: 'How would you balance club activities with your academic or personal responsibilities?',
    min: 70,
    max: 100,
  },
] as const

export function AnswersStep() {
  const { reg, err } = useField()
  const values = useWatch<ApplicationFormValues, ['answerMotivation', 'answerHealthGap', 'answerSkills', 'answerBalance']>({
    name: ['answerMotivation', 'answerHealthGap', 'answerSkills', 'answerBalance'],
  })

  return (
    <div className='flex flex-col gap-6'>
      {questions.map((q, i) => (
        <WordCountField
          key={q.name}
          id={q.name}
          label={q.label}
          min={q.min}
          max={q.max}
          words={countWords(values[i] ?? '')}
          error={err(q.name)}
          register={reg(q.name)}
        />
      ))}
    </div>
  )
}

export function ConsentFields() {
  const { reg, err } = useField()
  const heardAbout = useWatch<ApplicationFormValues, 'heardAbout'>({ name: 'heardAbout' })

  return (
    <div className='flex flex-col gap-4'>
      <Select
        id='heardAbout'
        label='How did you hear about us?'
        placeholder='Choose one'
        options={asOptions(heardAboutOptions)}
        error={err('heardAbout')}
        {...reg('heardAbout')}
      />
      {heardAbout === 'Other' && (
        <Input id='heardAboutOther' label='Where did you hear about us?' error={err('heardAboutOther')} {...reg('heardAboutOther')} />
      )}

      <div className='mt-2 flex flex-col gap-1'>
        <Checkbox
          id='consent'
          label="I agree that Health Custodians Club may use the information in this application for membership administration only, in line with Ghana's Data Protection Act, 2012 (Act 843)."
          aria-describedby='consent-error'
          aria-invalid={err('consent') ? true : undefined}
          {...reg('consent')}
        />
        <p id='consent-error' aria-live='polite' className='min-h-5 pl-8 text-small text-error'>
          {err('consent')}
        </p>
        <Checkbox
          id='truthful'
          label='I confirm that the information I have given is true and complete.'
          aria-describedby='truthful-error'
          aria-invalid={err('truthful') ? true : undefined}
          {...reg('truthful')}
        />
        <p id='truthful-error' aria-live='polite' className='min-h-5 pl-8 text-small text-error'>
          {err('truthful')}
        </p>
      </div>

      {/* honeypot: off-screen and skipped by keyboards and screen readers; people never fill it */}
      <div aria-hidden className='absolute -left-[10000px] size-px overflow-hidden'>
        <label htmlFor='website'>Website</label>
        <input id='website' tabIndex={-1} autoComplete='off' {...reg('website')} />
      </div>
    </div>
  )
}
