import { NextResponse } from "next/server";
import { cleanPath, normalisePhone, validateLead, type LeadPayload } from "@/lib/leads";
import { emailOps, forward, looksLikeBot, newRef, rateLimited } from "@/lib/lead-forward";
import { findDownload } from "@/lib/downloads";
import { getCondition } from "@/lib/conditions";

// POST /api/leads/: a download request, and its optional second step,
// "Send it to my WhatsApp" (recorded only; the team sends it).
// Forwards to LEADS_WEBHOOK_URL and emails OPS_EMAIL. See lib/lead-forward.ts.

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (looksLikeBot(body)) return NextResponse.json({ ok: true });
  if (rateLimited(req, "leads")) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const errors = validateLead(body);
  const download = findDownload(body.download);
  if (!download?.file) errors.download = "Something went wrong. Please reload the page.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 422 });

  const ref = body.sendToWhatsapp && body.ref && /^[a-f0-9]{8}$/.test(body.ref) ? body.ref : newRef();
  const record = {
    type: body.sendToWhatsapp ? "download_whatsapp_request" : "download_lead",
    ref,
    received_at: new Date().toISOString(),
    download: download!.slug,
    condition: getCondition(body.condition)?.slug ?? "",
    page: cleanPath(body.page) ?? "",
    name: body.name!.trim(),
    phone: body.gate === "email" ? "" : normalisePhone(body.phone!)!,
    email: body.gate === "email" ? body.email!.trim() : "",
    gate: body.gate === "email" ? "email" : "whatsapp",
    consent: true,
    consent_text: "Contact on WhatsApp or by email about this download; read the Privacy Policy.",
  };

  const result = await forward(process.env.LEADS_WEBHOOK_URL, record);
  if (result === "not_configured") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (result === "failed") return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });

  if (body.sendToWhatsapp) {
    await emailOps(`Send on WhatsApp: ${download!.title}`, [
      ["Reference", ref],
      ["Name", record.name],
      ["WhatsApp", record.phone],
      ["Download", download!.title],
    ]);
  }
  return NextResponse.json({ ok: true, ref, file: download!.file });
}
