/* Shared by the npm report scripts. These run outside Next, so they read Supabase
   directly with the same public anon key the site uses, which only sees published
   rows. `--drafts` uses the service-role key to include unpublished ones. */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

export async function fetchPosts({ columns = "*", drafts = false } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = drafts ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(`Missing Supabase settings in .env.local (${drafts ? "SUPABASE_SERVICE_ROLE_KEY" : "NEXT_PUBLIC_SUPABASE_ANON_KEY"}).`);
  }
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${url}/rest/v1/content_posts?select=${columns}&order=published_at.desc&limit=1000&offset=${offset}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase said ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  // Unlisted posts are review links, hidden everywhere except their own URL.
  return rows.filter((r) => r.slug && r.title && r.category && (drafts || !(r.tags ?? []).includes("unlisted")));
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function writeCsv(relativePath, header, rows) {
  const file = path.resolve(relativePath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  return file;
}

/** Every link in some Markdown: [text](url "title"), and bare https:// autolinks. Images are skipped. */
export function markdownLinks(md) {
  const links = [];
  const withoutImages = md.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  const remainder = withoutImages.replace(/\[((?:[^\][]|\[[^\]]*\])*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g, (_, text, url) => {
    links.push({ text: text.replace(/[*_`]/g, "").trim(), url });
    return " ";
  });
  for (const m of remainder.matchAll(/https?:\/\/[^\s)\]"'<>]+/g)) links.push({ text: "", url: m[0].replace(/[.,;:!?]+$/, "") });
  return links;
}
