'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { TurnstileWidget } from '@/components/ui/turnstile'
import { ProgressBar, ProgressRail } from '@/components/membership/apply/form-progress'
import type { StepMeta } from '@/components/membership/apply/form-progress'
import {
  AcademicStep,
  AnswersStep,
  ConsentFields,
  InterestsStep,
  LocationStep,
  PersonalStep,
  SkillsStep,
} from '@/components/membership/apply/steps'
import { ReviewSummary } from '@/components/membership/apply/review'
import { submitApplication } from '@/lib/actions/submit-application'
import { easeOut, formStep } from '@/lib/config/motion'
import { emptyApplication, stepSchemas } from '@/lib/validation/application'
import type { ApplicationFormValues } from '@/lib/validation/application'

const steps: readonly StepMeta[] = [
  { title: 'About you', description: 'How we will reach you.' },
  { title: 'Your studies', description: 'Academic details are checked with your institution.' },
  {
    title: 'Region and languages',
    description: 'Language sits at the heart of our work: explaining health in the words people use.',
  },
  { title: 'Interests and commitment', description: 'Where you would like to help, and how much time you can give.' },
  { title: 'Skills', description: 'Optional. Anything here helps us plan; leave it empty if none apply.' },
  {
    title: 'Short answers',
    description: 'Four questions in your own words. Your draft is saved on this device as you type.',
  },
  { title: 'Review and submit', description: 'Check your answers, then confirm and submit.' },
]

const DRAFT_KEY = 'hcc-application-draft-v1'

type Draft = { values: ApplicationFormValues; step: number; reached: number }

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (draft) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    else window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // storage can be full or blocked (private mode): the form still works, it just will not remember
  }
}

type Status = 'idle' | 'submitting' | 'closed' | 'duplicate' | 'rate_limited' | 'turnstile' | 'failed'

// the message shown when the server refuses a submission (the answers stay saved on this device)
const statusMessage: Record<Exclude<Status, 'idle' | 'submitting'>, string> = {
  closed: 'Applications have just closed, so this could not be submitted. Your answers are saved on this device.',
  duplicate: 'You have already applied this cohort with this email. If that was not you, write to us.',
  rate_limited: 'That is a few attempts in a short time. Please wait a few minutes and try again.',
  turnstile: 'We could not confirm you are human. Tick the box above, then submit again.',
  failed: 'Something went wrong on our side. Your answers are saved on this device; please try again in a moment.',
}

const lastStep = steps.length - 1
const clampStep = (n: number) => Math.min(Math.max(Number(n) || 0, 0), lastStep)

