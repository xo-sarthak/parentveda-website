import type { Metadata } from "next";
import { LegalPage, S, H, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("privacy")!;

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
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "health-information", title: "Health information, and why we treat it differently" },
  { id: "why", title: "Why we use it" },
  { id: "consent", title: "Consent, and taking it back" },
  { id: "sharing", title: "Who else sees it" },
  { id: "cookies", title: "Cookies and browser storage" },
  { id: "retention", title: "How long we keep it" },
  { id: "your-rights", title: "Your rights" },
  { id: "children", title: "Children" },
  { id: "security", title: "How we protect it" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact and grievances" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="who-we-are" title="Who we are">
        <P>
          {ORG.brand} is a pregnancy and early-parenthood companion for Indian families, published
          at {ORG.site} and, when it launches, as a mobile app. In the language of India&rsquo;s
          Digital Personal Data Protection Act, {ORG.legalEntity} is the <em>data fiduciary</em> for
          the information described here — meaning we decide why and how it is used, and we are
          answerable for it.
        </P>
        <P>
          This policy is written to be read, not to be survived. If any part of it is unclear, ask
          us and we will explain it plainly.
        </P>
      </S>

      <S id="what-we-collect" title="What we collect">
        <H>When you join the waitlist or subscribe</H>
        <P>
          Your email address, and whether you asked for the waitlist, the newsletter, or both. That
          is all — we do not ask for your name, your phone number or your due date to sign up.
        </P>

        <H>When you use the app</H>
        <P>
          The app is not released yet. When it is, it will collect what it needs to do its job:
          account details, the information you choose to give about your pregnancy or your
          child&rsquo;s age so the guidance matches where you are, and any notes or preferences you
          save. This policy will be updated with the specifics before the app ships, and you will
          be asked to agree to them.
        </P>

        <H>When someone invites you</H>
        <P>
          If you arrive through an invite link, we process the referral code in it so the person who
          invited you can be credited. If you install from Google Play, the Play Store passes us that
          same code through its Install Referrer service.
        </P>

        <H>Technical information</H>
        <P>
          Like any website, our hosting provider records ordinary request data — IP address, browser
          and device type, the page requested, and the time. This is used to keep the service
          running and secure, not to build a profile of you.
        </P>

        <Callout>
          We do not run advertising trackers, analytics pixels or third-party marketing scripts on
          this website. Not &ldquo;we limit them&rdquo; — there are none. If that ever changes, this
          policy will say so before it happens.
        </Callout>
      </S>

      <S id="health-information" title="Health information, and why we treat it differently">
        <P>
          Anything you tell us about a pregnancy, a due date, a loss, or a child&rsquo;s health is{" "}
          <strong>sensitive personal information</strong> under Indian law, and it is the most
          private thing this product will ever hold. We treat it accordingly.
        </P>
        <UL>
          <LI>We only collect it when you actively give it, never by inference or purchase.</LI>
          <LI>We do not sell it, rent it, or share it for anyone else&rsquo;s marketing. Ever.</LI>
          <LI>
            We do not use it to target advertising to you, and we do not pass it to advertising
            networks.
          </LI>
          <LI>
            Reading a guide on this website tells us nothing about you personally — the guides
            require no account and set no tracking cookie.
          </LI>
        </UL>
      </S>

      <S id="why" title="Why we use it">
        <UL>
          <LI>To tell you when {ORG.brand} launches, if you asked to be told.</LI>
          <LI>To send the newsletter, if you asked for it.</LI>
          <LI>To provide the app&rsquo;s features and match guidance to your stage.</LI>
          <LI>To credit a referral to the person who invited you.</LI>
          <LI>To keep the service working, secure, and free of abuse.</LI>
          <LI>To meet legal obligations where they apply.</LI>
        </UL>
        <P>
          We do not use your information for automated decisions that have a legal or similarly
          significant effect on you.
        </P>
      </S>

      <S id="consent" title="Consent, and taking it back">
        <P>
          We rely on your consent, given freely and for a stated purpose. You can withdraw it at any
          time — every email we send carries an unsubscribe link, and you can write to{" "}
          <A href={`mailto:${ORG.privacyEmail}`}>{ORG.privacyEmail}</A> to withdraw consent for
          anything else.
        </P>
        <P>
          Withdrawing consent stops future processing. It does not undo what was lawfully done
          before, and it may mean parts of the service stop working — for example, we cannot email
          you about the launch if you have asked us not to email you.
        </P>
      </S>

      <S id="sharing" title="Who else sees it">
        <P>
          We do not sell your personal information. We share it only with the services that make{" "}
          {ORG.brand} run, and only as much as each one needs:
        </P>
        <UL>
          <LI>
            <strong>Vercel</strong> — hosting for this website.
          </LI>
          <LI>
            <strong>Supabase</strong> — the database that stores our content and, in future, app
            data.
          </LI>
          <LI>
            <strong>Google Play</strong> — distribution of the Android app, and the Install Referrer
            service that carries invite codes through installation.
          </LI>
          <LI>
            <strong>Our email provider</strong> — to deliver the newsletter and launch
            announcements.
          </LI>
        </UL>
        <P>
          We may also disclose information where the law genuinely requires it, or to protect
          someone&rsquo;s safety. If we are ever compelled to hand over data, we will tell you unless
          we are legally forbidden from doing so.
        </P>
        <P>
          Some of these providers operate servers outside India. Where information is transferred
          abroad, it stays subject to this policy and to the protections Indian law requires.
        </P>
      </S>

      <S id="cookies" title="Cookies and browser storage">
        <P>
          This site uses only what it needs to function, and no advertising or analytics cookies.
          The details, including the one piece of browser storage we set on invite links, are in the{" "}
          <A href={legalPath("cookies")}>Cookie Policy</A>.
        </P>
      </S>

      <S id="retention" title="How long we keep it">
        <UL>
          <LI>
            <strong>Waitlist and newsletter emails</strong> — until you unsubscribe or ask us to
            delete them, and then removed from our active systems.
          </LI>
          <LI>
            <strong>App account data</strong> — for as long as your account exists. Delete the
            account and we delete the data, apart from anything we are legally required to keep.
          </LI>
          <LI>
            <strong>Server logs</strong> — a short rolling window, kept for security and
            troubleshooting.
          </LI>
        </UL>
      </S>

      <S id="your-rights" title="Your rights">
        <P>Under the DPDP Act you have the right to:</P>
        <UL>
          <LI>Ask what personal data we hold about you, and what we have done with it.</LI>
          <LI>Have it corrected if it is wrong, or completed if it is partial.</LI>
          <LI>Have it erased when it is no longer needed for the purpose you gave it for.</LI>
          <LI>Withdraw your consent.</LI>
          <LI>Nominate someone to exercise these rights if you are unable to.</LI>
          <LI>Raise a grievance with us, and escalate to the Data Protection Board of India.</LI>
        </UL>
        <P>
          Write to <A href={`mailto:${ORG.privacyEmail}`}>{ORG.privacyEmail}</A> and we will respond
          within a reasonable period. We do not charge for this.
        </P>
      </S>

      <S id="children" title="Children">
        <P>
          {ORG.brand} is written for adults — parents, expectant parents, and the people supporting
          them. It is not directed at children, and we do not knowingly collect personal information
          from anyone under 18. Where the app holds information <em>about</em> a baby or child, that
          information belongs to the parent or guardian who entered it, and is subject to everything
          in this policy.
        </P>
        <P>
          If you believe a child has given us personal information, write to{" "}
          <A href={`mailto:${ORG.privacyEmail}`}>{ORG.privacyEmail}</A> and we will delete it.
        </P>
      </S>

      <S id="security" title="How we protect it">
        <P>
          Traffic to this site is encrypted in transit. Access to stored data is restricted to the
          people who need it to operate the service. Our database enforces row-level access rules so
          that published content is public and nothing else is.
        </P>
        <P>
          No system is perfectly secure, and we would rather say that than promise otherwise. If a
          breach ever affects your personal data, we will notify you and the Data Protection Board
          as the law requires.
        </P>
      </S>

      <S id="changes" title="Changes to this policy">
        <P>
          This policy will change as {ORG.brand} grows — most immediately when the app launches and
          starts holding more than an email address. We will update the date at the top, and for any
          change that materially affects your rights we will tell you directly rather than quietly
          editing the page.
        </P>
      </S>

      <S id="contact" title="Contact and grievances">
        <P>
          For anything about your privacy, write to{" "}
          <A href={`mailto:${ORG.privacyEmail}`}>{ORG.privacyEmail}</A>.
        </P>
        <P>
          If you are not satisfied with how we have handled something, you can raise a formal
          grievance with {ORG.grievanceOfficer} at{" "}
          <A href={`mailto:${ORG.grievanceEmail}`}>{ORG.grievanceEmail}</A>. We will acknowledge it
          within 24 hours and aim to resolve it within 15 days, as India&rsquo;s IT Rules require.
          {ORG.address ? ` Post reaches us at ${ORG.address}.` : ""}
        </P>
        <P>
          If we still have not put it right, you may complain to the Data Protection Board of India.
        </P>
      </S>
    </LegalPage>
  );
}
