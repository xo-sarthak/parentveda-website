/* ============================================================
   Which cards an article shows (inline after the article, and one in the side
   rail), in place of the old "same calculator everywhere" card.

   Order of preference, one card per kind (tool, download, consult):
     1. the article's own `cta` in content/article-meta.json
     2. its condition's tool, download and consult
     3. its cluster's defaults (content/clusters.json)
     4. its stage's default (content/cta-defaults.json), only for an article
        with no cluster, so a loss or complication page never inherits a
        calculator just because of its stage
   A card shows only when the thing exists: a built tool, a download with a
   file, a consult specialty in the consult config. When nothing is left, the
   app waitlist is the fallback; on a sensitive page, the "Talk to someone"
   card takes its place (lib/article-context.ts).
   ============================================================ */

import { STAGE_CTA, type Cluster, type CtaPlan, type SiteStage } from "@/lib/clusters";
import type { Condition } from "@/lib/conditions";
import type { ArticleMeta } from "@/lib/article-meta";
import { TOOLS, type ToolInfo } from "@/lib/tools";
import { getConsult, type Consult } from "@/lib/consults";
import { getDownload, type Download } from "@/lib/downloads";

export type Card =
  | { kind: "tool"; tool: ToolInfo }
  | { kind: "download"; download: Download }
  | { kind: "consult"; consult: Consult };

function cardsFrom(plan: CtaPlan): Card[] {
  const out: Card[] = [];
  const tool = plan.tool ? TOOLS.find((t) => t.slug === plan.tool && t.available !== false) : undefined;
  if (tool) out.push({ kind: "tool", tool });
  const download = getDownload(plan.download);
  if (download) out.push({ kind: "download", download });
  const consult = getConsult(plan.consult);
  if (consult) out.push({ kind: "consult", consult });
  return out;
}

export function resolveCards({
  meta,
  condition,
  cluster,
  stage,
}: {
  meta: ArticleMeta;
  condition?: Condition;
  cluster?: Cluster;
  stage?: SiteStage;
}): Card[] {
  const levels: CtaPlan[] = [
    meta.cta,
    ...(condition ? [{ tool: condition.tool, download: condition.download, consult: condition.consult.specialty }] : []),
    ...(cluster ? [cluster.cta] : stage ? [STAGE_CTA[stage]] : []),
  ];
  const picked = new Map<Card["kind"], Card>();
  for (const level of levels) {
    for (const card of cardsFrom(level)) if (!picked.has(card.kind)) picked.set(card.kind, card);
  }
  return [...picked.values()];
}
