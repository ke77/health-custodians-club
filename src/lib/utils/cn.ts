// join truthy class names. tiny helper so components can compose conditional classes.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
