import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostCard from "@/components/reads/PostCard";
import JsonLd from "@/components/JsonLd";
import { AUTHORS, LISTED_EXPERTS, authorField, authorInitials, authorPath, getAuthorBySlug, type Author, type Qualification } from "@/lib/authors";
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

/** "Dr. Smitha Avula" → "Dr Avula"; "Keya Sampat" → "Keya". */
function callName(a: Author): string {
  const parts = a.name.replace(/^(Dr|Dt)\.?\s+/, "").split(/\s+/);
  return /^Dr\.?\s/.test(a.name) ? `Dr ${parts[parts.length - 1]}` : parts[0];
}

/* The only way to reach an expert from her page is through ParentVeda: no
   phone, email, clinic or outside profile appears anywhere on it. */
function ExpertCta({ author }: { author: Author }) {
  const who = callName(author);
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-label={`Talk to ${who}`}>
      <div className="wrap">
        <div className="xcta">
          <div>
            <h2 className="display-m">Talk to {who} on ParentVeda</h2>
            <p>
              Consultations, classes and questions with {who} happen inside the ParentVeda app, so your notes and
              reports stay in one place.
            </p>
          </div>
          <Link href="/download/" className="btn btn--ink">
            Get the app
          </Link>
        </div>
      </div>
    </section>
  );
}

function Others({ author }: { author: Author }) {
  const others = LISTED_EXPERTS.filter((o) => o.group && o.group === author.group && o.slug !== author.slug).slice(0, 3);
  if (!others.length) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby="others-title">
      <div className="wrap">
        <h2 id="others-title" className="display-m" style={{ marginBottom: 24 }}>
          More in {authorField(author)}
        </h2>
        <ul className="agrid agrid--three">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`${authorPath(o.slug)}/`} className="acard">
                <span className="acard__body">
                  <span className="acard__meta">{authorField(o)}</span>
                  <span className="acard__title">{o.name}</span>
                  <span className="acard__desc">{o.role}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
                <span className="phero__range">{isExpert ? (author.founding ? "Founding expert" : "Our expert") : "Our team"}</span>
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
            {isExpert && author.founding ? (
              <p className="rperson__founding">
                <b>Founding expert.</b> {callName(author)} is one of the specialists who helped shape ParentVeda from the start.
              </p>
            ) : null}
            {!isExpert && author.sameAs?.length ? (
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
              {author.qualifications.length ? null : <p className="rperson__empty">Being added.</p>}
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
                {/* No practice name for an expert: families reach experts through ParentVeda. */}
                {author.location ? <li>{author.location}</li> : null}
                {author.registration ? <li>Registered with the {author.registration}</li> : null}
                {author.languages?.length ? <li>Speaks {author.languages.join(" and ")}</li> : null}
                {author.memberships.map((m) => (
                  <li key={m}>{m}</li>
                ))}
                <li>Sees ParentVeda families online, through the app</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isExpert ? <ExpertCta author={author} /> : null}

      <PostShelf id="rev-title" title={`Reads reviewed by ${shortName}`} posts={reviewed} />
      <PostShelf id="wrote-title" title={`Reads written by ${shortName}`} posts={written} />
      {isExpert ? <Others author={author} /> : null}
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
