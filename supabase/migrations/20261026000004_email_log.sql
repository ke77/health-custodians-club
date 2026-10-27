-- a record of every status email the dashboard sends to an applicant: who, which template, whether it went.
-- it is how the dashboard knows an applicant has already been told, so nobody gets the same email twice.

create table public.email_log (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications (id) on delete set null,
  template text not null,
  to_email text not null,
  ok boolean not null,
  error text,
  sent_by text,
  sent_at timestamptz not null default now()
);

create index email_log_application_idx on public.email_log (application_id, template);

alter table public.email_log enable row level security;

-- admins read and write the log; nobody else can see who was emailed
create policy "admins read email log" on public.email_log
  for select to authenticated using ((select public.is_admin()));
create policy "admins add to email log" on public.email_log
  for insert to authenticated with check ((select public.is_admin()));
