/* The conditions index (the plan's "conditions.config").

   One JSON file per condition sits next to this file. To add a condition, copy
   any file, change it, then add one import line and one list entry below. A hub
   goes live only when its file says "published": true and at least 3 published
   articles belong to it (see lib/conditions.ts). */

import type { Condition } from "@/lib/conditions";
import prematureBabyNicu from "./premature-baby-nicu.json";
import highRiskPregnancy from "./high-risk-pregnancy.json";
import blockedFallopianTubes from "./blocked-fallopian-tubes.json";
import lowAmh from "./low-amh.json";
import cervicalCerclage from "./cervical-cerclage.json";
import developmentalDelay from "./developmental-delay.json";
import postpartumDepression from "./postpartum-depression.json";
import azoospermia from "./azoospermia.json";
import thalassemiaMinor from "./thalassemia-minor.json";
import autism from "./autism.json";
import cerebralPalsy from "./cerebral-palsy.json";
import speechDelay from "./speech-delay.json";
import unexplainedInfertility from "./unexplained-infertility.json";
import abnormalSemenReport from "./abnormal-semen-report.json";
import preeclampsia from "./preeclampsia.json";
import bleedingInEarlyPregnancy from "./bleeding-in-early-pregnancy.json";
import failedIvf from "./failed-ivf.json";
import endometriosis from "./endometriosis.json";
import gestationalDiabetes from "./gestational-diabetes.json";
import downSyndrome from "./down-syndrome.json";
import recurrentMiscarriage from "./recurrent-miscarriage.json";
import eggFreezing from "./egg-freezing.json";
import donorEggSpermIvf from "./donor-egg-sperm-ivf.json";
import pregnancyAfter3540 from "./pregnancy-after-35-40.json";
import febrileSeizure from "./febrile-seizure.json";
import lowAmnioticFluid from "./low-amniotic-fluid.json";
import lowMilkSupply from "./low-milk-supply.json";
import learningDifficulty from "./learning-difficulty.json";
import genitalTb from "./genital-tb.json";
import earlyMenopausePoi from "./early-menopause-poi.json";
import cancerAndPregnancy from "./cancer-and-pregnancy.json";
import congenitalHeartDisease from "./congenital-heart-disease.json";
import adhd from "./adhd.json";
import varicocele from "./varicocele.json";
import secondaryInfertility from "./secondary-infertility.json";
import placentaPrevia from "./placenta-previa.json";
import fibroids from "./fibroids.json";
import pretermLabour from "./preterm-labour.json";
import iugr from "./iugr.json";
import childAnxiety from "./child-anxiety.json";
import ectopicPregnancy from "./ectopic-pregnancy.json";
import adenomyosis from "./adenomyosis.json";
import cousinMarriage from "./cousin-marriage.json";

export const CONDITION_FILES = [
  prematureBabyNicu,
  highRiskPregnancy,
  blockedFallopianTubes,
  lowAmh,
  cervicalCerclage,
  developmentalDelay,
  postpartumDepression,
  azoospermia,
  thalassemiaMinor,
  autism,
  cerebralPalsy,
  speechDelay,
  unexplainedInfertility,
  abnormalSemenReport,
  preeclampsia,
  bleedingInEarlyPregnancy,
  failedIvf,
  endometriosis,
  gestationalDiabetes,
  downSyndrome,
  recurrentMiscarriage,
  eggFreezing,
  donorEggSpermIvf,
  pregnancyAfter3540,
  febrileSeizure,
  lowAmnioticFluid,
  lowMilkSupply,
  learningDifficulty,
  genitalTb,
  earlyMenopausePoi,
  cancerAndPregnancy,
  congenitalHeartDisease,
  adhd,
  varicocele,
  secondaryInfertility,
  placentaPrevia,
  fibroids,
  pretermLabour,
  iugr,
  childAnxiety,
  ectopicPregnancy,
  adenomyosis,
  cousinMarriage,
] as Condition[];
