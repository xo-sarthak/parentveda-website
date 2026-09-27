import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostCard from "@/components/reads/PostCard";
import { AUTHORS, authorInitials, authorPath, getAuthorBySlug, type Author } from "@/lib/authors";
import { GUIDES_BASE, GUIDES_NAME, getAllPosts } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/* A reviewer's profile. It exists as much for search as for readers: health
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

function personSchema(author: Author, canonicalAbs: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: canonicalAbs,
    jobTitle: author.role,
    description: author.shortBio,
    honorificPrefix: "Dr.",
    ...(author.photo ? { image: `${SITE_URL}${author.photo}` } : {}),
    knowsAbout: author.specialties,
    ...(author.languages?.length ? { knowsLanguage: author.languages } : {}),
    alumniOf: [...new Set(author.qualifications.map((q) => q.institution))].map((name) => ({
      "@type": "EducationalOrganization",
      name,
    })),
    hasCredential: author.qualifications.map((q) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: q.degree,
      educationalLevel: q.degree,
      dateCreated: q.year,
      recognizedBy: { "@type": "EducationalOrganization", name: q.institution },
    })),
    memberOf: author.memberships.map((name) => ({ "@type": "Organization", name })),
    ...(author.practice ? { worksFor: { "@type": "MedicalBusiness", name: author.practice } } : {}),
    ...(author.registration ? { identifier: author.registration } : {}),
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = getAuthorBySlug((await params).slug);
  if (!author) notFound();
  const canonical = `${authorPath(author.slug)}/`;
  const posts = (await getAllPosts()).filter((p) => p.author.trim().toLowerCase() === author.name.toLowerCase());

  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#C5D6C4", ["--deep-tone" as string]: "#2E5E45" }} aria-labelledby="a-title">
        <div className="wrap">
          <div className="phero__copy rperson">
            <nav className="rhead__crumbs" aria-label="Breadcrumb">
              <Link href={`${GUIDES_BASE}/`}>{GUIDES_NAME}</Link>
            </nav>
            <div className="rperson__top">
              {author.photo ? (
                <Image src={author.photo} alt={author.name} width={112} height={112} className="rperson__photo" priority />
              ) : (
                <span className="rhead__initials rperson__photo">{authorInitials(author.name)}</span>
              )}
              <div>
                <span className="phero__range">Medical reviewer</span>
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
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }} aria-label="Credentials">
        <div className="wrap">
          <div className="cards3">
            <div>
              <h3>Qualifications</h3>
              <ul className="rperson__list">
                {author.qualifications.map((q) => (
                  <li key={q.degree}>
                    <b>{q.degree}</b>
                    {q.institution}, {q.year}
                  </li>
                ))}
              </ul>
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

      {posts.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="rev-title">
          <div className="wrap">
            <h2 id="rev-title" className="display-m" style={{ marginBottom: 24 }}>
              Reads reviewed by {author.name.replace(/^Dr\.?\s+/, "Dr ")}
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
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(author, `${SITE_URL}${canonical}`)) }} />
    </>
  );
}
