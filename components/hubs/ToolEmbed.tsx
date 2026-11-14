import Link from "next/link";
import { toolPath, type ToolInfo } from "@/lib/tools";
import { EMBEDS } from "@/components/tools/embeds";

/* A tool inside a hub. A tool with an embeddable version renders in place;
   any other shows a card that opens its own page. */
export default function ToolEmbed({ tool }: { tool: ToolInfo }) {
  const Embed = EMBEDS[tool.slug];
  if (Embed) {
    return (
      <div className="hub__tool">
        <Embed />
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
