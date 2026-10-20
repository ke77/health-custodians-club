'use client'

import { useId, useMemo, useState } from 'react'
import type { KeyboardEvent, Ref } from 'react'
import { ChevronDown } from 'lucide-react'
import { FieldShell, describedBy, errorRing, fieldBase } from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Props = {
  id: string
  label: string
  hint?: string
  error?: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  // an option that always shows, whatever is typed (e.g. 'Other')
  pinned?: string
  ref?: Ref<HTMLInputElement>
}

// a searchable select: type to filter, arrows to move, enter to choose, escape to close. only listed options can be chosen
export function Combobox({
  id,
  label,
  hint,
  error,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  pinned,
  ref,
}: Props) {
  const listId = useId()
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  // keep the text in step when the value changes from outside (a restored draft)
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setQuery(value)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = options.filter((o) => o !== pinned && (q === '' || q === value.toLowerCase() || o.toLowerCase().includes(q)))
    return pinned ? [...matches, pinned] : matches
  }, [options, pinned, query, value])

  function choose(option: string) {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && open && filtered[active]) {
      e.preventDefault()
      choose(filtered[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(value)
    }
  }

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className='relative'>
        <input
          ref={ref}
          id={id}
          type='text'
          role='combobox'
          autoComplete='off'
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete='list'
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          aria-describedby={describedBy(id, hint, error)}
          aria-invalid={error ? true : undefined}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => {
            setOpen(false)
            // free text is not a choice: snap back to the chosen option, or take an exact match
            const exact = options.find((o) => o.toLowerCase() === query.trim().toLowerCase())
            if (exact && exact !== value) onChange(exact)
            else setQuery(exact ?? value)
            onBlur?.()
          }}
          onKeyDown={onKeyDown}
          className={cn(fieldBase, 'w-full pr-10', errorRing(error))}
        />
        <ChevronDown
          aria-hidden
          className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted'
        />
        {open && (
          <ul
            id={listId}
            role='listbox'
            aria-label={label}
            className='absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-sm border border-rule bg-paper py-1 shadow-float'
          >
            {filtered.length === 0 ? (
              <li className='px-4 py-3 font-body text-small text-muted'>No match. Choose Other below.</li>
            ) : (
              filtered.map((option, i) => (
                <li
                  key={option}
                  id={`${listId}-${i}`}
                  role='option'
                  aria-selected={option === value}
                  // mousedown keeps focus in the input so blur does not close the list first
                  onMouseDown={(e) => {
                    e.preventDefault()
                    choose(option)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'cursor-pointer px-4 py-2.5 font-body text-base text-ink',
                    i === active && 'bg-sand',
                    option === value && 'font-semibold',
                  )}
                >
                  {option}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </FieldShell>
  )
}
