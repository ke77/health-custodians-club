-- core schema for Phase 1: admins, settings, applications, waiting list, enquiries, rate limiting.
-- docs/05-data-model.md. RLS is on for every table; public forms write through the service-role key only.

-- enums ------------------------------------------------------------------------------------------

create type public.application_status as enum (
  'submitted', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected', 'waitlisted'
);

create type public.region as enum (
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra', 'North East',
  'Northern', 'Oti', 'Savannah', 'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
);

create type public.programme as enum (
  'Medicine', 'Nursing', 'Midwifery', 'Pharmacy', 'Physician Assistantship', 'Medical Laboratory Science',
  'Public Health', 'Nutrition and Dietetics', 'Physiotherapy', 'Radiography and Medical Imaging', 'Dentistry',
  'Optometry', 'Biomedical Science', 'Clinical Psychology', 'Other health-related'
);

create type public.gender as enum ('male', 'female', 'prefer_not_to_say');

create type public.inquiry_interest as enum ('adviser', 'partner', 'professional', 'alumni', 'member', 'other');

create type public.inquiry_status as enum ('new', 'handled');

-- helpers ----------------------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admins -----------------------------------------------------------------------------------------

create table public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text,
  user_id uuid references auth.users (id) on delete set null,
  added_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admins_updated_at before update on public.admins
  for each row execute function public.set_updated_at();

-- true when the signed-in user's email is on the admins list. security definer so policies can call it
-- without the caller needing read access to admins.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- settings (single row) --------------------------------------------------------------------------

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  applications_open boolean not null default false,
  application_deadline timestamptz,
  current_cohort text not null default '2026/27',
  contact_email text,
  phones jsonb not null default '[]' check (jsonb_typeof(phones) = 'array'),
  whatsapp jsonb not null default '[]' check (jsonb_typeof(whatsapp) = 'array'),
  socials jsonb not null default '[]' check (jsonb_typeof(socials) = 'array'),
  banner_text text,
  banner_link text,
  banner_on boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- the one row exists from the start, so the app only ever updates it
insert into public.settings (id) values (1);

-- reference numbers ------------------------------------------------------------------------------

create table public.reference_counters (
  year int primary key,
  last_number int not null default 0
);

-- HCC-YYYY-XXXX in one atomic statement, so two simultaneous applications never share a number
create function public.next_reference(p_year int)
returns text
language sql
security definer
set search_path = ''
as $$
  insert into public.reference_counters (year, last_number)
  values (p_year, 1)
  on conflict (year) do update set last_number = public.reference_counters.last_number + 1
  returning 'HCC-' || p_year || '-' || lpad(last_number::text, 4, '0');
$$;

revoke execute on function public.next_reference(int) from public, anon, authenticated;
grant execute on function public.next_reference(int) to service_role;

-- applications -----------------------------------------------------------------------------------

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique
    default public.next_reference(extract(year from (now() at time zone 'Africa/Accra'))::int),
  cohort text not null,
  status public.application_status not null default 'submitted',
  status_changed_at timestamptz,
  status_changed_by text,

  -- step 1: personal
  full_name text not null,
  email text not null check (email = lower(email)),
  phone text not null,
  whatsapp text not null,
  gender public.gender,
  date_of_birth date not null,

  -- step 2: academic
  level smallint not null check (level >= 200 and level <= 600),
  institution text not null,
  institution_other text,
  programme public.programme not null,
  programme_other text,
  student_id text not null,
  cgpa numeric(3, 2) check (cgpa >= 2.80 and cgpa <= 4.00),
  cwa numeric(5, 2) check (cwa >= 10 and cwa <= 100),

  -- step 3: location and languages
  home_region public.region not null,
  current_region public.region not null,
  languages jsonb not null check (jsonb_typeof(languages) = 'array'),
  language_other text,

  -- step 4: interests and commitment
  interests text[] not null default '{}',
  leadership_interest text check (leadership_interest in ('none', 'executive', 'regional_head')),
  hours_per_month smallint not null,
  committed boolean not null,

  -- step 5: skills
  skills text[] not null default '{}',

  -- step 6: short answers (word counts are validated in the app, not here)
  answer_motivation text not null,
  answer_health_gap text not null,
  answer_skills text not null,
  answer_balance text not null,

  -- step 7: review
  heard_about text not null,
  heard_about_other text,
  consent_at timestamptz not null,

  -- admin only
  notes text,
  ip_hash text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint applications_one_grade check ((cgpa is null) <> (cwa is null))
);

create unique index applications_cohort_email_key on public.applications (cohort, lower(email));
create index applications_status_idx on public.applications (status);
create index applications_cohort_idx on public.applications (cohort);
create index applications_created_at_idx on public.applications (created_at desc);

create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

create function public.stamp_status_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    new.status_changed_at = now();
  end if;
  return new;
end;
$$;

create trigger applications_status_change before update of status on public.applications
  for each row execute function public.stamp_status_change();

-- waiting list -----------------------------------------------------------------------------------

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email)),
  cohort text not null,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index waitlist_cohort_email_key on public.waitlist (cohort, lower(email));

create trigger waitlist_updated_at before update on public.waitlist
  for each row execute function public.set_updated_at();

-- enquiries (contact form) -----------------------------------------------------------------------

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  interest public.inquiry_interest not null,
  message text not null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_status_idx on public.inquiries (status, created_at desc);

create trigger inquiries_updated_at before update on public.inquiries
  for each row execute function public.set_updated_at();

-- rate limiting ----------------------------------------------------------------------------------

create table public.rate_limit_events (
  id bigint generated always as identity primary key,
  key text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx on public.rate_limit_events (key, action, created_at);

-- row level security -----------------------------------------------------------------------------
-- no anon policies except reading settings. reference_counters and rate_limit_events have no policies
-- at all: only the service role (server-only) touches them.

alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.reference_counters enable row level security;
alter table public.applications enable row level security;
alter table public.waitlist enable row level security;
alter table public.inquiries enable row level security;
alter table public.rate_limit_events enable row level security;

create policy "admins read admins" on public.admins
  for select to authenticated using ((select public.is_admin()));
create policy "admins add admins" on public.admins
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update admins" on public.admins
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins remove admins" on public.admins
  for delete to authenticated using ((select public.is_admin()));

create policy "anyone reads settings" on public.settings
  for select to anon, authenticated using (true);
create policy "admins update settings" on public.settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins read applications" on public.applications
  for select to authenticated using ((select public.is_admin()));
create policy "admins update applications" on public.applications
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete applications" on public.applications
  for delete to authenticated using ((select public.is_admin()));

create policy "admins read waitlist" on public.waitlist
  for select to authenticated using ((select public.is_admin()));
create policy "admins update waitlist" on public.waitlist
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete waitlist" on public.waitlist
  for delete to authenticated using ((select public.is_admin()));

create policy "admins read inquiries" on public.inquiries
  for select to authenticated using ((select public.is_admin()));
create policy "admins update inquiries" on public.inquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete inquiries" on public.inquiries
  for delete to authenticated using ((select public.is_admin()));
