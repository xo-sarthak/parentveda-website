import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_BASE, LEGAL_PAGES, ORG, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Policies",
  description: "ParentVeda's privacy policy, terms of use, medical disclaimer, cookie policy and editorial standards.",
  alternates: { canonical: `${LEGAL_BASE}/` },
  openGraph: { type: "website", url: `${SITE_URL}${LEGAL_BASE}/`, title: "ParentVeda · Policies" },
};

export default function LegalIndexPage() {
  return (
    <article className="legal">
      <header className="legal__head">
        <div className="wrap legal__narrow">
          <nav className="rhead__crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
          </nav>
          <h1 className="display-l">Policies</h1>
          <p className="legal__summary">
            How {ORG.brand} handles your information, what we promise, and the limits of what guidance from a website or an app
            can be.
          </p>
        </div>
      </header>
      <div className="wrap legal__narrow">
        <ul className="legal__list">
          {LEGAL_PAGES.map((p) => (
            <li key={p.slug}>
              <Link href={`${legalPath(p.slug)}/`}>
                <span>
                  <b>{p.title}</b>
                  {p.summary}
                </span>
                <Icon name="arrow" size={18} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="legal__end">
          Last updated {ORG.updated}. If anything here is unclear, write to{" "}
          <a className="link" href={`mailto:${ORG.contactEmail}`}>
            {ORG.contactEmail}
          </a>{" "}
          and we will explain it in plain words.
        </p>
      </div>
    </article>
  );
}
