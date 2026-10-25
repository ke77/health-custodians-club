import { cn } from '@/lib/utils/cn'

type Props = {
  result: { ok: boolean; message?: string } | null
  className?: string
}

// the line under a form that says what just happened; announced to screen readers
export function FormMessage({ result, className }: Props) {
  return (
    <p aria-live='polite' className={cn('min-h-5 text-small', result?.ok ? 'text-teal' : 'text-error', className)}>
      {result?.message}
    </p>
  )
}
