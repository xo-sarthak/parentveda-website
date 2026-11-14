"use client";

/* Small shared pieces for the consult and download forms. Same look as the
   contact form (app/contact.css). */

export function Field({
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
    <label className={`cfield${error ? " has-error" : ""}`} data-field={name}>
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

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="cform__hp" aria-hidden="true">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export type SendStatus = "idle" | "sending" | "sent" | "not_configured" | "error" | "rate_limited";

export function StatusNote({ status }: { status: SendStatus }) {
  const msg =
    status === "not_configured"
      ? "This form is not connected yet. Please write to hello@parentveda.in instead."
      : status === "rate_limited"
        ? "That is a lot of requests in a short time. Please wait a few minutes and try again."
        : status === "error"
          ? "That did not go through. Check your connection and try again."
          : "";
  return msg ? (
    <p className="cform__note cform__note--err" role="alert">
      {msg}
    </p>
  ) : null;
}

/** Posts JSON and maps the answer to a status, plus field errors when the server found any. */
export async function postJson<T>(
  url: string,
  body: unknown
): Promise<{ status: SendStatus; errors?: Record<string, string>; data?: T }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { status: "sent", data };
    if (data.error === "invalid") return { status: "idle", errors: data.errors };
    return { status: data.error === "not_configured" ? "not_configured" : data.error === "rate_limited" ? "rate_limited" : "error" };
  } catch {
    return { status: "error" };
  }
}
