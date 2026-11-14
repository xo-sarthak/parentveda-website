/* ============================================================
   Extra facts about each article that the website needs and the content table
   does not hold: its cluster, condition, role, sensitivity, red flags, cards
   and language pair.

   They live in content/article-meta.json, keyed by article slug, so nothing in
   the shared Supabase table changes (the app reads that table too) and
   `updated_at` never moves. An entry can exist before its article is
   published ("planned": true); it takes effect the moment the slug goes live.
   A slug with no entry still works: every field falls back to "unknown".

   Most values were filled from the publishing plan sheet (Cluster,
   Sensitivity and Medical reviewer columns). Sheet sensitivity maps as
   Standard = low, Medical-urgent = medium, Emotional = high.
   ============================================================ */

import META from "@/content/article-meta.json";
import type { CtaPlan } from "@/lib/clusters";

export type Role = "pillar" | "spoke" | "hinglish" | "tool-page" | "commerce-hub" | "checklist-hub";
export type Sensitivity = "low" | "medium" | "high";

export type ArticleMeta = {
  /** True for a slug that is planned but not yet published. */
  planned?: boolean;
  /** Exact cluster string from the plan, e.g. "Pregnancy > Complications". */
  cluster: string | null;
  /** Hub slug in content/conditions/, or null. */
  condition: string | null;
  role: Role;
  sensitivity: Sensitivity;
  /** The reviewer specialty this article needs, in content/specialties.json names. */
  reviewer_specialty_required: string | null;
  /** Emergency signs for the red-flag card. MEDICAL-REVIEW. */
  red_flags: string[];
  /** Set to true only after a doctor has signed off the red_flags list. */
  red_flags_reviewed: boolean;
  /** Cards to show, overriding the condition, cluster and stage defaults. */
  cta: CtaPlan;
  /** Slug of the matching page in the other language. */
  hinglish_pair: string | null;
  english_pair: string | null;
};

const ALL = META as Record<string, ArticleMeta>;

const EMPTY: ArticleMeta = {
  cluster: null,
  condition: null,
  role: "spoke",
  sensitivity: "low",
  reviewer_specialty_required: null,
  red_flags: [],
  red_flags_reviewed: false,
  cta: {},
  hinglish_pair: null,
  english_pair: null,
};

export function metaFor(slug: string): ArticleMeta {
  const m = ALL[slug];
  return m ? { ...EMPTY, ...m, cta: m.cta ?? {} } : EMPTY;
}

export function hasMeta(slug: string): boolean {
  return slug in ALL;
}

export const ARTICLE_META = ALL;
