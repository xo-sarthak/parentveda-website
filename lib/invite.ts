/* ============================================================
   Referral invites — the shared contract between this site and
   the ParentVeda Android app.
   ============================================================

   The flow this file supports:

     app share sheet  →  parentveda.in/invite/ABCD234
                      →  (Android) bounce to Play with ?referrer=…
                      →  install  →  first launch
                      →  app reads the referrer via the Play Install
                         Referrer API and applies the code itself

   Three things below MUST stay in sync with the app repo. If either
   side changes one alone, shared links silently stop crediting:

     1. ANDROID_PACKAGE  — the app's applicationId
     2. the URL shape    — /invite/<CODE>
     3. REFERRER_KEY     — the key the code travels under inside the
                           Play referrer string

   ============================================================ */

/** Play Store application id — must equal `applicationId` in the app's build.gradle. */
export const ANDROID_PACKAGE = "com.parentveda.app";

/**
 * Whether the app is live on Google Play.
 *
 * FALSE until launch, and deliberately so: the homepage still renders
 * <DownloadComingSoon /> and lib/content.ts still has PLAY_STORE_HREF = "#download",
 * i.e. there is no Play listing to send anyone to yet. While this is false the
 * invite page renders in full but never redirects — it shows the code and points
 * at the waitlist instead, so links shared today don't dead-end on a 404 store page.
 *
 * On launch day: flip this to true. Nothing else here needs to change.
 */
export const APP_LIVE = false;

/** Route prefix. The app builds `${SITE_URL}${INVITE_BASE}/${code}`. */
export const INVITE_BASE = "/invite";

/**
 * The key the referral code travels under inside the Play referrer string.
 * utm_content is used rather than a custom key so the same install also shows
 * up as a campaign in Play Console acquisition reports.
 */
export const REFERRER_KEY = "utm_content";

/**
 * Accepted code shape — confirmed against lib/referral/referral_engine.dart.
 *
 * The generator was never broken; it produces EXACTLY 7 characters from
 * `ABCDEFGHJKMNPQRSTUVWXYZ23456789` — no I, L, O, 0 or 1, so a code retyped
 * from a screenshot cannot be mistyped into a different valid one.
 *
 * The old shape (4-12 of A-Z0-9) accepted codes the app can never produce,
 * including ones containing the excluded characters. Kept for reference:
 * const CODE_RE = /^[A-Z0-9]{4,12}$/;
 *
 * NOTE length is the ONLY difference between an invite code (7) and a Care
 * Partner token (10). That is precisely why the two systems are told apart by
 * `utm_source` and never by length — see lib/care.ts.
 */
export const INVITE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const INVITE_CODE_LENGTH = 7;

const CODE_RE = new RegExp(`^[${INVITE_ALPHABET}]{${INVITE_CODE_LENGTH}}$`);

/**
 * Normalise a code out of the URL.
 *
 * Codes are case-insensitive by design: people retype these from screenshots,
 * and chat apps sometimes lowercase a URL's tail when they auto-link it. So
 * /invite/abcd234 and /invite/ABCD234 resolve to the same invite.
 *
 * Next.js has already percent-decoded the route param, so no decoding here.
 */
export const normaliseCode = (raw: string) => raw.trim().toUpperCase();

export const isValidCode = (code: string) => CODE_RE.test(code);

/** The canonical shareable link for a code. */
export const invitePath = (code: string) => `${INVITE_BASE}/${normaliseCode(code)}`;

/**
 * Play Store URL carrying the referral code.
 *
 * `referrer` is itself a query string, so it gets encoded twice — once when
 * built here, once when appended. The app receives it back *decoded* from
 * InstallReferrerClient, i.e. exactly:
 *
 *     utm_source=invite&utm_medium=referral&utm_content=ABCD234
 *
 * …which it should parse as a query string rather than string-matching.
 */
export function playStoreUrl(code: string) {
  const referrer = new URLSearchParams({
    utm_source: "invite",
    utm_medium: "referral",
    [REFERRER_KEY]: normaliseCode(code),
  });

  const query = new URLSearchParams({
    id: ANDROID_PACKAGE,
    referrer: referrer.toString(),
  });

  return `https://play.google.com/store/apps/details?${query.toString()}`;
}
