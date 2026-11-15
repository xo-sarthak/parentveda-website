# Hub copy: medical review list

Drafted 15 Nov 2026 for all 43 condition hubs (`content/conditions/*.json`): `one_line`, `who_this_is_for`, `doctor_questions`, `faq`, `red_flags`, `track`. Every hub is still `published: false`, with `reviewed_by` and `reviewed_at` null, and every red-flag list has `red_flags_reviewed: false`, so none of it shows on the live site. Preview and dev show it.

Below is every factual claim and red flag in the drafts, by hub, for the reviewing doctor. To sign off a hub: correct the copy, set `reviewed_by` (expert slug from `lib/authors.ts`) and `reviewed_at` (the real date), and `red_flags_reviewed: true` if the red flags were checked.

Emergency numbers: red flags use 108 (ambulance), the same as the article red-flag cards, and Tele-MANAS 14416 for mental health.

## Parenting and child (12 hubs)

Reviewers: Paediatrics / Developmental Paediatrics / Child Psychology / Perinatal Mental Health / Lactation, per hub.

Notes:
- **Track:** uses app features named in `lib/stages.ts` (Milestones, Feeding log, Growth, Health records, Journal). "Journal" for postpartum mood and "Milestones" past the first year may not match what the app has. Track is left empty for adhd, child-anxiety and learning-difficulty.
- **Red flags left empty:** adhd and learning-difficulty, since neither has truly urgent signs.

