import { cn } from '@/lib/utils/cn'

type Props = {
  label: string
  title: string
  rule?: boolean
  className?: string
}

export function SectionHeader({ label, title, rule = true, className }: Props) {
  return (
    <div className={cn('flex flex-col', className)}>
      <p className='font-mono text-label uppercase text-teal'>{label}</p>
      <h2 className='mt-3 font-display text-h2 text-ink'>{title}</h2>
      {rule && <hr className='mt-6 border-0 border-t border-rule' />}
    </div>
  )
}
