import type { Metadata } from "next";
import { EXPERT_GROUPS, LISTED_EXPERTS, authorField, authorInitials, authorPath } from "@/lib/authors";
import ExpertDirectory, { type DirectoryExpert } from "@/components/experts/ExpertDirectory";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";

/* The people behind ParentVeda's guidance, one card each, linking to the
   profile at /reads/authors/<slug>/ (that URL is unchanged). Built from the
   Reads index card pattern (.agrid / .acard in articles.css), with filter chips
   by field.

   The cover names the expert's FIELD, not a stage: nobody here belongs to one.
   Families reach experts through ParentVeda, so a card shows a city at most:
   never a clinic, hospital, phone, email or outside profile. */

const DESCRIPTION =
  "Fertility doctors, obstetricians, physiotherapists, lactation consultants, nutritionists, yoga teachers and child psychologists. Here is who they are and what they have trained in.";

export const metadata: Metadata = {
  title: "Our experts",
  description: DESCRIPTION,
  alternates: { canonical: "/experts/" },
  openGraph: { type: "website", url: `${SITE_URL}/experts/`, title: "Our experts", description: DESCRIPTION },
  twitter: { card: "summary", title: "Our experts", description: DESCRIPTION },
};


export default function ExpertsPage() {
  const experts: DirectoryExpert[] = LISTED_EXPERTS.map((a) => ({
    slug: a.slug,
    href: `${authorPath(a.slug)}/`,
    name: a.name,
    credentials: a.credentials,
    role: a.role,
    field: authorField(a),
    group: a.group,
    founding: a.founding,
    initials: authorInitials(a.name),
    photo: a.photo,
    meta: [a.location, a.experience].filter(Boolean).join(" \u00b7 "),
    helps: a.specialties.slice(0, 3).join(" \u00b7 "),
  }));
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
          <ExpertDirectory experts={experts} groups={EXPERT_GROUPS} />
          <p className="experts__note">These specialists work with ParentVeda, and you can reach them through the app. They do not replace your own doctor.</p>
        </div>
      </section>
      <JsonLd data={breadcrumbSchema([{ name: "Our experts", path: "/experts/" }])} />
    </>
  );
}
