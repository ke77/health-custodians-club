// shared motion tokens (docs/03-design-system.md, Motion). change timing here, not in components

// a soft ease-out: quick start, long settle
export const easeOut = [0.22, 1, 0.36, 1] as const

// scroll-in reveal for section content
export const reveal = {
  distance: 16,
  duration: 0.6,
  stagger: 0.06,
  // starts the reveal once the element is 10% into the viewport
  margin: '0px 0px -10% 0px',
} as const

// full-screen mobile menu
export const menu = {
  duration: 0.4,
  linkDistance: 12,
  stagger: 0.04,
} as const

// accordion: answer height and the plus-to-cross turn
export const accordion = {
  duration: 0.3,
} as const

// scroll-to-top button: shows after one viewport of scrolling
export const scrollTop = {
  duration: 0.2,
  distance: 8,
} as const
