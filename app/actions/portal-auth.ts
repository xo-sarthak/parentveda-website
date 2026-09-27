"use server";

/* ============================================================
   Sponsor portal — sign in and sign out.

   Runs on the server so the session lands in an httpOnly cookie rather than in
   JavaScript's reach. Same auth.users the app signs into; there is no separate
   HR account, no second password, and no user table of our own.

   NOTE: this file must export the actions and NOTHING else. Every export in a
   "use server" module becomes a callable server endpoint, so a constant or a
   type here throws on module evaluation — a 500 at submit time that
   `next build` does not catch. Shared types live in lib/portal.ts, the same
   arrangement actions/subscribe.ts uses.
   ============================================================ */

import { redirect } from "next/navigation";
import { portalClient } from "@/lib/supabase-portal";
import { PORTAL_NOT_CONNECTED, type PortalAuthState } from "@/lib/portal";

export async function signIn(
  _prev: PortalAuthState,
  formData: FormData
): Promise<PortalAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await portalClient();
  // No Supabase env vars on this deploy: say so calmly rather than crash.
  if (!supabase) return { error: PORTAL_NOT_CONNECTED.title };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    /* Supabase says "Invalid login credentials" for both a wrong password and
       an address that has never registered, and that is the right behaviour to
       pass through unchanged: distinguishing them would turn this form into a
       way to test whether a given person has a ParentVeda account. For a
       pregnancy app that is not a small thing. */
    return { error: "That email and password did not match." };
  }

  /* Whether they may SEE anything is decided by the database, not here. An
     ordinary parent can sign in perfectly well and simply has no programme —
     /portal says so plainly rather than pretending the login failed. */
  redirect("/portal/");
}

export async function signOut(): Promise<void> {
  const supabase = await portalClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/portal/login/");
}
