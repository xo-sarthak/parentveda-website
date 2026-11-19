/* Image audit for Reads (a report only; it changes nothing).

   Runs the same guard /api/release runs before each release
   (lib/image-guard.ts) over every published and scheduled article, so a mix-up
   is found the day it is queued, not the morning it goes live.

   BLOCKED: the cover is also an in-article image, or the cover's alt text
   describes an infographic or diagram. /api/release will hold these.
   NOTE: no cover, or no image inside the article. Often deliberate; check the
   publishing log before chasing.

   Run: npm run audit:images   (needs SUPABASE_SERVICE_ROLE_KEY in .env.local
   to see scheduled rows). Exits 1 when anything is blocked. */

import { fetchPosts } from "./lib/content.mjs";

const { checkImages } = await import("../lib/image-guard.ts");

const posts = await fetchPosts({
  columns: "slug,title,category,status,published_at,body,og_image,og_image_file,og_image_alt,tags",
  drafts: true,
});

const live = posts.filter((p) => p.status === "published" || p.status === "scheduled");
let blocked = 0;
const lines = [];
for (const p of live.sort((a, b) => String(a.published_at).localeCompare(String(b.published_at)))) {
  const { blocking, notes } = checkImages(p);
  if (!blocking.length && !notes.length) continue;
  if (blocking.length) blocked++;
  const day = String(p.published_at ?? "").slice(0, 10);
  const tag = blocking.length ? "BLOCKED" : "note   ";
  lines.push(`${tag}  ${p.status.padEnd(9)} ${day}  ${p.slug}: ${[...blocking, ...notes].join("; ")}`);
}

console.log(lines.join("\n") || "Nothing to report.");
console.log(`\n${live.length} published or scheduled articles, ${blocked} blocked.`);
process.exitCode = blocked ? 1 : 0;
