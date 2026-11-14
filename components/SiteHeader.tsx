import Header from "./Header";
import { getMenuConditions, getMenuPillars } from "@/lib/pillars";

/* Server wrapper: the header's dropdowns list published pillar guides and live
   condition hubs, so it reads content once here and passes plain links down. */
export default async function SiteHeader() {
  const [pillars, conditions] = await Promise.all([getMenuPillars(), getMenuConditions()]);
  return <Header pillars={pillars} conditions={conditions} />;
}
