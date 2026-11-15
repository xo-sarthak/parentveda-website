/* ============================================================
   "Talk to a specialist": the consult config (the plan's consults.config).

   content/consults.json, keyed by specialty. Prices are in INR; null shows
   "Price on request". Three prices come from the app (fertility specialist,
   gynaecologist, male fertility); the rest wait for the team.

   A consult card or block shows only when the form has somewhere to send to:
   LEADS_ENABLED=1 (requests are stored in Supabase, see lib/lead-store.ts).
   Until then nothing about consults renders, so no one fills in a form that
   goes nowhere.
   ============================================================ */

import DATA from "@/content/consults.json";
import { leadsEnabled } from "@/lib/lead-store";

export type ConsultMode = "book" | "callback";

export type Consult = {
  specialty: string;
  label: string;
  price_inr: number | null;
  duration_min: number | null;
  /** The price covers both partners. */
  for_couple: boolean;
  /** What is included, one or two plain sentences. */
  includes: string;
  /** "callback" until payments are live; "book" is a stub for a provider later. */
  mode: ConsultMode;
  /** Expert slugs in lib/authors.ts who take this consult. */
  experts: string[];
};

export const CONSULTS: Consult[] = Object.entries(DATA as Record<string, Omit<Consult, "specialty">>).map(
  ([specialty, c]) => ({ specialty, ...c })
);

export function consultsEnabled(): boolean {
  return leadsEnabled();
}

/** The consult for a specialty, or undefined when unknown or consults are off. */
export function getConsult(specialty?: string | null): Consult | undefined {
  if (!specialty || !consultsEnabled()) return undefined;
  return CONSULTS.find((c) => c.specialty === specialty);
}

/** Config lookup that ignores the on/off switch, for reports and admin pages. */
export function findConsult(specialty?: string | null): Consult | undefined {
  return specialty ? CONSULTS.find((c) => c.specialty === specialty) : undefined;
}

export function priceLabel(c: Consult): string {
  if (c.price_inr == null) return "Price on request";
  const minutes = c.duration_min ? `, ${c.duration_min} minutes` : "";
  return `₹${c.price_inr.toLocaleString("en-IN")}${c.for_couple ? " for both of you" : ""}${minutes}`;
}

/** The plain shape the client ConsultBlock takes. */
export function consultView(c: Consult) {
  return { specialty: c.specialty, label: c.label, priceLabel: priceLabel(c), includes: c.includes, mode: c.mode };
}
