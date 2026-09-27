import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/* ============================================================
   /legal/delete-account — how to delete a ParentVeda account.

   WHY THIS PAGE EXISTS: Google Play requires that any app offering account
   creation also offers a deletion route reachable WITHOUT installing the app.
   This URL goes into the Play Console's Data safety form. A reviewer will open
   it, so it has to answer plainly: what goes, what stays, and how long it takes.

   It is written for someone who has already decided. No retention pitch, no
   "are you sure?", no alternatives dressed up as help — those read as friction
   at exactly the moment a person is exercising a right.
   ============================================================ */

const META = getLegalPage("delete-account")!;

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
  { id: "in-the-app", title: "Deleting from inside the app" },
  { id: "by-email", title: "If you cannot open the app" },
  { id: "what-is-deleted", title: "What gets deleted" },
  { id: "what-remains", title: "What does not" },
  { id: "how-long", title: "How long it takes" },
  { id: "partner", title: "If you were paired with a partner" },
];

export default function DeleteAccountPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="in-the-app" title="Deleting from inside the app">
        <P>
          If you can still sign in, this is the fastest route and it takes effect immediately.
        </P>
        <UL>
          <LI>Open {ORG.brand} and go to <strong>Profile</strong>.</LI>
          <LI>Scroll to the bottom and tap <strong>Delete account</strong>.</LI>
          <LI>
            Type <strong>DELETE</strong> to confirm. We ask you to type it rather than tap twice
            because this cannot be undone.
          </LI>
        </UL>
        <P>
          The app closes once it is done. There is no waiting period and no confirmation email to
          click — by the time it closes, the account is gone.
        </P>
      </S>

      <S id="by-email" title="If you cannot open the app">
        <P>
          You do not need the app to delete your account. Write to{" "}
          <A href={`mailto:${ORG.privacyEmail}?subject=Delete%20my%20account`}>
            {ORG.privacyEmail}
          </A>{" "}
          from the email address the account uses, with the subject{" "}
          <strong>Delete my account</strong>.
        </P>
        <P>
          Sending from the registered address is how we know the request is yours. If you no longer
          have access to that mailbox, write anyway and say so — we will ask for something else that
          establishes it rather than refusing outright.
        </P>
        <Callout>
          We will never ask you for your password, and we will never ask you to pay to delete your
          account. Anyone who does is not us.
        </Callout>
      </S>

      <S id="what-is-deleted" title="What gets deleted">
        <P>
          Everything tied to the account, in one operation. Not hidden, not deactivated, not
          retained for a grace period — removed from the database.
        </P>
        <UL>
          <LI>Your profile: name, role, due date, contact preferences.</LI>
          <LI>Your journal, including every entry and any photos attached to them.</LI>
          <LI>
            Everything you tracked: weight, kicks, contractions, kegels, bump photos, symptoms.
          </LI>
          <LI>Health records, prescriptions, documents and vaccination history.</LI>
          <LI>Your child&rsquo;s profile, growth, feeding, sleep and milestone records.</LI>
          <LI>Scans, appointments, reminders and calendar entries.</LI>
          <LI>Bookings, consultations and any saved or bookmarked content.</LI>
          <LI>The sign-in itself, so the account can no longer be logged into.</LI>
        </UL>
        <P>
          Anything stored on your phone is cleared at the same time, so the device does not keep a
          copy after the account is gone.
        </P>
      </S>

      <S id="what-remains" title="What does not">
        <P>Two things survive deletion, and it is fair that you know what they are.</P>
        <UL>
          <LI>
            <strong>Anonymous counts.</strong> If you arrived through a clinic or a partner, the
            record that <em>somebody</em> did is kept — with you removed from it. It carries no name,
            no email and nothing you wrote. It exists so partner reporting stays honest, and it
            cannot be traced back to you.
          </LI>
          <LI>
            <strong>Records the law requires us to keep.</strong> Payment and tax records, where any
            money changed hands. Indian tax law sets how long those must be held; they are kept for
            that reason alone and are not used for anything else.
          </LI>
        </UL>
        <P>
          Nothing else is retained. We do not keep a shadow copy of your data for analytics, model
          training, or in case you come back.
        </P>
      </S>

      <S id="how-long" title="How long it takes">
        <UL>
          <LI>
            <strong>In the app:</strong> immediately. The account is gone before the app closes.
          </LI>
          <LI>
            <strong>By email:</strong> we aim to complete it within 7 days, and confirm when it is
            done. If we need to establish who you are first, we will reply within 72 hours.
          </LI>
        </UL>
        <P>
          Backups are the one exception to &ldquo;immediately&rdquo;. Encrypted backups are kept on a
          rolling cycle and expire within 30 days, so a copy may persist in one until it rolls off.
          Those backups are never read for any purpose other than restoring the service after a
          failure.
        </P>
      </S>

      <S id="partner" title="If you were paired with a partner">
        <P>
          Deleting your account removes your data, not theirs. If your partner was paired with you,
          their own account and everything they wrote in it continue to exist — but the pairing ends,
          and they lose access to anything that was yours.
        </P>
        <P>
          The same applies in reverse: if your partner deletes their account, yours is untouched. If
          you both want everything gone, you each need to delete your own.
        </P>
        <P>
          Questions about any of this go to{" "}
          <A href={`mailto:${ORG.privacyEmail}`}>{ORG.privacyEmail}</A>.
        </P>
      </S>
    </LegalPage>
  );
}
