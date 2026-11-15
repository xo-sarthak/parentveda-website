import { readFile } from "node:fs/promises";
import { pdfPath, servableDownload } from "@/lib/downloads";

// GET /downloads/<slug>/: one of the condition PDFs (content/downloads/<slug>.pdf).
// 404 unless it is reviewed or this deploy shows drafts. Never indexed.

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const d = servableDownload(slug);
  if (!d) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  const pdf = await readFile(pdfPath(d.slug));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="parentveda-${d.slug}.pdf"`,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
