import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, S, P, UL, LI, A } from "@/components/legal/LegalPage";
import { ORG, draftHidden, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/* DRAFT, needs legal and founder review. 404 in production while
   LEGAL_PAGES marks it `draft` (lib/legal.ts). Before it goes live, the review
   practice must match it: see docs/website-upgrade/reviewer-mismatch.csv. */

const META = getLegalPage("medical-review-policy")!;

export const metadata: Metadata = {
  title: META.title,
  description: META.summary,
  alternates: { canonical: `${legalPath(META.slug)}/` },
  robots: META.draft ? { index: false, follow: false } : undefined,
  openGraph: { type: "website", url: `${SITE_URL}${legalPath(META.slug)}/`, title: `${META.title} · ${ORG.brand}`, description: META.summary },
};

const SECTIONS = [
  { id: "who", title: "Who reviews our health content" },
  { id: "matching", title: "How we match the reviewer to the topic" },
  { id: "checks", title: "What a reviewer checks" },
  { id: "cycle", title: "How often we review" },
  { id: "tools", title: "Our free tools" },
  { id: "sources", title: "The sources we prefer" },
  { id: "corrections", title: "How corrections work" },
];

export default function MedicalReviewPolicyPage() {
  if (draftHidden(META)) notFound();
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS} draft={META.draft}>
      <S id="who" title="Who reviews our health content">
        <P>
          Health content on {ORG.brand} is checked by qualified professionals before it is published. Each one has a profile on our{" "}
          <A href="/experts/">Our experts</A> page, with their qualifications, their registration where they have one, and the
          reads they have reviewed.
        </P>
        <P>
          A review credit on a read means that person really did check it. We never add a reviewer&rsquo;s name to a piece they
          have not read, and a read that is waiting for review shows no reviewer at all.
        </P>
      </S>

      <S id="matching" title="How we match the reviewer to the topic">
        <P>The reviewer&rsquo;s field should match the subject of the read:</P>
        <UL>
          <LI>Trying to conceive: a gynaecologist or a fertility specialist. For male fertility: an andrologist or urologist.</LI>
          <LI>Pregnancy: an obstetrician. For scans and tests, a fetal medicine specialist or radiologist can review too.</LI>
          <LI>Newborns and child health: a paediatrician or neonatologist.</LI>
          <LI>Development concerns: a developmental paediatrician, a child psychologist or a therapist.</LI>
          <LI>Food and nutrition: a nutritionist or dietitian. Breastfeeding: a lactation consultant.</LI>
        </UL>
        <P>Our condition guides name the specialty they need, and are reviewed by someone in that specialty.</P>
      </S>

      <S id="checks" title="What a reviewer checks">
        <UL>
          <LI>That the facts are right and up to date.</LI>
          <LI>That nothing important is missing, and the warning signs are complete.</LI>
          <LI>That the read never tells someone to wait when they should see a doctor.</LI>
          <LI>That the tone is calm and does not frighten.</LI>
        </UL>
        <P>If a reviewer and a writer disagree, the reviewer decides. If a read cannot be made accurate, it is not published.</P>
      </S>

      <S id="cycle" title="How often we review">
        <P>
          Every read is reviewed again at least once every 12 months, and sooner when the guidance it relies on changes. Each read
          shows the date it was last reviewed.
        </P>
      </S>

      <S id="tools" title="Our free tools">
        <P>
          Our tools explain what a number usually means and what to ask your doctor. They never give a diagnosis. Every reference
          value a tool uses is checked by a specialist before the tool goes live, and is reviewed on the same cycle as our reads.
        </P>
      </S>

      <S id="sources" title="The sources we prefer">
        <UL>
          <LI>Indian guidance first: FOGSI, ICMR and the Ministry of Health and Family Welfare.</LI>
          <LI>International guidance: WHO, NICE, ACOG and RCOG.</LI>
          <LI>Peer-reviewed research, with systematic reviews ahead of single studies.</LI>
        </UL>
        <P>
          More on how we write is in our <A href={legalPath("editorial-policy")}>Editorial Policy</A>.
        </P>
      </S>

      <S id="corrections" title="How corrections work">
        <P>
          If you find something wrong, please <A href={legalPath("corrections")}>report it here</A> or write to{" "}
          <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>. A reviewer checks every report. Small fixes are made
          quietly. A change that alters the meaning of a read is noted on that read, with the date.
        </P>
      </S>
    </LegalPage>
  );
}
