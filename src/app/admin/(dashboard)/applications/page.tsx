import type { Metadata } from 'next'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { FilterBar } from '@/components/admin/applications/filter-bar'
import { PageHeader } from '@/components/admin/page-header'
import { StatusLabel } from '@/components/admin/status-label'
import { Button } from '@/components/ui/buttons'
import { institutionOf, programmeOf } from '@/lib/admin/application-display'
import { requireAdmin } from '@/lib/auth/admin'
import { listApplications, listCohorts, pageSize } from '@/lib/data/admin/applications'
import type { ApplicationListItem } from '@/lib/data/admin/applications'
import { formatDate } from '@/lib/utils/format'
import { activeFilterCount, filtersToQuery, parseFilters } from '@/lib/validation/admin/application-filters'
import type { ApplicationFilters, SearchParams } from '@/lib/validation/admin/application-filters'

export const metadata: Metadata = { title: 'Applications' }

const linkStyle =
  'rounded-xs text-small text-ink/80 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

function detailHref(id: string, filters: ApplicationFilters) {
  const qs = filtersToQuery(filters)
  return `/admin/applications/${id}${qs ? `?${qs}` : ''}`
}

function Committed({ value }: { value: boolean }) {
  return value ? <span>Yes</span> : <span className='font-medium text-ink'>No</span>
}

function Table({ rows, filters }: { rows: ApplicationListItem[]; filters: ApplicationFilters }) {
  const th = 'py-3 pr-4 text-left font-mono text-label font-normal uppercase text-muted'
  return (
    <table className='hidden w-full border-collapse lg:table'>
      <thead className='border-b border-rule'>
        <tr>
          <th scope='col' className={th}>Applicant</th>
          <th scope='col' className={th}>Programme and institution</th>
          <th scope='col' className={th}>Level</th>
          <th scope='col' className={th}>Region now</th>
          <th scope='col' className={th}>Committed</th>
          <th scope='col' className={th}>Status</th>
          <th scope='col' className={`${th} pr-0 text-right`}>Submitted</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-rule'>
        {rows.map((a) => (
          // the whole row is clickable through the name link stretched over it
          <tr key={a.id} className='relative align-top transition-colors hover:bg-ink/5'>
            <td className='py-4 pr-4'>
              <Link
                href={detailHref(a.id, filters)}
                className='font-body text-base font-medium text-ink after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-teal'
              >
                {a.full_name}
              </Link>
              <p className='mt-0.5 font-mono text-label text-muted'>{a.reference}</p>
            </td>
            <td className='max-w-72 py-4 pr-4 text-small text-ink/80'>
              <p>{programmeOf(a)}</p>
              <p className='text-muted'>{institutionOf(a)}</p>
            </td>
            <td className='py-4 pr-4 text-small text-ink/80 tabular-nums'>{a.level}</td>
            <td className='py-4 pr-4 text-small text-ink/80'>{a.current_region}</td>
            <td className='py-4 pr-4 text-small text-ink/80'>
              <Committed value={a.committed} />
            </td>
            <td className='py-4 pr-4'>
              <StatusLabel status={a.status} />
            </td>
            <td className='py-4 text-right text-small text-ink/80 tabular-nums whitespace-nowrap'>{formatDate(a.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// below lg, one stacked entry per applicant instead of a table
function List({ rows, filters }: { rows: ApplicationListItem[]; filters: ApplicationFilters }) {
  return (
    <ul className='divide-y divide-rule border-t border-rule lg:hidden'>
      {rows.map((a) => (
        <li key={a.id}>
          <Link
            href={detailHref(a.id, filters)}
            className='flex flex-col gap-2 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
          >
            <div className='flex items-start justify-between gap-4'>
              <span className='font-body text-base font-medium text-ink'>{a.full_name}</span>
              <StatusLabel status={a.status} className='pt-1' />
            </div>
            <span className='text-small text-ink/80'>
              {programmeOf(a)}, Level {a.level}
            </span>
            <span className='text-small text-muted'>
              {institutionOf(a)} · {a.current_region}
            </span>
            <span className='font-mono text-label text-muted'>
              {a.reference} · {formatDate(a.created_at)} · Committed: {a.committed ? 'yes' : 'no'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin()
  const filters = parseFilters(await searchParams)
  const [{ rows, total, page, cohort }, cohorts] = await Promise.all([listApplications(filters), listCohorts()])

  const pages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  const qs = filtersToQuery(filters)
  const filtered = activeFilterCount(filters) > 0

  return (
    <>
      <PageHeader
        title='Applications'
        description={
          cohort ? (
            <>
              Cohort {cohort}. Open an application to read every answer, change its status and leave notes for other
              reviewers.
            </>
          ) : (
            <>Every cohort. Open an application to read every answer, change its status and leave notes.</>
          )
        }
        actions={
          total > 0 && (
            <Button variant='primary' href={`/admin/applications/export${qs ? `?${qs}` : ''}`} download className='px-5'>
              <Download className='size-4' aria-hidden />
              Export CSV{filtered ? ' (filtered)' : ''}
            </Button>
          )
        }
      />

      <div className='mt-8'>
        <FilterBar key={qs} filters={filters} cohorts={cohorts} />
      </div>

      <p className='mt-8 mb-3 font-mono text-label uppercase text-muted' aria-live='polite'>
        {total === 0 ? 'No applications' : `${first}–${last} of ${total}`}
      </p>

      {total === 0 ? (
        <div className='border-t border-rule py-16'>
          <p className='font-body text-base text-ink/70'>
            {filtered || filters.q
              ? 'Nothing matches this search. Try fewer filters.'
              : 'No applications yet. They appear here as soon as someone applies.'}
          </p>
        </div>
      ) : (
        <>
          <Table rows={rows} filters={filters} />
          <List rows={rows} filters={filters} />
        </>
      )}

      {pages > 1 && (
        <nav aria-label='Pages' className='mt-8 flex items-center justify-between border-t border-rule pt-6'>
          {page > 1 ? (
            <Link href={`/admin/applications?${filtersToQuery(filters, { page: page - 1 })}`} className={linkStyle}>
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className='font-mono text-label uppercase text-muted'>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={`/admin/applications?${filtersToQuery(filters, { page: page + 1 })}`} className={linkStyle}>
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  )
}
