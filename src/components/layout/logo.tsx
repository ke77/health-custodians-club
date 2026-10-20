import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/*
  to switch to the real logo: drop the file in public/brand/, set LOGO_SRC (e.g. '/brand/logo.svg')
  and LOGO_SIZE to the file's intrinsic size. until then the Newsreader wordmark renders.
*/
const LOGO_SRC: string | null = null
const LOGO_SIZE = { width: 120, height: 40 }

type Props = {
  onClick?: () => void
  className?: string
}

export function Logo({ onClick, className }: Props) {
  return (
    <Link
      href='/'
      onClick={onClick}
      aria-label='Health Custodians Club, home'
      className={cn(
        'inline-flex items-center rounded-xs font-display text-h3 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink',
        className,
      )}
    >
      {LOGO_SRC ? (
        <Image
          src={LOGO_SRC}
          alt=''
          width={LOGO_SIZE.width}
          height={LOGO_SIZE.height}
          priority
          className='h-9 w-auto'
        />
      ) : (
        <span aria-hidden>HCC</span>
      )}
    </Link>
  )
}
