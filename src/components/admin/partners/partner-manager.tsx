'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { FormMessage } from '@/components/admin/form-message'
import { ImageField } from '@/components/admin/image-field'
import { Switch } from '@/components/admin/switch'
import { createPartner, deletePartner, movePartner, updatePartner } from '@/lib/actions/admin/partners'
import type { Partner } from '@/lib/data/admin/partners'
import type { ActionResult } from '@/lib/actions/admin/admins'

const iconBtn =
  'rounded-sm p-1.5 text-ink/60 hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

function PartnerRow({ partner, first, last }: { partner: Partner; first: boolean; last: boolean }) {
  const router = useRouter()
  const [name, setName] = useState(partner.name)
  const [url, setUrl] = useState(partner.url ?? '')
  const [logoPath, setLogoPath] = useState(partner.logo_path ?? '')
  const [published, setPublished] = useState(partner.published)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setResult(null)
    startTransition(async () => setResult(await updatePartner(partner.id, { name, url, logoPath, published })))
  }

  function move(direction: 'up' | 'down') {
    startTransition(async () => {
      const r = await movePartner(partner.id, direction)
      if (r.ok) router.refresh()
      else setResult(r)
    })
  }

  return (
    <li className='flex flex-col gap-4 border-t border-rule py-6'>
      <div className='flex items-center justify-end gap-1'>
        <button type='button' className={iconBtn} aria-label='Move up' disabled={first || pending} onClick={() => move('up')}>
          <ArrowUp className='size-4' aria-hidden />
        </button>
        <button type='button' className={iconBtn} aria-label='Move down' disabled={last || pending} onClick={() => move('down')}>
          <ArrowDown className='size-4' aria-hidden />
        </button>
      </div>

      <Input id={`name-${partner.id}`} label='Name' value={name} onChange={(e) => setName(e.target.value)} />
      <Input id={`url-${partner.id}`} label='Website (optional)' type='url' inputMode='url' placeholder='https://…' value={url} onChange={(e) => setUrl(e.target.value)} />
      <ImageField label='Logo' folder='partners' path={logoPath} onChange={setLogoPath} shape='logo' />
      <Switch checked={published} onChange={setPublished} label='Published' />

      <div className='flex flex-wrap items-center gap-4'>
        <Button type='button' variant='primary' disabled={pending} onClick={save} className='px-6'>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <ConfirmButton
          label='Delete'
          title='Delete this partner?'
          body='This removes the partner for good.'
          confirmLabel='Delete'
          className='text-error hover:text-error'
          onConfirm={async () => {
            const r = await deletePartner(partner.id)
            if (r.ok) router.refresh()
            return r
          }}
        />
        <FormMessage result={result} />
      </div>
    </li>
  )
}

export function PartnerManager({ partners }: { partners: Partner[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function add() {
    startTransition(async () => {
      await createPartner()
      router.refresh()
    })
  }

  return (
    <div>
      <div className='flex justify-end'>
        <Button type='button' variant='secondary' disabled={pending} onClick={add} className='px-5'>
          Add partner
        </Button>
      </div>
      {partners.length === 0 ? (
        <p className='mt-6 border-t border-rule py-10 font-body text-base text-ink/60'>
          No partners yet. The public partners page shows a short “building partnerships” message until you add one and publish it.
        </p>
      ) : (
        <ul className='mt-4'>
          {partners.map((p, i) => (
            <PartnerRow key={p.id} partner={p} first={i === 0} last={i === partners.length - 1} />
          ))}
        </ul>
      )}
    </div>
  )
}
