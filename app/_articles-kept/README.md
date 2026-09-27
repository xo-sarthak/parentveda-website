Kept for revert — the new site's own /articles section (2026-09-25), eight
reads converted from the app, stored in content/articles.

Reads (/reads, fed from Directus via Supabase) is the one articles section now,
so this route is parked: a folder starting with "_" is private in the Next.js
App Router and is never served. /articles redirects to /reads/articles/ in
next.config.ts. To bring it back, move `articles/` back under `app/` and remove
those two redirects.
