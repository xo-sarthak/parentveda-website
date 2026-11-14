import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, S, P, UL, LI, A } from "@/components/legal/LegalPage";
import { ORG, draftHidden, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/* DRAFT, needs legal and founder review. 404 in production while
   LEGAL_PAGES marks it `draft` (lib/legal.ts). Every line here must be true
   before it goes live, especially the referral fee arrangements. */

const META = getLegalPage("how-we-make-money")!;

export const metadata: Metadata = {
  title: META.title,
  description: META.summary,
  alternates: { canonical: `${legalPath(META.slug)}/` },
  robots: META.draft ? { index: false, follow: false } : undefined,
  openGraph: { type: "website", url: `${SITE_URL}${legalPath(META.slug)}/`, title: `${META.title} · ${ORG.brand}`, description: META.summary },
};

const SECTIONS = [
  { id: "why", title: "Why we tell you this" },
  { id: "affiliate", title: "Shopping links" },
  { id: "referrals", title: "Lab and clinic referrals" },
  { id: "consults", title: "Consultations with specialists" },
  { id: "programmes", title: "Programmes and classes" },
  { id: "brands", title: "Brand partnerships" },
  { id: "never", title: "What we never do" },
];

export default function HowWeMakeMoneyPage() {
  if (draftHidden(META)) notFound();
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS} draft={META.draft}>
      <S id="why" title="Why we tell you this">
        <P>
          {ORG.brand} is run by {ORG.legalEntity}. Reading is free. You should know how we pay for it, so you can judge what you
          read here.
        </P>
      </S>

      <S id="affiliate" title="Shopping links">
        <P>
          Some reads link to products on Amazon. If you buy through one of those links, we earn a small commission. You pay the
          same price. Every page with such a link says so above the first one. More in our{" "}
          <A href={legalPath("affiliate-disclosure")}>Affiliate Disclosure</A>.
        </P>
      </S>

      <S id="referrals" title="Lab and clinic referrals">
        <P>
          When we help you book a test or a visit with a partner lab or clinic, the partner may pay {ORG.legalEntity} a platform
          fee. No payment ever goes to an individual doctor for referring you, and no fee changes which test or clinic our reads
          suggest.
        </P>
      </S>

      <S id="consults" title="Consultations with specialists">
        <P>
          You can pay to talk to a specialist through {ORG.brand}. The price is shown before you ask for a session. Part of the
          fee goes to the specialist and part to us.
        </P>
      </S>

      <S id="programmes" title="Programmes and classes">
        <P>Some programmes and classes in the app are paid. Their price is shown before you join.</P>
      </S>

      <S id="brands" title="Brand partnerships">
        <P>
          We may work with brands that fit what families need. Any paid content is clearly labelled as paid, and it never appears
          inside our medical guidance.
        </P>
      </S>

      <S id="never" title="What we never do">
        <UL>
          <LI>Sell your personal information, or use what you tell us about your health for advertising.</LI>
          <LI>Put shopping links on pages about a loss or a hard diagnosis.</LI>
          <LI>Let any payment change what a read says, or which doctor, test or product it suggests.</LI>
          <LI>Accept payment to add or remove a review credit.</LI>
        </UL>
        <P>
          See also our <A href={legalPath("privacy")}>Privacy Policy</A> and <A href={legalPath("editorial-policy")}>Editorial Policy</A>.
        </P>
      </S>
    </LegalPage>
  );
}
