import Link from "next/link";
import { toolPath } from "@/lib/tools";
import { consultView } from "@/lib/consults";
import { downloadView } from "@/lib/downloads";
import type { Card } from "@/lib/cta";
import ConsultBlock from "@/components/leads/ConsultBlock";
import DownloadCard from "@/components/leads/DownloadCard";

/* The contextual cards for an article or hub (lib/cta.ts). `compact` is the
   single card in the side rail: a tool card, or a short link down to the
   download or consult block below the article. */
export default function ArticleCards({ cards, compact, condition }: { cards: Card[]; compact?: boolean; condition?: string }) {
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
        if (compact) {
          const label = c.kind === "consult" ? `Talk to a ${c.consult.label.toLowerCase()}` : c.download.title;
          const href = c.kind === "consult" ? "#talk-to-a-specialist" : `#dl-${c.download.slug}-h`;
          return (
            <a key={`rail-${c.kind}`} href={href} className="rtools__card">
              <span className="rtools__eyebrow">{c.kind === "consult" ? "Talk to a specialist" : "Free download"}</span>
              <strong>{label}</strong>
              <span className="rtools__cta">See below →</span>
            </a>
          );
        }
        if (c.kind === "download") return <DownloadCard key={`dl-${c.download.slug}`} download={downloadView(c.download)} condition={condition} />;
        return <ConsultBlock key={`consult-${c.consult.specialty}`} consult={consultView(c.consult)} condition={condition} />;
      })}
    </aside>
  );
}
