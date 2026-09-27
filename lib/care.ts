/* ============================================================
   Care Partner referrals — /care/<TOKEN>

   The bridge between a QR poster on a clinic wall and the app. A phone camera
   cannot open an app that is not installed, so every scan lands in a browser
   first. This is that page's contract.

   NOT the same system as /invite/:

     /care/<TOKEN>   doctor invites parent   10 chars   utm_source=care
     /invite/<CODE>  parent invites parent    4-12      utm_source=invite

   They must never resolve each other's links, and they are told apart by
   `utm_source`, NEVER by length — the day either length changes, matching on
   length would silently start crediting the wrong person with nothing erroring
   anywhere.
   ============================================================ */

import { supabase } from "@/lib/supabase";
import { ANDROID_PACKAGE } from "@/lib/invite";

/** No I, L, O, 0 or 1 — so a token read off a printed poster cannot be mistyped. */
export const CARE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const CARE_TOKEN_LENGTH = 10;

const TOKEN_RE = new RegExp(`^[${CARE_ALPHABET}]{${CARE_TOKEN_LENGTH}}$`);

export const CARE_BASE = "/care";
export const carePath = (token: string) => `${CARE_BASE}/${normaliseToken(token)}`;

/** Tokens are case-insensitive; posters and prescriptions get retyped by hand. */
export const normaliseToken = (raw: string) => raw.trim().toUpperCase();

export const isValidToken = (token: string) => TOKEN_RE.test(token);

/* ---------------- Channel & campaign ----------------
   Channels the app understands:
     qr · link · whatsapp · sms · email · nfc · poster · prescription ·
     report · website · manual

   Sanitised rather than checked against that list, deliberately: the app may
   add a channel before this site hears about it, and dropping an unknown-but-
   harmless value would silently record the scan as a QR. Anything that is not
   a plain short slug is dropped instead of passed through. */
const sanitiseTag = (raw: string | undefined, max: number): string | undefined => {
  if (!raw) return undefined;
  const clean = raw.trim().toLowerCase();
  // Reject over-length rather than truncate. Slicing first turned a long but
  // otherwise valid slug into a DIFFERENT valid slug, which then rode into
  // utm_term and was recorded as a real channel nobody ever used — wrong data
  // reads as real data, whereas a dropped tag reads as missing.
  if (clean.length > max) return undefined;
  return /^[a-z0-9_-]+$/.test(clean) ? clean : undefined;
};

export const sanitiseChannel = (raw?: string) => sanitiseTag(raw, 20);
export const sanitiseCampaign = (raw?: string) => sanitiseTag(raw, 40);

/* ---------------- Play Store link ----------------
   The install referrer is the only free mechanism that carries an identifier
   through an app-store install, and the app already reads it on first launch. */
export function carePlayStoreUrl(
  token: string,
  opts: { channel?: string; campaign?: string } = {}
): string {
  const referrer = new URLSearchParams();
  // Order matches the spec's worked example. utm_source is what distinguishes
  // a doctor token from a parent invite code — it is not optional.
  referrer.set("utm_source", "care");
  referrer.set("utm_medium", "partner");
  referrer.set("utm_content", normaliseToken(token));
  if (opts.channel) referrer.set("utm_term", opts.channel);
  if (opts.campaign) referrer.set("utm_campaign", opts.campaign);

  const query = new URLSearchParams({
    id: ANDROID_PACKAGE,
    referrer: referrer.toString(),
  });

  return `https://play.google.com/store/apps/details?${query.toString()}`;
}

/* ---------------- The trust label ----------------

   A doctor recommending something to a patient is not an advertisement, and
   the wording must never suggest otherwise. The app enforces this in three
   places (a model fallback, a DB CHECK constraint, and the only component that
   renders a partner). This is the fourth, and nothing automatic protects it.

   Fail closed: an allowlist, not a blocklist. The spec's rule is "never render
   an unrecognised label", and a blocklist can only ever catch the phrasings
   somebody thought of. Anything unfamiliar falls back to "Invited by".

   Adding a label the team starts using is a one-line change here — deliberately
   a code change rather than something editable in a CMS, because the whole
   point is that no database value can put "Sponsored by" on this page. */
const ALLOWED_TRUST_LABELS = [
  "Invited by",
  "Recommended by",
  "Connected through",
  "Your Care Partner",
  "Supported by",
  // Seeded by migration 0038 for corporate and insurance partners. Without it
  // those rows fell back to "Invited by" — not wrong, but not what the row
  // said, and an employer providing a benefit did not "invite" anybody.
  "Provided by",
] as const;

export const DEFAULT_TRUST_LABEL = "Invited by";

/** Belt and braces — these must never appear even if one is ever allowlisted. */
const BANNED_FRAGMENTS = ["sponsor", "advert", "promot", "ad by", "paid"];

export function safeTrustLabel(raw?: string | null): string {
  if (!raw) return DEFAULT_TRUST_LABEL;
  const value = raw.trim();
  const lower = value.toLowerCase();

  if (BANNED_FRAGMENTS.some((w) => lower.includes(w))) return DEFAULT_TRUST_LABEL;

  const match = ALLOWED_TRUST_LABELS.find((l) => l.toLowerCase() === lower);
  return match ?? DEFAULT_TRUST_LABEL;
}

