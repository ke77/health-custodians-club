-- read-only launch check. paste into the Supabase SQL editor and run; every row should say OK.
-- changes nothing.

with checks as (
  -- 1. row level security is on for every table the site uses
  select 'RLS on: ' || c.relname as check_name,
         case when c.relrowsecurity then 'OK' else 'FAIL: run  alter table public.' || c.relname || ' enable row level security;' end as result
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('admins','settings','applications','waitlist','inquiries','rate_limit_events','reference_counters',
                      'people','regions','faqs','partners','posts')

  union all
  -- 2. the post kinds the editor offers exist in the enum
  select 'post_kind has ' || k,
         case when exists (
           select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
           where t.typname = 'post_kind' and e.enumlabel = k
         ) then 'OK' else 'FAIL: alter type public.post_kind add value ''' || k || ''';' end
  from unnest(array['announcement','training','outreach','event','news','article']) as k

  union all
  -- 3. the settings row and all 16 regions exist
  select 'settings row exists',
         case when exists (select 1 from public.settings where id = 1) then 'OK'
              else 'FAIL: insert into public.settings (id) values (1);' end
  union all
  select 'regions = 16 rows',
         case when (select count(*) from public.regions) = 16 then 'OK'
              else 'FAIL: found ' || (select count(*) from public.regions) end

  union all
  -- 4. there is at least one admin, and it is signed up in auth too
  select 'at least one admin',
         case when exists (select 1 from public.admins) then 'OK' else 'FAIL: nobody can sign in' end
  union all
  select 'admin emails exist in auth.users',
         case when not exists (
           select 1 from public.admins a
           where not exists (select 1 from auth.users u where lower(u.email) = lower(a.email))
         ) then 'OK' else 'WARN: an admin has no auth user yet (they sign in by code once they do)' end

  union all
  -- 5. the media bucket exists and is public, with admin-only write policies
  select 'media bucket is public',
         case when exists (select 1 from storage.buckets where id = 'media' and public) then 'OK'
              else 'FAIL: bucket missing or private' end
  union all
  select 'storage policy: ' || p,
         case when exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = p)
              then 'OK' else 'FAIL: missing' end
  from unnest(array['anyone reads media','admins upload media','admins update media','admins delete media']) as p

  union all
  -- 6. the admin check function exists
  select 'is_admin() exists',
         case when exists (select 1 from pg_proc where proname = 'is_admin') then 'OK' else 'FAIL' end

  union all
  -- 7. content is present (WARN, not FAIL: the pages show a tidy empty state without it)
  select 'published executives',
         case when exists (select 1 from public.people where type = 'executive' and published) then 'OK'
              else 'WARN: none, so About shows "Applications for executive roles open with membership"' end
  union all
  select 'published blog posts',
         case when exists (select 1 from public.posts where status = 'published') then 'OK'
              else 'INFO: none, so /blog shows Coming soon' end
  union all
  select 'test or untitled posts left behind',
         case when not exists (select 1 from public.posts where slug like 'test%' or slug like 'untitled-%' or title ilike 'untitled%')
              then 'OK' else 'WARN: delete leftover test/untitled posts before launch' end
)
select check_name, result from checks order by (result = 'OK'), check_name;
