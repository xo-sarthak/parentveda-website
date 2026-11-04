import { NextResponse } from "next/server";

/* The body of /<INDEXNOW_KEY>.txt, reached through a rewrite in next.config.ts.
   The key is public by design: serving it is how IndexNow checks we own the host. */
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
