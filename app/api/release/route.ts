/* ============================================================
   GET /api/release — the daily release of queued Reads.

   WHAT IT DOES. Once a day a Vercel cron calls this. It publishes every
   `scheduled` article in content_posts whose planned date has arrived (India
   time), at most RELEASE_LIMIT a run, oldest slot first. Each one gets
   status = 'published' and published_at = now, so the page, the sitemap and
   IndexNow all carry the real release time, not the day it was queued. Then
   it does what the Directus "Publish → website" flow does on a manual save:
   clears the content cache and pings IndexNow.

   HOW THE QUEUE WORKS. Articles are prepared in Directus with
   status = 'scheduled' and published_at = their planned day. To reorder, edit
   the date; to hold one back, set it to draft. The public read policy is
   `status = 'published'`, so a scheduled article is invisible to the site and
   the app until this runs.

   WHY HERE AND NOT A DIRECTUS FLOW. Directus runs on Render's free plan, which
   sleeps when idle, and a scheduled Flow cannot fire on a sleeping server.
   This writes to Supabase directly, so it does not depend on Render.

   WHY THE DATE, NOT THE TIME. Vercel's Hobby plan fires a daily cron at some
   point within the hour it is set for, so a run can land before 9:00 IST.
   Comparing against the end of today in India means a run at 8:40 still
   releases today's slot, and a second run the same day finds nothing new,
   because tomorrow's slot is not due yet.

   AUTH. Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is
   set in the project. Unset fails closed, like /api/revalidate.
   ============================================================ */

import { NextResponse, after, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { pingIndexNow, recentlyChangedUrls } from "@/lib/indexnow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Most articles one run may publish. A missed day catches up 3 at a time, not all at once. */
const RELEASE_LIMIT = 3;

/** India has no daylight saving, so a fixed offset is exact. */
const IST_OFFSET_MS = (5 * 60 + 30) * 60_000;

/** The first instant of tomorrow in India, as an ISO string in UTC. */
function endOfTodayIST(now = Date.now()): string {
  const ist = new Date(now + IST_OFFSET_MS);
  const nextMidnightIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + 1);
  return new Date(nextMidnightIst - IST_OFFSET_MS).toISOString();
}

/** Constant-time string compare, as in /api/revalidate. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not set on this deployment." }, { status: 503 });
  }
  if (!safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set." }, { status: 503 });
  }

  const due = await db
    .from("content_posts")
    .select("id, slug, published_at")
    .eq("status", "scheduled")
    .lt("published_at", endOfTodayIST())
    .order("published_at", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(RELEASE_LIMIT);

  if (due.error) {
    console.error("[release] could not read the queue:", due.error.message);
    return NextResponse.json({ ok: false, error: "Could not read the queue." }, { status: 500 });
  }
  if (!due.data.length) {
    console.log("[release] nothing due today");
    return NextResponse.json({ ok: true, released: [] });
  }

  /* `status = 'scheduled'` again in the update, so a row someone set back to
     draft between the read and here stays a draft. */
  const released = await db
    .from("content_posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .in("id", due.data.map((r) => r.id))
    .eq("status", "scheduled")
    .select("slug");

  if (released.error) {
    console.error("[release] publish failed:", released.error.message);
    return NextResponse.json({ ok: false, error: "Publish failed." }, { status: 500 });
  }

  const slugs = released.data.map((r) => r.slug);
  console.log(`[release] published ${slugs.length}: ${slugs.join(", ")}`);

  if (slugs.length) {
    revalidateTag(CONTENT_TAG, { expire: 0 });
    after(async () => {
      await pingIndexNow(await recentlyChangedUrls());
    });
  }

  return NextResponse.json({ ok: true, released: slugs, at: new Date().toISOString() });
}
