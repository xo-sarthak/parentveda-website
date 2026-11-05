-- =====================================================================
-- seo_author_fields.sql: separate who WROTE an article from who REVIEWED it.
--
-- Run STEP 1 in the Supabase SQL editor. It changes nothing readers see
-- on the current site and can run before or after the code deploys.
-- Run STEP 2 only AFTER the new code is live: the old code finds the
-- reviewer by matching the plain `author` text.
--
-- This file also belongs in the app repo's supabase/migrations, which is
-- where the content schema is kept (0020, 0053).
--
-- `updated_at` feeds the sitemap's lastmod and the article's dateModified,
-- so a bulk edit must not move it. Each step snapshots it, then aborts and
-- rolls back if any value changed.
-- =====================================================================

-- ---- STEP 1 ----------------------------------------------------------
begin;

create temp table _updated_before on commit drop as
  select id, updated_at from public.content_posts;

alter table public.content_posts
  add column if not exists reviewed_by text,   -- slug in the site's lib/authors.ts (kind: expert)
  add column if not exists reviewed_at date;   -- when that expert reviewed it, when known

comment on column public.content_posts.reviewed_by is
  'Slug of the expert who actually reviewed this piece. Leave empty until one has.';

-- author_slug has a foreign key to content_authors, so the writer needs a row.
insert into public.content_authors (slug, name, role, short_bio, photo, sort)
values (
  'sarthak-thakur',
  'Sarthak Thakur',
  'Co-Founder, CTO & Chief Marketing Officer, ParentVeda',
  'Co-founder, CTO and Chief Marketing Officer of ParentVeda, and the software engineer who builds its app and the pipeline that checks its articles.',
  '/authors/sarthak-thakur.jpg',
  1
) on conflict (slug) do nothing;

-- Order matters: read the current expert credit before overwriting it.
update public.content_posts
   set reviewed_by = author_slug
 where author_slug = 'dr-mahender-singh'
   and reviewed_by is null;

update public.content_posts
   set author_slug = 'sarthak-thakur'
 where author_slug is distinct from 'sarthak-thakur';

alter table public.content_posts
  alter column author_slug set default 'sarthak-thakur';

do $$
begin
  if exists (
    select 1 from public.content_posts p
      join _updated_before b using (id)
     where p.updated_at is distinct from b.updated_at
  ) then
    raise exception 'updated_at moved: a trigger touched it. Nothing was saved.';
  end if;
end $$;

commit;

-- Expect: sarthak-thakur | dr-mahender-singh | 47, and sarthak-thakur | null | 14.
select author_slug, reviewed_by, count(*)
  from public.content_posts
 where status = 'published'
 group by 1, 2;


-- ---- STEP 2: ONLY AFTER THE NEW CODE IS LIVE -------------------------
-- Uncomment and run. Keeps the plain text column honest for Directus editors.
--
-- begin;
-- create temp table _updated_before on commit drop as
--   select id, updated_at from public.content_posts;
-- update public.content_posts set author = 'Sarthak Thakur'
--  where author is distinct from 'Sarthak Thakur';
-- do $$
-- begin
--   if exists (
--     select 1 from public.content_posts p
--       join _updated_before b using (id)
--      where p.updated_at is distinct from b.updated_at
--   ) then
--     raise exception 'updated_at moved: a trigger touched it. Nothing was saved.';
--   end if;
-- end $$;
-- commit;
