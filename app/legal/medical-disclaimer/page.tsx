import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("medical-disclaimer")!;

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
  { id: "not-advice", title: "This is not medical advice" },
  { id: "emergency", title: "If something feels wrong, do not wait" },
  { id: "relationship", title: "No doctor–patient relationship" },
  { id: "how-written", title: "How our guides are written" },
  { id: "individual", title: "Every pregnancy is different" },
  { id: "tradition", title: "Garbh Sanskar and traditional practices" },
  { id: "medicines", title: "Medicines, supplements and remedies" },
  { id: "app", title: "The app's guidance" },
  { id: "errors", title: "Telling us about an error" },
];

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="not-advice" title="This is not medical advice">
        <P>
          Everything on {ORG.site} and in the {ORG.brand} app is general education. It is written to
          help you understand what is happening, ask better questions, and feel less alone. It is
          not a diagnosis, not a treatment plan, and not a substitute for care from a qualified
          doctor or midwife who knows your history.
        </P>
        <P>
          Please do not start, stop or change any treatment because of something you read here.
          Speak to your doctor first — including when what we say seems to disagree with what they
          have told you. They know your case; we do not.
        </P>
      </S>

      <S id="emergency" title="If something feels wrong, do not wait">
        <Callout>
          In an emergency, call your doctor or go to the nearest hospital immediately. Do not use
          this website to decide whether a symptom is serious.
        </Callout>
        <P>
          During pregnancy, some symptoms need to be seen the same day rather than at the next
          appointment. Among them:
        </P>
        <UL>
          <LI>Heavy bleeding, or bleeding with pain.</LI>
          <LI>Severe or one-sided abdominal or pelvic pain.</LI>
          <LI>Pain at the tip of the shoulder.</LI>
          <LI>Fainting, dizziness that does not pass, or a racing heart.</LI>
          <LI>A bad headache with blurred vision, or sudden swelling of the face and hands.</LI>
          <LI>Fever, or fluid leaking from the vagina.</LI>
          <LI>A noticeable drop in your baby&rsquo;s movements.</LI>
        </UL>
        <P>
          This list is not complete, and it is not a screening tool. If something feels wrong to
          you, that is reason enough to be seen. Trust that instinct.
        </P>
      </S>

      <S id="relationship" title="No doctor–patient relationship">
        <P>
          Reading our guides, using the app, or writing to us does not make anyone at {ORG.brand}{" "}
          your doctor. Our contributors — including the medical professionals who review our
          content — are not treating you, cannot examine you, and are not on call for you.
        </P>
        <P>
          If you write to us with a personal medical question, we will not answer it clinically. We
          will point you to your doctor, because that is the honest and safe response.
        </P>
      </S>

      <S id="how-written" title="How our guides are written">
        <P>
          Our guides are researched against reputable medical sources and reviewed before
          publication. The full process, including who reviews what and how corrections are handled,
          is in our <A href={legalPath("editorial-policy")}>Editorial Policy</A>.
        </P>
        <P>
          Even so, medicine moves, and an article accurate on the day it was published can age. We
          date and update our guides, but we cannot promise that every page reflects the very latest
          guidance at the moment you read it.
        </P>
      </S>

      <S id="individual" title="Every pregnancy is different">
        <P>
          Our content describes what is typical. You may not be typical, and that alone is not a
          problem. Your age, your medical history, previous pregnancies, medication you take and
          conditions you live with all change what is right for you. General guidance cannot account
          for any of it. Your doctor can.
        </P>
      </S>

      <S id="tradition" title="Garbh Sanskar and traditional practices">
        <P>
          {ORG.brand} draws on Indian tradition — Garbh Sanskar, sound and breath practices, and
          food customs carried down through families. We include them because they are meaningful,
          calming, and part of how many Indian families experience pregnancy.
        </P>
        <P>
          We present them as cultural and emotional practice, not as clinical treatment. Where we
          describe a benefit, we mean the kind that comes from rest, ritual and calm. We do not claim
          that these practices prevent, treat or cure any medical condition, and nothing traditional
          should replace antenatal care, prescribed medication, or a scan your doctor has asked for.
        </P>
      </S>

      <S id="medicines" title="Medicines, supplements and remedies">
        <P>
          Do not take any medicine, herb, supplement or home remedy in pregnancy or while
          breastfeeding on the strength of something you read here — including things widely
          considered harmless. Safety depends on dose, timing, your history and what else you are
          taking. Ask your doctor or pharmacist.
        </P>
      </S>

      <S id="app" title="The app's guidance">
        <P>
          The {ORG.brand} app tailors what it shows to the week or stage you tell it you are at. That
          is a convenience, not an assessment. It does not monitor you, cannot detect a
          complication, and must never be relied on to tell you whether you or your baby are well.
        </P>
      </S>

      <S id="errors" title="Telling us about an error">
        <P>
          If you are a clinician, or a reader who has spotted something wrong, please tell us at{" "}
          <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>. We take corrections
          seriously and we would much rather be corrected than be wrong in public.
        </P>
      </S>
    </LegalPage>
  );
}
