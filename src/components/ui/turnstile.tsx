'use client'

import { Turnstile } from '@marsidev/react-turnstile'

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/*
  the bot check shown on public forms. renders only when a site key is configured, so forms work in
  development before the club sets Turnstile up. calls onToken with the token (or null when it expires).
*/
export function TurnstileWidget({ onToken }: { onToken: (token: string | null) => void }) {
  if (!siteKey) return null
  return (
    <div className='min-h-[65px]'>
      <Turnstile
        siteKey={siteKey}
        options={{ theme: 'light', size: 'flexible' }}
        onSuccess={onToken}
        onExpire={() => onToken(null)}
        onError={() => onToken(null)}
      />
    </div>
  )
}
