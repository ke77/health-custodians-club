import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { NotesField } from '@/components/admin/applications/notes-field'
import { StatusSelect } from '@/components/admin/applications/status-select'
import { CopyButton } from '@/components/admin/copy-button'
import { applicationSections, gradeOf, institutionOf, programmeOf } from '@/lib/admin/application-display'
import { requireAdmin } from '@/lib/auth/admin'
import { getApplication, neighbours } from '@/lib/data/admin/applications'
import { cn } from '@/lib/utils/cn'
import { formatDateTime } from '@/lib/utils/format'
import { filtersToQuery, parseFilters } from '@/lib/validation/admin/application-filters'
import type { SearchParams } from '@/lib/validation/admin/application-filters'

export const metadata: Metadata = { title: 'Application' }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<SearchParams> }

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const navButton =
  'inline-flex size-11 items-center justify-center rounded-full border border-rule text-ink/80 hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

function Fact({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className='flex flex-col gap-1'>
      <dt className='font-mono text-label uppercase text-muted'>{label}</dt>
      <dd className={cn('text-base text-ink', mono && 'font-mono')}>{children}</dd>
    </div>
  )
}

export default async function ApplicationPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!uuid.test(id)) notFound()

  const filters = parseFilters(await searchParams)
  const [application, nav] = await Promise.all([getApplication(id), neighbours(id, filters)])
  if (!application) notFound()

  const a = application
  const qs = filtersToQuery(filters)
  const withFilters = (path: string) => `${path}${qs ? `?${qs}` : ''}`
  const grade = gradeOf(a)

  return (
    <article>
      <div className='flex items-center justify-between gap-4'>
        <Link
          href={withFilters('/admin/applications')}
          className='inline-flex items-center gap-2 rounded-xs text-small text-ink/80 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
        >
          <ArrowLeft className='size-4' aria-hidden />
          Applications
        </Link>
        <nav aria-label='Other applications' className='flex items-center gap-2'>
          {nav.position && (
            <span className='mr-2 font-mono text-label uppercase text-muted'>
              {nav.position} of {nav.total}
            </span>
          )}
          {nav.previous ? (
            <Link href={withFilters(`/admin/applications/${nav.previous}`)} aria-label='Previous application' className={navButton}>
              <ChevronLeft className='size-4' aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className={cn(navButton, 'opacity-30')}>
              <ChevronLeft className='size-4' />
            </span>
          )}
          {nav.next ? (
            <Link href={withFilters(`/admin/applications/${nav.next}`)} aria-label='Next application' className={navButton}>
              <ChevronRight className='size-4' aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className={cn(navButton, 'opacity-30')}>
              <ChevronRight className='size-4' />
            </span>
          )}
        </nav>
      </div>

      <header className='mt-8 border-b border-rule pb-8'>
        <p className='font-mono text-label uppercase text-muted'>
          {a.reference} · Cohort {a.cohort}
        </p>
        <h1 className='mt-3 font-display text-h2 text-ink'>{a.full_name}</h1>
        <p className='mt-2 font-body text-base text-ink/70'>
          {programmeOf(a)}, Level {a.level} · {institutionOf(a)}
        </p>
        <p className='mt-1 text-small text-muted'>Submitted {formatDateTime(a.created_at)}</p>
      </header>

      <div className='mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16'>
        {/* on phones the review panel comes first: it is what the reviewer acts on */}
        <aside className='flex flex-col gap-8 lg:order-last lg:sticky lg:top-10 lg:self-start' aria-label='Review'>
          <div>
            {/* key: a fresh picker when the status changes elsewhere (another admin, prev/next) */}
            <StatusSelect key={`${a.id}-${a.status}`} id={a.id} status={a.status} />
            {a.status_changed_at && (
              <p className='text-small text-muted'>
                Changed {formatDateTime(a.status_changed_at)}
                {a.status_changed_by && ` by ${a.status_changed_by}`}
              </p>
            )}
          </div>

          <dl className='grid grid-cols-2 gap-6 border-y border-rule py-6'>
            <Fact label='Committed'>
              {a.committed ? 'Yes' : <span className='font-medium'>No</span>}
            </Fact>
            <Fact label={grade.scale} mono>
              {grade.value}
            </Fact>
            <div className='col-span-2 flex flex-col gap-1'>
              <dt className='font-mono text-label uppercase text-muted'>Student ID</dt>
              <dd className='flex items-center justify-between gap-2'>
                <span className='font-mono text-base break-all text-ink'>{a.student_id}</span>
                <CopyButton value={a.student_id} label='student ID' className='-mr-3' />
              </dd>
            </div>
            <div className='col-span-2 flex flex-col gap-1'>
              <dt className='font-mono text-label uppercase text-muted'>Email</dt>
              <dd className='flex items-center justify-between gap-2'>
                <a
                  href={`mailto:${a.email}?subject=${encodeURIComponent(`Your HCC application ${a.reference}`)}`}
                  className='text-base break-all text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink'
                >
                  {a.email}
                </a>
                <CopyButton value={a.email} label='email' className='-mr-3' />
              </dd>
            </div>
          </dl>

          <NotesField key={a.id} id={a.id} initial={a.notes ?? ''} />
        </aside>

        <div className='flex flex-col'>
          {applicationSections(a).map((section, i) => (
            <section
              key={section.title}
              aria-labelledby={`section-${i}`}
              className='border-t border-rule py-8 first:border-t-0 first:pt-0'
            >
              <h2 id={`section-${i}`} className='flex items-baseline gap-3 font-body text-base font-semibold text-ink'>
                <span className='font-mono text-label font-normal tabular-nums text-muted'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>
              <dl className='mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-[11rem_minmax(0,1fr)]'>
                {section.rows.map((r) => (
                  <div key={r.label} className='contents'>
                    <dt className='font-mono text-label uppercase text-muted sm:pt-1'>{r.label}</dt>
                    <dd
                      className={cn(
                        r.long
                          ? 'max-w-[var(--container-prose)] whitespace-pre-line font-body text-base leading-[1.7] text-ink/80'
                          : 'font-body text-base text-ink',
                        r.mono && 'font-mono',
                      )}
                    >
                      {r.value.trim() ? r.value : '—'}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
