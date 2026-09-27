import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { GUIDES_BASE } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("editorial-policy")!;

export const metadata: Metadata = {
  title: META.title,
  description: META.summary,
  alternates: { canonical: legalPath(META.slug) },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${legalPath(META.slug)}`,
    title: `${META.title} · ${ORG.brand}`,
    description: META.summary,
  },
};

const SECTIONS = [
  { id: "principles", title: "What we are trying to do" },
  { id: "sources", title: "The sources we rely on" },
  { id: "review", title: "Medical review" },
  { id: "authors", title: "Who writes and reviews" },
  { id: "updates", title: "Dates, updates and corrections" },
  { id: "independence", title: "Independence" },
  { id: "language", title: "Language and tone" },
  { id: "ai", title: "Where technology helps, and where it does not" },
  { id: "contact", title: "Reporting a problem" },
];

export default function EditorialPolicyPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="principles" title="What we are trying to do">
        <P>
          {ORG.brand} writes for someone who has just been told something they did not expect, at
          two in the morning, on a phone. That reader deserves accuracy first and warmth
          immediately after — never warmth instead of accuracy.
        </P>
        <UL>
          <LI>Say what is known, and say plainly where knowledge runs out.</LI>
          <LI>Never frighten for engagement, and never soothe by omission.</LI>
          <LI>
            Send people to their doctor at the point where a doctor is genuinely needed, not as a
            disclaimer at the bottom.
          </LI>
          <LI>Assume the reader is intelligent and frightened, not ignorant.</LI>
        </UL>
      </S>

      <S id="sources" title="The sources we rely on">
        <P>Our guides are researched against, in rough order of preference:</P>
        <UL>
          <LI>
            Guidance from recognised medical bodies — the WHO, India&rsquo;s Ministry of Health and
            Family Welfare, ICMR, FOGSI, ACOG, NICE and the NHS.
          </LI>
          <LI>Peer-reviewed research, favouring systematic reviews over single studies.</LI>
          <LI>Standard clinical reference texts.</LI>
          <LI>Practising clinicians, for how guidance actually plays out in Indian care.</LI>
        </UL>
        <P>
          We do not build health guidance from other people&rsquo;s blogs, from social media, or from
          anecdote. Where a claim comes from tradition rather than evidence, we say so in the piece
          rather than letting the two blur — see the{" "}
          <A href={legalPath("medical-disclaimer")}>Medical Disclaimer</A> on how we handle Garbh
          Sanskar and traditional practices.
        </P>
      </S>

      <S id="review" title="Medical review">
        <P>
          Health content is reviewed by a qualified medical professional before it is published. A
          reviewer checks that the piece is factually correct, that nothing important is missing,
          that the emergency signs are right, and that the tone will not lead someone to delay care.
        </P>
        <P>
          If a reviewer and a writer disagree, the reviewer decides. If a piece cannot be made
          accurate, it does not go out.
        </P>
      </S>

      <S id="authors" title="Who writes and reviews">
        <P>
          Reads carry a byline, and the name links to a profile listing that person&rsquo;s
          qualifications, registration and areas of practice. That is deliberate: you should be able
          to check who is telling you something about your pregnancy, and decide for yourself what
          their word is worth.
        </P>
        <P>
          Where a piece is written by our editorial team rather than an individual clinician, it says{" "}
          {ORG.brand} rather than inventing an author.
        </P>
      </S>

      <S id="updates" title="Dates, updates and corrections">
        <P>
          Every guide shows when it was published and when it was last updated. Medicine changes,
          and an undated health article is a warning sign on any website.
        </P>
        <P>
          When we get something wrong, we correct it and we do not pretend otherwise. Small fixes —
          spelling, clarity — are made silently. Anything that changed the meaning, or that could
          have affected a decision someone made, is corrected and noted on the page.
        </P>
      </S>

      <S id="independence" title="Independence">
        <P>
          Nobody can pay to appear in a {ORG.brand} guide, to be recommended in one, or to have
          criticism removed. We do not publish sponsored posts dressed as editorial.
        </P>
        <P>
          If we ever earn money from a link or a partnership, it will be labelled clearly on the page
          where it appears, and it will not change what we say. Our reason to exist is that a parent
          can trust what they read here; there is no revenue worth trading that for.
        </P>
      </S>

      <S id="language" title="Language and tone">
        <P>
          We write in English and Hinglish, the way Indian families actually talk about these things
          at home. Familiar words sit alongside clinical ones so the piece is readable without being
          vague — and where a clinical term matters, we use it and explain it, because that is the
          word you will hear at the hospital.
        </P>
      </S>

      <S id="ai" title="Where technology helps, and where it does not">
        <P>
          We use software for drafting support, structure and editing, the way any modern newsroom
          does. No health guidance is published on the strength of a machine&rsquo;s say-so: every
          piece is written, checked against the sources above, and reviewed by people who are
          accountable for it by name.
        </P>
      </S>

      <S id="contact" title="Reporting a problem">
        <P>
          If something in a guide is wrong, out of date, or unclear, tell us at{" "}
          <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>. Clinicians especially — we
          would rather be corrected than be wrong in front of someone who is frightened.
        </P>
        <P>
          You can read what we have published so far in the <A href={GUIDES_BASE}>Reads</A>.
        </P>
      </S>
    </LegalPage>
  );
}
