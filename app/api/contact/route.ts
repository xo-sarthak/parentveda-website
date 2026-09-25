import { NextResponse } from "next/server";
import { topics, validate, type ContactPayload } from "@/lib/contact";

// POST /api/contact — validates, filters spam, and emails the message.
//
// Delivery goes through Resend's HTTP API with a plain fetch, so there is no
// SDK to install and swapping providers later changes only `send()`.
// Configure in .env.local (and in the host's environment settings):
//   RESEND_API_KEY     — from resend.com
//   CONTACT_TO_EMAIL   — the inbox that receives messages
//   CONTACT_FROM_EMAIL — a sender on a domain verified in Resend
//                        (until then: "ParentVeda <onboarding@resend.dev>")
//
// Until those exist the route answers 503 "not_configured" and the form says
// so plainly. It never pretends a message was delivered.

export const runtime = "nodejs";

// Best-effort rate limit: 5 messages per address per 10 minutes. It lives in
// this server process's memory, so a serverless host with many instances
// only approximates it. That's enough to blunt a noisy script; a shared store
// such as Redis would be the upgrade if abuse ever shows up.
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function send(p: ContactPayload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "ParentVeda <onboarding@resend.dev>";
  if (!key || !to) return { ok: false as const, reason: "not_configured" };

  const topic = topics.find((t) => t.id === p.topic)!;
  const rows: [string, string | undefined][] = [
    ["Topic", topic.label],
    ["Name", p.name],
    ["Email", p.email],
    ["Phone", p.phone],
    ["Organisation", p.org],
  ];
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;color:#201C24">
      <h2 style="margin:0 0 12px">${esc(topic.subject)}</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6F6878">${k}</td><td>${esc(v!)}</td></tr>`)
          .join("")}
      </table>
      <div style="white-space:pre-wrap;line-height:1.6;padding:16px;background:#F4F2F6;border-radius:12px">${esc(p.message)}</div>
      <p style="color:#6F6878;font-size:13px">Sent from the contact form on parentveda.in. Reply to this email to answer ${esc(p.name)} directly.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: p.email,
      subject: `${topic.subject} — ${p.name}`,
      html,
      text: `${topic.subject}\n\n${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${p.message}`,
    }),
  });
  if (!res.ok) return { ok: false as const, reason: "send_failed", detail: await res.text() };
  return { ok: true as const };
}

export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Spam: a filled honeypot or an instant submit gets a quiet "ok" and is
  // dropped. Answering success means a bot learns nothing to adapt to.
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 2500;
  if (body.website || tooFast) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const errors = validate(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 422 });

  const clean: ContactPayload = {
    topic: body.topic!,
    name: body.name!.trim(),
    email: body.email!.trim(),
    phone: body.phone?.trim() || undefined,
    org: body.org?.trim() || undefined,
    message: body.message!.trim(),
    consent: true,
  };

  const result = await send(clean);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      console.warn("[contact] not configured — message not sent:", clean.topic, clean.email);
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    console.error("[contact] send failed:", result.detail);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
