"use server";

/* ============================================================
   Waitlist / newsletter signup.

   Runs on the server so the service-role key never reaches a browser, and so
   validation, de-duplication and the honeypot check cannot be skipped by
   posting straight at the database.

   The two boolean flags are the consent record — see /legal/privacy. They are
   only ever set from what the visitor actually ticked.
   ============================================================ */

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { SignupState } from "@/lib/signup";

/* NOTE: this file must export the action and NOTHING else. Every export in a
   "use server" module becomes a callable server endpoint, so a constant or an
   object here throws on module evaluation — a 500 at submit time that
   `next build` does not catch. SignupState and SIGNUP_INITIAL live in
   lib/signup.ts for exactly that reason. */

/* Deliberately loose. Real address validation is delivery, not regex — this
   only rejects what is obviously not an email so we do not store junk. The
   same shape is enforced again as a CHECK constraint on the table. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isOn = (v: FormDataEntryValue | null) => v === "true" || v === "on" || v === "1";

export async function subscribe(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  /* Honeypot. A bot fills every field it finds; a person never sees this one.
     Answer with success rather than an error — telling a scraper it was
     detected just teaches it to try again differently. Nothing is stored. */
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "ok" };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "error", message: "That email doesn't look right — could you check it?" };
  }

  const wantsWaitlist = isOn(formData.get("wants_waitlist"));
  const wantsNewsletter = isOn(formData.get("wants_newsletter"));

  if (!wantsWaitlist && !wantsNewsletter) {
    return {
      status: "error",
      message: "Pick at least one — the launch heads-up or the weekly letter.",
    };
  }

  const source = String(formData.get("source") ?? "website").slice(0, 60);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[subscribe] SUPABASE_SERVICE_ROLE_KEY is not set — signup not stored.");
    return {
      status: "error",
      message: "We couldn't save that just now. Please try again in a moment.",
    };
  }

  /* Merge rather than overwrite.

     Someone may join the waitlist from the main form and later subscribe to
     the letter from the footer, which posts wants_waitlist=false. Writing that
     straight in would quietly cancel a launch signup they never withdrew. So
     an existing opt-in is only ever added to here; withdrawing consent belongs
     to an unsubscribe flow, where it is a deliberate act. */
  const { data: existing, error: readError } = await supabase
    .from("waitlist_signups")
    .select("wants_waitlist, wants_newsletter")
    .eq("email", email)
    .maybeSingle();

  if (readError) {
    console.error("[subscribe] lookup failed:", readError.message);
    return {
      status: "error",
      message: "We couldn't save that just now. Please try again in a moment.",
    };
  }

  const { error: writeError } = await supabase.from("waitlist_signups").upsert(
    {
      email,
      wants_waitlist: wantsWaitlist || Boolean(existing?.wants_waitlist),
      wants_newsletter: wantsNewsletter || Boolean(existing?.wants_newsletter),
      source,
    },
    { onConflict: "email" }
  );

  if (writeError) {
    console.error("[subscribe] write failed:", writeError.message);
    return {
      status: "error",
      message: "We couldn't save that just now. Please try again in a moment.",
    };
  }

  return { status: "ok" };
}
