import { isCmsFileId } from "@/lib/cms-media";
import { getDirectusFile } from "@/lib/r2";

/* An image uploaded in Directus, read from R2 (see lib/cms-media.ts).

   A Directus file id never points to different bytes (replacing an image
   gives it a new id), so the response is cached for a year at Vercel's edge
   and in browsers: R2 is read once per image, not once per visitor. A miss
   is cached only briefly, so an image uploaded a moment after its article
   was saved still appears. */
export const dynamic = "force-dynamic";

const ALLOWED = /^(image\/(jpeg|png|webp|gif|avif|svg\+xml)|video\/(mp4|webm)|application\/pdf)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notFound = () =>
    new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });

  if (!isCmsFileId(id)) return notFound();
  const file = await getDirectusFile(id.toLowerCase());
  if (!file?.body) return notFound();

  /* Only media types the site shows; anything else in the bucket stays unreachable. */
  const type = (file.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED.test(type)) return notFound();

  const headers = new Headers({
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });
  const len = file.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  /* An SVG can carry script; keep it from running if someone opens it directly. */
  if (type === "image/svg+xml") headers.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox");

  return new Response(file.body, { headers });
}
