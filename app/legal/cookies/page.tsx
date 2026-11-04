import type { Metadata } from "next";
import { LegalPage, S, P, UL, LI, A, Callout } from "@/components/legal/LegalPage";
import { ORG, getLegalPage, legalPath } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const META = getLegalPage("cookies")!;

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
  { id: "short-version", title: "The short version" },
  { id: "what-they-are", title: "What cookies and browser storage are" },
  { id: "what-we-use", title: "What we actually use" },
  { id: "what-we-dont", title: "What we do not use" },
  { id: "third-party", title: "Third parties" },
  { id: "managing", title: "Managing them yourself" },
  { id: "changes", title: "If this changes" },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage title={META.title} summary={META.summary} sections={SECTIONS}>
      <S id="short-version" title="The short version">
        <Callout>
          {ORG.site} sets no advertising cookies and nothing that builds an advertising profile. We
          use Google Analytics to count visits, but only if you accept it. If you decline, or have
          not been asked, it does not run. Reading works the same either way.
        </Callout>
      </S>

      <S id="what-they-are" title="What cookies and browser storage are">
        <P>
          A cookie is a small file a website asks your browser to keep, so it can recognise
          something on your next visit. Browsers also offer <em>local storage</em> and{" "}
          <em>session storage</em>, which do a similar job without being sent back to the server
          with every request. This policy covers all three, because from your point of view they are
          the same thing: data a site leaves on your device.
        </P>
      </S>

      <S id="what-we-use" title="What we actually use">
        <P>The list is short. Everything except analytics is functional.</P>
        <UL>
          <LI>
            <strong>Invite links</strong> — when you open a{" "}
            <span className="whitespace-nowrap">{ORG.site}/invite/…</span> link on an Android phone,
            we record one flag in your browser&rsquo;s <em>session storage</em> to remember that we
            have already sent you to the Play Store once. Without it, returning to the tab would
            bounce you to the store again in a loop. It is deleted when you close the tab, and it
            contains no personal information.
          </LI>
          <LI>
            <strong>Security and delivery</strong> — our hosting provider may set strictly necessary
            cookies to route requests and protect against abuse. These do not identify you as a
            person.
          </LI>
          <LI>
            <strong>Your cookie choice</strong> — one entry in your browser&rsquo;s{" "}
            <em>local storage</em> remembers whether you accepted or declined analytics, so we do not
            ask on every page. It stays on your device and contains nothing else.
          </LI>
          <LI>
            <strong>Google Analytics, if you accept</strong> — Google&rsquo;s script and its{" "}
            <em>_ga</em> cookies, which last up to two years, tell us how many people visit, how they
            found us, which pages they read and which product links they click. Google receives your
            IP address, your browser and device type, and the address of each page you read, and an
            address can show what a page is about, such as a pregnancy or fertility topic. Google
            processes this under its own terms, and some of it outside India. Advertising features
            are switched off. It does not run on invite, doctor or employer portal links.
          </LI>
        </UL>
        <P>
          When the app launches and accounts exist, we will need a session cookie to keep you signed
          in. This page will be updated before that happens.
        </P>
      </S>

      <S id="what-we-dont" title="What we do not use">
        <UL>
          <LI>No analytics of any kind unless you accept it.</LI>
          <LI>No advertising or retargeting pixels.</LI>
          <LI>No social media tracking scripts.</LI>
          <LI>No cross-site profiling, and no selling of any of it.</LI>
        </UL>
        <P>
          This is a deliberate choice rather than an oversight. A site read by people looking up
          pregnancy loss, complications and fertility should not be quietly building an advertising
          profile out of it. That is why analytics is off until you say yes, and why saying no costs
          you nothing.
        </P>
      </S>

      <S id="third-party" title="Third parties">
        <P>
          Our guides link out to other websites, including Amazon for some products, and those sites
          set their own cookies once you arrive. We have no control over them. See our{" "}
          <A href={legalPath("affiliate-disclosure")}>Affiliate Disclosure</A>. If you install the app from Google Play, Google&rsquo;s
          own terms and privacy policy apply to that.
        </P>
      </S>

      <S id="managing" title="Managing them yourself">
        <P>
          To change your answer about analytics at any time, use <strong>Cookie settings</strong> in
          the footer. Declining removes our Google Analytics cookies from your browser.
        </P>
        <P>
          Every browser also lets you view, block and delete cookies and site storage, usually under
          Settings &rarr; Privacy. Blocking everything for this site will not break the guides —
          there is nothing here you need to accept in order to read.
        </P>
      </S>

      <S id="changes" title="If this changes">
        <P>
          On {ORG.updated} we added Google Analytics, which runs only with your consent, and said so
          here. If we add anything else that tracks behaviour, we will update this page, say so
          plainly, and ask for your consent first rather than assuming it. For the wider picture of
          what we collect, see the <A href={legalPath("privacy")}>Privacy Policy</A>.
        </P>
      </S>
    </LegalPage>
  );
}
