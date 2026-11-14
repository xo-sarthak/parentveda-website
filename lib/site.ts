// One place for everything that changes at launch.
// The app is not on Google Play yet (the app repo's docs/STILL-OPEN.md §1.1),
// so every "Get the app" button routes to /download until `appLive` flips.

export const site = {
  name: "ParentVeda",
  domain: "https://parentveda.in",
  // The official tagline (the user, 2026-10-01). Was "Your child’s story starts
  // with you.", which stays the home headline and the voice guide's idea.
  tagline: "Your trusted parenting companion",
  description:
    "ParentVeda is a calm, India-first companion for the whole journey of raising a child: trying to conceive, pregnancy, parenting and the school years.",
  appLive: false,
  playUrl: "https://play.google.com/store/apps/details?id=com.parentveda.app",
  // The same mailbox the legal pages and the app use (lib/legal.ts ORG).
  // Was "partners@parentveda.com", seen in an app-repo doc; kept for revert.
  email: "hello@parentveda.in",
  /* ParentVeda's own public profiles (Instagram, YouTube, LinkedIn, Pinterest,
     Facebook, X). They go into the homepage's Organization schema as sameAs. */
  socials: [
    "https://www.linkedin.com/company/parentveda/",
    "https://www.instagram.com/parent_veda/",
    "https://www.facebook.com/profile.php?id=61595986366855",
    "https://www.youtube.com/@ParentVeda",
    "https://x.com/ParentVeda",
    "https://www.threads.com/@parent_veda",
    "https://in.pinterest.com/parentveda/",
    "https://medium.com/@ParentVeda",
  ] as string[],
} as const;

export function getAppHref() {
  return site.appLive ? site.playUrl : "/download";
}

/** A link into the app with UTM tags saying which component sent the visitor.
    Tags go only on the Play Store link: on our own /download page they would
    start a new GA4 session and lose where the visitor came from. */
export function appLink(medium: string, campaign: string) {
  if (!site.appLive) return "/download/";
  const u = new URL(site.playUrl);
  u.searchParams.set("utm_source", "web");
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

export const nav = [
  { href: "/trying-to-conceive", label: "Trying" },
  { href: "/pregnancy", label: "Pregnancy" },
  { href: "/parenting", label: "Parenting" },
  { href: "/skilling", label: "Skilling" },
  { href: "/ask-veda", label: "Ask Veda" },
  { href: "/tools/", label: "Free tools" },
  { href: "/reads", label: "Reads" }, // was /articles, "Articles": Reads is the one articles section
  { href: "/experts", label: "Our experts" },
];

/* Named exports the carried-over files from the old site import (lib/care,
   lib/legal pages, reads). Keep SITE_URL in sync with site.domain. */
export const SITE_URL = site.domain;
export const SITE_NAME = site.name;
export const BASE_PATH = "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