/*
  rendered in the browser only (see application-form-loader.tsx), so a draft saved on this device
  can seed the form on its very first render
*/
export function ApplicationForm() {
  const router = useRouter()
  const [draft] = useState(readDraft)
  const [token, setToken] = useState<string | null>(null)
  const form = useForm<ApplicationFormValues>({
    defaultValues: draft ? { ...emptyApplication, ...draft.values, website: '' } : emptyApplication,
  })
  const { getValues, setError, clearErrors, setFocus, reset, subscribe } = form
  const [step, setStep] = useState(() => (draft ? clampStep(draft.step) : 0))
  const [reached, setReached] = useState(() => (draft ? clampStep(draft.reached) : 0))
  const [status, setStatus] = useState<Status>('idle')
  const [restored, setRestored] = useState(draft !== null)
  const topRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const reduceMotion = useReducedMotion()

  // save the draft as the applicant types, and whenever the step changes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const save = () => writeDraft({ values: getValues(), step, reached })
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: () => {
        clearTimeout(timer)
        timer = setTimeout(save, 400)
      },
    })
    save()
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [subscribe, getValues, step, reached])

  // on a new step: bring the top of the form into view and move focus to the step heading
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const top = topRef.current
    if (top && top.getBoundingClientRect().top < 0) {
      top.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step, reduceMotion])

  // checks one step; on failure shows every message and focuses the first field with a problem
  function validateStep(i: number) {
    const schema = stepSchemas[i]
    clearErrors(Object.keys(schema.shape) as FieldPath<ApplicationFormValues>[])
    const result = schema.safeParse(getValues())
    if (result.success) return true
    // a field can fail several checks; the first is the most basic ("enter your date of birth"), so it wins
    const seen = new Set<string>()
    for (const issue of result.error.issues) {
      const path = issue.path.join('.')
      if (seen.has(path)) continue
      seen.add(path)
      setError(path as FieldPath<ApplicationFormValues>, { type: 'manual', message: issue.message })
    }
    const first = String(result.error.issues[0].path[0]) as FieldPath<ApplicationFormValues>
    // tiles and the language picker are not single inputs; fall back to the step heading
    try {
      setFocus(first)
    } catch {
      headingRef.current?.focus()
    }
    return false
  }

  function goTo(i: number) {
    setStep(i)
    setStatus('idle')
  }

  function next() {
    if (!validateStep(step)) return
    const n = step + 1
    setReached((r) => Math.max(r, n))
    goTo(n)
  }

  async function submit() {
    // every step again: a restored draft or an edit from the review may have left one incomplete
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        if (i !== step) goTo(i)
        return
      }
    }
    setStatus('submitting')
    try {
      const result = await submitApplication(getValues(), token ?? undefined)
      if (result.ok) {
        writeDraft(null)
        router.push(`/membership/apply/success?ref=${encodeURIComponent(result.reference)}`)
        return
      }
      if (result.reason === 'invalid') {
        const target = stepSchemas.findIndex((s) => result.fields.some((f) => f in s.shape))
        if (target >= 0) {
          goTo(target)
          validateStep(target)
        }
        setStatus('idle')
        return
      }
      setStatus(result.reason === 'error' ? 'failed' : result.reason)
    } catch {
      setStatus('failed')
    }
  }

  function startOver() {
    writeDraft(null)
    reset(emptyApplication)
    setStep(0)
    setReached(0)
    setRestored(false)
    setStatus('idle')
  }

  const stepBody: Record<number, ReactNode> = {
    0: <PersonalStep />,
    1: <AcademicStep />,
    2: <LocationStep />,
    3: <InterestsStep />,
    4: <SkillsStep />,
    5: <AnswersStep />,
    6: (
      <div className='flex flex-col gap-10'>
        <ReviewSummary steps={steps.slice(0, 6)} onEdit={goTo} />
        <div className='border-t border-ink pt-8'>
          <ConsentFields />
        </div>
      </div>
    ),
  }

  const isLast = step === steps.length - 1

  return (
    <FormProvider {...form}>
      <div ref={topRef} className='scroll-mt-6 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-20'>
        <div className='lg:sticky lg:top-10 lg:self-start'>
          <ProgressRail steps={steps} current={step} reached={reached} onGo={goTo} />
          <ProgressBar steps={steps} current={step} />
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (isLast) void submit()
            else next()
          }}
          className='relative min-w-0'
        >
          {restored && step === 0 && (
            <p className='mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm bg-cream/60 px-4 py-3 font-body text-small text-ink/80'>
              We brought back the answers you saved on this device.
              <button
                type='button'
                onClick={startOver}
                className='cursor-pointer font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink'
              >
                Start over
              </button>
            </p>
          )}

          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: formStep.distance }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -formStep.distance }}
              transition={{ duration: formStep.duration, ease: easeOut }}
            >
              <header className='mb-8'>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className='font-body text-h3 font-semibold text-ink outline-none'
                >
                  {steps[step].title}
                </h2>
                <p className='mt-2 font-body text-base text-ink/70'>{steps[step].description}</p>
              </header>
              {stepBody[step]}
            </motion.div>
          </AnimatePresence>

          {isLast && (
            <div className='mt-8'>
              <TurnstileWidget onToken={setToken} />
            </div>
          )}

          {status !== 'idle' && status !== 'submitting' && (
            <p
              role='alert'
              className='mt-8 rounded-sm bg-cream/60 px-4 py-3 font-body text-base text-ink'
            >
              {statusMessage[status]}
            </p>
          )}

          <div className='mt-10 flex items-center justify-between gap-4 border-t border-rule pt-8'>
            {step > 0 ? (
              <button
                type='button'
                onClick={() => goTo(step - 1)}
                className='group inline-flex min-h-11 cursor-pointer items-center gap-2 font-body text-base font-medium text-ink/80 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
              >
                <ArrowLeft className='size-4 transition-transform group-hover:-translate-x-1' aria-hidden />
                Back
              </button>
            ) : (
              <span />
            )}
            <Button type='submit' variant='primary' disabled={status === 'submitting'} className='px-8 py-3.5 text-ink' arrow>
              {isLast ? (status === 'submitting' ? 'Submitting…' : 'Submit application') : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