| Hub | Claim or red flag (RF) |
|---|---|
| autism | "Autism is a different way the brain develops", not caused by anything a parent did |
| autism | Signs often show between one and three years |
| autism | Many paediatricians use a short autism checklist at the 18 and 24 month visits |
| autism | Large studies found no link between vaccines, including MMR, and autism |
| autism | DEICs under RBSK offer screening and therapy, often at the district hospital |
| autism | Starting support early gives a child more room to grow |
| autism | RF: Losing words, babble or social skills your child already had, at any age |
| cerebral-palsy | A group of conditions affecting movement and posture, from a brain difference or injury before, during or soon after birth |
| cerebral-palsy | The brain injury does not get worse over time, though needs change with growth |
| cerebral-palsy | Often noticed in the first year or two; tests may include a brain scan and a movement assessment |
| cerebral-palsy | Main therapies: physiotherapy, occupational and speech therapy; some need medicines, splints or surgery |
| cerebral-palsy | Recognised under the RPwD Act 2016; DEICs offer therapy |
| cerebral-palsy | Doctor question: check eyes, hearing, swallowing and hips |
| cerebral-palsy | RF: A seizure lasting more than 5 minutes |
| cerebral-palsy | RF: Choking, or coughing and struggling to breathe during feeds |
| cerebral-palsy | RF: Losing skills your child already had |
| developmental-delay | Many possible causes; some children simply need more time |
| developmental-delay | Assessment may include hearing and eyesight checks, and sometimes blood tests |
| developmental-delay | RBSK screens; DEICs offer assessment and therapy |
| developmental-delay | For babies born early, corrected age is used until about two years |
| developmental-delay | RF: Losing skills your child already had, such as words, sitting or walking |
| postpartum-depression | Baby blues are common in the first two weeks and pass on their own |
| postpartum-depression | Low mood lasting more than two weeks may be PPD |
| postpartum-depression | Can start in pregnancy or any time in the first year, after any baby |
| postpartum-depression | Treatment: talking therapy, support, and for some, medicine; some medicines can be taken while breastfeeding |
| postpartum-depression | Doctor question: thyroid or low iron may play a part |
| postpartum-depression | Tele-MANAS is free on 14416 in many Indian languages |
| postpartum-depression | Partners can also have postpartum depression or anxiety |
| postpartum-depression | RF: Thoughts of harming yourself or your baby: call 108 or Tele-MANAS 14416 now |
| postpartum-depression | RF: Seeing or hearing things others do not, or feeling very confused (postpartum psychosis) |
| postpartum-depression | RF: Feeling you cannot keep yourself or your baby safe: get help today |
| premature-baby-nicu | WHO recommends kangaroo mother care once stable; helps warmth and breastfeeding; fathers can do it |
| premature-baby-nicu | Breast milk is the best food for most premature babies; can be given by tube or cup |
| premature-baby-nicu | Corrected age for growth and milestones until about two; vaccines usually by actual age |
| premature-baby-nicu | ROP screening for babies born before 34 weeks or under 2 kg, or others at risk; first exam usually within the first month |
| premature-baby-nicu | Follow-up includes eye and hearing checks |
| premature-baby-nicu | RF: Pauses in breathing, or fast or hard breathing |
| premature-baby-nicu | RF: Blue or grey lips or face |
| premature-baby-nicu | RF: Not feeding, or very sleepy and hard to wake |
| premature-baby-nicu | RF: Feels cold to touch, or has a fever |
| premature-baby-nicu | RF: Yellow skin that is spreading or getting deeper |
| premature-baby-nicu | RF: Fits, stiffening or jerking movements |
| speech-delay | First words around the first birthday; two-word phrases around two |
| speech-delay | Bilingual homes do not cause speech delay |
| speech-delay | Paediatric groups suggest no screens under two, apart from video calls |
| speech-delay | A hearing test comes first; ear infections or fluid may play a part |
| speech-delay | Referral to audiologist and speech language therapist; DEICs offer speech therapy |
| speech-delay | Some children catch up, but it is hard to know which |
| speech-delay | RF: Losing words or other skills your child already had |
| adhd | A brain difference in attention, activity and impulse control, not caused by bad parenting |
| adhd | Diagnosis usually waits until school age; signs in more than one setting, affecting daily life |
| adhd | Assessed by a paediatrician, child psychiatrist or psychologist |
| adhd | Parent training first, especially for younger children; medicine helps some school-age children |
| adhd | Sugar does not cause ADHD |
| adhd | The RPwD Act 2016 expects schools to make reasonable accommodations |
| adhd | Doctor question: check hearing, eyesight or sleep first |
| child-anxiety | Can show as stomach aches, headaches, sleep trouble, clinging, anger or avoidance |
| child-anxiety | Talking therapy, especially CBT, with parents involved; some need medicine |
| child-anxiety | Tele-MANAS 14416 can guide families to support |
| child-anxiety | RF: Your child talks about hurting themselves or not wanting to live: get help now |
| child-anxiety | RF: For urgent help call Tele-MANAS 14416, or 108 in an emergency |
| learning-difficulty | Dyslexia, dysgraphia and dyscalculia are common types; unrelated to how clever or hardworking a child is |
| learning-difficulty | Usually clear after a couple of years of school; assessed by a clinical psychologist or government hospital team |
| learning-difficulty | SLD is recognised under the RPwD Act 2016 |
| learning-difficulty | CBSE and many state boards allow extra time or a scribe with a certificate from a recognised authority |
| learning-difficulty | Doctor question: check eyesight and hearing first |
| congenital-heart-disease | Ranges from small holes that close on their own to conditions needing surgery; not caused by parents |
| congenital-heart-disease | May be found on a pregnancy scan, pulse oximetry after birth, or a murmur; echo is the main test |
| congenital-heart-disease | Treatment may be medicine, a catheter procedure or surgery |
| congenital-heart-disease | Covered under RBSK; several states have schemes for children's heart treatment |
| congenital-heart-disease | Doctor question: antibiotics before dental work |
| congenital-heart-disease | RF: Blue or grey lips, tongue or skin, especially when crying or feeding |
| congenital-heart-disease | RF: Fast or hard breathing while resting |
| congenital-heart-disease | RF: Sweating, tiring or stopping during feeds |
| congenital-heart-disease | RF: Very sleepy, floppy or hard to wake |
| congenital-heart-disease | RF: Fainting or chest pain in an older child |
| febrile-seizure | Usually between six months and five years; most last a minute or two and stop on their own |
| febrile-seizure | First aid: on their side, nothing in the mouth, don't hold down, note the time, call 108 after 5 minutes |
| febrile-seizure | Simple febrile seizures do not damage the brain; most children do not develop epilepsy |
| febrile-seizure | Fever medicine does not prevent them; some children have another; most grow out of them |
| febrile-seizure | Always see a doctor after a first seizure |
| febrile-seizure | Doctor questions: emergency medicine at home, continuing vaccines |
| febrile-seizure | RF: A seizure lasting more than 5 minutes |
| febrile-seizure | RF: Struggling to breathe, or blue lips during or after |
| febrile-seizure | RF: Not waking up fully, or very confused, after it stops |
| febrile-seizure | RF: A second seizure in the same illness |
| febrile-seizure | RF: Stiff neck, a rash that does not fade, or repeated vomiting |
| febrile-seizure | RF: First seizure: see a doctor the same day |
| low-milk-supply | Worry about supply is very common; most mothers can make more with frequent feeds and a good latch |
| low-milk-supply | After the first week, at least six heavy wet nappies a day |
| low-milk-supply | Newborns feed 8 to 12 times in 24 hours; cluster feeding is normal |
| low-milk-supply | Milk is made on demand; offer both breasts, skin to skin |
| low-milk-supply | No single food is a sure answer; check before any herb or medicine for supply |
| low-milk-supply | Doctor questions: tongue tie and thyroid |
| low-milk-supply | ASHA and ANM workers can support breastfeeding at home |
| low-milk-supply | RF: Very few wet nappies, or dark yellow urine after the first week |
| low-milk-supply | RF: Baby very sleepy, hard to wake or too tired to feed |
| low-milk-supply | RF: Dry mouth, or a sunken soft spot on the head |
| low-milk-supply | RF: Yellow skin that is spreading or getting deeper |
| low-milk-supply | RF: Fever with a red, hot, painful breast in the mother |

