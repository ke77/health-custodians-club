'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormMessage } from '@/components/admin/form-message'
import { Switch } from '@/components/admin/switch'
import { updateBanner } from '@/lib/actions/admin/settings'
import type { ActionResult } from '@/lib/actions/admin/admins'

type Props = {
  initial: { bannerOn: boolean; bannerText: string; bannerLink: string }
}

export function BannerForm({ initial }: Props) {
  const [on, setOn] = useState(initial.bannerOn)
  const [text, setText] = useState(initial.bannerText)
  const [link, setLink] = useState(initial.bannerLink)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => setResult(await updateBanner({ bannerOn: on, bannerText: text, bannerLink: link })))
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex max-w-xl flex-col gap-8'>
      <div className='border-b border-rule pb-6'>
        <Switch
          checked={on}
          onChange={setOn}
          label={`Banner is ${on ? 'showing' : 'hidden'}`}
          description='A thin strip across the top of every public page.'
        />
      </div>

      <Textarea
        id='banner-text'
        label='Banner text'
        hint='Short and clear, for example “Applications for 2026/27 close on 30 November.”'
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Input
        id='banner-link'
        label='Link (optional)'
        type='url'
        inputMode='url'
        hint='Where the banner sends people when tapped. Leave empty for no link.'
        placeholder='https://… or /membership/apply'
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <div className='flex flex-wrap items-center gap-4'>
        <Button type='submit' variant='dark' disabled={pending} className='px-6'>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <FormMessage result={result} />
      </div>
    </form>
  )
}
