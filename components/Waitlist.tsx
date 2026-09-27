"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/subscribe";
import { SIGNUP_INITIAL } from "@/lib/signup";
import Icon from "./Icon";

/**
 * The waitlist, carried over from the old site: signups go to Supabase
 * (waitlist_signups) through a server action, so the service-role key never
 * reaches a browser and the checks can't be skipped. The two boxes are the
 * consent record (see /legal/privacy), set only from what the visitor ticked.
 *
 * Honest by design: no email provider is connected yet, so the success line
 * promises a letter on launch day, not "check your inbox".
 */
export default function Waitlist({ source = "website", dark = false }: { source?: string; dark?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, SIGNUP_INITIAL);

  if (state.status === "ok") {
    return (
      <div className={`wl wl--done${dark ? " wl--dark" : ""}`} role="status">
        <Icon name="check" size={22} />
        <p>
          <b>You’re on the list.</b> We’ll write to you the day ParentVeda opens.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className={`wl${dark ? " wl--dark" : ""}`}>
      <div className="wl__row">
        <label className="visually-hidden" htmlFor={`wl-email-${source}`}>
          Email
        </label>
        <input
          id={`wl-email-${source}`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          required
          maxLength={254}
        />
        <button type="submit" className="btn btn--ink" disabled={pending} aria-busy={pending}>
          {pending ? "Saving" : "Tell me when it’s live"}
        </button>
      </div>
      {/* honeypot: a person never sees this; a bot fills it */}
      <input className="wl__hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="source" value={source} />
      <div className="wl__opts">
        <label>
          <input type="checkbox" name="wants_waitlist" defaultChecked /> Tell me when the app launches
        </label>
        <label>
          <input type="checkbox" name="wants_newsletter" /> Send me the weekly letter
        </label>
      </div>
      {state.status === "error" && state.message ? (
        <p className="wl__err" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
