"use client";

import { useEffect } from "react";

/**
 * Android-only bounce to the Play Store, carrying the install referrer.
 * Carried over from the old site's CareRedirect / InviteRedirect, which were
 * identical but for their storage key.
 *
 * Runs in the browser, never on the server, and that is the point: a server
 * 3xx would be followed by WhatsApp's and Slack's link crawlers, and the
 * shared card would show the Play Store instead of the doctor's name or the
 * invitation. Everyone gets the real page; only a real Android browser leaves.
 *
 * It does not try to detect whether the app is installed — JavaScript cannot
 * reliably tell, and it does not need to: once /.well-known/assetlinks.json
 * is live, Android opens the app before the browser ever loads this page.
 */
export default function BounceToPlay({ url, storageKey }: { url: string; storageKey: string }) {
  useEffect(() => {
    if (!/android/i.test(navigator.userAgent)) return;

    // ?stay=1 renders the page without bouncing, so it can be checked on a
    // real Android phone.
    if (new URLSearchParams(window.location.search).has("stay")) return;

    // Bounce once per tab. Without this, coming back from Play with the back
    // gesture fires the redirect again and traps her in a loop.
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Private mode or storage disabled: bouncing once still beats not at all.
    }

    // replace(), not assign(): Back from Play returns to wherever she came from.
    window.location.replace(url);
  }, [url, storageKey]);

  return null;
}
