"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { validateLead, type LeadPayload } from "@/lib/leads";
import { track } from "@/lib/track";
import { Field, Honeypot, StatusNote, postJson, type SendStatus } from "./FormBits";

export type DownloadView = { slug: string; title: string; value: string; gate: "whatsapp" | "email" };

/* A free PDF behind a short form (name, WhatsApp number or email, consent).
   The server decides whether to render it (lib/downloads.ts: only when the
   PDF exists and LEADS_WEBHOOK_URL is set). After the form, the link shows,
   with an offer to send it on WhatsApp too; that request is only recorded,
   and the team sends it. */
export default function DownloadCard({ download, condition }: { download: DownloadView; condition?: string }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", contact: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SendStatus>("idle");
  const [result, setResult] = useState<{ ref: string; file: string } | null>(null);
  const [wa, setWa] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const email = download.gate === "email";
  const id = `dl-${download.slug}`;

  const payload = (extra: Partial<LeadPayload> = {}): LeadPayload => ({
    download: download.slug,
    condition,
    page: location.pathname,
    name: f.name,
    ...(email ? { email: f.contact } : { phone: f.contact }),
    gate: download.gate,
    consent,
    website: f.website,
    startedAt: startedAt.current,
    ...extra,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = payload();
    const errs = validateLead(p);
    setErrors(errs);
    if (Object.keys(errs).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const r = await postJson<{ ref: string; file: string }>("/api/leads/", p);
    if (r.errors) setErrors(r.errors);
    setStatus(r.status);
    if (r.status === "sent" && r.data) {
      setResult(r.data);
      track("download_submit", { download: download.slug, condition });
    }
  }

  async function sendWhatsapp() {
    if (!result) return;
    setWa("sending");
    const r = await postJson("/api/leads/", payload({ sendToWhatsapp: true, ref: result.ref }));
    setWa(r.status === "sent" ? "sent" : "error");
  }

  return (
    <section className="dlcard" aria-labelledby={`${id}-h`}>
      <p className="consult__eyebrow">Free download</p>
      <h3 id={`${id}-h`} className="consult__h">
        {download.title}
      </h3>
      <p>{download.value}</p>

      {result ? (
        <div className="consult__done" role="status">
          <p>
            <a className="btn btn--ink" href={result.file} download>
              Download the PDF
            </a>
          </p>
          {!email ? (
            wa === "sent" ? (
              <p>Thank you. We will send it to your WhatsApp.</p>
            ) : (
              <p>
                <button type="button" className="btn btn--ghost" onClick={sendWhatsapp} disabled={wa === "sending"}>
                  {wa === "sending" ? "Sending" : "Send it to my WhatsApp"}
                </button>
                {wa === "error" ? <span className="cform__err"> That did not go through. Please try again.</span> : null}
              </p>
            )
          ) : null}
        </div>
      ) : !open ? (
        <button
          type="button"
          className="btn btn--ink"
          onClick={() => {
            startedAt.current = Date.now();
            setOpen(true);
          }}
          aria-expanded={false}
          aria-controls={`${id}-form`}
        >
          Get the free PDF
        </button>
      ) : (
        <form ref={formRef} id={`${id}-form`} className="cform consult__form" onSubmit={submit} noValidate>
          <div className="cform__row">
            <Field label="Your name" name="name" error={errors.name}>
              <input name="name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={80} aria-invalid={!!errors.name} />
            </Field>
            <Field label={email ? "Email" : "WhatsApp number"} name={email ? "email" : "phone"} error={email ? errors.email : errors.phone}>
              <input
                name={email ? "email" : "phone"}
                type={email ? "email" : "tel"}
                inputMode={email ? "email" : "tel"}
                autoComplete={email ? "email" : "tel"}
                placeholder={email ? "" : "10 digit number"}
                value={f.contact}
                onChange={(e) => setF({ ...f, contact: e.target.value })}
                maxLength={email ? 120 : 16}
                aria-invalid={!!(email ? errors.email : errors.phone)}
              />
            </Field>
          </div>
          <Honeypot value={f.website} onChange={(v) => setF({ ...f, website: v })} />
          <label className={`cform__consent${errors.consent ? " has-error" : ""}`}>
            <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              ParentVeda may contact me {email ? "by email" : "on WhatsApp"} about this download. I have read the{" "}
              <Link href="/legal/privacy/" className="link">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="cform__err">{errors.consent}</p>}
          <StatusNote status={status} />
          <div className="cform__submit">
            <button type="submit" className="btn btn--ink" disabled={status === "sending"} aria-busy={status === "sending"}>
              {status === "sending" ? "Sending" : "Get the PDF"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
