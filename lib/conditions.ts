/* ============================================================
   Condition hubs (/conditions/<slug>/).

   Data: one JSON file per condition in content/conditions/, listed in
   content/conditions/index.ts. A hub is live only when its file says
   `published: true` AND at least MIN_HUB_ARTICLES published articles belong to
   it. Until then every link to it (the "Part of the guide" box, menus,
   sitemap) stays hidden.

   Which articles belong: first those whose content/article-meta.json entry
   names this condition, then, as a fallback, articles whose tags match one of
   the hub's `article_match.keywords`.
   ============================================================ */

import { CONDITION_FILES } from "@/content/conditions";
import { metaFor } from "@/lib/article-meta";
import { planStageToSite, type SiteStage } from "@/lib/clusters";
import type { GuidePost } from "@/lib/guides";

export const CONDITIONS_BASE = "/conditions";
export const MIN_HUB_ARTICLES = 3;

export type PlanStage = "TTC" | "Preconception" | "Pregnancy" | "Parenting 0-5" | "Child";

export type Condition = {
  slug: string;
  name: string;
  alternate_names: string[];
  stage: PlanStage;
  tier: "P1" | "P2";
  published: boolean;
  /** The reassuring promise, in plain words. */
  one_line: string;
  who_this_is_for: string;
  /** Specialty for consult routing, as written in the plan. */
  specialty: string;
  /** In content/specialties.json names. */
  reviewer_specialty_required: string;
  /** The expert (lib/authors.ts slug) who actually reviewed this hub, and when.
      Both stay null until that review has happened: the hub then shows no
      reviewer at all, never a made-up one. */
  reviewed_by: string | null;
  reviewed_at: string | null;
  sensitivity: "low" | "medium" | "high";
  /** MEDICAL-REVIEW. Shown only once red_flags_reviewed is true. */
  red_flags: string[];
  red_flags_reviewed: boolean;
  tool: string | null;
  download: string | null;
  /** `specialty` is a key in content/consults.json. Prices live there, once. */
  consult: { specialty: string; mode: "book" | "callback" };
  article_match: { conditions: string[]; keywords: string[] };
  hinglish_pair: string | null;
  /** "Questions to take to your doctor", shown when the hub has no tool. */
  doctor_questions: string[];
  /** The "Track" section: an app feature or a web tracker. */
  track: { label: string; tool?: string; app_feature?: string } | null;
  faq: { q: string; a: string }[];
};

export const CONDITIONS: Condition[] = CONDITION_FILES;

const bySlug = new Map(CONDITIONS.map((c) => [c.slug, c]));

export function getCondition(slug?: string | null): Condition | undefined {
  return slug ? bySlug.get(slug) : undefined;
}

export function conditionPath(slug: string): string {
  return `${CONDITIONS_BASE}/${slug}/`;
}

export function conditionSiteStage(c: Condition): SiteStage {
  return planStageToSite(c.stage);
}

/** Articles that belong to a condition: tagged ones first, then keyword matches. */
export function postsForCondition(c: Condition, posts: GuidePost[]): GuidePost[] {
  const tagged = posts.filter((p) => {
    const m = metaFor(p.slug).condition;
    return m !== null && c.article_match.conditions.includes(m);
  });
  // Whole-word starts, so "amh" never matches inside another word.
  const keys = c.article_match.keywords.map((k) => new RegExp(`\\b${k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  const matched = posts.filter((p) => {
    if (tagged.includes(p)) return false;
    // An article tagged with a different condition stays there.
    if (metaFor(p.slug).condition) return false;
    const hay = [p.title, ...p.tags].join(" ").toLowerCase();
    return keys.some((k) => k.test(hay));
  });
  const pillarFirst = (a: GuidePost, b: GuidePost) =>
    Number(metaFor(b.slug).role === "pillar") - Number(metaFor(a.slug).role === "pillar");
  return [...tagged.sort(pillarFirst), ...matched];
}

/** A hub is live once it is marked published and has enough real articles. */
export function isHubLive(c: Condition, posts: GuidePost[]): boolean {
  return c.published && postsForCondition(c, posts).length >= MIN_HUB_ARTICLES;
}

export function liveConditions(posts: GuidePost[]): Condition[] {
  return CONDITIONS.filter((c) => isHubLive(c, posts));
}
