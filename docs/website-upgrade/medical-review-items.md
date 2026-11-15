# Medical review items

Every medical number or claim added in this upgrade is listed here. None of it shows on the live site until a doctor signs it off and the matching flag is set to `true`. Preview deploys and local dev show it so it can be checked.

How to sign off: the reviewer reads the item, edits it if needed, and the team sets the flag named in the "Flag" column.

## Phase 1

### Red-flag lists ("Go to a hospital now if")

File: `content/article-meta.json`. Flag: `red_flags_reviewed` on each entry. Every card also says "Call 108 or go to the nearest hospital." with a tap-to-call 108 button.

| Slug | Status | Suggested reviewer | Bullets |
|---|---|---|---|
| ectopic-pregnancy | published | Obstetrics & Gynaecology | Sharp or one-sided pain low in your tummy that keeps getting worse; Pain at the tip of your shoulder; Feeling faint or dizzy, or fainting; Heavy bleeding from your vagina; Pain when you pass urine or stool |
| spotting-during-pregnancy | planned | Obstetrics & Gynaecology | Bleeding as heavy as a period or heavier, or passing clots; Bleeding with cramps or strong pain in your tummy; Feeling faint, dizzy or very weak; Bleeding with a fever or bad-smelling discharge; Any bleeding in the second half of pregnancy |
| preeclampsia-symptoms | planned | Obstetrics & Gynaecology | A bad headache that does not go away with rest or paracetamol; Blurred vision, flashing lights or spots in front of your eyes; Pain just below your ribs, in the middle or on the right side; Sudden swelling of your face, hands or feet; Feeling very short of breath; A fit (seizure) |
| gestational-hypertension | planned | Obstetrics & Gynaecology | Same list as preeclampsia-symptoms |
| bp-in-pregnancy | planned | Obstetrics & Gynaecology | **A blood pressure reading of 160/110 or higher**, then the preeclampsia-symptoms list |
| placental-abruption | planned | Obstetrics & Gynaecology | Sudden or constant pain in your tummy or back; Your womb feels hard and tender and does not relax; Bleeding from your vagina, even a little; Your baby is moving less than usual; Feeling faint or dizzy |
| preterm-labour-signs | planned | Obstetrics & Gynaecology | Regular tightenings or period-like pains **before 37 weeks**; A gush or a steady trickle of fluid from your vagina; Pressure low in your pelvis, or a dull backache that comes and goes; Bleeding from your vagina |
| pprom | planned | Obstetrics & Gynaecology | Fluid leaking from your vagina **before 37 weeks**, as a gush or a trickle; Fluid that is green, brown or bad-smelling; A fever, chills or feeling unwell; Pain or tenderness in your tummy; Your baby is moving less than usual |
| reduced-fetal-movement | planned | Obstetrics & Gynaecology | Your baby is moving less than usual; The pattern of your baby's movements has changed; You cannot feel your baby move at all |
| water-breaking-what-to-do | planned | Obstetrics & Gynaecology | The fluid is green, brown or bad-smelling; There is bleeding; Your waters break **before 37 weeks**; You have a fever or feel unwell; Your baby is moving less than usual; You can feel or see something in your vagina |
| febrile-seizure | planned | Paediatrics | The fit lasts **more than 5 minutes**; Your child has trouble breathing or turns blue; It is your child's first fit; Your child does not wake up properly after the fit; A second fit in the same illness; A stiff neck, or a rash that does not fade when you press a glass on it |
| newborn-danger-signs | planned | Neonatology | Not feeding well, or not able to feed; A fit (seizure); Fast breathing, or the chest pulling in with each breath; A fever, or the baby feels cold to touch; Moving only when touched, or not moving at all; Yellow skin in the first day, or yellow palms and soles; Blue lips or tongue |
| child-emergency-signs | planned | Paediatrics | Trouble breathing, or the ribs pulling in with each breath; Blue or grey lips; A fit, or your child is very hard to wake; A rash that does not fade when you press a glass on it; Very dry mouth, no tears and very little or no urine; Swallowed a poison, a medicine or a button battery; A serious injury, or bleeding that will not stop |
| postpartum-bleeding | planned | Obstetrics & Gynaecology | Soaking a pad **in an hour or less**; Passing large clots; Bleeding that gets heavier instead of lighter; Feeling faint or dizzy, or a racing heartbeat; A fever, chills or bad-smelling discharge; Pain in your tummy that gets worse |
| low-amniotic-fluid | planned | Fetal Medicine | Fluid leaking from your vagina; Your baby is moving less than usual; Bleeding from your vagina |
| cholestasis-of-pregnancy | planned | Obstetrics & Gynaecology | Your baby is moving less than usual; Yellow skin or yellow eyes |

Questions for the reviewer:
- Should the newborn list give numbers (60 or more breaths a minute; 37.5 °C or more, below 35.5 °C, as in the WHO list) or stay without numbers as drafted?
- Is 108 right for every state we serve, or should the card also name 102 (pregnancy and child transport in several states) or 112?

