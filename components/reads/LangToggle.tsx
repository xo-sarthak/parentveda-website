"use client";

import Link from "next/link";
import { track } from "@/lib/track";

/* "Read in Hinglish" / "Read in English" at the top of an article that has a
   pair in the other language (content/article-meta.json). */
export default function LangToggle({ href, to, slug }: { href: string; to: "hinglish" | "english"; slug: string }) {
  return (
    <p className="rlang">
      <Link href={href} hrefLang={to === "hinglish" ? "hi-Latn" : "en-IN"} onClick={() => track("hinglish_toggle", { slug })}>
        {to === "hinglish" ? "Read in Hinglish" : "Read in English"}
      </Link>
    </p>
  );
}
