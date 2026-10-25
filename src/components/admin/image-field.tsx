'use client'

import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { mediaUrl, uploadImage } from '@/lib/admin/upload-image'
import { cn } from '@/lib/utils/cn'

type Folder = 'people' | 'partners' | 'regions'

type Props = {
  label: string
  folder: Folder
  // current stored path ('' when none)
  path: string
  onChange: (path: string) => void
  // preview shape
  shape?: 'round' | 'logo'
  hint?: string
}

// upload a single image to the media bucket, with preview and remove. used for logos and photos
export function ImageField({ label, folder, path, onChange, shape = 'logo', hint }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPick(file: File) {
    setError(null)
    setUploading(true)
    try {
      const { path: uploaded } = await uploadImage(file, folder)
      onChange(uploaded)
    } catch {
      setError('Could not upload that image. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <span className='font-mono text-label uppercase text-muted'>{label}</span>
      {hint && <span className='font-body text-small text-muted'>{hint}</span>}
      {path ? (
        <div className='flex items-center gap-4'>
          {/* eslint-disable-next-line @next/next/no-img-element -- storage url, editor preview only */}
          <img
            src={mediaUrl(path)}
            alt=''
            className={cn('bg-ink/5 object-cover', shape === 'round' ? 'size-20 rounded-full' : 'h-16 w-28 rounded-sm object-contain')}
          />
          <button
            type='button'
            onClick={() => onChange('')}
            className='inline-flex items-center gap-1.5 rounded-xs text-small text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
          >
            <X className='size-4' aria-hidden /> Remove
          </button>
        </div>
      ) : (
        <label className='flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-dashed border-rule px-4 py-3 font-body text-base text-ink/70 transition-colors hover:border-ink/40 hover:text-ink'>
          <ImagePlus className='size-5' aria-hidden />
          {uploading ? 'Uploading…' : 'Upload image'}
          <input
            type='file'
            accept='image/*'
            hidden
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.[0]) onPick(e.target.files[0])
              e.target.value = ''
            }}
          />
        </label>
      )}
      {error && <p className='text-small text-error'>{error}</p>}
    </div>
  )
}
