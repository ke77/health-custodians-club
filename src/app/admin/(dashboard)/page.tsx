import { redirect } from 'next/navigation'
import { adminHome } from '@/lib/config/admin-nav'

// no overview page: /admin opens the first screen
export default function AdminIndex() {
  redirect(adminHome)
}
