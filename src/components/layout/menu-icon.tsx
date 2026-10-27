// the three-line hamburger, shared by the site's navbar and the dashboard header.
// the two shorter lines stretch on hover (the parent button or the icon itself)
export function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 items-end justify-center group cursor-pointer ${className}`}>
      <span className='h-0.5 bg-ink/70 rounded-full w-6 transition-all duration-300'></span>
      <span className='h-0.5 bg-ink/60 rounded-full w-4 transition-all duration-300 group-hover:w-5'></span>
      <span className='h-0.5 bg-ink/60 rounded-full w-2.5 transition-all duration-300 group-hover:w-6'></span>
    </div>
  )
}
