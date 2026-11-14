/* ============================================================
   Clusters: the content team's topic groups, e.g. "Pregnancy > Complications".

   The list lives in content/clusters.json, built from the "Cluster" column of
   the publishing plan sheet. The `name` must match the sheet word for word.
   Each cluster has a list page at /<stage>/<slug>/ once it has a published
   article (app/[stage]/[page]/page.tsx).
   ============================================================ */

import CLUSTER_DATA from "@/content/clusters.json";
import CTA_DEFAULTS from "@/content/cta-defaults.json";

/** The site's stage routes: /trying-to-conceive, /pregnancy, /parenting. */
export type SiteStage = "trying-to-conceive" | "pregnancy" | "parenting";

export type CtaPlan = { tool?: string | null; download?: string | null; consult?: string | null };

export type Cluster = {
  /** Exactly as in the plan sheet: "Pregnancy > Complications". */
  name: string;
  /** The part before " > ": TTC, Pregnancy, Parenting 0-5, Kids 5-12, Cross-stage. */
  prefix: string;
  /** The part after " > ", shown in breadcrumbs and as the page title. */
  leaf: string;
  /** URL segment under the stage. Unique within a stage. */
  slug: string;
  stage: SiteStage;
  /** Default cards for articles in this cluster (see lib/cta.ts). */
  cta: CtaPlan;
};

export const CLUSTERS = CLUSTER_DATA as Cluster[];

export const STAGE_NAMES: Record<SiteStage, string> = {
  "trying-to-conceive": "Trying to conceive",
  pregnancy: "Pregnancy",
  parenting: "Parenting",
};

/** The content table's stage values, mapped to the site's stage routes. */
export const CONTENT_STAGE: Record<string, SiteStage> = { ttc: "trying-to-conceive", pregnancy: "pregnancy", parenting: "parenting" };

/** The plan's condition stages (TTC, Preconception, Pregnancy, Parenting 0-5, Child) on the site's three. */
export function planStageToSite(stage: string): SiteStage {
  if (stage === "Pregnancy") return "pregnancy";
  if (stage === "Parenting 0-5" || stage === "Child") return "parenting";
  return "trying-to-conceive"; // TTC, Preconception
}

export const STAGE_CTA = CTA_DEFAULTS as Record<SiteStage, CtaPlan>;

const byName = new Map(CLUSTERS.map((c) => [c.name, c]));

export function getCluster(name?: string | null): Cluster | undefined {
  return name ? byName.get(name) : undefined;
}

export function getClusterBySlug(stage: string, slug: string): Cluster | undefined {
  return CLUSTERS.find((c) => c.stage === stage && c.slug === slug);
}

export function clusterPath(c: Cluster): string {
  return `/${c.stage}/${c.slug}/`;
}

export function stagePath(stage: SiteStage): string {
  return `/${stage}/`;
}
