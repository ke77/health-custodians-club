import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import type { Json, Tables } from '@/lib/supabase/types'
import type { Settings, SocialLink, SocialPlatform } from '@/lib/types/content'

export const settingsTag = 'settings'

const socialPlatforms: SocialPlatform[] = ['instagram', 'facebook', 'linkedin', 'x']

function asStringArray(value: Json): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function asSocials(value: Json): SocialLink[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return []
    const platform = (item as Record<string, unknown>).platform
    const href = (item as Record<string, unknown>).href
    if (typeof platform !== 'string' || typeof href !== 'string') return []
    if (!socialPlatforms.includes(platform as SocialPlatform)) return []
    return [{ platform: platform as SocialPlatform, href }]
  })
}

// the one place that turns a settings row into the typed shape the app uses
export function toSettings(row: Tables<'settings'>): Settings {
  return {
    applicationsOpen: row.applications_open,
    applicationDeadline: row.application_deadline,
    currentCohort: row.current_cohort,
    contactEmail: row.contact_email,
    phones: asStringArray(row.phones),
    whatsapp: asStringArray(row.whatsapp),
    socials: asSocials(row.socials),
    bannerText: row.banner_text,
    bannerLink: row.banner_link,
    bannerOn: row.banner_on,
  }
}

// public, cached read for the site (footer, contact, banner, closed state). invalidated by updateTag(settingsTag)
export async function getSettings(): Promise<Settings> {
  'use cache'
  cacheTag(settingsTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
  if (!data) {
    // settings row is created by the migration; this is only a safety net
    return {
      applicationsOpen: false,
      applicationDeadline: null,
      currentCohort: '',
      contactEmail: null,
      phones: [],
      whatsapp: [],
      socials: [],
      bannerText: null,
      bannerLink: null,
      bannerOn: false,
    }
  }
  return toSettings(data)
}

// true when applications are open and the deadline (if any) has not passed
export function windowOpen(settings: Pick<Settings, 'applicationsOpen' | 'applicationDeadline'>) {
  if (!settings.applicationsOpen) return false
  if (settings.applicationDeadline && new Date(settings.applicationDeadline).getTime() <= Date.now()) return false
  return true
}

// fresh read for the dashboard settings form (no cache)
export async function getAdminSettings(): Promise<Settings> {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
  return data ? toSettings(data) : await getSettings()
}
