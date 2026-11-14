/* Tools that can sit inside a condition hub (and on their own page), by slug.
   Each renders the tool alone, without the tool page's hero, notes or reads.
   Add a tool here when it is built. */

import type { ComponentType } from "react";
import type { ToolProps } from "./condition/kit";
import FertilityCheck from "./condition/FertilityCheck";
import SemenReader from "./condition/SemenReader";
import AmhReader from "./condition/AmhReader";
import ThalassemiaCheck from "./condition/ThalassemiaCheck";
import ScreeningExplainer from "./condition/ScreeningExplainer";
import AfiReader from "./condition/AfiReader";
import BpLog from "./condition/BpLog";
import SugarTargets from "./condition/SugarTargets";

export const EMBEDS: Record<string, ComponentType<ToolProps>> = {
  "fertility-specialist-check": FertilityCheck,
  "semen-report-reader": SemenReader,
  "amh-reader": AmhReader,
  "thalassemia-couple-check": ThalassemiaCheck,
  "screening-result-explainer": ScreeningExplainer,
  "afi-reader": AfiReader,
  "bp-log": BpLog,
  "pregnancy-sugar-targets": SugarTargets,
};
