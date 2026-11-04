import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR_FIELD, EXPERTS, authorPath } from "@/lib/authors";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";

/* The people behind ParentVeda's guidance, one card each, linking to the
   profile at /reads/authors/<slug>/ (that URL is unchanged). Built from the
   Reads index card pattern (.agrid / .acard in articles.css).

   The cover names the expert's FIELD, not a stage: nobody here belongs to one,
   and a stage label would imply that she only helps there. Tones simply cycle. */

const DESCRIPTION =
  "Genetic counselling, women's health physiotherapy, breastfeeding, childbirth education and child psychology. Here is who they are and what they have trained in.";

export const metadata: Metadata = {
  title: "Our experts",
  description: DESCRIPTION,
  alternates: { canonical: "/experts/" },
  openGraph: { type: "website", url: `${SITE_URL}/experts/`, title: "Our experts", description: DESCRIPTION },
  twitter: { card: "summary", title: "Our experts", description: DESCRIPTION },
};

const TONES = [
  { tone: "#E8D9C0", deep: "#6B4A1F" },
  { tone: "#E8C4CE", deep: "#7A3348" },
  { tone: "#D8CCE8", deep: "#4A3470" },
] as const;

// Dr. Mahender Singh was on the site first and keeps the last place, as in the approved layout.
const LAST = "dr-mahender-singh";
const experts = [...EXPERTS.filter((a) => a.slug !== LAST), ...EXPERTS.filter((a) => a.slug === LAST)];

export default function ExpertsPage() {
  return (
    <>
      <section className="phero ahero" style={{ ["--tone" as string]: "#E8C4CE" }} aria-labelledby="x-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 880 }}>
            <span className="phero__range">Our experts</span>
            <h1 id="x-title" className="display-xl">
              Our experts
            </h1>
            <p className="lede">{DESCRIPTION}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }} aria-label="All experts">
        <div className="wrap">
          <ul className="agrid">
            {experts.map((a, i) => {
              const look = TONES[i % TONES.length];
              return (
                <li key={a.slug}>
                  <Link
                    href={`${authorPath(a.slug)}/`}
                    className="acard"
                    style={{ ["--tone" as string]: look.tone, ["--deep" as string]: look.deep }}
                  >
                    <span className="acard__cover" aria-hidden="true">
                      <span className="acard__disc" />
                      <span className="acard__cat">{AUTHOR_FIELD[a.slug]}</span>
                    </span>
                    <span className="acard__body">
                      <span className="acard__meta">Helps with {a.specialties.slice(0, 3).join(" · ")}</span>
                      <span className="acard__title">{a.name}</span>
                      <span className="acard__desc">
                        {a.role}. {a.shortBio}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="experts__note">These specialists work with us. They do not replace your own doctor.</p>
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: "Our experts", path: "/experts/" }])} />
    </>
  );
}
