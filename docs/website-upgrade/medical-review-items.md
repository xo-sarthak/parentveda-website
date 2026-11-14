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
