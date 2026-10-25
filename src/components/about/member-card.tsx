import type { ComponentType } from 'react'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import type { Person, SocialPlatform } from '@/lib/config/leadership'

const socialMeta: Record<SocialPlatform, { label: string; Icon: ComponentType<{ className?: string }> }> = {
  linkedin: { label: 'LinkedIn', Icon: FaLinkedinIn },
  instagram: { label: 'Instagram', Icon: FaInstagram },
  x: { label: 'X', Icon: FaXTwitter },
  facebook: { label: 'Facebook', Icon: FaFacebookF },
  email: { label: 'Email', Icon: Mail },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

type Props = {
  person: Pick<Person, 'name' | 'role' | 'photoPath' | 'socials'>
}


export function MemberCard({ person: { name, role, photoPath, socials } }: Props) {
  return (
    <article className='flex flex-col items-center text-center'>
      <div className='relative size-28 overflow-hidden rounded-full bg-ink/5 shadow-sm sm:size-36'>
        {photoPath ? (
          <Image
            src={photoPath}
            alt={`${name}, ${role}`}
            fill
            sizes='(min-width: 640px) 144px, 112px'
            className='object-cover'
          />
        ) : (
          <span
            aria-hidden
            className='absolute inset-0 flex items-center justify-center font-display text-h2 text-ink/40'
          >
            {initials(name)}
          </span>
        )}
      </div>

      <h3 className='mt-6 font-body text-md md:text-lg font-semibold text-ink'>{name}</h3>
      <p className='mt-1 font-body text-label uppercase text-muted text-base'>{role}</p>

      {socials.length > 0 && (
        <ul className='mt-3 flex items-center'>
          {socials.map(({ platform, href }) => {
            const { label, Icon } = socialMeta[platform]
            return (
              <li key={platform}>
                <a
                  href={href}
                  aria-label={platform === 'email' ? `Email ${name}` : `${name} on ${label}`}
                  className='flex size-11 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                >
                  <Icon className='size-4' />
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
