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
} as const;

export function getAppHref() {
  return site.appLive ? site.playUrl : "/download";
}

export const nav = [
  { href: "/trying-to-conceive", label: "Trying" },
  { href: "/pregnancy", label: "Pregnancy" },
  { href: "/parenting", label: "Parenting" },
  { href: "/skilling", label: "Skilling" },
  { href: "/ask-veda", label: "Ask Veda" },
  { href: "/reads", label: "Reads" }, // was /articles, "Articles": Reads is the one articles section
];

/* Named exports the carried-over files from the old site import (lib/care,
   lib/legal pages, reads). Keep SITE_URL in sync with site.domain. */
export const SITE_URL = site.domain;
export const SITE_NAME = site.name;
export const BASE_PATH = "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
