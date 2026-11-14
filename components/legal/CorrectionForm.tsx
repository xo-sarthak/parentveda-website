"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { limits, validate, type ContactPayload } from "@/lib/contact";
import { Field, Honeypot, StatusNote, postJson, type SendStatus } from "@/components/leads/FormBits";

/* "Report an error". Sends through the contact form's route (/api/contact,
   topic "correction"), so it reaches the same inbox with the same spam guards. */
export default function CorrectionForm() {
  const [f, setF] = useState({ page: "", problem: "", source: "", name: "", email: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SendStatus>("idle");
  const startedAt = useRef(Date.now());
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (f.problem.trim().length < 10) errs.problem = "Tell us a little more about what is wrong.";
    const message = [`Page: ${f.page.trim() || "not given"}`, `What is wrong: ${f.problem.trim()}`, f.source.trim() ? `Source: ${f.source.trim()}` : ""]
      .filter(Boolean)
      .join("\n\n");
    const payload: ContactPayload = { topic: "correction", name: f.name, email: f.email, message, consent, website: f.website, startedAt: startedAt.current };
    const v = validate(payload);
    if (v.name) errs.name = v.name;
    if (v.email) errs.email = v.email;
    if (v.message && !errs.problem) errs.problem = v.message;
    if (v.consent) errs.consent = v.consent;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    const r = await postJson("/api/contact/", payload);
    setStatus(r.status);
  }

  if (status === "sent") {
    return (
      <div className="consult__done" role="status">
        <p>
          <b>Thank you. We have your report.</b>
        </p>
        <p>A reviewer will check it. If we change the read, the change is noted on that page with the date.</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={submit} noValidate>
      <Field label="Which page?" hint="Optional" name="page">
        <input name="page" inputMode="url" value={f.page} onChange={set("page")} maxLength={300} placeholder="Paste the link or the title" />
      </Field>
      <Field label="What is wrong?" name="problem" error={errors.problem} counter={`${f.problem.length}/2000`}>
        <textarea name="problem" rows={5} value={f.problem} onChange={set("problem")} maxLength={2000} aria-invalid={!!errors.problem} />
      </Field>
      <Field label="Your source" hint="Optional" name="source">
        <input name="source" value={f.source} onChange={set("source")} maxLength={300} placeholder="A guideline or study, if you have one" />
      </Field>
      <div className="cform__row">
        <Field label="Your name" name="name" error={errors.name}>
          <input name="name" autoComplete="name" value={f.name} onChange={set("name")} maxLength={limits.name} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} maxLength={limits.email} aria-invalid={!!errors.email} />
        </Field>
      </div>
      <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />
      <label className={`cform__consent${errors.consent ? " has-error" : ""}`}>
        <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          ParentVeda may reply to me by email about this report. I have read the{" "}
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
          {status === "sending" ? "Sending" : "Send report"}
        </button>
      </div>
    </form>
  );
}
