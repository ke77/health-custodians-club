-- content tables edited from the dashboard (Phase 2 of docs/06-build-plan.md): people, regions, faqs, partners,
-- posts, and a public media bucket. public pages read published rows; admins manage everything.

-- enums ------------------------------------------------------------------------------------------

create type public.person_type as enum ('executive', 'adviser');
create type public.faq_category as enum ('membership', 'club');
create type public.post_kind as enum ('announcement', 'training', 'outreach', 'event');
create type public.post_status as enum ('draft', 'published');

-- people: executives and board of advisers --------------------------------------------------------

create table public.people (
  id uuid primary key default gen_random_uuid(),
  type public.person_type not null,
  name text not null,
  role text not null,
  photo_path text,
  bio text,
  socials jsonb not null default '[]' check (jsonb_typeof(socials) = 'array'),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index people_type_order_idx on public.people (type, sort_order);

create trigger people_updated_at before update on public.people
  for each row execute function public.set_updated_at();

-- regions: one row per region, drives the About map and the regional head ------------------------

create table public.regions (
  region public.region primary key,
  active boolean not null default true,
  head_name text,
  head_institution text,
  head_photo_path text,
  head_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger regions_updated_at before update on public.regions
  for each row execute function public.set_updated_at();

-- every region exists from the start, all active (matches the current lib/config/regions.ts)
insert into public.regions (region, active)
select unnest(enum_range(null::public.region)), true;

-- faqs -------------------------------------------------------------------------------------------

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category public.faq_category not null default 'membership',
  on_homepage boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_category_order_idx on public.faqs (category, sort_order);

create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- partners ---------------------------------------------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text,
  url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_order_idx on public.partners (sort_order);

create trigger partners_updated_at before update on public.partners
  for each row execute function public.set_updated_at();

-- posts (blog, with an optional photo gallery for outreach and events) ---------------------------

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body jsonb not null default '{}'::jsonb,
  cover_path text,
  cover_alt text,
  gallery jsonb not null default '[]' check (jsonb_typeof(gallery) = 'array'),
  kind public.post_kind not null default 'announcement',
  status public.post_status not null default 'draft',
  published_at timestamptz,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_status_published_idx on public.posts (status, published_at desc);

create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- row level security ------------------------------------------------------------------------------
-- anon reads published public content; admins do everything.

alter table public.people enable row level security;
alter table public.regions enable row level security;
alter table public.faqs enable row level security;
alter table public.partners enable row level security;
alter table public.posts enable row level security;

create policy "anyone reads published people" on public.people
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins write people" on public.people
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- region rows are not sensitive (region name, active flag, head name); the component hides an unpublished head
create policy "anyone reads regions" on public.regions
  for select to anon, authenticated using (true);
create policy "admins write regions" on public.regions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "anyone reads published faqs" on public.faqs
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins write faqs" on public.faqs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "anyone reads published partners" on public.partners
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins write partners" on public.partners
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "anyone reads published posts" on public.posts
  for select to anon, authenticated using (status = 'published' or (select public.is_admin()));
create policy "admins write posts" on public.posts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- storage: one public bucket for photos, logos and post images -----------------------------------

insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;

create policy "anyone reads media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));
