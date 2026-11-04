import Link from "next/link";
import PostCard from "@/components/reads/PostCard";
import { GUIDES_BASE, GUIDES_NAME, categoryPath, type GuideCategory, type GuidePost } from "@/lib/guides";

/* One page of a category. Plain links, no client state, so a crawler can walk
   every page and reach every article. */

export const POSTS_PER_PAGE = 48;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

/** Page 1 keeps the address it has always had. */
export function listingPath(category: string, page: number): string {
  return page <= 1 ? `${categoryPath(category)}/` : `${categoryPath(category)}/page/${page}/`;
}

export default function CategoryListing({ category, posts, page }: { category: GuideCategory; posts: GuidePost[]; page: number }) {
  const pages = pageCount(posts.length);
  const shown = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#F7ECD4" }} aria-labelledby="c-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 860 }}>
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <Link href={`${GUIDES_BASE}/`}>{GUIDES_NAME}</Link>
            </nav>
            <h1 id="c-title" className="display-xl">
              <span className="hl"><span>{category.name}</span></span>
            </h1>
            <p className="lede rv rv-d2">{category.description || category.tagline}</p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }} aria-label={category.name}>
        <div className="wrap">
          {shown.length ? (
            <ul className="agrid">
              {shown.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} categoryName={category.name} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="aempty">
              <p className="display-m">{category.name} are being written.</p>
              <p>
                <Link className="link" href={`${GUIDES_BASE}/`}>See everything in Reads</Link>, or{" "}
                <Link className="link" href="/ask-veda/">ask Veda</Link> the question you came with.
              </p>
            </div>
          )}
          {pages > 1 ? (
            <nav className="rpages" aria-label={`${category.name} pages`}>
              {page > 1 ? <Link href={listingPath(category.slug, page - 1)} rel="prev">Newer</Link> : null}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} aria-current="page">{n}</span>
                ) : (
                  <Link key={n} href={listingPath(category.slug, n)}>{n}</Link>
                )
              )}
              {page < pages ? <Link href={listingPath(category.slug, page + 1)} rel="next">Older</Link> : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
