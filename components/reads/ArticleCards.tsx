import Link from "next/link";
import { toolPath } from "@/lib/tools";
import type { Card } from "@/lib/cta";

/* The contextual cards for an article (lib/cta.ts). `compact` is the single
   card in the side rail. Download and consult cards render through their own
   components once those features are switched on. */
export default function ArticleCards({
  cards,
  compact,
  renderDownload,
  renderConsult,
}: {
  cards: Card[];
  compact?: boolean;
  renderDownload?: (c: Extract<Card, { kind: "download" }>) => React.ReactNode;
  renderConsult?: (c: Extract<Card, { kind: "consult" }>) => React.ReactNode;
}) {
  const shown = compact ? cards.slice(0, 1) : cards;
  if (!shown.length) return null;
  return (
    <aside className={compact ? "rtools rtools--rail" : "rtools"} aria-label="Helpful next steps">
      {shown.map((c) => {
        if (c.kind === "tool") {
          const t = c.tool;
          return (
            <Link key={`tool-${t.slug}`} href={toolPath(t.slug)} className="rtools__card" style={{ ["--tone" as string]: t.tone }}>
              <span className="rtools__eyebrow">Free tool</span>
              <strong>{t.name}</strong>
              {compact ? null : <span>{t.short}</span>}
              <span className="rtools__cta">{t.cta} →</span>
            </Link>
          );
        }
        if (c.kind === "download") return renderDownload ? <div key={`dl-${c.download.slug}`}>{renderDownload(c)}</div> : null;
        return renderConsult ? <div key={`consult-${c.consult.specialty}`}>{renderConsult(c)}</div> : null;
      })}
    </aside>
  );
}
