import Link from "next/link";
import Icon from "@/components/Icon";
import { toolPath, type ToolInfo } from "@/lib/tools";

const ICON: Record<string, string> = {
  "ovulation-calculator": "sun",
  "due-date-calculator": "calendar",
  "pregnancy-week-calculator": "heart",
  "is-it-safe-in-pregnancy": "shield",
  "pregnancy-weight-gain-calculator": "bowl",
  "vaccination-schedule": "doctor",
  "baby-growth-chart": "sprout",
  "baby-names": "tag",
};

/* One card, used on /tools/, the home page, stage pages and under every tool. */
export default function ToolCard({ tool, hideStage }: { tool: ToolInfo; hideStage?: boolean }) {
  return (
    <Link href={toolPath(tool.slug)} className="tool-tile">
      <span className="tool-tile__top">
        <span className="tool-tile__icon">
          <Icon name={ICON[tool.slug] ?? "arrow"} size={20} />
        </span>
        {!hideStage && <span className="tool-tile__stage">{tool.stage}</span>}
      </span>
      <strong>{tool.name}</strong>
      <span className="tool-tile__short">{tool.short}</span>
      <span className="tool-tile__cta">
        {tool.cta} <Icon name="arrow" size={15} />
      </span>
    </Link>
  );
}
