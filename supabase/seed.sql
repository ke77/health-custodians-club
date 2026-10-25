-- starter content for a local database (`supabase db reset`). the hosted project gets its settings row
-- from the core migration; content tables are seeded by their own migrations as they arrive.
insert into public.settings (id) values (1) on conflict (id) do nothing;
