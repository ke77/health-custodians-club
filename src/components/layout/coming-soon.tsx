import { socialIcons } from '@/lib/config/socials'

type Props = {
  // the page this stands in for, used in the small line above the heading (e.g. "Programmes")
  label: string
  // short sentence under "Coming soon"
  blurb: string
  // background photo from /public
  image: string
}

/*
  a full-height hero-style stand-in for a page that is not ready yet: a dark background photo with the
  one allowed linear overlay, large centred "Coming soon" text, and the club's social icons beneath.
*/
export function ComingSoon({ label, blurb, image }: Props) {
  return (
    <section
      className='relative flex min-h-[85svh] flex-col items-center justify-center bg-ink bg-cover bg-center px-6 text-center text-paper'
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div aria-hidden className='absolute inset-0 bg-linear-to-t from-ink via-ink/80 to-ink/50' />

      <div className='relative z-10 flex flex-col items-center'>
        <p className='font-mono text-label uppercase tracking-[0.2em] text-paper/70'>{label}</p>
        <h1 className='mt-5 font-display text-display text-paper'>Coming soon</h1>
        <p className='mt-6 max-w-[48ch] font-body text-base md:text-md text-paper/80 leading-[1.7]'>{blurb}</p>

        {socialIcons.length > 0 && (
          <ul className='mt-12 flex items-center gap-7'>
            {socialIcons.map(({ label: name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  {...(href !== '#' && { target: '_blank', rel: 'noreferrer' })}
                  aria-label={name}
                  className='block text-paper/80 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'
                >
                  <Icon className='size-6' />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
