/*
  dashboard navigation, in sidebar order. `ready` hides links to screens that are not built yet,
  so the menu only ever offers what works (plan: one or two features per step).
*/
export type AdminNavItem = { href: string; label: string; ready: boolean }
export type AdminNavGroup = { label: string; items: AdminNavItem[] }

export const adminNav: AdminNavGroup[] = [
  {
    label: 'Membership',
    items: [
      { href: '/admin/applications', label: 'Applications', ready: true },
      { href: '/admin/waitlist', label: 'Waiting list', ready: true },
    ],
  },
  {
    label: 'Inbox',
    items: [{ href: '/admin/enquiries', label: 'Enquiries', ready: true }],
  },
  {
    label: 'Website',
    items: [
      { href: '/admin/blog', label: 'Blog', ready: true },
      { href: '/admin/leadership', label: 'Leadership', ready: true },
      { href: '/admin/partners', label: 'Partners', ready: true },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/settings/applications', label: 'Applications window', ready: true },
      { href: '/admin/settings/banner', label: 'Announcement banner', ready: true },
      { href: '/admin/settings/admins', label: 'Admins', ready: true },
    ],
  },
]

export const readyAdminNav = adminNav
  .map((group) => ({ ...group, items: group.items.filter((item) => item.ready) }))
  .filter((group) => group.items.length > 0)

// where /admin lands: the first screen that exists
export const adminHome = readyAdminNav[0]?.items[0]?.href ?? '/admin/account'
