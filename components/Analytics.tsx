"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";

/* ============================================================
   Google Analytics, only with consent. Switched off entirely until
   NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time: no banner, no script.

   Nothing from Google loads until someone presses Accept. Their answer stays in
   their own browser, and the footer's "Cookie settings" lets them change it.
   Ad personalisation and Google signals stay off: the policies promise that
   reading about pregnancy here never builds an advertising profile.
   ============================================================ */

const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const KEY = "pv-analytics-consent";
const OPEN_EVENT = "pv:cookie-settings";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null; // storage blocked: ask again, and load nothing meanwhile
  }
}

function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    /* The choice still holds for this page; it just will not be remembered. */
  }
}

/* Removes Google's cookies, including those set on the parent domain. */
function clearGoogleCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, "")}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/* The same paths robots.ts keeps out of search: one-off links and a signed-in portal. */
const isPrivatePath = (path: string) => /^\/(care|invite|portal)(\/|$)/.test(path);

export default function Analytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ID) return;
    const saved = readChoice();
    setChoice(saved);
    setOpen(saved === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const active = Boolean(ID) && choice === "granted" && !isPrivatePath(pathname);

  // Sends affiliate_click once analytics is on. A nofollow link is still a normal click.
  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[data-affiliate]") as HTMLAnchorElement | null;
      if (!link) return;
      window.gtag?.("event", "affiliate_click", {
        article_slug: location.pathname.split("/").filter(Boolean).at(-1) ?? "",
        link_domain: link.hostname,
        product_name: (link.textContent ?? "").trim(),
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [active]);

  if (!ID) return null;

  const decide = (next: Choice) => {
    const wasOn = choice === "granted";
    saveChoice(next);
    setChoice(next);
    setOpen(false);
    if (next === "denied" && wasOn) {
      clearGoogleCookies();
      location.reload(); // the only way to unload a script that is already running
    }
  };

  return (
    <>
      {active ? (
        <>
          <Script id="ga-setup" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',${JSON.stringify(ID)},{allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
        </>
      ) : null}

      {open && !isPrivatePath(pathname) ? (
        <aside className="consent" role="dialog" aria-label="Cookie choice">
          <p>
            May we count visits to this site? If you accept, Google Analytics sets cookies and sees which pages you read,
            including what they are about. It is never used for advertising, and reading works the same either way.{" "}
            <Link href="/legal/cookies/">Cookie Policy</Link>
          </p>
          <div className="consent__actions">
            <button type="button" className="btn btn--ghost" onClick={() => decide("granted")}>
              Accept
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => decide("denied")}>
              Decline
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}

/** Reopens the choice. Renders nothing unless analytics is configured. */
export function CookieSettingsButton() {
  if (!ID) return null;
  return (
    <button type="button" className="ftr__link" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
