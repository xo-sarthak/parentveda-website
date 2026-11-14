import Link from "next/link";
import { toolPath, type ToolInfo } from "@/lib/tools";
import { EMBEDS } from "@/components/tools/embeds";
import { toolConsult } from "@/components/tools/condition/ConditionToolPage";

/* A tool inside a hub. A tool with an embeddable version renders in place,
   with its own specialist at the end; any other shows a card that opens its
   page. The hub passes only tools that are available on this deploy. */
export default function ToolEmbed({ tool, condition, withConsult = false }: { tool: ToolInfo; condition?: string; withConsult?: boolean }) {
  const Embed = EMBEDS[tool.slug];
  if (Embed) {
    return (
      <div className="hub__tool">
        {/* The hub has its own consult section, so the embedded tool skips one by default. */}
        <Embed consult={withConsult ? toolConsult(tool.slug) : undefined} condition={condition} />
        <p className="small">
          <Link className="link" href={toolPath(tool.slug)}>
            Open {tool.name} on its own page
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="rtools">
      <Link href={toolPath(tool.slug)} className="rtools__card" style={{ ["--tone" as string]: tool.tone }}>
        <span className="rtools__eyebrow">Free tool</span>
        <strong>{tool.name}</strong>
        <span>{tool.short}</span>
        <span className="rtools__cta">{tool.cta} →</span>
      </Link>
    </div>
  );
}
