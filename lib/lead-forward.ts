/* ============================================================
   Server side of the consult and download forms: spam guards, a rate limit,
   an optional webhook copy and the ops email. Server-only. The requests
   themselves are stored by lib/lead-store.ts (Supabase website_leads).

   Optional webhooks, a second copy of each request (e.g. a CRM):
     CONSULT_WEBHOOK_URL  consult requests
     LEADS_WEBHOOK_URL    download leads
   The body is JSON (see docs/website-upgrade/02-phase-2.md).

   Ops email: OPS_EMAIL (default hello@parentveda.in), sent through Resend with
   the RESEND_API_KEY and CONTACT_FROM_EMAIL the contact form already uses.
   No email key = the request is still forwarded; only the email is skipped.
   ============================================================ */

import { randomUUID } from "node:crypto";

/* Best effort: 5 per address per 10 minutes, in this server instance's memory.
   On a serverless host with many instances it only approximates; enough to
   blunt a noisy script. A shared store is the upgrade if abuse shows up. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

export function rateLimited(req: Request, bucket: string): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - (v.at(-1) ?? 0) > WINDOW_MS) hits.delete(k);
  return recent.length > MAX;
}

/** A filled honeypot or an instant submit. Answer "ok" and keep nothing. */
export function looksLikeBot(body: { website?: string; startedAt?: number }): boolean {
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 2500;
  return Boolean(body.website) || tooFast;
}

export const newRef = () => randomUUID().slice(0, 8);

export async function forward(url: string | undefined, record: Record<string, unknown>): Promise<"ok" | "not_configured" | "failed"> {
  if (!url) return "not_configured";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      // Apps Script answers a POST with a redirect to the result; following it is fine.
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[leads] webhook answered ${res.status}`);
      return "failed";
    }
    return "ok";
  } catch (e) {
    console.error("[leads] webhook failed:", (e as Error).message);
    return "failed";
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Tells the ops inbox a request arrived. Never throws; a failed email never fails a request. */
export async function emailOps(subject: string, rows: [string, string | undefined][]): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OPS_EMAIL || "hello@parentveda.in";
  const from = process.env.CONTACT_FROM_EMAIL || "ParentVeda <onboarding@resend.dev>";
  if (!key) return;
  const shown = rows.filter(([, v]) => v);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px"><h2 style="margin:0 0 12px">${esc(subject)}</h2><table style="border-collapse:collapse">${shown
          .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6F6878">${esc(k)}</td><td>${esc(v!)}</td></tr>`)
          .join("")}</table><p style="color:#6F6878;font-size:13px">Sent from parentveda.in. Full record is in Directus, under website_leads.</p></div>`,
        text: `${subject}\n\n${shown.map(([k, v]) => `${k}: ${v}`).join("\n")}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[leads] ops email answered ${res.status}`);
  } catch (e) {
    console.error("[leads] ops email failed:", (e as Error).message);
  }
}