## Trying to conceive (16 hubs)

Reviewers: Reproductive Medicine / Andrology / Obstetrics & Gynaecology, per hub.

Notes:
- **Red flags** written for 9 hubs: blocked-fallopian-tubes, failed-ivf, varicocele, adenomyosis, egg-freezing, endometriosis, fibroids, genital-tb, recurrent-miscarriage. The rest are empty.
- **Track:** uses "Cycle calendar", "Journal", "Attachments" and "Medicines" from the app's TTC screens. Check these match the app's real names. Track is empty for blocked-fallopian-tubes, varicocele, donor-egg-sperm-ivf, egg-freezing and recurrent-miscarriage.
- failed-ivf and recurrent-miscarriage carry a self-harm red flag pointing to Tele-MANAS 14416.

| Hub | Claim or red flag |
|---|---|
| low-amh | AMH shows how many eggs are left, not their quality, and does not predict natural pregnancy well on its own |
| low-amh | Many women with low AMH conceive |
| low-amh | AMH stays fairly steady through the cycle; most Indian labs test it on any day; labs differ a little |
| low-amh | No reliable way to raise AMH; many supplements lack good evidence |
| low-amh | AFC is a vaginal scan, often early in the cycle, read alongside AMH |
| low-amh | Some couples with low AMH are advised to keep trying or start with simpler treatment rather than IVF |
| unexplained-infertility | Standard workup: ovulation check, tube check (HSG or HyCoSy), semen analysis; thyroid, prolactin and pelvic scan common |
| unexplained-infertility | Many couples with unexplained infertility go on to conceive |
| unexplained-infertility | Options: more time trying, IUI with medicines, or IVF, by age and duration |
| unexplained-infertility | Stress is not usually the reason a couple does not conceive |
| blocked-fallopian-tubes | An HSG can falsely show a block because of tubal spasm |
| blocked-fallopian-tubes | One open tube can still pick up an egg from either ovary in many cases |
| blocked-fallopian-tubes | Hydrosalpinx fluid can hinder IVF; doctors often suggest removing or clipping the tube first |
| blocked-fallopian-tubes | Causes: past pelvic infections and STIs, genital TB, endometriosis, earlier abdominal surgery, often silent |
| blocked-fallopian-tubes | With both tubes blocked, IVF is usually the main option |
| blocked-fallopian-tubes | RF: positive test with one-sided pain; bleeding with shoulder-tip pain or fainting; severe pain with fever after an HSG |
| failed-ivf | Many couples need more than one cycle; one failed cycle does not mean the next will fail |
| failed-ivf | Failure is often due to the embryo, closely linked to egg age |
| failed-ivf | Usually at least one period before the next cycle |
| failed-ivf | Limited evidence for many add-ons offered in India (ERA, embryo glue, immune treatments) |
| failed-ivf | A hysteroscopy may be offered before another transfer |
| failed-ivf | RF: OHSS signs (severe belly pain or swelling, fast weight gain, little urine, breathlessness); breathlessness or chest pain means hospital |
| abnormal-semen-report | Results vary a lot between samples; fever, illness or abstinence gap change them |
| abnormal-semen-report | Repeat test usually a few weeks to three months later |
| abnormal-semen-report | Definitions of oligo-, astheno- and teratozoospermia; Indian labs use WHO reference ranges |
| abnormal-semen-report | Collection: 2 to 7 days abstinence, whole sample, to the lab within about an hour at body temperature |
| abnormal-semen-report | Sperm take about three months to form |
| abnormal-semen-report | Smoking, alcohol, weight and heat (hot baths, laptop on lap) are worth changing |
| azoospermia | Some causes (blockage, hormone problem, recent illness) can be treated; confirmed on a repeat, centrifuged sample |
| azoospermia | Obstructive vs non-obstructive, told apart by hormones, exam and sometimes a scan |
| azoospermia | Tests: FSH, LH, testosterone, scrotal ultrasound, karyotype, Y microdeletion |
| azoospermia | PESA, TESA and micro-TESE can retrieve sperm for IVF with ICSI in many men |
| varicocele | Like varicose veins of the scrotum, most often on the left; many men have one and father children |
| varicocele | Repair considered when palpable, semen abnormal and the couple has trouble conceiving; scan-only ones not usually treated |
| varicocele | Microsurgery or embolisation, usually day or short stay; semen changes take a few months |
| varicocele | RF: sudden, severe testicular pain or swelling: hospital now (torsion) |
| adenomyosis | Lining-like tissue in the womb muscle; bulky womb, heavy painful periods; not cancer |
| adenomyosis | Diagnosed by transvaginal ultrasound, sometimes MRI |
| adenomyosis | Many conceive, but it can sometimes make conceiving or carrying harder |
| adenomyosis | Hormonal treatments, including the hormone coil, prevent pregnancy while used |
| adenomyosis | Some women having IVF get GnRH pretreatment first |
| adenomyosis | Heavy periods can cause anaemia |
| adenomyosis | RF: soaking a pad every hour for a few hours (doctor today); heavy bleeding with faintness, dizziness or breathlessness (hospital) |
| donor-egg-sperm-ivf | Legal under the ART (Regulation) Act 2021; only registered clinics and ART banks |
| donor-egg-sperm-ivf | Donor identity confidential; recipients get non-identifying details (age, height, blood group) |
| donor-egg-sperm-ivf | The donor is not told who receives |
| donor-egg-sperm-ivf | The child is legally the commissioning couple's or woman's; donor has no parental rights |
| donor-egg-sperm-ivf | Donors are screened for infections and genetic conditions |
| donor-egg-sperm-ivf | Many counsellors suggest telling the child early, in simple words |
| early-menopause-poi | POI: ovaries stop working normally before 40; early menopause: periods stop at 40 to 45 |
| early-menopause-poi | With POI the ovaries may work on and off |
| early-menopause-poi | Diagnosed by missed or irregular periods plus FSH repeated a few weeks apart; thyroid and karyotype may look for a cause |
| early-menopause-poi | Hormone therapy usually advised until around natural menopause age, for bone, heart and brain |
| early-menopause-poi | Natural pregnancy possible but uncommon; contraception advised if not wanted |
| early-menopause-poi | Many women with POI build families with donor eggs |
| early-menopause-poi | Calcium, vitamin D, weight-bearing exercise, not smoking; a bone density scan may be suggested |
| egg-freezing | About two weeks of injections with scans and blood tests, then collection under sedation, vitrification |
| egg-freezing | Egg number and quality fall with age; eggs frozen younger generally do better |
| egg-freezing | Not every egg survives thawing, fertilises or becomes a pregnancy |
| egg-freezing | Regulated under the ART Act 2021, including storage and consent; storage limits exist |
| egg-freezing | Fertility preservation before cancer treatment can sometimes be arranged quickly |
| egg-freezing | RF: OHSS signs after collection; heavy bleeding, fever or fainting after collection |
| endometriosis | Lining-like tissue outside the womb; long-term, can be managed |
| endometriosis | Signs: painful periods not helped by painkillers, pain in sex, pain passing stool or urine in periods, trouble conceiving; diagnosis often delayed for years in India |
| endometriosis | Transvaginal scan shows endometriomas and some deep disease, misses smaller patches; laparoscopy sees directly |
| endometriosis | Doctor question: check AMH before ovarian surgery (implies surgery can lower reserve) |
| endometriosis | Many conceive, naturally or with treatment |
| endometriosis | Most hormonal pain treatments prevent pregnancy while taken |
| endometriosis | RF: sudden severe belly pain with fever, vomiting or fainting; positive test with one-sided pain |
| fibroids | Very common, almost never cancer; many cause no symptoms |
| fibroids | Submucosal fibroids most likely to affect fertility; outside ones usually do not |
| fibroids | Small fibroids with no symptoms often just watched |
| fibroids | Fibroid inside the womb can often be removed by hysteroscopy without a belly cut |
| fibroids | After myomectomy, a wait of a few months often advised; a caesarean may be planned |
| fibroids | Most pregnancies with fibroids go well; fibroids can grow or cause pain in pregnancy |
| fibroids | RF: heavy bleeding (as adenomyosis); sudden severe belly pain with fever |
| genital-tb | Most often affects tubes and womb lining; more common in India; often silent |
| genital-tb | Diagnosed by endometrial biopsy for TB culture, CBNAAT/GeneXpert and histopathology; sometimes seen at laparoscopy or hysteroscopy |
| genital-tb | Blood antibody tests for TB not recommended in India; Mantoux and TB Gold show only past contact |
| genital-tb | Full course of TB medicines, usually about six months, free under the National TB Elimination Programme |
| genital-tb | Some conceive naturally after treatment; IVF may be needed if tubes or lining are damaged |
| genital-tb | RF: positive test with one-sided pain; coughing up blood; yellow eyes or skin or vomiting on TB medicines |
| recurrent-miscarriage | Many doctors now test after two losses; older definitions used three in a row |
| recurrent-miscarriage | Tests: antiphospholipid antibodies, thyroid, blood sugar, womb-shape scan, and for some, chromosome tests for both partners |
| recurrent-miscarriage | Many couples with no cause found go on to a healthy pregnancy with supportive care |
| recurrent-miscarriage | Work, travel, lifting, sex and normal exercise do not cause miscarriage; most early losses are because the pregnancy was not developing as it should |
| recurrent-miscarriage | Aspirin plus heparin often given for APS; progesterone may be offered to women who bleed in early pregnancy after a past miscarriage |
| recurrent-miscarriage | Doctor question: testing tissue from a future loss |
| recurrent-miscarriage | RF: heavy bleeding or faintness; severe or one-sided pain in early pregnancy; fever, chills or foul discharge after a miscarriage or procedure |
| secondary-infertility | Includes trouble conceiving after any previous pregnancy, whether or not it led to a birth |
| secondary-infertility | Causes: age, weight, thyroid, infections, scarring after birth or surgery (including caesarean), semen changes |
| secondary-infertility | See a doctor after 12 months if under 35, 6 months if 35 or over, sooner if periods are irregular |
| secondary-infertility | Frequent and night breastfeeding can delay periods and ovulation returning |

