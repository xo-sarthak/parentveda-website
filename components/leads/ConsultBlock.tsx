"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { NOTE_MAX, SLOTS, validateConsult, type ConsultPayload, type SlotId } from "@/lib/leads";
import { track } from "@/lib/track";
import { Field, Honeypot, StatusNote, postJson, type SendStatus } from "./FormBits";

export type ConsultView = {
  specialty: string;
  label: string;
  priceLabel: string;
  includes: string;
  mode: "book" | "callback";
};

/* "Talk to a specialist". The server decides whether to render this at all
   (lib/consults.ts: only when CONSULT_WEBHOOK_URL is set).

   mode "callback" (today): a short form; the team calls back.
   mode "book": the integration point for paid booking. Pass `onBook` once a
   provider exists (see app/api/consult/book/route.ts). Without it, a "book"
   consult falls back to the callback form, so nothing is ever a dead end. */
export default function ConsultBlock({
  consult,
  condition,
  heading,
  onBook,
}: {
  consult: ConsultView;
  condition?: string;
  /** e.g. "Book a session with Dr. Avula". Defaults to "Talk to a <specialist>". */
  heading?: string;
  onBook?: (c: ConsultView) => void;
}) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", slot: "" as SlotId | "", note: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SendStatus>("idle");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const mode = consult.mode === "book" && onBook ? "book" : "callback";
  const id = `consult-${consult.specialty}`;

  const start = () => {
    track("consult_click", { specialty: consult.specialty, condition, mode });
    if (mode === "book") return onBook!(consult);
    startedAt.current = Date.now();
    setOpen(true);
  };

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: ConsultPayload = {
      specialty: consult.specialty,
      condition,
      page: location.pathname,
      name: f.name,
      phone: f.phone,
      slot: f.slot as SlotId,
      note: f.note,
      consent,
      website: f.website,
      startedAt: startedAt.current,
    };
    const errs = validateConsult(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const r = await postJson("/api/consult/", payload);
    if (r.errors) setErrors(r.errors);
    setStatus(r.status);
    if (r.status === "sent") track("consult_submit", { specialty: consult.specialty, condition, mode });
  }

  return (
    <section className="consult" aria-labelledby={`${id}-h`} id="talk-to-a-specialist">
      <div className="consult__head">
        <p className="consult__eyebrow">Talk to a specialist</p>
        <h3 id={`${id}-h`} className="consult__h">
          {heading ?? `Talk to a ${consult.label.toLowerCase()}`}
        </h3>
        {consult.includes ? <p>{consult.includes}</p> : null}
        <p className="consult__price">{consult.priceLabel}</p>
      </div>

      {status === "sent" ? (
        <div className="consult__done" role="status">
          <p>
            <b>Thank you, {f.name.trim().split(" ")[0]}. We have your request.</b>
          </p>
          <p>What happens next: someone from our team will call or WhatsApp you to find a time that suits you.</p>
        </div>
      ) : !open ? (
        <button type="button" className="btn btn--ink" onClick={start} aria-expanded={false} aria-controls={`${id}-form`}>
          {mode === "book" ? "Book a session" : "Request a call back"}
        </button>
      ) : (
        <form ref={formRef} id={`${id}-form`} className="cform consult__form" onSubmit={submit} noValidate>
          <div className="cform__row">
            <Field label="Your name" name="name" error={errors.name}>
              <input name="name" autoComplete="name" value={f.name} onChange={set("name")} maxLength={80} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Mobile number" name="phone" error={errors.phone}>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="10 digit number"
                value={f.phone}
                onChange={set("phone")}
                maxLength={16}
                aria-invalid={!!errors.phone}
              />
            </Field>
          </div>
          <Field label="When should we call?" name="slot" error={errors.slot}>
            <select name="slot" value={f.slot} onChange={set("slot")} aria-invalid={!!errors.slot}>
              <option value="">Choose a time</option>
              {SLOTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Anything we should know?" hint="Optional" name="note" error={errors.note} counter={`${f.note.length}/${NOTE_MAX}`}>
            <textarea name="note" rows={3} value={f.note} onChange={set("note")} maxLength={NOTE_MAX} aria-describedby={`${id}-notehint`} />
          </Field>
          <p className="small" id={`${id}-notehint`}>
            Please do not share reports or test results here. The specialist will ask for them on the call.
          </p>

          <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />

          <label className={`cform__consent${errors.consent ? " has-error" : ""}`}>
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (errors.consent) setErrors((x) => ({ ...x, consent: "" }));
              }}
            />
            <span>
              ParentVeda may contact me on WhatsApp or by phone about this request. I have read the{" "}
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
              {status === "sending" ? "Sending" : "Request a call back"}
            </button>
            <p className="small">Not for emergencies. If something feels wrong, call your doctor or 108.</p>
          </div>
        </form>
      )}
    </section>
  );
}
