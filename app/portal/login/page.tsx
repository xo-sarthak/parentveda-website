import type { Metadata } from "next";
import Image from "next/image";
import Wordmark from "@/components/Wordmark";
import LoginForm from "./LoginForm";

/**
 * /portal/login — the way in for someone who administers a sponsored
 * programme.
 *
 * THE SAME ACCOUNT AS THE APP. This is not a separate HR system with its own
 * users table and its own password. It signs in against the same auth.users
 * the ParentVeda app uses, and what unlocks this section is the `sponsor_admin`
 * capability on that account (migration 0060).
 *
 * That is the entitlement architecture doing its job. HR at a customer is very
 * often a parent too — trying to conceive, pregnant, or a partner — and there
 * is no reason to make them keep two identities. They use the app like anyone
 * else, and the same login shows them their programme here.
 *
 * Never prerendered and never indexed: a login page is per-request by
 * definition, and a portal has no business in search results.
 *
 * The root is a <div class="portal"> rather than the old site's <main>: the
 * root layout already provides <main id="main">, and the `portal` class is what
 * hides the site header and footer here too (app/portal.css).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programme sign in",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  return (
    <div className="portal portal--login">
      <div className="p-login">
        <div className="p-login__brand">
          <Image src="/brand/pv-mark.png" alt="" width={34} height={34} priority />
          <Wordmark />
        </div>

        <h1 className="p-login__title">Your ParentVeda programme</h1>
        <p className="p-login__sub">
          Sign in with your ParentVeda account to see how your team is using the
          benefit.
        </p>

        <div className="p-card p-login__card">
          <LoginForm />
        </div>

        <p className="p-login__fine">
          This page shows take-up across your organisation. It never shows what
          any individual reads, asks or books. See{" "}
          <a href="/legal/privacy/" className="link">
            our privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
