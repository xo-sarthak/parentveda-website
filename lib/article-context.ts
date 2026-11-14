/* ============================================================
   Everything an article page needs beyond the post itself: where it sits
   (breadcrumbs), what to read next, which cards to show, whether it is a
   sensitive page, and its red-flag card. Server-only.
   ============================================================ */

import { metaFor, type ArticleMeta } from "@/lib/article-meta";
import {
  CONTENT_STAGE,
  STAGE_NAMES,
  clusterPath,
  getCluster,
  stagePath,
  type Cluster,
  type SiteStage,
} from "@/lib/clusters";
import { conditionPath, getCondition, isHubLive, type Condition } from "@/lib/conditions";
import { resolveCards, type Card } from "@/lib/cta";
import { GUIDES_BASE, GUIDES_NAME, type GuidePost } from "@/lib/guides";
import { canShow } from "@/lib/review-gate";
import type { Crumb } from "@/lib/jsonld";

export type ArticleContext = {
  meta: ArticleMeta;
  cluster?: Cluster;
  condition?: Condition;
  /** The hub, only when it is live. */
  hub?: { name: string; path: string };
  stage?: SiteStage;
  /** Breadcrumb trail above the title, without the title itself. */
  crumbs: Crumb[];
  sensitive: boolean;
  /** Reviewed red flags, or unreviewed ones on preview and dev. Empty = no card. */
  redFlags: string[];
  cards: Card[];
};

export function articleContext(post: GuidePost, all: GuidePost[]): ArticleContext {
  const meta = metaFor(post.slug);
  const cluster = getCluster(meta.cluster);
  const condition = getCondition(meta.condition);
  const stage = cluster?.stage ?? (post.stage ? CONTENT_STAGE[post.stage] : undefined);

  const crumbs: Crumb[] = [{ name: GUIDES_NAME, path: `${GUIDES_BASE}/` }];
  if (stage) crumbs.push({ name: STAGE_NAMES[stage], path: stagePath(stage) });
  if (cluster) crumbs.push({ name: cluster.leaf, path: clusterPath(cluster) });

  const sensitive = meta.sensitivity === "high" || condition?.sensitivity === "high";
  const redFlags = meta.red_flags.length && canShow(meta.red_flags_reviewed) ? meta.red_flags : [];

  return {
    meta,
    cluster,
    condition,
    hub: condition && isHubLive(condition, all) ? { name: condition.name, path: conditionPath(condition.slug) } : undefined,
    stage,
    crumbs,
    sensitive,
    redFlags,
    cards: resolveCards({ meta, condition, cluster, stage }),
  };
}

/**
 * Read next: same condition first, then same cluster, then same stage.
 * Inside a condition or cluster, pillars come first; then shared tags, then the newest.
 * Only if those run out do other articles fill the gaps, by shared tags.
 */
export function relatedFor(post: GuidePost, all: GuidePost[], n = 3): GuidePost[] {
  const me = metaFor(post.slug);
  const myStage = getCluster(me.cluster)?.stage ?? (post.stage ? CONTENT_STAGE[post.stage] : undefined);
  const tier = (p: GuidePost) => {
    const m = metaFor(p.slug);
    if (me.condition && m.condition === me.condition) return 3;
    if (me.cluster && m.cluster === me.cluster) return 2;
    const st = getCluster(m.cluster)?.stage ?? (p.stage ? CONTENT_STAGE[p.stage] : undefined);
    if (myStage && st === myStage) return 1;
    return 0;
  };
  const shared = (p: GuidePost) => p.tags.filter((t) => post.tags.includes(t)).length;
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, t: tier(p), pillar: metaFor(p.slug).role === "pillar" ? 1 : 0, s: shared(p) }))
    /* Inside a condition or cluster, the pillar leads. Across a whole stage,
       shared tags say more about closeness than being a pillar does. */
    .sort(
      (a, b) =>
        b.t - a.t ||
        (a.t >= 2 ? b.pillar - a.pillar : 0) ||
        b.s - a.s ||
        b.pillar - a.pillar ||
        (a.p.date < b.p.date ? 1 : -1)
    )
    .slice(0, n)
    .map((x) => x.p);
}
