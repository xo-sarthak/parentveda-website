// One place for everything that changes at launch.
// The app is not on Google Play yet (the app repo's docs/STILL-OPEN.md §1.1),
// so every "Get the app" button routes to /download until `appLive` flips.

export const site = {
  name: "ParentVeda",
  domain: "https://parentveda.in",
  tagline: "A companion that stays.",
  description:
    "ParentVeda is a calm, India-first family companion — from trying to conceive, through pregnancy, into parenting and the school years.",
  appLive: false,
  playUrl: "https://play.google.com/store/apps/details?id=com.parentveda.app",
  // Seen in the app repo; confirm before launch (DECISIONS.md).
  email: "partners@parentveda.com",
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
  { href: "/articles", label: "Articles" },
];