## Pregnancy and preconception (15 hubs)

Reviewers: Obstetrics & Gynaecology / Fetal Medicine / Genetic Counselling, per hub.

Notes:
- **Red flags left empty:** thalassemia-minor, cancer-and-pregnancy, cousin-marriage, pregnancy-after-35-40, down-syndrome (planning or screening hubs).
- **Ectopic red flags** are copied word for word from the ectopic article's list in `content/article-meta.json`.
- **Track:** "Kick counter", "Contraction timer" and "Symptom log" as app features ("Symptom log" is a made-up name; check). preeclampsia uses the BP log tool, gestational-diabetes the sugar targets tool.
- **New consult:** pregnancy hubs that pointed to the TTC-worded gynaecologist consult now point to a new `obstetrician` consult (price on request).

| Hub | Claim or red flag (RF) |
|---|---|
| thalassemia-minor | Being a carrier is usually harmless; most need no treatment; mild anaemia may show |
| thalassemia-minor | If both partners are carriers, each pregnancy has a chance of thalassemia major; a genetic counsellor can discuss early testing |
| thalassemia-minor | Screen with CBC, confirm with HbA2 by HPLC; low iron can change the result |
| thalassemia-minor | Carrier anaemia is not iron lack; iron only if iron studies show it is low |
| thalassemia-minor | Being a carrier does not usually make pregnancy risky for the mother |
| bleeding-in-early-pregnancy | Light first-trimester spotting is common; causes include implantation and a sensitive cervix |
| bleeding-in-early-pregnancy | Tests: TVS, serum beta hCG (sometimes repeated at 48 hours), blood group |
| bleeding-in-early-pregnancy | Rh-negative women may be advised anti-D after bleeding |
| bleeding-in-early-pregnancy | No good evidence that strict bed rest prevents miscarriage |
| bleeding-in-early-pregnancy | Most early loss is from causes such as chromosome changes; work, sex, activity do not cause it |
| bleeding-in-early-pregnancy | RF: soaking a pad in an hour or large clots; strong pain esp. one side; shoulder-tip pain; faint or dizzy; fever or smelly discharge |
| cervical-cerclage | A short cervix on mid-pregnancy TVS makes early labour more likely |
| cervical-cerclage | Stitch placed under anaesthesia, often spinal; home same or next day |
| cervical-cerclage | Vaginal progesterone often advised for a short cervix; some get a stitch, some both |
| cervical-cerclage | Strict bed rest not usually advised; can raise clot risk |
| cervical-cerclage | Removed around 36 to 37 weeks, often without anaesthesia, or earlier if labour or waters break |
| cervical-cerclage | RF: leaking fluid; regular tightenings or cramps before 37 weeks; bleeding; pelvic pressure; fever, chills or smelly discharge |
| high-risk-pregnancy | Double marker with NT, quadruple marker and NIPT are screening, not diagnosis |
| high-risk-pregnancy | CVS and amniocentesis are diagnostic, with a small miscarriage risk |
| high-risk-pregnancy | Common reasons: high BP, diabetes, thyroid, age over 35, twins, past caesarean or early birth, screening follow-up |
| high-risk-pregnancy | Fetal medicine referral is routine after a high-risk screen; high-risk alone does not mean caesarean |
| high-risk-pregnancy | RF: bleeding; severe headache, blurred vision or sudden swelling; less movement; leaking fluid; severe tummy pain |
| preeclampsia | High BP after 20 weeks with signs of organ effect; can affect the placenta; often silent at first |
| preeclampsia | Low-dose aspirin often advised for higher-risk women; never self-started |
| preeclampsia | Home BP: automatic upper-arm machine, sit quietly 5 minutes, record |
| preeclampsia | Delivery ends it, but BP can stay high for days or weeks, and rarely it starts after birth; yearly BP check later |
| preeclampsia | Cutting salt has not been shown to prevent it |
| preeclampsia | Calcium tablets are routine in Indian antenatal care, matter more when diet is low in calcium |
| preeclampsia | RF: severe headache not eased by rest; blurred vision or flashing lights; right upper pain or vomiting; sudden swelling; a fit or confusion; less movement |
| cancer-and-pregnancy | Many people treated for cancer go on to become parents |
| cancer-and-pregnancy | Some chemo, pelvic radiation and surgery can affect eggs, sperm or womb |
| cancer-and-pregnancy | Options: egg, embryo or sperm freezing, sometimes ovarian tissue; some within a few weeks |
| cancer-and-pregnancy | Some medicines need a set gap before conceiving |
| cancer-and-pregnancy | Some surgery and chemo can be given after the first trimester; others wait until after birth |
| cancer-and-pregnancy | Breastfeeding often possible after treatment, not during some treatments |
| cousin-marriage | Most children of cousin couples are born healthy; the risk is higher than for unrelated couples |
| cousin-marriage | Higher risk comes from shared recessive genes |
| cousin-marriage | Testing starts with a thalassemia carrier test, adding sickle cell or a wider panel by family and community |
| cousin-marriage | For carrier couples: CVS, amniocentesis, or IVF with embryo testing |
| pregnancy-after-35-40 | Many women have healthy pregnancies after 35 and 40 |
| pregnancy-after-35-40 | See a doctor after 6 months of trying at 35+; over 40, many suggest checking straight away |
| pregnancy-after-35-40 | AMH and AFC show reserve but cannot tell whether you will conceive |
| pregnancy-after-35-40 | All pregnant women are offered chromosome screening; sugar may be checked earlier |
| pregnancy-after-35-40 | Anomaly scan around 18 to 20 weeks (check: some Indian centres say 18 to 22) |
| pregnancy-after-35-40 | Age alone is not a reason for a caesarean; folic acid at least a month before trying |
| down-syndrome | An extra copy of chromosome 21, by chance at conception, not caused by parents |
| down-syndrome | Only CVS or amniocentesis confirm; NT with double marker, quadruple marker and NIPT are screening |
| down-syndrome | Many babies with a high-risk screen do not have Down syndrome |
| down-syndrome | Newborns checked for heart (echo), hearing, vision, thyroid |
| down-syndrome | Early intervention helps; many children go to school and enjoy full lives |
| ectopic-pregnancy | Most often in a tube; cannot continue safely |
| ectopic-pregnancy | Diagnosed with TVS and serial beta hCG |
| ectopic-pregnancy | Treatment: methotrexate, laparoscopy, or sometimes watching while hCG falls |
| ectopic-pregnancy | Past pelvic infection or tube surgery make it more likely; often no clear reason |
| ectopic-pregnancy | Many have a healthy pregnancy later, even with one tube; early scan next time; a waiting gap after methotrexate |
| ectopic-pregnancy | RF: same list as the ectopic article |
| gestational-diabetes | GoI guideline: single-step 75 g test, fasting or not, read at 2 hours; some use fasting 75 g OGTT; first visit and 24 to 28 weeks |
| gestational-diabetes | Diet: 3 smaller meals plus 2 or 3 snacks; whole grains, dal, vegetables, curd, protein; less white rice, maida, sweets, juice, sugary chai |
| gestational-diabetes | Many manage with diet and activity; metformin or insulin if above target; insulin does not cross to the baby |
| gestational-diabetes | A 10 to 15 minute walk after meals helps |
| gestational-diabetes | Usually resolves after birth; raises later type 2 risk; test in the weeks after delivery and regularly |
| gestational-diabetes | RF: less movement; shaky, sweaty or confused on insulin; readings much above target again and again; leaking fluid or regular tightenings before 37 weeks |
| iugr | Some small babies are constitutionally small and healthy; serial scans tell them apart |
| iugr | Often the placenta; high BP, preeclampsia, smoking, infections contribute |
| iugr | Doppler guides monitoring and delivery timing |
| iugr | Eating extra does not usually fix it |
| iugr | Earlier delivery may be planned; steroids if early birth likely |
| iugr | RF: less movement or a change in pattern; severe headache, blurred vision or swelling; bleeding; leaking fluid; severe or constant pain |
| low-amniotic-fluid | Later in pregnancy, most fluid is the baby's urine |
| low-amniotic-fluid | AFI is four pockets added; or single deepest pocket; the trend matters |
| low-amniotic-fluid | Causes: past due date, ruptured membranes, placenta not working as well; rarely the baby's kidneys |
| low-amniotic-fluid | Drinking water may raise it a little for a short time; not a treatment on its own |
| low-amniotic-fluid | Decisions weigh weeks, growth, Doppler, NST |
| low-amniotic-fluid | RF: leaking fluid; less movement; bleeding; regular tightenings or pain before 37 weeks |
| placenta-previa | A low placenta at the anomaly scan often moves clear; repeat scan around 32 weeks |
| placenta-previa | Previa covers the cervix; low-lying is near but not covering |
| placenta-previa | Doctors often advise avoiding sex and heavy exercise while low |
| placenta-previa | If still covering late, a planned caesarean is usually advised, often a few weeks early |
| placenta-previa | Bleeding often painless and can be sudden and heavy; any bleeding needs a same-day check |
| placenta-previa | Doctor question links a past caesarean to checks for accreta |
| placenta-previa | RF: any bleeding; tightenings, cramps or pain; less movement; faint or dizzy; leaking fluid |
| preterm-labour | Labour before 37 weeks; signs: regular tightenings, cramps, low backache, pelvic pressure, change in discharge |
| preterm-labour | PPROM: infection risk; antibiotics usually started |
| preterm-labour | Treatments: antenatal steroids, magnesium sulphate for the baby's brain, short-term medicine to slow contractions, transfer to a NICU hospital |
| preterm-labour | Progesterone or a stitch may help with short cervix or past early birth; treat urine infections; no smoking |
| preterm-labour | Normal work, sex and activity do not cause it in a healthy pregnancy |
| preterm-labour | RF: regular tightenings before 37 weeks; gush or trickle of fluid; bleeding; pelvic pressure or new low backache; less movement; fever or smelly discharge |

