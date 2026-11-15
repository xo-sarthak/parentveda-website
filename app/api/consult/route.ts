import { NextResponse } from "next/server";
import { cleanPath, normalisePhone, SLOTS, validateConsult, type ConsultPayload } from "@/lib/leads";
import { emailOps, forward, looksLikeBot, newRef, rateLimited } from "@/lib/lead-forward";
import { findConsult } from "@/lib/consults";
import { storeLead } from "@/lib/lead-store";
import { getCondition } from "@/lib/conditions";

// POST /api/consult/: a "Talk to a specialist" callback request.
// Stored in Supabase (website_leads, lib/lead-store.ts), optionally copied to
// CONSULT_WEBHOOK_URL, and emailed to OPS_EMAIL. See lib/lead-forward.ts.

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<ConsultPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (looksLikeBot(body)) return NextResponse.json({ ok: true });
  if (rateLimited(req, "consult")) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const errors = validateConsult(body);
  const consult = findConsult(body.specialty);
  if (!consult) errors.specialty = "Something went wrong. Please reload the page.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 422 });

  const ref = newRef();
  const condition = getCondition(body.condition);
  const slot = SLOTS.find((s) => s.id === body.slot)!;
  const record = {
    type: "consult_request",
    ref,
    received_at: new Date().toISOString(),
    specialty: consult!.specialty,
    specialty_label: consult!.label,
    price_inr: consult!.price_inr,
    mode: consult!.mode,
    condition: condition?.slug ?? "",
    page: cleanPath(body.page) ?? "",
    name: body.name!.trim(),
    phone: normalisePhone(body.phone!)!,
    slot: slot.id,
    note: body.note?.trim() ?? "",
    consent: true,
    consent_text: "Contact on WhatsApp or phone about this request; read the Privacy Policy.",
  };

  const result = await storeLead({
    ref,
    kind: "consult_request",
    name: record.name,
    phone: record.phone,
    email: null,
    specialty: record.specialty,
    price_inr: record.price_inr,
    best_time: record.slot,
    note: record.note || null,
    condition: record.condition || null,
    page: record.page || null,
    consent: true,
    consent_text: record.consent_text,
  });
  if (result === "not_configured") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (result === "failed") return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  // Optional copy to a webhook; the request is already safe in the table.
  if (process.env.CONSULT_WEBHOOK_URL) await forward(process.env.CONSULT_WEBHOOK_URL, record);

  await emailOps(`Consult request: ${consult!.label}`, [
    ["Reference", ref],
    ["Name", record.name],
    ["Phone", record.phone],
    ["Best time", slot.label],
    ["Specialist", consult!.label],
    ["From page", record.page],
    ["Note", record.note],
  ]);
  return NextResponse.json({ ok: true, ref });
}
