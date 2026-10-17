import { cn } from '@/lib/utils/cn'

type Option = { value: string; label: string }

type Props = {
  name: string
  legend: string
  options: Option[]
  defaultValue?: string
}

export function RadioGroup({ name, legend, options, defaultValue }: Props) {
  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='font-mono text-label uppercase text-ink'>{legend}</legend>
      <div className='mt-1 flex flex-col gap-1'>
        {options.map((o) => {
          const id = `${name}-${o.value}`
          return (
            <label
              key={o.value}
              htmlFor={id}
              className='flex min-h-11 cursor-pointer items-center gap-3'
            >
              <input
                id={id}
                type='radio'
                name={name}
                value={o.value}
                defaultChecked={defaultValue === o.value}
                className={cn(
                  'size-5 shrink-0 border border-ink bg-sand accent-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
                )}
              />
              <span className='font-body text-body text-ink'>{o.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