## The nine printable PDFs

Sources: `content/downloads/src/<slug>.html` and `print.css`. Rebuild with `node content/downloads/src/render.mjs`. Each PDF carries "DRAFT: awaiting medical review" in its footer. Once signed off: remove that line, re-render, and set `reviewed: true` for that entry in `content/downloads.json`.

| PDF | What to check |
|---|---|
| cerclage-care-sheet | Spotting and mild cramps for a day or two after the stitch; hospital-now list (bleeding beyond spotting, leaking fluid, rhythmic cramps, pelvic pressure, fever, foul discharge, less movement); water against urine infections; fibre, no heavy lifting, ask before sex, travel or exercise, nothing in the vagina; some discharge normal; removal around 36 to 37 weeks in hospital, sooner if labour or waters |
| gdm-diet-chart-veg | 7-day menu and portions (e.g. 2 rotis, or 1 small katori rice plus 1 roti, per main meal); 4 to 5 almonds or 2 walnut halves early morning; bedtime milk; katori about 150 ml; plate method; small meals every 2 to 3 hours; foods to keep rare; low-sugar signs on insulin or tablets |
| fertility-specialist-checklist | FSH and LH on day 2 or 3; reports to bring: AMH, TSH, prolactin, fasting sugar or HbA1c, CBC, blood group, rubella IgG, HSG, HIV, HBsAg, anti-HCV, VDRL, thalassemia (HbA2 HPLC); dates of last 3 to 6 periods |
| thalassemia-partner-test-guide | Low MCV/MCH can mean carrier or low iron; raised HbA2 by HPLC is the usual sign of beta trait (no cut-off printed); HPLC also shows HbE, HbS; ferritin or DNA test for unclear results; one carrier plus one normal: baby not expected to have thalassemia major (check wording for alpha thalassemia); CVS 10 to 13 weeks, amniocentesis from about 15 weeks; carriers may still need iron in pregnancy. The 1 in 4 figure is left out on purpose |
| bp-log-sheet | How to measure (30 minutes no tea, coffee, smoking or exercise; empty bladder; rest 5 minutes; back supported, feet flat; bare upper arm at heart level; no talking; two readings 1 minute apart; same arm); hospital-now list; check your machine against the doctor's. No target printed, only "Your doctor's target: ____" |
| ivf-next-cycle-questions | No numbers. Questions imply: hysteroscopy, repeat semen test, thyroid, sugar, prolactin and vitamin D, PGT, frozen vs fresh, number of embryos, ICSI |
| semen-report-guide | WHO 2021 lower limits (1.4 ml, 16 M/ml, 39 M, 42%, 30%, 54%, 4%); pH 7.2 or more; liquefaction within 60 minutes; peroxidase-positive cells under 1 M/ml; abstinence 2 to 7 days; reference men = partners conceived within a year; some labs use WHO 2010; reach the lab within about an hour; illness in last 3 months matters |
| high-risk-pregnancy-visit-plan | 6 to 10 weeks dating scan and booking bloods; ask about low-dose aspirin early; 11 to 14 weeks NT with double marker, uterine artery and preeclampsia screen; 15 to 20 weeks quadruple marker, Td, cervical length if past early birth or stitch; 18 to 22 weeks anomaly (TIFFA), fetal echo if advised; 24 to 28 weeks 75 g OGTT, CBC, anti-D at about 28 weeks if Rh negative; 28 to 32 weeks visits every 2 to 4 weeks, growth and Doppler, steroids if early birth likely; 32 to 36 weeks every 2 weeks with NST; from 36 weeks weekly; hospital-now list |
| nicu-to-home-checklist | Paladai, spoon or bottle; kangaroo care; back to sleep on a firm flat surface; discharge medicines as examples (iron, vitamin D, multivitamin); follow-ups: ROP, hearing, newborn screening, birth-dose vaccines; corrected age from due date; no smoke, mosquito coils or agarbatti; hospital-now list (fast or hard breathing, grunting, chest indrawing, pauses or blue lips, poor feeding, fever or cold, fits, stiff or floppy, yellow palms or soles, vomiting everything or green, far fewer wet nappies, red or pus at cord) |
