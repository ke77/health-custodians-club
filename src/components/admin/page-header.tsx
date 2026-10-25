import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: ReactNode
  // buttons on the right (export, add)
  actions?: ReactNode
}

// every dashboard screen opens with this: title, one quiet line of help, actions
export function PageHeader({ title, description, actions }: Props) {
  return (
    <header className='flex flex-col gap-6 border-b border-rule pb-8 sm:flex-row sm:items-end sm:justify-between'>
      <div className='flex flex-col gap-3'>
        <h1 className='font-display text-h2 text-ink'>{title}</h1>
        {description && (
          <p className='max-w-[var(--container-prose)] font-body text-base text-ink/70'>{description}</p>
        )}
      </div>
      {actions && <div className='flex flex-wrap items-center gap-3'>{actions}</div>}
    </header>
  )
}
