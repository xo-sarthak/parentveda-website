"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Sends hub_view once. The condition slug is the page's own topic, never anything typed. */
export default function HubView({ condition }: { condition: string }) {
  useEffect(() => {
    track("hub_view", { condition });
  }, [condition]);
  return null;
}
