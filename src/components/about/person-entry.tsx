import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type Props = {
  name: string
  role: string
  photoSrc?: string
  bio?: string
}

export function PersonEntry({ name, role, photoSrc, bio }: Props) {
  return (
    <figure className='flex flex-col gap-4'>
      <div
        className={cn(
          'relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-sand',
        )}
      >
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${name}, ${role}`}
            fill
            sizes='(max-width: 768px) 50vw, 25vw'
            className='object-cover'
          />
        ) : (
          <span className='absolute inset-0 flex items-center justify-center font-mono text-label uppercase text-muted'>
            Photo to come
          </span>
        )}
      </div>
      <figcaption className='flex flex-col gap-1'>
        <span className='font-display text-h3 text-ink'>{name}</span>
        <span className='font-mono text-label uppercase text-teal'>{role}</span>
        {bio && <p className='mt-2 font-body text-small text-muted'>{bio}</p>}
      </figcaption>
    </figure>
  )
}
