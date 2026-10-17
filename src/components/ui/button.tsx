import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'secondaryLight'

type Props = {
  children: ReactNode
  variant?: Variant
  href?: string
  arrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-body text-small font-medium transition-[opacity,color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-teal text-paper hover:opacity-90',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  // for dark backgrounds (hero, footer): paper outline, inverts on hover
  secondaryLight:
    'border border-paper text-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && (
        <ArrowRight
          className='size-4 transition-transform group-hover:translate-x-1'
          aria-hidden
        />
      )}
    </>
  )
}

export function Button({
  children,
  variant = 'primary',
  href,
  arrow,
  type = 'button',
  disabled,
  className,
}: Props) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        <Inner arrow={arrow}>{children}</Inner>
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  )
}
