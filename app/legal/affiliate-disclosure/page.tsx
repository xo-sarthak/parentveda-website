import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("affiliate-disclosure")!;

export const metadata: Metadata = {
  title: META.title,
  description: META.summary,
  alternates: { canonical: `${legalPath(META.slug)}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${legalPath(META.slug)}/`,
    title: `${META.title} · ${ORG.brand}`,
    description: META.summary,
  },
};

const SECTIONS = [
  { id: "short-version", title: "The short version" },
  { id: "how-it-works", title: "How affiliate links work" },
  { id: "independence", title: "What it does not change" },
  { id: "questions", title: "Questions" },
];

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="short-version" title="The short version">
        <Callout>As an Amazon Associate, {ORG.brand} earns from qualifying purchases.</Callout>
      </S>

      <S id="how-it-works" title="How affiliate links work">
        <P>
          Some articles link to products on Amazon. If you follow one of those links and buy something, Amazon may pay{" "}
          {ORG.brand} a small commission. The price you pay stays the same.
        </P>
        <P>
          Any article with an affiliate link carries a note saying so, above the first such link. You are free to search for
          the same product yourself, or to buy it anywhere else.
        </P>
      </S>

      <S id="independence" title="What it does not change">
        <UL>
          <LI>A product is never a substitute for advice from your own doctor.</LI>
          <LI>
            What our articles say about health follows our <A href={legalPath("editorial-policy")}>Editorial Policy</A>, with
            or without a commission.
          </LI>
          <LI>
            Amazon sets its own cookies once you arrive there, under its own policies. See our{" "}
            <A href={legalPath("cookies")}>Cookie Policy</A>.
          </LI>
        </UL>
      </S>

      <S id="questions" title="Questions">
        <P>
          Write to <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>.
        </P>
      </S>
    </LegalPage>
  );
}
