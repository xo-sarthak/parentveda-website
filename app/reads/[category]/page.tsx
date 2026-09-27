import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/reads/PostCard";
import { GUIDES_BASE, GUIDES_NAME, categoryPath, getCategories, getCategory, getPostsByCategory } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;
// A category added in Directus after the build still renders; unknown slugs 404 below.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  const canonical = `${categoryPath(category.slug)}/`;
  return {
    title: `${category.name} · Reads`,
    description: category.description || category.tagline,
    alternates: { canonical },
    openGraph: { type: "website", url: `${SITE_URL}${canonical}`, title: `${category.name} · ParentVeda Reads` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  const posts = await getPostsByCategory(category.slug);

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
          {posts.length ? (
            <ul className="agrid">
              {posts.map((p) => (
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
        </div>
      </section>
    </>
  );
}
