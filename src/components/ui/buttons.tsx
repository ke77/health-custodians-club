import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'secondaryLight' | 'link'

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
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-body text-base font-medium shadow-button transition-[opacity,color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-50'


const variants: Record<Exclude<Variant, 'link'>, string> = {
  primary: 'bg-cream text-ink/80 hover:opacity-90',
  secondary: 'bg-paper text-ink/80',
  secondaryLight:
    'border border-paper text-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
}

const linkBase =
  'group inline-flex items-center gap-2 font-body text-base font-medium text-ink/80 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/90'

const underlineDraw =
  '[background-image:linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]'

function Content({
  children,
  arrow,
  isLink,
}: {
  children: ReactNode
  arrow?: boolean
  isLink?: boolean
}) {
  return (
    <>
      {isLink ? <span className={underlineDraw}>{children}</span> : children}
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
  const isLink = variant === 'link'
  const classes = isLink
    ? cn(linkBase, className)
    : cn(base, variants[variant], className)
  const inner = (
    <Content arrow={arrow} isLink={isLink}>
      {children}
    </Content>
  )

  // in-page anchors use a plain <a> so the browser scrolls to the section natively
  if (href?.startsWith('#')) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {inner}
    </button>
  )
}
