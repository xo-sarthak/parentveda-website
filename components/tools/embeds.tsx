/* Tools that can sit inside a condition hub, by slug. Each entry renders the
   tool alone, without the tool page's hero, notes or reads (ToolEmbed adds a
   link to the full page). Tools are added here as they are built. */

import type { ComponentType } from "react";

export const EMBEDS: Record<string, ComponentType> = {};
