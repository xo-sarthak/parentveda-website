/* ============================================================
   Consult requests and download leads: the shapes and the checks, shared by
   the forms (client) and /api/consult and /api/leads (server), so both
   always agree.

   Privacy (DPDP Act): the forms collect only a name, a phone number, a time
   slot and an optional short note, plus which page the request came from.
   Nothing goes in a URL. Consent is a required, unticked checkbox.
   ============================================================ */

export const SLOTS = [
  { id: "morning", label: "Morning, 9 am to 12 noon" },
  { id: "afternoon", label: "Afternoon, 12 noon to 4 pm" },
  { id: "evening", label: "Evening, 4 pm to 8 pm" },
] as const;
export type SlotId = (typeof SLOTS)[number]["id"];

export const NOTE_MAX = 300;
export const NAME_MAX = 80;

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

/** An Indian mobile number: 10 digits starting 6 to 9, with an optional +91 or 0. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()-]/g, "");
  const m = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(digits);
  return m ? `+91${m[1]}` : null;
}

export function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x) && x.length <= 120;
}

type Guard = {
  /** Honeypot: a real person never fills a field they cannot see. */
  website?: string;
  /** When the form was shown; bots submit instantly. */
  startedAt?: number;
};

export type ConsultPayload = Guard & {
  specialty: string;
  condition?: string;
  /** The page the request came from (a path, never a query string). */
  page?: string;
  name: string;
  phone: string;
  slot: SlotId;
  note?: string;
  consent: boolean;
};

export type LeadPayload = Guard & {
  download: string;
  condition?: string;
  page?: string;
  name: string;
  /** WhatsApp number, for a WhatsApp gate. */
  phone?: string;
  /** Email, for an email gate. */
  email?: string;
  gate: "whatsapp" | "email";
  /** The second step: "Send it to my WhatsApp" after the download link shows. */
  sendToWhatsapp?: boolean;
  /** The reference the first submit returned, so the two records join up. */
  ref?: string;
  consent: boolean;
};

const nameError = (n?: string) =>
  !n?.trim() ? "Tell us your name." : n.trim().length > NAME_MAX ? "That name is too long." : undefined;

export function validateConsult(p: Partial<ConsultPayload>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.specialty || !SLUG.test(p.specialty)) e.specialty = "Something went wrong. Please reload the page.";
  if (p.condition && !SLUG.test(p.condition)) e.condition = "Something went wrong. Please reload the page.";
  const n = nameError(p.name);
  if (n) e.name = n;
  if (!p.phone || !normalisePhone(p.phone)) e.phone = "Enter a 10 digit Indian mobile number.";
  if (!SLOTS.some((s) => s.id === p.slot)) e.slot = "Choose a time that suits you.";
  if (p.note && p.note.length > NOTE_MAX) e.note = `Keep it under ${NOTE_MAX} characters.`;
  if (!p.consent) e.consent = "Tick this so we are allowed to contact you.";
  return e;
}

export function validateLead(p: Partial<LeadPayload>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.download || !SLUG.test(p.download)) e.download = "Something went wrong. Please reload the page.";
  if (p.condition && !SLUG.test(p.condition)) e.condition = "Something went wrong. Please reload the page.";
  const n = nameError(p.name);
  if (n) e.name = n;
  if (p.gate === "email") {
    if (!p.email || !isEmail(p.email.trim())) e.email = "That email does not look right.";
  } else if (!p.phone || !normalisePhone(p.phone)) {
    e.phone = "Enter a 10 digit Indian WhatsApp number.";
  }
  if (!p.consent) e.consent = "Tick this so we are allowed to contact you.";
  return e;
}

/** A path only: drops any query string or hash, so nothing typed can ride along. */
export function cleanPath(p?: string): string | undefined {
  if (!p || !p.startsWith("/")) return undefined;
  return p.split(/[?#]/)[0].slice(0, 200);
}
