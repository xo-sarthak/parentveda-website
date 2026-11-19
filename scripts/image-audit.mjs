/* Image audit for Reads (a report only; it changes nothing).

   Runs the same guard /api/release runs before each release
   (lib/image-guard.ts) over every published and scheduled article, so a mix-up
   is found the day it is queued, not the morning it goes live.

   BLOCKED: the cover is also an in-article image, or the cover's alt text
   describes an infographic or diagram. /api/release will hold these.
   NOTE: no cover, no image inside the article, or a portrait cover (the
   header crops it). Often deliberate; check the publishing log before chasing.

   Run: npm run audit:images   (needs SUPABASE_SERVICE_ROLE_KEY in .env.local
   to see scheduled rows). Exits 1 when anything is blocked. */

import { fetchPosts } from "./lib/content.mjs";

const { checkImages } = await import("../lib/image-guard.ts");

const posts = await fetchPosts({
  columns: "slug,title,category,status,published_at,body,og_image,og_image_file,og_image_alt,tags",
  drafts: true,
});

const live = posts.filter((p) => p.status === "published" || p.status === "scheduled");

/* A portrait cover is not wrong, but the article header (.rhero img: full
   width, at most 560px tall, object-fit: cover) shows only its middle band.
   On 19 Nov the jaundice cover lost its comparison circle that way. Directus
   keeps the size in directus_files, which the service role cannot read, so the
   size is taken from the first bytes of the image itself (JPEG or PNG header). */
function imageSize(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  for (let i = 2; i + 9 < buf.length; ) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

async function coverSize(p) {
  const src = p.og_image || "";
  const url = src.startsWith("/") ? `https://parentveda.in${src}` : src;
  if (!/^https:\/\//.test(url)) return null;
  try {
    const res = await fetch(url, { headers: { Range: "bytes=0-65535" } });
    if (!res.ok) return null;
    return imageSize(Buffer.from(await res.arrayBuffer()));
  } catch {
    return null;
  }
}
let blocked = 0;
const lines = [];
for (const p of live.sort((a, b) => String(a.published_at).localeCompare(String(b.published_at)))) {
  const { blocking, notes } = checkImages(p);
  const size = p.og_image ? await coverSize(p) : null;
  if (size && size.h >= size.w) notes.push(`cover is portrait (${size.w}x${size.h}); the header crops it to its middle band`);
  if (!blocking.length && !notes.length) continue;
  if (blocking.length) blocked++;
  const day = String(p.published_at ?? "").slice(0, 10);
  const tag = blocking.length ? "BLOCKED" : "note   ";
  lines.push(`${tag}  ${p.status.padEnd(9)} ${day}  ${p.slug}: ${[...blocking, ...notes].join("; ")}`);
}

console.log(lines.join("\n") || "Nothing to report.");
console.log(`\n${live.length} published or scheduled articles, ${blocked} blocked.`);
process.exitCode = blocked ? 1 : 0;
