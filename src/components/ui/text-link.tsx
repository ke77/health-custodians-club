import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

type Props = {
  href: string
  children: ReactNode
  className?: string
}

// underline draws in on hover/focus via a background-size transition (respects reduced-motion globally)
const underline =
  'bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]'

export function TextLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'text-teal [background-image:linear-gradient(currentColor,currentColor)]',
        underline,
        'rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
        className,
      )}
    >
      {children}
    </Link>
  )
}
