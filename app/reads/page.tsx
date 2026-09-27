import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/reads/PostCard";
import ReadsBrowser from "@/components/reads/ReadsBrowser";
import Icon from "@/components/Icon";
import { GUIDES_BASE, GUIDES_TAGLINE, categoryPath, countByCategory, getAllPosts, getCategories } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// Live from Directus: at most a minute stale, instant once /api/revalidate is wired.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Reads",
  description: GUIDES_TAGLINE,
  alternates: { canonical: `${GUIDES_BASE}/` },
  openGraph: { type: "website", url: `${SITE_URL}${GUIDES_BASE}/`, title: "ParentVeda Reads" },
};

export default async function ReadsPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  const counts = await Promise.all(categories.map((c) => countByCategory(c.slug)));
  const nameOf = (slug: string) => categories.find((c) => c.slug === slug)?.name;

  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#F7ECD4" }} aria-labelledby="r-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 880 }}>
            <span className="phero__range" style={{ color: "#7A4600" }}>
              Reads
            </span>
            <h1 id="r-title" className="display-xl">
              <span className="hl"><span>The things nobody</span></span>
              <span className="hl"><span><em>stops to explain.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              Calm, plain-language reads for Indian families: what a scan report means, what things cost here, what’s normal and
              what isn’t. Reviewed with care, and every one points you back to your own doctor.
            </p>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="rcats" aria-label="Kinds of reads">
          <div className="wrap">
            <ul className="rcats__row">
              {categories.map((c, i) => (
                <li key={c.slug}>
                  <Link href={`${categoryPath(c.slug)}/`} className="rcat">
                    <b>{c.name}</b>
                    <span>{c.tagline}</span>
                    <em>
                      {counts[i]} {counts[i] === 1 ? "read" : "reads"} <Icon name="arrow" size={15} />
                    </em>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 24 }} aria-label="All reads">
        <div className="wrap">
          {posts.length ? (
            <ReadsBrowser
              items={posts.map((p) => ({
                key: `${p.category}/${p.slug}`,
                stage: p.stage,
                node: <PostCard post={p} categoryName={nameOf(p.category)} />,
              }))}
            />
          ) : (
            <div className="aempty">
              <p className="display-m">New reads are on their way.</p>
              <p>
                In the meantime, <Link className="link" href="/ask-veda/">Ask Veda</Link> can answer the question you came with.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
