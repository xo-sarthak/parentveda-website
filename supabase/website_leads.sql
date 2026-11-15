-- =====================================================================
-- website_leads.sql: "Talk to a specialist" requests and PDF download
-- requests from parentveda.in, stored in Supabase and worked in Directus.
--
-- Run once in the Supabase SQL editor. Safe to re-run. It adds one new
-- table and changes nothing else. Nothing on the site uses it until the
-- website sets LEADS_ENABLED=1 (see lib/lead-store.ts).
--
-- Who can do what:
--   anon, authenticated (the public keys)  nothing at all
--   service_role (the website's server)     insert only, via the API routes
--   directus_cms (the Directus login)       read every row; change only
--                                           status, assigned_to, team_notes
-- Rows hold names and phone numbers people gave with consent (DPDP Act).
-- Nobody deletes through Directus; the owner deletes in SQL when a person
-- asks for their data to be removed.
--
-- This file also belongs in the app repo's supabase/migrations, next to
-- 0045_cms_role_and_grants.sql, which this follows.
-- =====================================================================

begin;

create table if not exists public.website_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  ref           text not null check (ref ~ '^[a-f0-9]{8}$'),
  kind          text not null check (kind in ('consult_request', 'download_lead', 'download_whatsapp_request')),
  name          text not null check (char_length(name) between 1 and 80),
  phone         text check (phone ~ '^\+91[6-9][0-9]{9}$'),
  email         text check (email is null or char_length(email) <= 120),
  specialty     text,              -- consult key in the site's content/consults.json
  price_inr     integer,           -- the price shown when they asked, if any
  best_time     text,              -- morning / afternoon / evening
  note          text check (note is null or char_length(note) <= 300),
  download      text,              -- slug in content/downloads.json
  condition     text,              -- slug of the condition page they came from
  page          text,              -- path only, never a query string
  consent       boolean not null check (consent),
  consent_text  text not null,
  -- The team's side, edited in Directus:
  status        text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed', 'spam')),
  assigned_to   text,
  team_notes    text,
  updated_at    timestamptz not null default now(),
  check (phone is not null or email is not null)
);

comment on table public.website_leads is
  'Consult and download requests from parentveda.in. Personal data given with consent; see /legal/privacy.';

create index if not exists website_leads_status_created on public.website_leads (status, created_at desc);
create index if not exists website_leads_ref on public.website_leads (ref);

-- Keep updated_at honest when the team changes a row.
create or replace function public.website_leads_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists website_leads_touch on public.website_leads;
create trigger website_leads_touch before update on public.website_leads
  for each row execute function public.website_leads_touch();

-- Sealed by default: RLS on, and no policy for the public roles.
alter table public.website_leads enable row level security;
revoke all on public.website_leads from anon, authenticated;
grant insert on public.website_leads to service_role;

-- Directus. Guarded, so this file also runs before the directus_cms role exists.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'directus_cms') then
    grant select on public.website_leads to directus_cms;
    grant update (status, assigned_to, team_notes) on public.website_leads to directus_cms;
    drop policy if exists website_leads_cms_read on public.website_leads;
    create policy website_leads_cms_read on public.website_leads
      for select to directus_cms using (true);
    drop policy if exists website_leads_cms_update on public.website_leads;
    create policy website_leads_cms_update on public.website_leads
      for update to directus_cms using (true) with check (true);
  else
    raise notice 'directus_cms role not found: Directus will reach website_leads only through its current login.';
  end if;
end $$;

commit;

-- ---- CHECKS (run after) ---------------------------------------------
-- Public keys see nothing (expect false, false):
--   select has_table_privilege('anon', 'public.website_leads', 'select'),
--          has_table_privilege('authenticated', 'public.website_leads', 'select');
-- Directus can read but not delete (expect true, false):
--   select has_table_privilege('directus_cms', 'public.website_leads', 'select'),
--          has_table_privilege('directus_cms', 'public.website_leads', 'delete');
--
-- ---- IN DIRECTUS (once) ---------------------------------------------
-- Settings -> Data Model: website_leads appears as a table Directus does
-- not manage yet; click it to start managing it. Then, under
-- Settings -> Access Policies, give the team's role read on every field
-- and update on status, assigned_to and team_notes only. Set the layout
-- to sort by created_at, newest first, with a filter on status = new.
