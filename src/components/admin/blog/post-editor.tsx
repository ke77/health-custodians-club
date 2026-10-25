'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { JSONContent } from '@tiptap/react'
import { ArrowDown, ArrowUp, ImagePlus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { FormMessage } from '@/components/admin/form-message'
import { RichTextEditor } from '@/components/admin/blog/rich-text-editor'
import { deletePost, publishPost, savePost, unpublishPost } from '@/lib/actions/admin/posts'
import { galleryKinds, postKinds, slugify } from '@/lib/validation/admin/post'
import type { PostKind, PostInput } from '@/lib/validation/admin/post'
import { mediaUrl, uploadPostImage } from '@/lib/admin/upload-image'
import type { Post } from '@/lib/data/admin/posts'
import type { ActionResult } from '@/lib/actions/admin/admins'
import { cn } from '@/lib/utils/cn'

type GalleryItem = { path: string; alt: string }

// a tiptap doc from stored json, or an empty paragraph to start on
function initialBody(body: Post['body']): JSONContent {
  const doc = body as JSONContent
  if (doc && typeof doc === 'object' && doc.type === 'doc') return doc
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

function toGallery(value: Post['gallery']): GalleryItem[] {
  if (!Array.isArray(value)) return []
  return value.filter((g): g is GalleryItem => !!g && typeof g === 'object' && typeof (g as GalleryItem).path === 'string')
}

export function PostEditor({ post }: { post: Post }) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  // keep the slug following the title until the admin edits it by hand, and never auto-change a live post's url
  const [slugLocked, setSlugLocked] = useState(post.status === 'published')
  const [kind, setKind] = useState<PostKind>(post.kind)
  const [excerpt, setExcerpt] = useState(post.excerpt ?? '')
  const [coverPath, setCoverPath] = useState(post.cover_path ?? '')
  const [coverAlt, setCoverAlt] = useState(post.cover_alt ?? '')
  const [coverUploading, setCoverUploading] = useState(false)
  const [gallery, setGallery] = useState<GalleryItem[]>(toGallery(post.gallery))
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [body, setBody] = useState<JSONContent>(() => initialBody(post.body))
  const [status, setStatus] = useState(post.status)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  const showGallery = galleryKinds.includes(kind)

  function onTitle(value: string) {
    setTitle(value)
    if (!slugLocked) setSlug(slugify(value))
  }

  function current(): PostInput {
    return { title, slug, kind, excerpt, coverPath, coverAlt, body, gallery }
  }

  function run(action: () => Promise<ActionResult>, after?: (r: ActionResult) => void) {
    setResult(null)
    startTransition(async () => {
      const r = await action()
      setResult(r)
      if (r.ok) after?.(r)
    })
  }

  async function onCover(file: File) {
    setCoverUploading(true)
    try {
      const { path } = await uploadPostImage(file)
      setCoverPath(path)
    } catch {
      setResult({ ok: false, message: 'Could not upload the cover image. Try again.' })
    } finally {
      setCoverUploading(false)
    }
  }

  async function onAddGallery(files: FileList) {
    setGalleryUploading(true)
    try {
      const uploaded: GalleryItem[] = []
      for (const file of Array.from(files)) {
        const { path } = await uploadPostImage(file)
        uploaded.push({ path, alt: '' })
      }
      setGallery((g) => [...g, ...uploaded])
    } catch {
      setResult({ ok: false, message: 'Could not upload one of the photos. Try again.' })
    } finally {
      setGalleryUploading(false)
    }
  }

  function moveGallery(index: number, delta: number) {
    setGallery((g) => {
      const next = [...g]
      const target = index + delta
      if (target < 0 || target >= next.length) return g
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <div className='flex flex-col gap-10'>
      {/* sticky action bar: status, save, publish/unpublish */}
      <div className='sticky top-[3.75rem] z-10 -mx-6 flex flex-wrap items-center gap-3 border-b border-rule bg-paper/95 px-6 py-4 backdrop-blur-sm lg:-mx-10 lg:px-10'>
        <span
          className={cn(
            'inline-flex items-center gap-2 font-mono text-label uppercase',
            status === 'published' ? 'text-ink' : 'text-muted',
          )}
        >
          <span className={cn('size-2 rounded-full', status === 'published' ? 'bg-teal' : 'bg-ink/30')} aria-hidden />
          {status === 'published' ? 'Published' : 'Draft'}
        </span>

        <div className='ml-auto flex flex-wrap items-center gap-3'>
          <FormMessage result={result} />
          <Button
            variant='outline'
            disabled={pending}
            onClick={() => run(() => savePost(post.id, current()))}
            className='border border-rule px-6'
          >
            {pending ? 'Saving…' : 'Save'}
          </Button>
          {status === 'published' ? (
            <Button
              variant='outline'
              disabled={pending}
              onClick={() => run(() => unpublishPost(post.id, current()), () => setStatus('draft'))}
              className='border border-rule px-6'
            >
              Unpublish
            </Button>
          ) : (
            <Button
              variant='dark'
              disabled={pending}
              onClick={() => run(() => publishPost(post.id, current()), () => setStatus('published'))}
              className='px-6'
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]'>
        {/* main column */}
        <div className='flex flex-col gap-6'>
          <Input id='title' label='Title' value={title} onChange={(e) => onTitle(e.target.value)} />
          <Input
            id='slug'
            label='URL slug'
            hint='The address of the post, for example our-first-outreach.'
            value={slug}
            onChange={(e) => {
              setSlugLocked(true)
              setSlug(slugify(e.target.value))
            }}
          />
          <Textarea
            id='excerpt'
            label='Excerpt'
            hint='One or two sentences shown in the blog list and link previews.'
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <div className='flex flex-col gap-2'>
            <span className='font-mono text-label uppercase text-muted'>Body</span>
            <RichTextEditor value={body} onChange={setBody} />
          </div>

          {showGallery && (
            <GalleryEditor
              gallery={gallery}
              uploading={galleryUploading}
              onAdd={onAddGallery}
              onRemove={(i) => setGallery((g) => g.filter((_, idx) => idx !== i))}
              onAlt={(i, alt) => setGallery((g) => g.map((item, idx) => (idx === i ? { ...item, alt } : item)))}
              onMove={moveGallery}
            />
          )}
        </div>

        {/* side column: kind, cover, delete */}
        <aside className='flex flex-col gap-6 lg:border-l lg:border-rule lg:pl-8'>
          <Select
            id='kind'
            label='Kind'
            value={kind}
            onChange={(e) => setKind(e.target.value as PostKind)}
            options={postKinds.map((k) => ({ value: k.value, label: k.label }))}
          />

          <CoverEditor
            path={coverPath}
            alt={coverAlt}
            uploading={coverUploading}
            onPick={onCover}
            onAlt={setCoverAlt}
            onRemove={() => setCoverPath('')}
          />

          <div className='border-t border-rule pt-6'>
            <ConfirmButton
              label='Delete post'
              title='Delete this post?'
              body='This removes the post for good. It cannot be undone.'
              confirmLabel='Delete'
              className='text-error hover:text-error'
              onConfirm={async () => {
                const r = await deletePost(post.id)
                if (r.ok) router.push('/admin/blog')
                return r
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

function ImagePicker({
  id,
  label,
  uploading,
  multiple,
  onPick,
}: {
  id: string
  label: string
  uploading: boolean
  multiple?: boolean
  onPick: (files: FileList) => void
}) {
  return (
    <label
      htmlFor={id}
      className='flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-rule px-4 py-6 text-center font-body text-base text-ink/70 transition-colors hover:border-ink/40 hover:text-ink'
    >
      <ImagePlus className='size-5' aria-hidden />
      {uploading ? 'Uploading…' : label}
      <input
        id={id}
        type='file'
        accept='image/*'
        multiple={multiple}
        hidden
        disabled={uploading}
        onChange={(e) => {
          if (e.target.files?.length) onPick(e.target.files)
          e.target.value = ''
        }}
      />
    </label>
  )
}

function CoverEditor({
  path,
  alt,
  uploading,
  onPick,
  onAlt,
  onRemove,
}: {
  path: string
  alt: string
  uploading: boolean
  onPick: (file: File) => void
  onAlt: (value: string) => void
  onRemove: () => void
}) {
  return (
    <div className='flex flex-col gap-3'>
      <span className='font-mono text-label uppercase text-muted'>Cover image</span>
      {path ? (
        <div className='flex flex-col gap-3'>
          {/* eslint-disable-next-line @next/next/no-img-element -- storage url, no next/image optimisation needed in the editor */}
          <img src={mediaUrl(path)} alt='' className='aspect-video w-full rounded-sm object-cover' />
          <button
            type='button'
            onClick={onRemove}
            className='inline-flex w-fit items-center gap-1.5 rounded-xs text-small text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
          >
            <X className='size-4' aria-hidden /> Remove
          </button>
          <Input id='cover-alt' label='Alt text' hint='Describe the image for screen readers.' value={alt} onChange={(e) => onAlt(e.target.value)} />
        </div>
      ) : (
        <ImagePicker id='cover-file' label='Add a cover' uploading={uploading} onPick={(files) => onPick(files[0])} />
      )}
    </div>
  )
}

function GalleryEditor({
  gallery,
  uploading,
  onAdd,
  onRemove,
  onAlt,
  onMove,
}: {
  gallery: GalleryItem[]
  uploading: boolean
  onAdd: (files: FileList) => void
  onRemove: (index: number) => void
  onAlt: (index: number, alt: string) => void
  onMove: (index: number, delta: number) => void
}) {
  return (
    <div className='flex flex-col gap-3 border-t border-rule pt-6'>
      <div className='flex flex-col gap-1'>
        <span className='font-mono text-label uppercase text-muted'>Photo gallery</span>
        <p className='font-body text-small text-ink/60'>Optional, for outreach and event posts.</p>
      </div>

      {gallery.length > 0 && (
        <ul className='flex flex-col gap-4'>
          {gallery.map((item, i) => (
            <li key={item.path} className='flex gap-3'>
              {/* eslint-disable-next-line @next/next/no-img-element -- storage url */}
              <img src={mediaUrl(item.path)} alt='' className='size-20 shrink-0 rounded-sm object-cover' />
              <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <Input
                  id={`gallery-alt-${i}`}
                  label='Alt text'
                  value={item.alt}
                  onChange={(e) => onAlt(i, e.target.value)}
                />
                <div className='flex items-center gap-3 text-ink/60'>
                  <button type='button' onClick={() => onMove(i, -1)} disabled={i === 0} aria-label='Move up' className='rounded-xs p-1 hover:text-ink disabled:opacity-30'>
                    <ArrowUp className='size-4' aria-hidden />
                  </button>
                  <button type='button' onClick={() => onMove(i, 1)} disabled={i === gallery.length - 1} aria-label='Move down' className='rounded-xs p-1 hover:text-ink disabled:opacity-30'>
                    <ArrowDown className='size-4' aria-hidden />
                  </button>
                  <button type='button' onClick={() => onRemove(i)} aria-label='Remove photo' className='ml-auto rounded-xs p-1 text-ink/60 hover:text-error'>
                    <Trash2 className='size-4' aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ImagePicker id='gallery-file' label='Add photos' uploading={uploading} multiple onPick={onAdd} />
    </div>
  )
}
