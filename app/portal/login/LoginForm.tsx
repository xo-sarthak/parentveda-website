"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/portal-auth";
import { PORTAL_AUTH_INITIAL } from "@/lib/portal";

/**
 * The sign-in form. A client component only so it can show a pending state and
 * render the error in place — the credentials themselves never touch client
 * JavaScript, because the action runs on the server and sets an httpOnly
 * cookie.
 */
export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, PORTAL_AUTH_INITIAL);

  return (
    <form action={action} className="p-form">
      <div className="p-field">
        <label htmlFor="portal-email" className="p-field__label">
          Email
        </label>
        <input
          id="portal-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="p-input"
          placeholder="you@company.com"
        />
      </div>

      <div className="p-field">
        <label htmlFor="portal-password" className="p-field__label">
          Password
        </label>
        <input
          id="portal-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="p-input"
        />
      </div>

      {state.error && (
        <p role="alert" className="p-alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn--ink p-submit">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
