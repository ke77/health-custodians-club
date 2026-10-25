import type { ReactNode } from 'react'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'secondaryLight' | 'link' | 'dark';

type Props = {
  children: ReactNode
  variant?: Variant
  href?: string
  arrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-body text-base font-medium shadow-button transition-[opacity,color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-50'


const variants: Record<Exclude<Variant, 'link'>, string> = {
  primary: 'bg-primary text-ink/90 hover:opacity-90',
  secondary: 'bg-paper text-ink/80',
  secondaryLight:
    'border border-paper text-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
  dark: 'bg-ink/90 text-paper hover:opacity-95'
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
        <HiArrowRight
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
  onClick,
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
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}
