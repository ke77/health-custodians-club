'use client'

import { useCallback, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react'
import { uploadPostImage } from '@/lib/admin/upload-image'
import { cn } from '@/lib/utils/cn'

type Props = {
  // tiptap document json to start from
  value: JSONContent
  // fires on every change with the current document json
  onChange: (json: JSONContent) => void
}

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

// one toolbar button
function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'flex size-9 items-center justify-center rounded-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40',
        active && 'bg-ink/10 text-ink',
        focus,
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className='mx-1 h-6 w-px bg-rule' aria-hidden />
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const addLink = useCallback(() => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadPostImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      window.alert('Could not upload that image. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-0.5 border-b border-rule p-2'>
      <ToolButton label='Bold' onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
        <Bold className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Italic' onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
        <Italic className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Strikethrough' onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
        <Strikethrough className='size-4' aria-hidden />
      </ToolButton>
      <Divider />
      <ToolButton
        label='Heading'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton
        label='Subheading'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className='size-4' aria-hidden />
      </ToolButton>
      <Divider />
      <ToolButton label='Bullet list' onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
        <List className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Numbered list' onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
        <ListOrdered className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Quote' onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
        <Quote className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Divider' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className='size-4' aria-hidden />
      </ToolButton>
      <Divider />
      <ToolButton label='Link' onClick={addLink} active={editor.isActive('link')}>
        <Link2 className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label={uploading ? 'Uploading…' : 'Insert image'} onClick={() => fileInput.current?.click()} disabled={uploading}>
        <ImageIcon className='size-4' aria-hidden />
      </ToolButton>
      <input ref={fileInput} type='file' accept='image/*' hidden onChange={onPickImage} />
      <Divider />
      <ToolButton label='Undo' onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className='size-4' aria-hidden />
      </ToolButton>
      <ToolButton label='Redo' onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className='size-4' aria-hidden />
      </ToolButton>
    </div>
  )
}

// a small rich-text editor over Tiptap; stores the document as Tiptap JSON
export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    // next.js renders this on the server first; defer the first editor render to the client
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } },
      }),
      Image.configure({ HTMLAttributes: { class: 'rte-image' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: 'rte-content min-h-80 px-4 py-4 focus:outline-none',
      },
    },
  })

  return (
    <div className='rounded-sm border border-rule bg-paper'>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
