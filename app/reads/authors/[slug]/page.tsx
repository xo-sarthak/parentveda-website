import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostCard from "@/components/reads/PostCard";
import JsonLd from "@/components/JsonLd";
import { AUTHORS, authorInitials, authorPath, getAuthorBySlug, type Qualification } from "@/lib/authors";
import { breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { getAllPosts, type GuidePost } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/* A writer's or reviewer's profile. It exists as much for search as for readers: health
   content is judged heavily on who stands behind it, and a credentialed,
   linkable Person with structured data is the strongest signal we can give.
   Carried over from the old site; the look is new. */

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const author = getAuthorBySlug((await params).slug);
  if (!author) return {};
  const canonical = `${authorPath(author.slug)}/`;
  const title = `${author.name}${author.credentials ? `, ${author.credentials}` : ""}`;
  return {
    title,
    description: author.shortBio,
    alternates: { canonical },
    openGraph: { type: "profile", url: `${SITE_URL}${canonical}`, title, description: author.shortBio },
    twitter: { card: "summary", title, description: author.shortBio },
  };
}

const QUALS_SHOWN = 4;

/** "linkedin.com/in/x" → "LinkedIn". Anything unrecognised shows its domain. */
function profileLabel(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const known: Record<string, string> = { "linkedin.com": "LinkedIn", "x.com": "X", "twitter.com": "X", "practo.com": "Practo", "instagram.com": "Instagram" };
  return known[host] ?? host;
}

function PostShelf({ id, title, posts }: { id: string; title: string; posts: GuidePost[] }) {
  if (!posts.length) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby={id}>
      <div className="wrap">
        <h2 id={id} className="display-m" style={{ marginBottom: 24 }}>
          {title}
        </h2>
        <ul className="agrid agrid--three">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* A degree with an institution reads as it always has: the degree in bold, the
   institution and year under it. A plain line (a training, a posting) is just text. */
function Qual({ q }: { q: Qualification }) {
  return q.institution ? (
    <li>
      <b>{q.degree}</b>
      {q.institution}
      {q.year ? `, ${q.year}` : ""}
    </li>
  ) : (
    <li>{q.degree}</li>
  );
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = getAuthorBySlug((await params).slug);
  if (!author) notFound();
  const canonical = `${authorPath(author.slug)}/`;
  const all = await getAllPosts();
  const reviewed = all.filter((p) => p.reviewedBy === author.slug);
  const written = all.filter((p) => p.authorSlug === author.slug);
  const shortName = author.name.replace(/^Dr\.?\s+/, "Dr ");
  const isExpert = author.kind === "expert";

  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#C5D6C4", ["--deep-tone" as string]: "#2E5E45" }} aria-labelledby="a-title">
        <div className="wrap">
          <div className="phero__copy rperson">
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              {isExpert ? <Link href="/experts/">Our experts</Link> : <Link href="/about/">About ParentVeda</Link>}
            </nav>
            <div className="rperson__top">
              {author.photo ? (
                <Image src={author.photo} alt={author.name} width={112} height={112} className="rperson__photo" priority />
              ) : (
                <span className="rhead__initials rperson__photo">{authorInitials(author.name)}</span>
              )}
              <div>
                <span className="phero__range">{isExpert ? "Our expert" : "Our team"}</span>
                <h1 id="a-title" className="display-l">
                  {author.name}
                </h1>
                {author.credentials ? <p className="rperson__cred">{author.credentials}</p> : null}
                <p className="rperson__role">{author.role}</p>
              </div>
            </div>
            <div className="prose">
              {author.bio.map((b) => (
                <p key={b.slice(0, 24)}>{b}</p>
              ))}
            </div>
            {author.sameAs?.length ? (
              <p className="rperson__links">
                {author.sameAs.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer me">
                    {profileLabel(url)}
                  </a>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {isExpert ? (
      <section className="section" style={{ paddingTop: 16 }} aria-label="Credentials">
        <div className="wrap">
          <div className="cards3">
            <div>
              <h3>Qualifications</h3>
              <ul className="rperson__list">
                {author.qualifications.slice(0, QUALS_SHOWN).map((q) => (
                  <Qual key={q.degree} q={q} />
                ))}
              </ul>
              {author.qualifications.length > QUALS_SHOWN && (
                /* Native disclosure: no client JS. Both labels are in the markup; CSS shows the right one. */
                <details className="showall">
                  <summary>
                    <span className="showall__open">Show all {author.qualifications.length}</span>
                    <span className="showall__close">Show less</span>
                  </summary>
                  <ul className="rperson__list">
                    {author.qualifications.slice(QUALS_SHOWN).map((q) => (
                      <Qual key={q.degree} q={q} />
                    ))}
                  </ul>
                </details>
              )}
            </div>
            <div>
              <h3>Specialties</h3>
              <ul className="rperson__list">
                {author.specialties.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Practice</h3>
              <ul className="rperson__list">
                {author.experience ? <li>{author.experience}</li> : null}
                {author.practice ? <li>{author.practice}</li> : null}
                {author.location ? <li>{author.location}</li> : null}
                {author.registration ? <li>Registered: {author.registration}</li> : null}
                {author.languages?.length ? <li>Speaks {author.languages.join(" and ")}</li> : null}
                {author.memberships.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <PostShelf id="rev-title" title={`Reads reviewed by ${shortName}`} posts={reviewed} />
      <PostShelf id="wrote-title" title={`Reads written by ${shortName}`} posts={written} />
      <JsonLd
        data={[
          personSchema(author, `${SITE_URL}${canonical}`),
          breadcrumbSchema([
            isExpert ? { name: "Our experts", path: "/experts/" } : { name: "About ParentVeda", path: "/about/" },
            { name: author.name, path: canonical },
          ]),
        ]}
      />
    </>
  );
}
