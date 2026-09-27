/* ============================================================
   POST /api/revalidate — Directus tells the site something changed.

   WHAT THIS FIXES. Content reads are cached with a 60-second window and a
   shared tag (see src/lib/supabase.ts). That is right for readers and wrong
   for the person who just pressed Publish: they refresh, see the old page,
   and conclude the panel is broken. Then they press Publish again.

   revalidateTag(CONTENT_TAG) drops every cached content read at once, so the
   next request rebuilds from Supabase. Publishing becomes immediate instead of
   eventually.

   ---------------------------------------------------------------
   WHY IT NEEDS A SECRET, since the data here is public anyway
   ---------------------------------------------------------------

   Nothing secret leaks if a stranger calls this — every guide is public. What
   leaks is MONEY AND LATENCY. An open endpoint that flushes the whole content
   cache can be called in a loop: every subsequent page view becomes a cold
   render against Supabase, so the site gets slower and both bills go up, with
   no error anywhere and nothing in the logs that looks like an attack.

   > Authentication is not only about secrets. Anything that lets a stranger
   > make your infrastructure do expensive work needs a gate, even when the
   > data is public.

   The secret is compared in constant time. Overkill for a cache-buster,
   admittedly — but a timing-safe compare costs one function and the habit is
   worth more than the microseconds, because the next endpoint written by
   copying this one might guard something that matters.

   ---------------------------------------------------------------
   SETUP (both sides, or this does nothing)
   ---------------------------------------------------------------

   1. Vercel → Settings → Environment Variables:
          REVALIDATE_SECRET = <a long random string>

   2. Directus → Settings → Flows → Create Flow
          Trigger:  Event Hook, Action (non-blocking)
          Scope:    items.create, items.update
          Collections: content_posts, content_categories, content_authors
          Operation: Webhook / Request URL
          Method:   POST
          URL:      https://parentveda.in/api/revalidate
          Headers:  x-revalidate-secret: <the same string>

   Non-blocking on purpose: if this site is down, saving in Directus must still
   work. A publish that fails because a cache could not be cleared is a worse
   failure than a page that is 60 seconds stale, which is exactly what happens
   anyway when the webhook never arrives.

   ⚠️ THE APP DOES NOT NEED THIS. It reads Supabase directly and sees a change
   the moment it is saved. Only this site caches, so only this site needs
   telling. (Ask Veda needs its own call for a different reason — it keeps a
   separate embedding index, so it is not stale, it is unaware.)
   ============================================================ */

import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Constant-time string compare — no early exit on the first wrong byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;

  /* An unset secret must FAIL CLOSED. The tempting alternative — "no secret
     configured, so allow it" — turns a forgotten environment variable into an
     open endpoint, and forgetting one is the single most likely way this ends
     up misconfigured. */
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET is not set on this deployment." },
      { status: 503 }
    );
  }

  const given =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret") ??
    "";

  if (!safeEqual(given, expected)) {
    /* Deliberately says nothing about why. A 401 that distinguishes "no
       header" from "wrong header" is a free oracle. */
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  /* NEXT 16 SIGNATURE. `revalidateTag(tag)` was valid in 15 and is a type
     error here — it now takes a cache profile as the second argument, part of
     the `use cache` model. "max" is the aggressive end: treat everything under
     this tag as expired.

     Worth pinning in a comment because the change is silent in the worst way:
     copy an example off the internet, get a compile error, "fix" it by
     removing the tag argument, and you have quietly turned a targeted
     invalidation into nothing at all. */
  revalidateTag(CONTENT_TAG, "max");

  /* Echo what Directus sent, when it sent anything. The body is not trusted
     and not acted on — every tagged read is flushed regardless of which
     collection changed, because a published article can appear on the hub, its
     category page, an author page and the sitemap, and working out which of
     those to drop is more ways to be wrong than flushing all of them.

     Returned only so the Flow log shows what fired, which is the difference
     between debugging this in five minutes and in an afternoon. */
  let collection: string | undefined;
  try {
    const body = (await request.json()) as { collection?: string };
    collection = body?.collection;
  } catch {
    /* Directus can be configured to send nothing. Not an error. */
  }

  return NextResponse.json({
    ok: true,
    revalidated: CONTENT_TAG,
    collection: collection ?? null,
    at: new Date().toISOString(),
  });
}

/* GET exists purely so a human can check the deployment is wired without
   crafting a POST. It reveals whether the secret is SET, never what it is. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "POST /api/revalidate",
    secretConfigured: Boolean(process.env.REVALIDATE_SECRET),
    tag: CONTENT_TAG,
  });
}
