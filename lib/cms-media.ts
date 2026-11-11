/* ============================================================
   Images uploaded in Directus, served from parentveda.in.

   Directus stores uploads in a private Cloudflare R2 bucket. Its own links
   (parentveda-cms.onrender.com/assets/<id>) need a login and go through the
   Render server, which sleeps. So the site rewrites every such link to
   /cms-media/<id>/, a route on this site that reads the file from R2 with a
   read-only key and lets Vercel's CDN keep it (app/cms-media/[id]/route.ts).

   An editor can therefore put a Directus image anywhere the site shows one:
   the "Image for sharing" field (a file id or an /assets/ link), or an image
   inserted in the article text. Paths like /media/x.jpg, kept in this repo,
   pass through unchanged.
   ============================================================ */

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const BARE_ID = new RegExp(`^${UUID}$`, "i");
const ASSET_LINK = new RegExp(`^(?:https?://[^/]+)?/assets/(${UUID})(?:[/?#.].*)?$`, "i");
/* A Directus Flow copies each "Image for sharing" upload into og_image as the
   bucket's public r2.dev link. Cloudflare rate-limits r2.dev and says it is not
   for production, so those links are served through /cms-media/ as well. */
const R2_DEV_LINK = new RegExp(`^https://pub-[0-9a-f]+\\.r2\\.dev/(?:.*/)?(${UUID})\\.[a-z0-9]+$`, "i");

export const CMS_MEDIA_BASE = "/cms-media";
export const isCmsFileId = (s: string) => BARE_ID.test(s);
export const cmsMediaPath = (id: string) => `${CMS_MEDIA_BASE}/${id.toLowerCase()}/`;

/** A Directus file id or /assets/ link becomes /cms-media/<id>/; anything else is returned as is. */
export function cmsMediaUrl(src: string): string;
export function cmsMediaUrl(src: string | null | undefined): string | undefined;
export function cmsMediaUrl(src: string | null | undefined): string | undefined {
  if (!src) return src ?? undefined;
  const s = src.trim();
  if (BARE_ID.test(s)) return cmsMediaPath(s);
  const m = ASSET_LINK.exec(s) ?? R2_DEV_LINK.exec(s);
  return m ? cmsMediaPath(m[1]) : s;
}
