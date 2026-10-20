import type { UseFormRegisterReturn } from 'react-hook-form'
import { Check } from 'lucide-react'
import { FieldShell, describedBy, errorRing, fieldBase } from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Option = { value: string; label: string }

type TilesProps = {
  name: string
  legend: string
  hint?: string
  error?: string
  options: readonly Option[]
  type: 'checkbox' | 'radio'
  register: UseFormRegisterReturn
  columns?: 1 | 2 | 3
}

/*
  a set of choices as sand tiles. the input is visually hidden; the tile turns ink when chosen,
  styled from the input's own state (has-checked), so it works with register and needs no client state.
*/
export function ChoiceTiles({ name, legend, hint, error, options, type, register, columns = 2 }: TilesProps) {
  return (
    <fieldset
      aria-describedby={describedBy(name, hint, error)}
      aria-invalid={error ? true : undefined}
      className='flex flex-col gap-2'
    >
      <legend className='font-mono text-label uppercase text-ink'>{legend}</legend>
      {hint && (
        <p id={`${name}-hint`} className='text-small text-muted'>
          {hint}
        </p>
      )}
      <div
        className={cn(
          'mt-1 grid gap-2',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-3',
        )}
      >
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              'group flex min-h-12 cursor-pointer items-center gap-3 rounded-sm bg-sand px-4 py-3 font-body text-base text-ink transition-colors',
              'has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal',
              errorRing(error),
            )}
          >
            <input type={type} value={o.value} className='peer sr-only' {...register} />
            <span
              aria-hidden
              className={cn(
                'flex size-4 shrink-0 items-center justify-center border border-ink/50 bg-paper text-ink transition-colors peer-checked:border-cream peer-checked:bg-cream',
                type === 'radio' ? 'rounded-full' : 'rounded-xs',
              )}
            >
              <Check className='hidden size-3 group-has-checked:block' strokeWidth={3} />
            </span>
            {o.label}
          </label>
        ))}
      </div>
      <p id={`${name}-error`} aria-live='polite' className='min-h-5 text-small text-error'>
        {error}
      </p>
    </fieldset>
  )
}

type WordCountProps = {
  id: string
  label: string
  hint?: string
  error?: string
  min: number
  max: number
  words: number
  register: UseFormRegisterReturn
}

// a textarea with a live word count against its range (counts words, not characters)
export function WordCountField({ id, label, hint, error, min, max, words, register }: WordCountProps) {
  const state = words === 0 ? 'empty' : words < min ? 'short' : words > max ? 'long' : 'ok'

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={7}
        aria-describedby={cn(describedBy(id, hint, error), `${id}-count`)}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, 'resize-y leading-relaxed', errorRing(error))}
        {...register}
      />
      <p id={`${id}-count`} className='flex items-center justify-between font-mono text-label tabular-nums'>
        <span className={cn(state === 'ok' ? 'text-teal' : state === 'long' ? 'text-error' : 'text-muted')}>
          {words} {words === 1 ? 'word' : 'words'}
        </span>
        <span className='text-muted'>
          {min}&ndash;{max}
        </span>
      </p>
    </FieldShell>
  )
}

type LanguageValue = { language: string; level: string }

type LanguagePickerProps = {
  languages: readonly string[]
  levels: readonly Option[]
  value: LanguageValue[]
  onChange: (value: LanguageValue[]) => void
  error?: string
  // per-language errors, e.g. a ticked language without a level
  levelErrors?: Record<string, string | undefined>
}

// tick a language, then say how well you speak it, on the same row
export function LanguagePicker({ languages, levels, value, onChange, error, levelErrors }: LanguagePickerProps) {
  const chosen = new Map(value.map((v) => [v.language, v.level]))

  function toggle(language: string) {
    onChange(
      chosen.has(language)
        ? value.filter((v) => v.language !== language)
        : [...value, { language, level: '' }],
    )
  }

  function setLevel(language: string, level: string) {
    onChange(value.map((v) => (v.language === language ? { ...v, level } : v)))
  }

  return (
    <fieldset aria-describedby={error ? 'languages-error' : undefined} className='flex flex-col gap-2'>
      <legend className='font-mono text-label uppercase text-ink'>Languages you speak</legend>
      <p className='text-small text-muted'>Tick each one, then say how well you speak it.</p>
      <ul className='mt-1 flex flex-col gap-2'>
        {languages.map((language) => {
          const isOn = chosen.has(language)
          const slug = language.toLowerCase().replace(/\s+/g, '-')
          const levelError = levelErrors?.[language]
          return (
            <li
              key={language}
              className={cn(
                'flex flex-col gap-3 rounded-sm bg-sand px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
                isOn && 'outline-1 outline-ink/30',
                levelError && 'outline-2 outline-error',
              )}
            >
              <label className='flex min-h-6 cursor-pointer items-center gap-3 font-body text-base text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-teal'>
                <input type='checkbox' checked={isOn} onChange={() => toggle(language)} className='peer sr-only' />
                <span
                  aria-hidden
                  className='flex size-4 shrink-0 items-center justify-center rounded-xs border border-ink/50 bg-paper peer-checked:border-ink peer-checked:bg-ink'
                >
                  {isOn && <Check className='size-3 text-paper' strokeWidth={3} />}
                </span>
                {language}
              </label>

              {isOn && (
                <div role='radiogroup' aria-label={`How well you speak ${language}`} className='flex gap-1'>
                  {levels.map((l) => (
                    <label
                      key={l.value}
                      className='cursor-pointer rounded-xs bg-paper px-3 py-1.5 font-body text-small text-ink/80 transition-colors has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal'
                    >
                      <input
                        type='radio'
                        name={`language-level-${slug}`}
                        value={l.value}
                        checked={chosen.get(language) === l.value}
                        onChange={() => setLevel(language, l.value)}
                        className='sr-only'
                      />
                      {l.label}
                    </label>
                  ))}
                </div>
              )}
              {levelError && <p className='text-small text-error sm:hidden'>{levelError}</p>}
            </li>
          )
        })}
      </ul>
      <p id='languages-error' aria-live='polite' className='min-h-5 text-small text-error'>
        {error ?? Object.values(levelErrors ?? {}).find(Boolean)}
      </p>
    </fieldset>
  )
}