### Support line on sensitive pages

File: `components/reads/SupportCard.tsx`. Not gated, because it is a public helpline and not a medical claim. Please still confirm it.

- "Tele-MANAS is free and open day and night: call 14416." (Tele-MANAS is the Government of India's national mental health helpline.)

### Structured data

`about` → `MedicalCondition` with `relevantSpecialty` on articles that have a condition. The specialty mapping is in `lib/jsonld.ts` (`SCHEMA_SPECIALTY`). This is labelling, not a claim, but the condition names and alternate names in `content/conditions/*.json` should be read once by a reviewer.

## Phase 3: tools

Each tool reads its numbers from `lib/tools-reference/<slug>.json`. Flag: `"reviewed": true` in that file. Until then the tool page says "Coming soon, being reviewed by our doctors" in production, is noindex, and the tool is left out of every list, card and sitemap. Fixed sentences in the tool components are listed too, because they are medical claims.

| Tool | Reviewer | Values (file) | Sentences in the component |
|---|---|---|---|
| fertility-specialist-check | Reproductive Medicine | Under 35: see after 12 months. 35 to 39: after 6 months. 40 or older: now. "See now" for PCOS, endometriosis, previous miscarriage, past pelvic surgery or infection, irregular cycles, abnormal semen test. Thyroid problem: not "see now". | "Ask your doctor about a folic acid supplement". "Egg numbers fall with age, and faster after 35" (FAQ). |
| semen-report-reader | Andrology/Urology | WHO 2021 lower limits: volume 1.4 mL, concentration 16 M/mL, total 39 M, total motility 42%, progressive 30%, normal forms 4%, vitality 54%. Abstinence 2 to 7 days. | Nil count: "There are treatment options, and many men in this situation go on to become fathers, sometimes with help. The test is usually repeated first." One-line explanations for each value. |
| amh-reader | Reproductive Medicine | **Drafted from an Indian study, 15 Nov 2026:** "lower than usual" below the 10th centile, "higher than usual" above the 90th, from Gunasheela D et al., J Hum Reprod Sci 2021;14(4):372-379 (5,525 Indian women tested for infertility, Beckman Coulter Access AMH Gen II). 20-24: 1.34 / 9.77. 25-29: 1.12 / 8.21. 30-34: 0.63 / 6.88. 35-39: 0.20 / 4.20. 40-44: 0.04 / 2.62 ng/mL. Outside 20 to 44: no comparison. Conversion 1 ng/mL = 7.14 pmol/L. **To decide:** whether 10th/90th centiles are the right cut-offs (some clinics use a fixed under 1.1 ng/mL for low reserve, the Bologna criterion); whether a study of women seeking fertility care is the right reference (Palgamkar 2021, JHRS 14(4):380-385, found similar medians in naturally conceiving Indian women); and that labs using Roche Elecsys may read a little differently. | "AMH reflects how many eggs are left, not how good they are." "It does not predict your natural chance of pregnancy in any given month." "A high AMH can go with PCOS." Source line under the result: "Ranges from a study of 5,525 Indian women tested for fertility (Gunasheela and others, 2021). Labs and test kits differ a little, so your doctor reads your result against your own lab's range." |
| thalassemia-couple-check | Genetic Counselling | Both carriers: 1 in 4 thalassemia major, 1 in 2 carrier, 1 in 4 unaffected. CVS at 11 to 13 weeks. | Carrier plus normal: "a baby cannot have thalassemia major from these two results". Carrier test named as HbA2 or haemoglobin electrophoresis. |
| screening-result-explainer | Fetal Medicine | Default cut-off 1 in 250. Stat line: "Most screens that come back as intermediate or high risk turn out to be low risk on NIPT." | "NIPT is a very good screen, but a high-risk result is not a confirmed diagnosis." "A low-risk NIPT is reassuring." "A result below the cut-off is called low risk." |
| afi-reader | Fetal Medicine | AFI under 5 cm low; 5 to 8 lower side of normal; 8 to 24 usual; above 24 high. Deepest pocket under 2 cm low, above 8 cm high. | Next steps: "a repeat scan, a Doppler scan ... and a check of the baby's growth". "Drinking more water has some evidence of raising fluid a little for a short time. Coconut water and other home remedies have no evidence of helping." Red flags: leaking fluid, reduced movements. |
| bp-log | Obstetrics & Gynaecology | 140/90 or above: call your doctor today. 160/110 or above, or symptoms (bad headache, vision changes, upper tummy pain, breathlessness, swelling of face or hands): full-screen hospital card with 108. Five "how to measure" steps. | none beyond the values |
| pregnancy-sugar-targets | Obstetrics & Gynaecology | Fasting under 95, 1 hour after a meal under 140, 2 hours under 120 mg/dL. 1 mmol/L = 18 mg/dL. DIPSI: 75 g glucose, 2-hour value 140 or above is GDM. | "One high reading is worth noting, not panicking about." |
