@AGENTS.md

# ParentVeda website: what every session should know

## Repos and systems
- This repo (`C:\parentveda-website`, GitHub `xo-sarthak/parentveda-website`) is the live website. Merging to `main` deploys `parentveda.in` through the Vercel project `parentveda-website`.
- `C:\parentveda-web` is the old website repo. It is not active.
- `C:\Projects\parentveda` is the app repo. Do not commit or push there. `C:\parent-veda-fork` is out of date.
- If a task touches another repo or location you aren't sure of, ask. Do not guess.
- Commit, push and merge only when the user says so.

## Content
- Articles live in Supabase, edited through Directus (`parentveda-cms.onrender.com`). The website and the app share that database. Article text is not in this repo.
- Do not change article wording unless asked. Do not change live URLs. New copy follows `VOICE.md`.
- `updated_at` drives the sitemap `lastmod` and `dateModified`. Bulk SQL must not move it; see the guard in `supabase/seo_author_fields.sql`.
- Website SQL is kept in `supabase/` in this repo. Numbered schema migrations are kept in the app repo.

## Writers and reviewers
- `author_slug` is the writer and `reviewed_by` is the medical reviewer. Both are slugs of people in `lib/authors.ts`.
- `lib/authors.ts` is what the site displays for people. The `content_authors` table exists for the foreign key, so editing a bio there does not change the site.
- A review credit makes a medical claim to readers. Never add one unless that expert really reviewed the article, and never invent a review date. Unreviewed articles show no reviewer. `reviewed_at` is empty today, so "Last reviewed" falls back to the updated or published date.

## Publishing and settings
- On save, the Directus Flow "Publish → website" posts to `https://parentveda.in/api/revalidate/`, with the trailing slash and an `x-revalidate-secret` header matching `REVALIDATE_SECRET` in Vercel. That clears the content cache and pings IndexNow for recently changed posts.
- Never print `REVALIDATE_SECRET` or the Supabase service role key. `INDEXNOW_KEY` is public by design.
- Optional features stay off until their variable is set: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4 and the consent banner), `AMAZON_ASSOCIATE_TAG`, `PINTEREST_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`. See `.env.example`. `NEXT_PUBLIC_` and verification values need a redeploy.
- Google's script must load only after a visitor accepts the consent banner.

## Checking your work
- Run `npm run typecheck` and `npm run build`. A local build can reuse cached content, so if a count looks stale, build again before trusting it.
- Headless Chrome will not render narrower than 500px. To check phone layouts, load the page inside a 390px iframe.
