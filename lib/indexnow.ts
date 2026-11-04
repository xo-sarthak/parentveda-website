/* ============================================================
   IndexNow: tells Bing (which feeds ChatGPT and Copilot) a page changed, rather
   than waiting for a crawl. The key is public by design, it proves we own the
   host; it lives in INDEXNOW_KEY and is served at /<key>.txt (next.config.ts).

   Every failure is logged and swallowed. A ping that fails must never get in the
   way of a publish: the sitemap catches the page later anyway.
   ============================================================ */

import { categoryPath, postPath, GUIDES_BASE, UNLISTED_TAG } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

const ENDPOINT = "https://api.indexnow.org/indexnow";

/** How far back a publish webhook looks for what changed. Longer than a slow save; repeats are harmless. */
const RECENT_MINUTES = 15;

export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.log("[indexnow] skipped: INDEXNOW_KEY is not set");
    return;
  }
  if (!urls.length) {
    console.log("[indexnow] nothing changed recently");
    return;
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
    });
    console.log(`[indexnow] ${res.status} for ${urls.length} URLs: ${urls.join(" ")}`);
  } catch (err) {
    console.error("[indexnow] failed:", err);
  }
}

type ChangedRow = { category: string; slug: string; canonical_path: string | null; tags: string[] | null };

/* Reads Supabase directly, uncached. The site's own client goes through the data
   cache, which could return the list from before this very publish. It asks what
   changed rather than trusting the webhook's body, which names no public URLs. */
export async function recentlyChangedUrls(now = Date.now()): Promise<string[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !anon) return [];
  const since = new Date(now - RECENT_MINUTES * 60_000).toISOString();
  const query = `select=category,slug,canonical_path,tags&status=eq.published&or=(updated_at.gte.${since},published_at.gte.${since})`;
  try {
    const res = await fetch(`${base}/rest/v1/content_posts?${query}`, {
      cache: "no-store",
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    });
    if (!res.ok) throw new Error(`Supabase said ${res.status}`);
    const rows = ((await res.json()) as ChangedRow[]).filter((r) => !(r.tags ?? []).includes(UNLISTED_TAG));
    if (!rows.length) return [];
    // A new article also changes the listings that show it.
    const paths = [
      ...rows.map((r) => r.canonical_path ?? postPath(r.category, r.slug)),
      ...new Set(rows.map((r) => categoryPath(r.category))),
      GUIDES_BASE,
    ];
    return paths.map((p) => `${SITE_URL}${p}/`);
  } catch (err) {
    console.error("[indexnow] could not read recent changes:", err);
    return [];
  }
}
