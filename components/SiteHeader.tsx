import Header from "./Header";
import { getMenuPillars } from "@/lib/pillars";

/* Server wrapper: reads the published pillar guides so the menu links to them
   in the HTML itself (crawlable), then hands them to the client Header. */
export default async function SiteHeader() {
  return <Header pillars={await getMenuPillars()} />;
}
