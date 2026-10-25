import { statusLabel } from '@/lib/config/application-status'
import type { ApplicationStatus } from '@/lib/config/application-status'
import { cn } from '@/lib/utils/cn'

// a small dot tells the statuses apart at a glance, using the palette only: open (hollow), in progress, decided
const dot: Record<ApplicationStatus, string> = {
  submitted: 'bg-ink',
  under_review: 'border border-ink',
  shortlisted: 'border-2 border-teal',
  interview: 'border-2 border-teal',
  accepted: 'bg-teal',
  waitlisted: 'border border-muted',
  rejected: 'bg-ink/20',
}

export function StatusLabel({ status, className }: { status: ApplicationStatus; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 whitespace-nowrap font-mono text-label uppercase text-ink/80', className)}>
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[status])} />
      {statusLabel(status)}
    </span>
  )
}
