import type { NextRequest } from 'next/server'
import {
  genderOf,
  heardAboutOf,
  hoursOf,
  institutionOf,
  languagesOf,
  leadershipOf,
  programmeOf,
} from '@/lib/admin/application-display'
import { requireAdmin } from '@/lib/auth/admin'
import { statusLabel } from '@/lib/config/application-status'
import { exportApplications } from '@/lib/data/admin/applications'
import type { ApplicationRow } from '@/lib/data/admin/applications'
import { formatDateTime } from '@/lib/utils/format'
import { parseFilters } from '@/lib/validation/admin/application-filters'

const columns: [string, (a: ApplicationRow) => string | number | null][] = [
  ['Reference', (a) => a.reference],
  ['Cohort', (a) => a.cohort],
  ['Status', (a) => statusLabel(a.status)],
  ['Submitted', (a) => formatDateTime(a.created_at)],
  ['Full name', (a) => a.full_name],
  ['Email', (a) => a.email],
  ['Phone', (a) => a.phone],
  ['WhatsApp', (a) => a.whatsapp],
  ['Gender', (a) => genderOf(a)],
  ['Date of birth', (a) => a.date_of_birth],
  ['Level', (a) => a.level],
  ['Institution', (a) => institutionOf(a)],
  ['Programme', (a) => programmeOf(a)],
  ['Student ID', (a) => a.student_id],
  ['CGPA', (a) => (a.cgpa === null ? '' : Number(a.cgpa).toFixed(2))],
  ['CWA', (a) => (a.cwa === null ? '' : Number(a.cwa))],
  ['Home region', (a) => a.home_region],
  ['Current region', (a) => a.current_region],
  ['Languages', (a) => languagesOf(a)],
  ['Areas of interest', (a) => a.interests.join('; ')],
  ['Leadership interest', (a) => leadershipOf(a)],
  ['Time per month', (a) => hoursOf(a)],
  ['Committed', (a) => (a.committed ? 'Yes' : 'No')],
  ['Skills', (a) => a.skills.join('; ')],
  ['Why HCC', (a) => a.answer_motivation],
  ['A health gap', (a) => a.answer_health_gap],
  ['Skills and experience', (a) => a.answer_skills],
  ['Balancing commitments', (a) => a.answer_balance],
  ['Heard about us', (a) => heardAboutOf(a)],
  ['Consent given', (a) => formatDateTime(a.consent_at)],
  ['Status changed', (a) => (a.status_changed_at ? formatDateTime(a.status_changed_at) : '')],
  ['Status changed by', (a) => a.status_changed_by],
  ['Private notes', (a) => a.notes],
]

// quotes every cell, and defuses values a spreadsheet would run as a formula (=, +, -, @)
function cell(value: string | number | null) {
  let text = value === null ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  await requireAdmin()
  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams))
  const { rows, cohort } = await exportApplications(filters)

  const lines = [
    columns.map(([header]) => cell(header)).join(','),
    ...rows.map((a) => columns.map(([, get]) => cell(get(a))).join(',')),
  ]
  // the byte order mark makes Excel read the file as UTF-8, so names with accents survive
  const body = `﻿${lines.join('\r\n')}\r\n`

  const today = new Date().toISOString().slice(0, 10)
  const name = `hcc-applications-${(cohort ?? 'all-cohorts').replace(/[^\w-]+/g, '-')}-${today}.csv`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`,
      // personal data: never stored by a browser or proxy cache
      'Cache-Control': 'private, no-store',
    },
  })
}
