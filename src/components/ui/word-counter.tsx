'use client'

import { useId, useState } from 'react'
import {
  FieldShell,
  describedBy,
  fieldBase,
  errorRing,
} from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Props = {
  label: string
  hint?: string
  min?: number
  max?: number
  defaultValue?: string
}

function countWords(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function WordCounterField({
  label,
  hint,
  min = 150,
  max = 200,
  defaultValue = '',
}: Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const words = countWords(value)
  const inRange = words >= min && words <= max

  return (
    <FieldShell id={id} label={label} hint={hint}>
      <textarea
        id={id}
        rows={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={cn(describedBy(id, hint), `${id}-count`)}
        className={cn(fieldBase, 'resize-y leading-relaxed', errorRing())}
      />
      <p
        id={`${id}-count`}
        aria-live='polite'
        className={cn(
          'font-mono text-label tabular-nums',
          value === '' ? 'text-muted' : inRange ? 'text-teal' : 'text-error',
        )}
      >
        {words} / {min}&ndash;{max} words
      </p>
    </FieldShell>
  )
}
