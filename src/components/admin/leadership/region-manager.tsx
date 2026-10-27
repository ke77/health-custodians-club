'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { FormMessage } from '@/components/admin/form-message'
import { ImageField } from '@/components/admin/image-field'
import { Switch } from '@/components/admin/switch'
import { updateRegion } from '@/lib/actions/admin/regions'
import type { RegionRow } from '@/lib/data/admin/regions'
import type { ActionResult } from '@/lib/actions/admin/admins'

function RegionItem({ row }: { row: RegionRow }) {
  const [active, setActive] = useState(row.active)
  const [headName, setHeadName] = useState(row.head_name ?? '')
  const [headInstitution, setHeadInstitution] = useState(row.head_institution ?? '')
  const [headPhotoPath, setHeadPhotoPath] = useState(row.head_photo_path ?? '')
  const [headPublished, setHeadPublished] = useState(row.head_published)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setResult(null)
    startTransition(async () =>
      setResult(await updateRegion(row.region, { active, headName, headInstitution, headPhotoPath, headPublished })),
    )
  }

  return (
    <li className='flex flex-col gap-4 border-t border-rule py-6'>
      <div className='flex items-center justify-between gap-4'>
        <h3 className='font-body text-md font-semibold text-ink'>{row.region}</h3>
      </div>

      <Switch checked={active} onChange={setActive} label='Active region' description='Marks the pin on the About map.' />

      <div className='grid gap-4 sm:grid-cols-2'>
        <Input id={`hn-${row.region}`} label='Regional head name' value={headName} onChange={(e) => setHeadName(e.target.value)} />
        <Input id={`hi-${row.region}`} label='Institution' value={headInstitution} onChange={(e) => setHeadInstitution(e.target.value)} />
      </div>
      <ImageField label='Head photo' folder='regions' path={headPhotoPath} onChange={setHeadPhotoPath} shape='round' />
      <Switch checked={headPublished} onChange={setHeadPublished} label='Show this head publicly' description='Needs a name to appear.' />

      <div className='flex flex-wrap items-center gap-4'>
        <Button type='button' variant='primary' disabled={pending} onClick={save} className='px-6'>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <FormMessage result={result} />
      </div>
    </li>
  )
}

export function RegionManager({ regions }: { regions: RegionRow[] }) {
  return (
    <section>
      <h2 className='font-display text-h3 text-ink'>Regions</h2>
      <p className='mt-2 font-body text-base text-ink/60'>All 16 regions. Toggle where the club is active and add a regional head.</p>
      <ul className='mt-4'>
        {regions.map((row) => (
          <RegionItem key={row.region} row={row} />
        ))}
      </ul>
    </section>
  )
}
