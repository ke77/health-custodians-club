import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { exportWaitlist } from '@/lib/data/admin/waitlist'
import { formatDateTime } from '@/lib/utils/format'

function cell(value: string) {
  let text = value ?? ''
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  await requireAdmin()
  const cohort = request.nextUrl.searchParams.get('cohort') ?? ''
  const rows = await exportWaitlist(cohort)

  const lines = [
    ['Email', 'Joined', 'Notified'].map(cell).join(','),
    ...rows.map((r) =>
      [r.email, formatDateTime(r.created_at), r.notified_at ? formatDateTime(r.notified_at) : ''].map(cell).join(','),
    ),
  ]
  const body = `﻿${lines.join('\r\n')}\r\n`
  const safe = cohort.replace(/[^\w-]+/g, '-') || 'all'

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="hcc-waitlist-${safe}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
