import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/*
  the club's seal, the same file the main site's navbar uses. it shows to the left of the wordmark text.
  set LOGO_SRC to null to go back to the text wordmark alone.
*/
const LOGO_SRC: string | null = '/logo.png'
const LOGO_SIZE = { width: 1000, height: 1000 }

type Props = {
  href?: string
  label?: string
  // the text shown beside the logo ('Dashboard' in the admin)
  wordmark?: string
  onClick?: () => void
  className?: string
}

export function Logo({ href = '/', label = 'Health Custodians Club, home', wordmark = 'HCC', onClick, className }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-xs font-display text-h3 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink',
        className,
      )}
    >
      {LOGO_SRC && (
        <Image src={LOGO_SRC} alt='' width={LOGO_SIZE.width} height={LOGO_SIZE.height} priority className='h-9 w-auto' />
      )}
      <span aria-hidden>{wordmark}</span>
    </Link>
  )
}
