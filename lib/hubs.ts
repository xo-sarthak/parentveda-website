/* ============================================================
   Hub page helpers: which hubs a deploy shows, how a hub's articles split
   into its sections, and the format badge on each card. Server-only.
   ============================================================ */

import { metaFor } from "@/lib/article-meta";
import { CONDITIONS, isHubLive, postsForCondition, type Condition, type PlanStage } from "@/lib/conditions";
import { showUnreviewed } from "@/lib/review-gate";
import type { GuidePost } from "@/lib/guides";

/** Plan stages, in the order the index lists them, with the words readers see. */
export const HUB_STAGES: { key: PlanStage; label: string; anchor: string }[] = [
  { key: "TTC", label: "Trying to conceive", anchor: "trying-to-conceive" },
  { key: "Preconception", label: "Before pregnancy", anchor: "before-pregnancy" },
  { key: "Pregnancy", label: "Pregnancy", anchor: "pregnancy" },
  { key: "Parenting 0-5", label: "Babies and young children", anchor: "babies-and-young-children" },
  { key: "Child", label: "Children 5 to 12", anchor: "children" },
];

/** Live hubs everywhere; on preview and dev, every hub, so the team can check drafts. */
export function visibleHubs(posts: GuidePost[]): Condition[] {
  return showUnreviewed() ? CONDITIONS : CONDITIONS.filter((c) => isHubLive(c, posts));
}

export function hubVisible(c: Condition, posts: GuidePost[]): boolean {
  return isHubLive(c, posts) || showUnreviewed();
}

export type Format = "Article" | "Guide" | "Myth vs fact" | "Hinglish" | "Research" | "Book summary" | "Q&A" | "Recipe";

/** The badge on a hub card, from what we already know about the post. */
export function formatOf(p: GuidePost): Format {
  const m = metaFor(p.slug);
  if (m.role === "hinglish") return "Hinglish";
  if (p.category === "research-summaries") return "Research";
  if (p.category === "book-summaries") return "Book summary";
  if (p.category === "parenting-faq") return "Q&A";
  if (p.category === "recipes") return "Recipe";
  if (p.tags.some((t) => /myth/i.test(t)) || /\bmyths?\b/i.test(p.title)) return "Myth vs fact";
  if (m.role === "pillar") return "Guide";
  return "Article";
}

/* "What helps" holds the treatment and care reads; "Understand" holds the rest. */
const HELPS = /\b(treat|treatment|manag|recover|recovery|care|diet|foods?|exercise|tips|relief|what to do|after|improve|increase|cope|coping)\b/i;

export function splitHubPosts(c: Condition, posts: GuidePost[]): { understand: GuidePost[]; helps: GuidePost[] } {
  const all = postsForCondition(c, posts);
  const helps = all.filter((p) => metaFor(p.slug).role !== "pillar" && HELPS.test(p.title));
  return { understand: all.filter((p) => !helps.includes(p)), helps };
}
