import Link from "next/link";
import { LEGAL_BASE, ORG } from "@/lib/legal";

/**
 * Shell and prose primitives for the policy pages. The six policy pages are
 * carried over from the old site word for word and only use these
 * primitives, so the whole look lives here.
 *
 * Policies are read under stress (how do I delete my data? is this medical
 * advice?), so: a real contents list, short sections, plain headings, a capped
 * measure like the articles.
 */

export function LegalPage({
  title,
  summary,
  sections,
  children,
}: {
  title: string;
  summary: string;
  /** Anchors for the contents list — must match the <S id> values below. */
  sections: { id: string; title: string }[];
  children: React.ReactNode;
}) {
  return (
    <article className="legal">
      <header className="legal__head">
        <div className="wrap legal__narrow">
          <nav className="rhead__crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`${LEGAL_BASE}/`}>Policies</Link>
          </nav>
          <h1 className="display-l">{title}</h1>
          <p className="legal__summary">{summary}</p>
          <p className="small">
            Effective {ORG.effective} · Last updated {ORG.updated}
          </p>
        </div>
      </header>
      <div className="wrap legal__narrow">
        {sections.length > 1 ? (
          <nav aria-label="Contents" className="legal__toc">
            <p className="rtoc__h">Contents</p>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="legal__body">{children}</div>
        <p className="legal__end">
          Questions about this page? Write to <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>. You can also read
          our{" "}
          <Link href={`${LEGAL_BASE}/`} className="link">
            other policies
          </Link>
          .
        </p>
      </div>
    </article>
  );
}

/** A numbered top-level section. `id` must match the contents entry. */
export function S({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="legal__s">
      <h2>{title}</h2>
      <div className="legal__sbody">{children}</div>
    </section>
  );
}

/** A sub-heading inside a section. */
export function H({ children }: { children: React.ReactNode }) {
  return <h3 className="legal__h">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="legal__p">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="legal__ul">{children}</ul>;
}

export function LI({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className="legal__a" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

/** Something the reader must not miss — used sparingly. */
export function Callout({ children }: { children: React.ReactNode }) {
  return <aside className="legal__callout">{children}</aside>;
}
