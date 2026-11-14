import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/reads/PostCard";
import { breadcrumbSchema } from "@/lib/jsonld";
import { metaFor } from "@/lib/article-meta";
import { CLUSTERS, STAGE_NAMES, clusterPath, stagePath, type Cluster } from "@/lib/clusters";
import { GUIDES_BASE, GUIDES_NAME, type GuidePost } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/* A cluster list, e.g. /pregnancy/complications/: every published read in
   that cluster, pillars first. Plain links, so crawlers can walk it.

   A list with fewer than INDEX_MIN reads is a thin page, so it is kept out of
   search (noindex, follow) and out of the sitemap until it fills up. */

export const INDEX_MIN = 3;

export function postsInCluster(c: Cluster, posts: GuidePost[]): GuidePost[] {
  return posts
    .filter((p) => metaFor(p.slug).cluster === c.name)
    .sort((a, b) => Number(metaFor(b.slug).role === "pillar") - Number(metaFor(a.slug).role === "pillar") || (a.date < b.date ? 1 : -1));
}

export function clustersWithPosts(posts: GuidePost[], min = 1): Cluster[] {
  return CLUSTERS.filter((c) => postsInCluster(c, posts).length >= min);
}

export function clusterMetadata(c: Cluster, count: number): Metadata {
  const stage = STAGE_NAMES[c.stage];
  const title = `${c.leaf} · ${stage}`;
  const description = `${c.leaf}: every ParentVeda read on this topic for ${stage.toLowerCase()}, written for Indian families.`;
  return {
    title,
    description,
    alternates: { canonical: clusterPath(c) },
    ...(count < INDEX_MIN ? { robots: { index: false, follow: true } } : {}),
    openGraph: { type: "website", url: `${SITE_URL}${clusterPath(c)}`, title, description },
  };
}

export default function ClusterListing({ cluster, posts }: { cluster: Cluster; posts: GuidePost[] }) {
  const stage = STAGE_NAMES[cluster.stage];
  const crumbs = [
    { name: GUIDES_NAME, path: `${GUIDES_BASE}/` },
    { name: stage, path: stagePath(cluster.stage) },
    { name: cluster.leaf, path: clusterPath(cluster) },
  ];
  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#F7ECD4" }} aria-labelledby="cl-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 860 }}>
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <Link href={crumbs[0].path}>{crumbs[0].name}</Link>
              <span aria-hidden="true">/</span>
              <Link href={crumbs[1].path}>{crumbs[1].name}</Link>
            </nav>
            <h1 id="cl-title" className="display-xl">
              <span className="hl">
                <span>{cluster.leaf}</span>
              </span>
            </h1>
            <p className="lede">
              Every read on this topic for {stage.toLowerCase()}, with the main guides first.
            </p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }} aria-label={cluster.leaf}>
        <div className="wrap">
          <ul className="agrid">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
