'use client'

import { useState, useTransition } from 'react'
import type { FormEvent, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { institutions } from '@/lib/config/application'
import { applicationStatuses, interviewStepEnabled } from '@/lib/config/application-status'
import { Constants } from '@/lib/supabase/types'
import { cn } from '@/lib/utils/cn'
import { activeFilterCount, filtersToQuery } from '@/lib/validation/admin/application-filters'
import type { ApplicationFilters, FilterKey } from '@/lib/validation/admin/application-filters'

type Props = {
  filters: ApplicationFilters
  cohorts: { current: string; all: string[] }
}

// the same grey field look as the apply and contact forms (ui/field.tsx), at a compact size for a filter row
const control =
  'min-h-11 w-full rounded-sm bg-gray-100/90 border-b border-b-transparent transition-[border-color] duration-300 ease-out motion-reduce:transition-none focus:border-b-ink/20 px-3 font-body text-small text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className='flex min-w-0 flex-col gap-1.5'>
      <label htmlFor={id} className='font-mono text-label uppercase text-muted'>
        {label}
      </label>
      {children}
    </div>
  )
}

function Choice({
  id,
  label,
  value,
  options,
  anyLabel,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: readonly { value: string; label: string }[]
  anyLabel: string
  onChange: (value: string) => void
}) {
  return (
    <Field id={id} label={label}>
      <div className='relative'>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(control, 'appearance-none pr-9')}>
          <option value=''>{anyLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted' aria-hidden />
      </div>
    </Field>
  )
}

const asOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }))

// search plus filters. every change goes into the URL, which the server reads; the export link uses the same URL
export function FilterBar({ filters, cohorts }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState(filters.q ?? '')
  const [open, setOpen] = useState(false)
  const active = activeFilterCount(filters)

  function go(overrides: ApplicationFilters) {
    // any change of filter starts again from page 1
    const qs = filtersToQuery(filters, { ...overrides, page: undefined })
    startTransition(() => router.push(qs ? `/admin/applications?${qs}` : '/admin/applications'))
  }

  const set = (key: FilterKey) => (value: string) => go({ [key]: value || undefined } as ApplicationFilters)

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    go({ q: search.trim() || undefined })
  }

  const statuses = applicationStatuses.filter((s) => interviewStepEnabled || s.value !== 'interview')

  return (
    <div className={cn('flex flex-col gap-4 transition-opacity', pending && 'opacity-60')} aria-busy={pending}>
      <div className='flex gap-3'>
        <form role='search' onSubmit={onSearch} className='relative flex-1'>
          <label htmlFor='search' className='sr-only'>
            Search applications
          </label>
          <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted' aria-hidden />
          <input
            id='search'
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Name, email, reference or student ID'
            className={cn(control, 'pl-10 text-base')}
          />
        </form>
        <button
          type='button'
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls='application-filters'
          className='inline-flex min-h-11 items-center gap-2 rounded-sm border border-rule px-4 text-small text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal lg:hidden'
        >
          <SlidersHorizontal className='size-4' aria-hidden />
          Filters{active > 0 && ` (${active})`}
        </button>
      </div>

      <div
        id='application-filters'
        className={cn('grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid lg:grid-cols-4 xl:grid-cols-8', open ? 'grid' : 'hidden')}
      >
        <Choice id='f-status' label='Status' value={filters.status ?? ''} options={statuses} anyLabel='Any status' onChange={set('status')} />
        <Choice
          id='f-committed'
          label='Committed'
          value={filters.committed ?? ''}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          anyLabel='Either'
          onChange={set('committed')}
        />
        <Choice
          id='f-region'
          label='Region now'
          value={filters.region ?? ''}
          options={asOptions(Constants.public.Enums.region)}
          anyLabel='Any region'
          onChange={set('region')}
        />
        <Choice
          id='f-programme'
          label='Programme'
          value={filters.programme ?? ''}
          options={asOptions(Constants.public.Enums.programme)}
          anyLabel='Any programme'
          onChange={set('programme')}
        />
        <Choice
          id='f-institution'
          label='Institution'
          value={filters.institution ?? ''}
          options={asOptions(institutions)}
          anyLabel='Any institution'
          onChange={set('institution')}
        />
        <Choice
          id='f-cohort'
          label='Cohort'
          value={filters.cohort ?? ''}
          options={[
            ...cohorts.all.filter((c) => c !== cohorts.current).map((c) => ({ value: c, label: c })),
            { value: 'all', label: 'All cohorts' },
          ]}
          anyLabel={cohorts.current ? `${cohorts.current} (current)` : 'Current'}
          onChange={set('cohort')}
        />
        <Field id='f-from' label='From'>
          <input id='f-from' type='date' value={filters.from ?? ''} onChange={(e) => set('from')(e.target.value)} className={control} />
        </Field>
        <Field id='f-to' label='To'>
          <input id='f-to' type='date' value={filters.to ?? ''} onChange={(e) => set('to')(e.target.value)} className={control} />
        </Field>
      </div>

      {(active > 0 || filters.cohort) && (
        <Link
          href='/admin/applications'
          onClick={() => setSearch('')}
          className='self-start rounded-xs text-small text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
        >
          Clear search and filters
        </Link>
      )}
    </div>
  )
}
