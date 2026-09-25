"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "./Icon";
import { topics, limits, validate, isTopic, type ContactPayload, type TopicId } from "@/lib/contact";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "not_configured" | "error" | "rate_limited";

export default function ContactForm() {
  const params = useSearchParams();
  const initial = params.get("topic");
  const [topic, setTopic] = useState<TopicId>(isTopic(initial) ? initial : "parent");
  const [fields, setFields] = useState({ name: "", email: "", phone: "", org: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isTopic(initial)) setTopic(initial);
  }, [initial]);

  const showOrg = topic === "doctors" || topic === "employers" || topic === "brands" || topic === "press";
  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: ContactPayload = { topic, ...fields, org: showOrg ? fields.org : "", consent, startedAt: startedAt.current };
    const errs = validate(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setStatus("sent");
      if (data.error === "invalid" && data.errors) {
        setErrors(data.errors);
        return setStatus("idle");
      }
      setStatus(data.error === "not_configured" ? "not_configured" : data.error === "rate_limited" ? "rate_limited" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="cform cform--done" role="status">
        <span className="cform__tick" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="24" />
            <path d="M15 27l7 7 15-15" />
          </svg>
        </span>
        <h2 className="display-m">Thank you, {fields.name.split(" ")[0]}.</h2>
        <p>Your message is with us. We’ll reply to {fields.email}.</p>
        <button
          className="btn btn--ghost"
          onClick={() => {
            setFields({ name: "", email: "", phone: "", org: "", message: "", website: "" });
            setConsent(false);
            startedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const mail = (
    <a className="link" href={`mailto:${site.email}?subject=${encodeURIComponent(topics.find((t) => t.id === topic)!.subject)}`}>
      {site.email}
    </a>
  );

  return (
    <form ref={formRef} className="cform" onSubmit={onSubmit} noValidate>
      <fieldset className="cform__topics">
        <legend>What’s this about?</legend>
        <div className="cform__chips">
          {topics.map((t) => (
            <label key={t.id} className={`cchip${topic === t.id ? " is-on" : ""}`}>
              <input type="radio" name="topic" value={t.id} checked={topic === t.id} onChange={() => setTopic(t.id)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="cform__row">
        <Field label="Your name" name="name" error={errors.name}>
          <input name="name" autoComplete="name" value={fields.name} onChange={set("name")} maxLength={limits.name} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" inputMode="email" value={fields.email} onChange={set("email")} maxLength={limits.email} aria-invalid={!!errors.email} />
        </Field>
      </div>

      <div className="cform__row">
        <Field label="Phone" hint="Optional" name="phone" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" value={fields.phone} onChange={set("phone")} maxLength={limits.phone} aria-invalid={!!errors.phone} />
        </Field>
        {showOrg ? (
          <Field label={topic === "doctors" ? "Clinic or hospital" : topic === "press" ? "Publication" : "Company"} hint="Optional" name="org" error={errors.org}>
            <input name="org" autoComplete="organization" value={fields.org} onChange={set("org")} maxLength={limits.org} />
          </Field>
        ) : (
          <span className="cform__spacer" aria-hidden="true" />
        )}
      </div>

      <Field label="Your message" name="message" error={errors.message} counter={`${fields.message.length}/${limits.message}`}>
        <textarea name="message" rows={6} value={fields.message} onChange={set("message")} maxLength={limits.message} aria-invalid={!!errors.message} />
      </Field>

      {/* honeypot — hidden from people and from screen readers */}
      <div className="cform__hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={set("website")} />
        </label>
      </div>

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
        <span>ParentVeda may reply to me by email about this message. It won’t be used for anything else.</span>
      </label>
      {errors.consent && <p className="cform__err">{errors.consent}</p>}

      {status === "not_configured" && (
        <p className="cform__note" role="alert">
          <Icon name="message" size={18} /> <span>This form isn’t connected to our inbox yet. Please email us at {mail} instead.</span>
        </p>
      )}
      {status === "error" && (
        <p className="cform__note cform__note--err" role="alert">
          <Icon name="x" size={18} /> <span>Your message didn’t go through. Check your connection and try again, or email us at {mail}.</span>
        </p>
      )}
      {status === "rate_limited" && (
        <p className="cform__note cform__note--err" role="alert">
          <Icon name="x" size={18} /> <span>That’s a lot of messages in a short time. Please wait a few minutes and try again.</span>
        </p>
      )}

      <div className="cform__submit">
        <button type="submit" className="btn btn--ink" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className="cform__spin" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              Send message <Icon name="arrow" />
            </>
          )}
        </button>
        <p className="small">Not for emergencies. If something feels wrong, call your doctor or 108.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`cfield${error ? " has-error" : ""}`} htmlFor={undefined} data-field={name}>
      <span className="cfield__label">
        {label}
        {hint && <em>{hint}</em>}
        {counter && <em className="cfield__count">{counter}</em>}
      </span>
      {children}
      {error && <span className="cform__err">{error}</span>}
    </label>
  );
}
