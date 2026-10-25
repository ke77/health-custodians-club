import type { ReactNode } from 'react'
import type { Json } from '@/lib/supabase/types'

type Mark = { type: string; attrs?: Record<string, unknown> }
type DocNode = {
  type?: string
  attrs?: Record<string, unknown>
  content?: DocNode[]
  marks?: Mark[]
  text?: string
}

// only web, mail and phone links and site-relative paths; anything else (javascript:, data:) is dropped
function safeHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(href) ? href : undefined
}

function applyMarks(text: string, marks: Mark[] | undefined, key: string): ReactNode {
  let node: ReactNode = text
  for (const mark of marks ?? []) {
    if (mark.type === 'bold') node = <strong key={key}>{node}</strong>
    else if (mark.type === 'italic') node = <em key={key}>{node}</em>
    else if (mark.type === 'strike') node = <s key={key}>{node}</s>
    else if (mark.type === 'underline') node = <u key={key}>{node}</u>
    else if (mark.type === 'code') node = <code key={key}>{node}</code>
    else if (mark.type === 'link') {
      const href = safeHref(mark.attrs?.href)
      if (href) {
        node = (
          <a key={key} href={href} rel='noopener noreferrer nofollow'>
            {node}
          </a>
        )
      }
    }
  }
  return node
}

function renderNodes(nodes: DocNode[] | undefined, parent: string): ReactNode[] {
  return (nodes ?? []).map((node, i) => renderNode(node, `${parent}.${i}`))
}

function renderNode(node: DocNode, key: string): ReactNode {
  const children = renderNodes(node.content, key)

  switch (node.type) {
    case 'text':
      return applyMarks(node.text ?? '', node.marks, key)
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading':
      return node.attrs?.level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>
    case 'bulletList':
      return <ul key={key}>{children}</ul>
    case 'orderedList':
      return <ol key={key}>{children}</ol>
    case 'listItem':
      return <li key={key}>{children}</li>
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      )
    case 'horizontalRule':
      return <hr key={key} />
    case 'hardBreak':
      return <br key={key} />
    case 'image': {
      const src = node.attrs?.src
      if (typeof src !== 'string' || !src.startsWith('https://')) return null
      const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''
      // body photos come from storage with unknown sizes, so a plain img keeps them at their natural ratio
      // eslint-disable-next-line @next/next/no-img-element
      return <img key={key} src={src} alt={alt} loading='lazy' className='rte-image' />
    }
    default:
      // an unknown node keeps its text instead of vanishing
      return children.length ? <div key={key}>{children}</div> : null
  }
}

// a published post's body. shares the `.rte-content` typography with the dashboard editor
export function PostBody({ body }: { body: Json }) {
  const doc = body as DocNode | null
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || doc.type !== 'doc') return null
  return <div className='rte-content'>{renderNodes(doc.content, 'n')}</div>
}
