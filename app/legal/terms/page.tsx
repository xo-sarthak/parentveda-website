import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("terms")!;

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
  { id: "agreement", title: "This agreement" },
  { id: "who-can-use", title: "Who can use ParentVeda" },
  { id: "what-it-is", title: "What ParentVeda is — and is not" },
  { id: "account", title: "Your account" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "referrals", title: "Invites and referrals" },
  { id: "content", title: "Our content" },
  { id: "your-content", title: "Anything you send us" },
  { id: "third-party", title: "Other people's links and services" },
  { id: "availability", title: "Availability and changes" },
  { id: "liability", title: "Liability" },
  { id: "termination", title: "Ending this agreement" },
  { id: "law", title: "Governing law" },
  { id: "contact", title: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="agreement" title="This agreement">
        <P>
          These terms are the agreement between you and {ORG.legalEntity} covering {ORG.site} and
          the {ORG.brand} app. By using either, you accept them. If you do not, please do not use
          the service.
        </P>
        <P>
          Two other documents form part of this agreement and are worth reading:{" "}
          <A href={legalPath("privacy")}>the Privacy Policy</A> and{" "}
          <A href={legalPath("medical-disclaimer")}>the Medical Disclaimer</A>.
        </P>
      </S>

      <S id="who-can-use" title="Who can use ParentVeda">
        <P>
          You need to be 18 or older to create an account or join the waitlist. Younger readers are
          welcome to read the guides, but should do so with a parent or guardian, and should not
          give us personal information.
        </P>
      </S>

      <S id="what-it-is" title="What ParentVeda is — and is not">
        <P>
          {ORG.brand} is an educational and supportive companion. It explains what is happening
          week by week, offers gentle practices rooted in Indian tradition, and tries to make a
          frightening or confusing time feel less lonely.
        </P>

        <Callout>
          {ORG.brand} does not practise medicine. Nothing here is medical advice, a diagnosis, or a
          treatment plan, and using it does not create a doctor&ndash;patient relationship. Decisions
          about your health or your baby&rsquo;s health belong with a qualified doctor who knows your
          case. This is set out in full in the{" "}
          <A href={legalPath("medical-disclaimer")}>Medical Disclaimer</A>, which you should read.
        </Callout>
      </S>

      <S id="account" title="Your account">
        <P>
          If you create an account in the app, keep your login details to yourself and tell us
          promptly if you think someone else has them. You are responsible for what happens under
          your account. Give us accurate information — particularly anything the app uses to tailor
          guidance, since wrong inputs produce wrong guidance.
        </P>
      </S>

      <S id="acceptable-use" title="Acceptable use">
        <P>Please do not:</P>
        <UL>
          <LI>Use {ORG.brand} for anything unlawful, or to harm or harass anyone.</LI>
          <LI>
            Copy, scrape, republish or resell our content without permission — see{" "}
            <A href="#content">Our content</A> below.
          </LI>
          <LI>
            Try to break, overload, probe or reverse-engineer the service, or get at data that is
            not yours.
          </LI>
          <LI>Impersonate anyone, or misrepresent a medical qualification you do not hold.</LI>
          <LI>Upload anything malicious.</LI>
        </UL>
      </S>

      <S id="referrals" title="Invites and referrals">
        <P>
          You may invite friends with a personal invite link. Invite codes are for genuine personal
          sharing. Creating fake accounts, buying or selling codes, spamming them, or otherwise
          gaming the system means we may cancel the rewards, the codes, and the accounts involved.
        </P>
        <P>
          Any reward attached to a referral is offered at our discretion and may change or end. We
          will not do that retroactively to referrals already properly earned.
        </P>
      </S>

      <S id="content" title="Our content">
        <P>
          The guides, illustrations, the {ORG.brand} name and mark, the design of this site and the
          app, and the software behind them all belong to us or to our licensors. You may read,
          share links to, and print our guides for your own personal use. You may quote a short
          passage with credit and a link.
        </P>
        <P>
          You may not republish articles in full, use our content to train a machine-learning model,
          or use it commercially, without written permission. Ask — the answer is often yes.
        </P>
      </S>

      <S id="your-content" title="Anything you send us">
        <P>
          If you send us feedback, a question or a correction, you keep ownership of it, but you give
          us permission to use it to improve {ORG.brand}. If we ever want to quote you publicly, we
          will ask first.
        </P>
        <P>Please do not send us confidential medical records. We are not equipped to hold them.</P>
      </S>

      <S id="third-party" title="Other people's links and services">
        <P>
          Our guides link out to medical bodies, research and other sources. Those sites are not
          ours; we do not control them and are not responsible for what they say or do. The same
          applies to Google Play, and to any service you reach through {ORG.brand}.
        </P>
      </S>

      <S id="availability" title="Availability and changes">
        <P>
          We would like {ORG.brand} to be available all the time, but we cannot promise it. It may
          be down for maintenance, or interrupted by something outside our control. Features may
          change, and some may be withdrawn.
        </P>
        <P>
          We may update these terms. If a change materially affects your rights, we will tell you
          rather than quietly edit the page. Continuing to use {ORG.brand} after a change means you
          accept it.
        </P>
      </S>

      <S id="liability" title="Liability">
        <P>
          {ORG.brand} is provided as it is. To the extent the law allows, we do not give warranties
          that the content is complete or correct for your particular situation, or that the service
          will be uninterrupted or error-free.
        </P>
        <P>
          We are not liable for indirect or consequential loss. Nothing in these terms limits
          liability that cannot lawfully be limited — including for death or personal injury caused
          by our negligence, or for fraud.
        </P>
        <P>
          The most important limit is the plainest one: acting on general information from a website
          or an app instead of consulting a doctor is a decision you make, and its consequences are
          not ours to carry. Please read the{" "}
          <A href={legalPath("medical-disclaimer")}>Medical Disclaimer</A>.
        </P>
      </S>

      <S id="termination" title="Ending this agreement">
        <P>
          You can stop using {ORG.brand} at any time, unsubscribe from our emails, or delete your
          account. We may suspend or close an account that breaches these terms, and where it is
          reasonable to do so we will tell you why and give you a chance to put it right.
        </P>
      </S>

      <S id="law" title="Governing law">
        <P>
          {/* Built as one expression rather than adjacent JSX children: a line
              break between `{ORG.country}` and the following string renders as
              a literal space, which put a gap before the comma and before the
              full stop. Invisible while `city` was null, obvious once it was
              set. */}
          {`These terms are governed by the laws of ${ORG.country}${
            ORG.city
              ? `, and the courts at ${ORG.city} have exclusive jurisdiction over any dispute`
              : ""
          }.`}
        </P>
      </S>

      <S id="contact" title="Contact">
        <P>
          Write to <A href={`mailto:${ORG.contactEmail}`}>{ORG.contactEmail}</A>. For a formal
          grievance, {ORG.grievanceOfficer} can be reached at{" "}
          <A href={`mailto:${ORG.grievanceEmail}`}>{ORG.grievanceEmail}</A>.
          {ORG.address ? ` Post reaches us at ${ORG.address}.` : ""}
        </P>
      </S>
    </LegalPage>
  );
}
