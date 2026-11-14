import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, postPath } from "@/lib/guides";
import { metaFor } from "@/lib/article-meta";
import { getAuthorBySlug } from "@/lib/authors";
import { CONDITIONS, MIN_HUB_ARTICLES, postsForCondition } from "@/lib/conditions";
import { ALL_TOOLS } from "@/lib/tools";
import { acceptedFor, requiredFor } from "@/lib/specialties";

/* /internal/content-health/: a working list for the content team. Off unless
   CONTENT_HEALTH=1 is set on the deploy; noindex and blocked in robots.txt.
   Shows only slugs, titles and settings, never anything a visitor typed. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content health",
  robots: { index: false, follow: false },
};

export default async function ContentHealth() {
  if (process.env.CONTENT_HEALTH !== "1") notFound();
  const posts = await getAllPosts();

  const rows = posts.map((p) => {
    const m = metaFor(p.slug);
    const reviewer = p.reviewedBy ? getAuthorBySlug(p.reviewedBy) : undefined;
    const required = requiredFor(m);
    const mismatch = Boolean(required && (!reviewer || !(reviewer.specialty ?? []).some((s) => acceptedFor(required, m.cluster).includes(s))));
    return { p, m, reviewer, required, mismatch };
  });
  const missing = rows.filter((r) => !r.m.cluster || !r.m.condition || !r.reviewer || !r.p.reviewedDate);
  const mismatched = rows.filter((r) => r.mismatch);
  const thinHubs = CONDITIONS.map((c) => ({ c, n: postsForCondition(c, posts).length })).filter((x) => x.n < MIN_HUB_ARTICLES);
  const unreviewedTools = ALL_TOOLS.filter((t) => t.available === false);
  const link = (p: (typeof posts)[number]) => `${p.canonicalPath ?? postPath(p.category, p.slug)}/`;
  const yesNo = (b: boolean) => (b ? "yes" : "missing");

  return (
    <section className="section">
      <div className="wrap health">
        <h1 className="display-m">Content health</h1>
        <p>
          {posts.length} published reads. Data: content/article-meta.json, content/conditions, lib/tools-reference. The full reviewer report is
          docs/website-upgrade/reviewer-mismatch.csv.
        </p>

        <h2>Reads missing cluster, condition, reviewer or review date ({missing.length})</h2>
        <div className="rtable">
          <table>
            <thead>
              <tr>
                <th>Read</th>
                <th>Cluster</th>
                <th>Condition</th>
                <th>Reviewer</th>
                <th>Last reviewed</th>
              </tr>
            </thead>
            <tbody>
              {missing.map(({ p, m, reviewer }) => (
                <tr key={p.slug}>
                  <td>
                    <Link href={link(p)}>{p.slug}</Link>
                  </td>
                  <td>{yesNo(Boolean(m.cluster))}</td>
                  <td>{m.condition ?? "none"}</td>
                  <td>{reviewer?.name ?? "missing"}</td>
                  <td>{p.reviewedDate ?? "missing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Reviewer specialty does not match ({mismatched.length})</h2>
        <div className="rtable">
          <table>
            <thead>
              <tr>
                <th>Read</th>
                <th>Reviewer</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              {mismatched.map(({ p, reviewer, required }) => (
                <tr key={p.slug}>
                  <td>
                    <Link href={link(p)}>{p.slug}</Link>
                  </td>
                  <td>{reviewer ? `${reviewer.name} (${(reviewer.specialty ?? []).join(", ")})` : "none"}</td>
                  <td>{required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Hubs with fewer than {MIN_HUB_ARTICLES} published reads ({thinHubs.length})</h2>
        <ul>
          {thinHubs.map(({ c, n }) => (
            <li key={c.slug}>
              {c.tier} {c.slug}: {n}
            </li>
          ))}
        </ul>

        <h2>Tools waiting for medical review ({unreviewedTools.length})</h2>
        <ul>
          {unreviewedTools.map((t) => (
            <li key={t.slug}>
              {t.slug}: lib/tools-reference/{t.slug}.json
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