/* ---------------- Data ---------------- */

/** Organisations get a logo and square corners; people get a photo and a circle. */
export type PartnerKind = "person" | "organisation";

export type CarePartner = {
  name: string;
  kind: PartnerKind;
  /** "Obstetrician · Rainbow Hospital, Hyderabad" — prebuilt for display. */
  subtitle: string;
  imageUrl: string | null;
  trustLabel: string;
};

/* The real values of care_partners.type, confirmed against
   lib/care_partner/care_partner_models.dart (CarePartnerType.known):

     doctor · hospital · clinic · diagnostic_lab · ivf_centre · nutritionist
     lactation_consultant · psychologist · physiotherapist · corporate · insurance

   CORRECTED: the previous list guessed three values that do not exist in the
   database — "lab", "ivf" and "organisation" — and was missing three that do:
   diagnostic_lab, corporate and insurance. A diagnostic lab therefore rendered
   as a PERSON: circular crop, reading photo_url, so a logo that was actually
   set never appeared and it fell through to initials.

   Kept for reference:
   const ORGANISATION_TYPES = ["hospital", "clinic", "lab", "ivf", "ivf_centre", "organisation"]; */
const ORGANISATION_TYPES = [
  "hospital",
  "clinic",
  "diagnostic_lab",
  "ivf_centre",
  "corporate",
  "insurance",
];

type ReferralRow = {
  partner_id: string | null;
  campaign_id: string | null;
  channel: string | null;
  active: boolean | null;
  expires_at: string | null;
};

type PartnerRow = {
  name: string | null;
  type: string | null;
  status: string | null;
  speciality: string | null;
  organisation: string | null;
  department: string | null;
  city: string | null;
  photo_url: string | null;
  logo_url: string | null;
  trust: { primary?: string } | null;
};

/**
 * Resolve a token to the partner behind it.
 *
 * Returns null for anything that is not a live, named partner — unknown token,
 * revoked, expired, a partner who is not `active`, or Supabase being
 * unreachable. Every one of those is the
 * same outcome for the visitor: she sees a normal ParentVeda page and still
 * reaches the store. A poster that has been on a wall for two years must never
 * dead-end a real person.
 *
 * The principle: a broken poster costs the doctor their credit, never costs
 * the parent the app.
 */
export async function getCarePartner(token: string): Promise<CarePartner | null> {
  if (!isValidToken(token)) return null;
  if (!supabase) return null; // no keys: the generic page, token still in the referrer

  try {
    const { data: referral, error: refError } = await supabase
      .from("partner_referrals")
      .select("partner_id, campaign_id, channel, active, expires_at")
      .eq("token", normaliseToken(token))
      .maybeSingle();

    if (refError || !referral) return null;

    const row = referral as ReferralRow;
    if (!row.active || !row.partner_id) return null;
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return null;

    const { data: partner, error: partnerError } = await supabase
      .from("care_partners")
      .select(
        "name, type, status, speciality, organisation, department, city, photo_url, logo_url, trust"
      )
      .eq("id", row.partner_id)
      .is("deleted_at", null)
      .maybeSingle();

    if (partnerError || !partner) return null;

    return toCarePartner(partner as PartnerRow);
  } catch {
    // Network failure, malformed row, anything. The page renders generically
    // and the token still rides in the referrer, so attribution survives even
    // when we could not name the doctor.
    return null;
  }
}

/* Only an ACTIVE partner may be named on this page.

   care_partners.status is one of: pending · active · inactive · rejected.
   The app's attribute_to_partner() refuses anything but `active` — it returns
   'partner_not_active' — so naming a deactivated doctor here would tell a
   parent she was invited by someone the app is then going to refuse to credit.
   That is a promise the product cannot keep, and it also puts a professional's
   name on a live page after we stopped working with them.

   (An inactive partner DOES still appear in the Care Circle of a family they
   already brought — that is history, and erasing it would rewrite her story.
   A fresh scan is the opposite case: no relationship exists yet.) */
const ACQUIRING_STATUS = "active";

function toCarePartner(p: PartnerRow): CarePartner | null {
  const name = p.name?.trim();
  if (!name) return null; // An unnamed partner is worse than no partner.
  if ((p.status ?? "").toLowerCase() !== ACQUIRING_STATUS) return null;

  const kind: PartnerKind = ORGANISATION_TYPES.includes((p.type ?? "").toLowerCase())
    ? "organisation"
    : "person";

  const subtitle = [
    p.speciality?.trim(),
    [p.department?.trim(), p.organisation?.trim()].filter(Boolean).join(", "),
    p.city?.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    name,
    kind,
    subtitle,
    // Prefer the right one for the kind, but fall back to the other rather
    // than showing initials when an image exists — this mirrors what the app's
    // CarePartnerCard does, so the same row does not render differently in the
    // two places a parent sees it.
    imageUrl:
      (kind === "organisation"
        ? p.logo_url?.trim() || p.photo_url?.trim()
        : p.photo_url?.trim() || p.logo_url?.trim()) || null,
    trustLabel: safeTrustLabel(p.trust?.primary),
  };
}

/** Initials for the fallback mark — "Dr Meera Rao" → "MR". Never a broken image. */
export function partnerInitials(name: string): string {
  return name
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
