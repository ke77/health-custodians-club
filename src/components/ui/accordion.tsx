import { ChevronDown } from 'lucide-react'

type Item = {
  question: string
  answer: string
}

type Props = {
  items: Item[]
}

// accessible accordion built on native <details>/<summary>: keyboard-operable with no client js.
export function Accordion({ items }: Props) {
  return (
    <div className='border-t border-rule'>
      {items.map((item) => (
        <details key={item.question} className='group border-b border-rule'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-h3 text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'>
            {item.question}
            <ChevronDown
              className='size-5 shrink-0 text-teal transition-transform group-open:rotate-180'
              aria-hidden
            />
          </summary>
          <p className='max-w-[var(--container-prose)] pb-6 font-body text-body text-muted'>
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
