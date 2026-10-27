'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { FormMessage } from '@/components/admin/form-message'
import { ImageField } from '@/components/admin/image-field'
import { Switch } from '@/components/admin/switch'
import { createPerson, deletePerson, movePerson, updatePerson } from '@/lib/actions/admin/people'
import type { Person } from '@/lib/data/admin/people'
import { parseSocials, personSocialPlatforms, personTypeLabels } from '@/lib/validation/admin/person'
import type { PersonSocialPlatform, PersonType } from '@/lib/validation/admin/person'
import type { ActionResult } from '@/lib/actions/admin/admins'

const iconBtn =
  'rounded-sm p-1.5 text-ink/60 hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

type Social = { platform: PersonSocialPlatform; href: string }

function PersonRow({ person, type, first, last }: { person: Person; type: PersonType; first: boolean; last: boolean }) {
  const router = useRouter()
  const [name, setName] = useState(person.name)
  const [role, setRole] = useState(person.role)
  const [bio, setBio] = useState(person.bio ?? '')
  const [photoPath, setPhotoPath] = useState(person.photo_path ?? '')
  const [published, setPublished] = useState(person.published)
  const [socials, setSocials] = useState<Social[]>(parseSocials(person.socials))
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setResult(null)
    startTransition(async () =>
      setResult(await updatePerson(person.id, { name, role, bio, photoPath, published, socials: socials.filter((s) => s.href.trim()) })),
    )
  }

  function move(direction: 'up' | 'down') {
    startTransition(async () => {
      const r = await movePerson(person.id, type, direction)
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

      <div className='grid gap-4 sm:grid-cols-2'>
        <Input id={`name-${person.id}`} label='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <Input id={`role-${person.id}`} label='Role' value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <Textarea id={`bio-${person.id}`} label='Bio (optional)' rows={2} value={bio} onChange={(e) => setBio(e.target.value)} />
      <ImageField label='Photo' folder='people' path={photoPath} onChange={setPhotoPath} shape='round' hint='Square works best; shown as a circle.' />

      <div className='flex flex-col gap-3'>
        <span className='font-mono text-label uppercase text-muted'>Social links</span>
        {socials.map((s, i) => (
          <div key={i} className='flex items-end gap-2'>
            <div className='w-40 shrink-0'>
              <Select
                id={`sp-${person.id}-${i}`}
                label='Platform'
                value={s.platform}
                onChange={(e) =>
                  setSocials((list) => list.map((x, idx) => (idx === i ? { ...x, platform: e.target.value as PersonSocialPlatform } : x)))
                }
                options={personSocialPlatforms.map((p) => ({ value: p.value, label: p.label }))}
              />
            </div>
            <div className='flex-1'>
              <Input
                id={`sh-${person.id}-${i}`}
                label='Link or email'
                value={s.href}
                onChange={(e) => setSocials((list) => list.map((x, idx) => (idx === i ? { ...x, href: e.target.value } : x)))}
              />
            </div>
            <button type='button' aria-label='Remove link' className={`${iconBtn} mb-2`} onClick={() => setSocials((list) => list.filter((_, idx) => idx !== i))}>
              <X className='size-4' aria-hidden />
            </button>
          </div>
        ))}
        {socials.length < 5 && (
          <button
            type='button'
            onClick={() => setSocials((list) => [...list, { platform: 'linkedin', href: '' }])}
            className='inline-flex w-fit items-center gap-1.5 rounded-xs text-small text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
          >
            <Plus className='size-4' aria-hidden /> Add a link
          </button>
        )}
      </div>

      <Switch checked={published} onChange={setPublished} label='Published' />

      <div className='flex flex-wrap items-center gap-4'>
        <Button type='button' variant='primary' disabled={pending} onClick={save} className='px-6'>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <ConfirmButton
          label='Delete'
          title='Delete this person?'
          body='This removes them for good.'
          confirmLabel='Delete'
          className='text-error hover:text-error'
          onConfirm={async () => {
            const r = await deletePerson(person.id)
            if (r.ok) router.refresh()
            return r
          }}
        />
        <FormMessage result={result} />
      </div>
    </li>
  )
}

export function PersonManager({ type, people }: { type: PersonType; people: Person[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const items = people.filter((p) => p.type === type)

  function add() {
    startTransition(async () => {
      await createPerson(type)
      router.refresh()
    })
  }

  return (
    <section>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='font-display text-h3 text-ink'>{personTypeLabels[type].plural}</h2>
        <Button type='button' variant='secondary' disabled={pending} onClick={add} className='px-5'>
          Add {personTypeLabels[type].singular.toLowerCase()}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className='mt-6 border-t border-rule py-8 font-body text-base text-ink/60'>
          None yet. The public page hides this section until someone is published here.
        </p>
      ) : (
        <ul className='mt-4'>
          {items.map((p, i) => (
            <PersonRow key={p.id} person={p} type={type} first={i === 0} last={i === items.length - 1} />
          ))}
        </ul>
      )}
    </section>
  )
}
