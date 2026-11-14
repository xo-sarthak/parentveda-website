import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, S, P, A } from "@/components/legal/LegalPage";
import CorrectionForm from "@/components/legal/CorrectionForm";
import { ORG, draftHidden, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/* DRAFT, needs legal and founder review. 404 in production while
   LEGAL_PAGES marks it `draft` (lib/legal.ts). */

const META = getLegalPage("corrections")!;

export const metadata: Metadata = {
  title: META.title,
  description: META.summary,
  alternates: { canonical: `${legalPath(META.slug)}/` },
  robots: META.draft ? { index: false, follow: false } : undefined,
  openGraph: { type: "website", url: `${SITE_URL}${legalPath(META.slug)}/`, title: `${META.title} · ${ORG.brand}`, description: META.summary },
};

const SECTIONS = [
  { id: "report", title: "Tell us what is wrong" },
  { id: "next", title: "What happens next" },
];

export default function CorrectionsPage() {
  if (draftHidden(META)) notFound();
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS} draft={META.draft}>
      <S id="report" title="Tell us what is wrong">
        <P>
          We would rather be corrected than be wrong in front of someone who is worried. Please do not share your own medical
          details here. This form is for errors in our reads, not for medical questions.
        </P>
        <CorrectionForm />
      </S>
      <S id="next" title="What happens next">
        <P>
          A reviewer checks every report. Small fixes are made quietly. A change that alters the meaning of a read is noted on that
          read, with the date. How we review is in our <A href={legalPath("medical-review-policy")}>Medical Review Policy</A>.
        </P>
      </S>
    </LegalPage>
  );
}
