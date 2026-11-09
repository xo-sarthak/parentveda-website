/* ============================================================
   ParentVeda — the people behind the articles: writers and expert reviewers.

   Why this lives in code rather than Supabase: a profile is a small,
   slow-moving, structured record (qualifications, registration, memberships)
   that we render into Person schema. A post points at people by slug:
   `author_slug` is who wrote it, `reviewed_by` is the expert who checked it
   (see toPost in lib/guides.ts). Add a person here and their byline,
   end-of-article card and /reads/authors/<slug> page all work from that.

   Why it matters for search: Google's quality guidelines for YMYL
   (your-money-or-your-life) topics — which all pregnancy and child-health
   content is — lean hard on who wrote a page and what qualifies them.
   A named, credentialed, linkable author with Person schema is the single
   biggest E-E-A-T signal we can add to an article.
   ============================================================ */

export const AUTHORS_BASE = "/reads/authors";

/** Who a post is credited to when it names nobody. */
export const DEFAULT_AUTHOR_SLUG = "sarthak-thakur";

export type Qualification = {
  /** The degree, or for a plain line (a training, a posting) the whole line. */
  degree: string;
  /** Absent on a plain line. A line without an institution is not a credential in Person schema. */
  institution?: string;
  year?: string;
};

export type Author = {
  slug: string;
  /** "expert" people can review articles and appear on /experts/. */
  kind: "writer" | "expert";
  name: string;
  /** Post-nominals, shown next to the name. */
  credentials?: string;
  /** Professional title — the line under the name. */
  role: string;
  /** Path to a headshot in /public. Falls back to initials when absent. */
  photo?: string;
  /** One sentence. Used on the end-of-article card and in meta descriptions. */
  shortBio: string;
  /** Full bio, one string per paragraph. */
  bio: string[];
  specialties: string[];
  qualifications: Qualification[];
  memberships: string[];
  experience?: string;
  /** Medical council registration — a verifiable credential, worth showing. */
  registration?: string;
  languages?: string[];
  /** Practice / clinic name. Kept for our records; never shown for an expert
      (families reach experts through ParentVeda, not directly). */
  practice?: string;
  /** Where they are based, when that is a place rather than a named practice. */
  location?: string;
  /** Public profiles that identify this person: LinkedIn, clinic page, Practo.
      Writers only. An expert page never links out to anywhere a family could
      book or contact the expert directly. */
  sameAs?: string[];
  /** The field shown on the expert's card cover. Not a stage: no expert belongs to one. */
  field?: string;
  /** The filter an expert sits under on /experts/. */
  group?: ExpertGroup;
  /** A founding expert: shown first, with a badge. */
  founding?: boolean;
  /** false = keeps a profile (for review credits) but is not listed on /experts/. */
  listed?: boolean;
};

export type ExpertGroup = "fertility" | "pregnancy" | "birth" | "pelvic" | "nutrition" | "yoga" | "child";

/** Filter chips on /experts/, in display order. */
export const EXPERT_GROUPS: { key: ExpertGroup; label: string }[] = [
  { key: "fertility", label: "Fertility & IVF" },
  { key: "pregnancy", label: "Pregnancy" },
  { key: "birth", label: "Birth & breastfeeding" },
  { key: "pelvic", label: "Pelvic health" },
  { key: "nutrition", label: "Nutrition" },
  { key: "yoga", label: "Yoga & garbh sanskar" },
  { key: "child", label: "Child development" },
];

export const AUTHORS: Author[] = [
  {
    slug: "sarthak-thakur",
    kind: "writer",
    name: "Sarthak Thakur",
    role: "Co-Founder, CTO & Chief Marketing Officer, ParentVeda",
    photo: "/authors/sarthak-thakur.jpg",
    shortBio:
      "Co-founder, CTO and Chief Marketing Officer of ParentVeda, and the software engineer who builds its app and the pipeline that checks its articles.",
    bio: [
      "Sarthak Thakur is a co-founder of ParentVeda, an India-first companion for families through trying to conceive, pregnancy, parenting and skilling. He is its CTO and Chief Marketing Officer, and the only engineer on a three-person founding team.",
      "A software engineer who previously worked at DRDO (SSPL), he builds the app, the backend, Ask Veda and the editorial pipeline that checks articles and blocks unsafe drafts. He is based in New Delhi.",
    ],
    specialties: [],
    qualifications: [],
    memberships: [],
    location: "New Delhi",
    sameAs: ["https://www.linkedin.com/in/sarthak-thakur1/"],
  },
  {
    slug: "dr-mahender-singh",
    kind: "expert",
    name: "Dr. Mahender Singh",
    credentials: "MBBS, DCH, MD (Paediatrics)",
    role: "Consultant Child Specialist & Neonatologist",
    /* Head-and-shoulders square crop at 400px — 3× the largest place it's
       rendered (112px on the profile header), so it stays sharp on retina
       without shipping a 2 MB original. */
    photo: "/authors/dr-mahender-singh.jpg",
    shortBio:
      "A consultant child specialist and neonatologist with over four decades of practice in newborn and child health.",
    bio: [
      "Dr. Mahender Singh is a consultant child specialist and neonatologist who has spent more than four decades caring for children — from the first fragile hours of a newborn's life through to adolescence.",
      "He completed his MBBS at Sardar Patel Medical College in 1979, returning to the same institution for a Diploma in Child Health in 1983 and an MD in Paediatrics in 1985. In the years since, his practice has centred on neonatal care, routine immunisation, growth and development, and the everyday worries that bring families to a paediatrician's door.",
      "He practises in both Hindi and English and is registered with the Delhi Medical Council.",
    ],
    specialties: [
      "Newborn & neonatal care",
      "Child health",
      "Immunisation",
      "Growth & development",
      "Adolescent health",
    ],
    qualifications: [
      { degree: "MD (Paediatrics)", institution: "Sardar Patel Medical College", year: "1985" },
      {
        degree: "DCH (Diploma in Child Health)",
        institution: "Sardar Patel Medical College",
        year: "1983",
      },
      { degree: "MBBS", institution: "Sardar Patel Medical College", year: "1979" },
    ],
    memberships: [
      "Indian Academy of Paediatrics",
      "National Neonatology Forum",
      "Indian Medical Association",
    ],
    experience: "42 years in healthcare",
    registration: "Delhi Medical Council",
    languages: ["English", "Hindi"],
    practice: "Child Care",
    field: "Paediatrics",
    listed: false,
  },
  {
    slug: "simranpreet-kaur-sandhu",
    kind: "expert",
    name: "Dr. Simranpreet Kaur Sandhu",
    credentials: "PhD",
    role: "Genetic counsellor and embryologist",
    shortBio: "Fertility, IVF, recurrent miscarriage and prenatal genetic counselling.",
    bio: [
      "Simranpreet counsels couples through infertility, recurrent miscarriage, preconception screening and prenatal testing. She helped set up a genetic clinic and a Level I ART lab at a medical university, and she also coaches on nutrition based on genetic results.",
    ],
    specialties: ["Fertility", "IVF", "Miscarriage", "Prenatal genetics"],
    qualifications: [
      { degree: "PhD, Medical Physiology (Human Genetics)", institution: "SGRD University of Health Sciences", year: "2023" },
      { degree: "MSc and BSc (Hons) in Human Genetics, Guru Nanak Dev University" },
      { degree: "Post-doctoral fellow, ICMR National Institute for Research in Reproductive and Child Health, Mumbai (2023)" },
      { degree: "Assistant Professor of Genetics, SGRD Institute of Medical Sciences (2021 to 2024); embryologist and counsellor there (2016 to 2024)" },
      { degree: "Hands-on embryology training in Las Vegas, Bangkok and Mumbai" },
      { degree: "11 research papers, including work on genes linked to infertility and on prenatal genetic counselling" },
      { degree: "Selected for the Gates Foundation OpeningGates programme (2024)" },
    ],
    memberships: ["Board of Genetic Counselling India", "Indian Society of Human Genetics"],
    experience: "In genetics and fertility since 2007, with more than 1,000 genetic counselling sessions",
    registration: "Board of Genetic Counselling India, Level II Genetic Counsellor",
    practice: "Blossom Genomic Wellness Clinic, Amritsar",
    location: "Amritsar",
    field: "Genetics and fertility",
    group: "fertility",
  },
  {
    slug: "maneesha-mohan",
    kind: "expert",
    name: "Dr. Maneesha Mohan",
    credentials: "Physiotherapist",
    role: "Women's health physiotherapist and lactation specialist",
    shortBio: "Pregnancy and postnatal physio, breastfeeding support, birth doula and childbirth education.",
    bio: [
      "Maneesha works with women through pregnancy, birth and the months after. She covers movement and recovery as a physiotherapist, feeding as a lactation specialist, and birth as a trained doula and childbirth educator.",
    ],
    specialties: ["Women's health", "Breastfeeding", "Birth doula", "Childbirth education"],
    qualifications: [
      { degree: "Bachelor of Physiotherapy", institution: "Rajiv Gandhi University of Health Sciences, Karnataka", year: "2011" },
      { degree: "Postgraduate certificate in Women's Health and Rehabilitation, International Health and Fitness Association (2020)" },
      { degree: "Infant and Young Child Feeding and Lactation Management Specialist, Breastfeeding Promotion Network of India (2019)" },
      { degree: "Trauma-informed certified birth doula, The Doula Collective" },
      { degree: "Completed the Lamaze Childbirth Educator Seminar, 25 contact hours (2024)" },
    ],
    memberships: ["Indian Association of Physiotherapists"],
    experience: "Physiotherapist since 2011",
    registration: "Indian Association of Physiotherapists, Life Member",
    location: "Bengaluru",
    field: "Women's health",
    group: "birth",
  },
  {
    slug: "keya-sampat",
    kind: "expert",
    name: "Keya Sampat",
    role: "Clinical hypnotherapist and HypnoBirthing educator",
    shortBio: "Calm birth preparation, fear of birth, anxiety and emotional wellbeing.",
    bio: [
      "Keya works with what a mother carries into birth. She combines hypnotherapy, HypnoBirthing and body-based somatic work to help people approach pregnancy and birth more calmly.",
    ],
    specialties: ["HypnoBirthing", "Birth fear", "Anxiety", "Life coaching"],
    qualifications: [
      { degree: "MSc Forensic Psychology", institution: "National Forensic Sciences University, Gandhinagar", year: "2022" },
      { degree: "Certified in Integrated Clinical Hypnotherapy, Ekaa (2020)" },
      { degree: "HypnoBirthing Practitioner, HypnoBirthing International, UK (2019)" },
      { degree: "Integral Somatic Psychology training with Dr. Raja Selvam (2024)" },
      { degree: "Certified life coach, Inspiring Evolution (2020)" },
      { degree: "BA Psychology, University of Mumbai" },
      { degree: "Runs workshops on anxiety and an introduction to HypnoBirthing" },
    ],
    memberships: [],
    experience: "Independent practice since 2018",
    practice: "Parichay",
    location: "Mumbai",
    field: "Birth and the mind",
    group: "birth",
  },
  {
    slug: "aishwarya-jain",
    kind: "expert",
    name: "Aishwarya Jain",
    role: "Child guidance counsellor",
    shortBio: "Child development, behaviour and parenting guidance.",
    bio: [
      "Aishwarya helps parents understand how their child is growing, both in behaviour and in development, and what to do when something feels off.",
    ],
    specialties: ["Child development", "Behaviour", "Parenting"],
    qualifications: [
      { degree: "MSc Human Development and Childhood Studies", institution: "University of Delhi", year: "2016 (First Division)" },
      { degree: "Advanced Diploma in Child Guidance and Counselling, recognised by RCI (2017); registration renewed 2024" },
      { degree: "BSc Home Science, University of Delhi (2014, First Division)" },
    ],
    memberships: [],
    experience: "Counselling children and families since 2017",
    registration: "Rehabilitation Council of India, Rehabilitation Counsellor",
    location: "New Delhi",
    field: "Child development",
    group: "child",
  },
  {
    slug: "madhvi-khurana",
    kind: "expert",
    name: "Madhvi Khurana",
    role: "Child and adolescent psychologist",
    shortBio: "Behaviour therapy, psychological assessment and support for children and teenagers.",
    bio: [
      "Madhvi works with children and teenagers on behaviour, emotions and development, using therapy and psychological assessment.",
    ],
    specialties: ["Children and teens", "Behaviour therapy", "Assessments"],
    qualifications: [
      { degree: "MA Clinical Psychology", institution: "Amity University, Noida", year: "2025" },
      { degree: "Advanced Diploma in Child Guidance and Counselling, Amity University, recognised by RCI (2026)" },
      { degree: "Trainee child psychologist, Child Development Clinic, Sir Ganga Ram Hospital (2026)" },
      { degree: "Clinical postings at Moolchand Khairati Ram Hospital" },
      { degree: "BA Psychology and English, University of Delhi" },
    ],
    memberships: [],
    experience: "Supervised clinical placements, 2022 to 2026",
    registration: "Rehabilitation Council of India, Rehabilitation Counsellor",
    location: "New Delhi",
    field: "Child psychology",
    group: "child",
  },
  {
    slug: "gunjan-sabherwal",
    kind: "expert",
    name: "Dr. Gunjan Sabherwal",
    credentials: "MBBS, DGO, DNB",
    role: "Fertility specialist and gynaecologist",
    shortBio: "Fertility care for PCOS, endometriosis, low egg reserve and failed IVF cycles.",
    bio: ["Dr. Gunjan Sabherwal is a senior obstetrician, gynaecologist and fertility specialist with 25 years of practice. She treats fertility problems both medically and surgically, including laparoscopy and hysteroscopy.", "On ParentVeda she leads our guidance on complex fertility: PCOS, endometriosis, low egg reserve, repeated IVF failure and what to try next."],
    specialties: ["PCOS and fertility", "Endometriosis", "Low egg reserve", "IVF failure", "Fertility surgery"],
    qualifications: [{ degree: "MBBS, Lady Hardinge Medical College, Delhi" }, { degree: "DGO, Delhi" }, { degree: "DNB and MNAMS, Obstetrics & Gynaecology" }, { degree: "Certificate in Reproductive Medicine, ICOG" }],
    memberships: [],
    experience: "25 years in practice",
    languages: ["English", "Hindi"],
    location: "Gurugram",
    field: "Fertility & IVF",
    group: "fertility",
    founding: true,
  },
  {
    slug: "smitha-avula",
    kind: "expert",
    name: "Dr. Smitha Avula",
    credentials: "MBBS, DNB, FFM",
    role: "High-risk obstetrician and fetal medicine specialist",
    shortBio: "High-risk pregnancy, IVF pregnancies, recurrent pregnancy loss and fetal medicine.",
    bio: ["Dr. Smitha Avula is a high-risk obstetrician with a fellowship in fetomaternal medicine and 21 years of practice. She has cared for IVF pregnancies for over a decade, and her interests include recurrent pregnancy loss, endocrine problems in pregnancy and preventive women's health.", "She has written a chapter in the Elsevier book Critically Ill Pregnant Woman. On ParentVeda she is our lead for pregnancy care, scans and warning signs."],
    specialties: ["High-risk pregnancy", "IVF pregnancy", "Recurrent pregnancy loss", "Scans and screening", "Postpartum care"],
    qualifications: [{ degree: "MBBS" }, { degree: "DNB, Obstetrics & Gynaecology" }, { degree: "Fellowship in Fetomaternal Medicine, RGUHS" }, { degree: "MBA in Hospital and Health Systems Management, BITS Pilani" }, { degree: "Author of a chapter in Critically Ill Pregnant Woman (Elsevier)" }],
    memberships: ["Society of Maternal Fetal Medicine India (treasurer)"],
    experience: "21 years in practice",
    languages: ["English", "Hindi", "Kannada", "Telugu", "Tamil"],
    location: "Bengaluru",
    field: "Pregnancy",
    group: "pregnancy",
    founding: true,
  },
  {
    slug: "gurbani-kohli",
    kind: "expert",
    name: "Dr. Gurbani Kohli",
    credentials: "PhD",
    role: "Child and adolescent psychologist",
    shortBio: "Autism, ADHD, developmental delay, learning differences and teen mental health.",
    bio: ["Dr. Gurbani Kohli is a child and adolescent psychologist with a PhD in Clinical Psychology and more than 11 years of practice. She assesses and supports children with autism, ADHD, developmental delay and learning differences.", "Her belief is simple: every child deserves to be understood, not just assessed. On ParentVeda she leads our development screening and red-flag guidance."],
    specialties: ["Autism", "ADHD", "Developmental delay", "Learning differences", "Speech and sensory concerns"],
    qualifications: [{ degree: "PhD in Clinical Psychology" }, { degree: "Qualification from CISNE, Singapore" }],
    memberships: [],
    experience: "11+ years in practice",
    registration: "Rehabilitation Council of India",
    languages: ["English", "Hindi"],
    location: "New Delhi",
    field: "Child development",
    group: "child",
    founding: true,
  },
  {
    slug: "sugandh-yadav",
    kind: "expert",
    name: "Sugandh Yadav",
    role: "Fertility, prenatal and postnatal yoga coach",
    shortBio: "Yoga for fertility, pregnancy and recovery after birth, including PCOS and pelvic floor.",
    bio: ["Sugandh Yadav is a certified prenatal and postnatal yoga coach who specialises in yoga for fertility. She leads Yoga Shastra, whose teachers run ParentVeda's yoga sessions.", "Her classes help women prepare for pregnancy, stay strong and calm through it, and recover gently afterwards."],
    specialties: ["Fertility yoga", "Prenatal yoga", "Postnatal yoga", "PCOS", "Pelvic floor"],
    qualifications: [{ degree: "Certified prenatal and postnatal yoga coach" }, { degree: "Prenatal yoga teacher training" }],
    memberships: [],
    location: "Noida",
    field: "Yoga",
    group: "yoga",
    founding: true,
  },
  {
    slug: "kiran-sharma",
    kind: "expert",
    name: "Kiran Sharma",
    role: "Prenatal and postnatal yoga teacher",
    shortBio: "Yoga through pregnancy and after birth, for fertility, PCOS and the pelvic floor.",
    bio: ["Kiran Sharma teaches yoga for women trying to conceive, pregnant women and new mothers. Her sessions cover fertility, PCOS, pregnancy and pelvic floor strength."],
    specialties: ["Prenatal yoga", "Postnatal yoga", "Fertility yoga", "PCOS", "Pelvic floor"],
    qualifications: [],
    memberships: [],
    field: "Yoga",
    group: "yoga",
  },
  {
    slug: "shilpi-srivastava",
    kind: "expert",
    name: "Dr. Shilpi Srivastava",
    credentials: "MPT",
    role: "Women's health physiotherapist, Lamaze educator and lactation counsellor",
    shortBio: "Birth preparation, Lamaze classes, breastfeeding and the first 40 days.",
    bio: ["Dr. Shilpi Srivastava is a women's health physiotherapist, pelvic health specialist, lactation counsellor and birth doula with 16 years of clinical experience. She has supported mothers across hospital and outpatient settings.", "On ParentVeda she leads our birthing course and our guidance for the first 40 days after birth."],
    specialties: ["Childbirth education", "Labour support", "Breastfeeding", "Pelvic health", "Postpartum recovery"],
    qualifications: [{ degree: "Master of Physical Therapy (Orthopaedics), Jamia Hamdard, Delhi" }, { degree: "Bachelor of Physical Therapy" }, { degree: "Lamaze Childbirth Educator" }, { degree: "DONA International Birth Doula" }, { degree: "BPNI Lactation Counsellor" }, { degree: "HypnoBirthing educator" }],
    memberships: [],
    experience: "16 years in practice",
    languages: ["English", "Hindi"],
    location: "New Delhi",
    field: "Birth & breastfeeding",
    group: "birth",
  },
  {
    slug: "swati-shivhare",
    kind: "expert",
    name: "Dr. Swati Shivhare",
    credentials: "MBBS, MD, DNB, MRCOG (UK)",
    role: "Fertility and IVF specialist",
    shortBio: "IVF and ICSI, PCOS treatment, repeated loss and fetal medicine.",
    bio: ["Dr. Swati Shivhare is an obstetrician and gynaecologist who specialises in reproductive and fetal medicine. She treats infertility and offers IVF, ICSI and donor programmes.", "On ParentVeda she covers IVF decisions, PCOS treatment and pregnancy after repeated loss."],
    specialties: ["IVF and ICSI", "PCOS treatment", "Repeated pregnancy loss", "Fetal medicine", "Egg freezing"],
    qualifications: [{ degree: "MBBS" }, { degree: "MD, Obstetrics & Gynaecology" }, { degree: "DNB" }, { degree: "MRCOG (UK)" }, { degree: "Fellowships in Fetal Medicine and Reproductive Medicine" }],
    memberships: [],
    experience: "9+ years in practice",
    location: "Gurugram",
    field: "Fertility & IVF",
    group: "fertility",
  },
  {
    slug: "fathima-pothuraju",
    kind: "expert",
    name: "Dr. Fathima Pothuraju",
    credentials: "PharmD",
    role: "Clinical pharmacologist and pregnancy & parenting coach",
    shortBio: "Which medicines are safe in pregnancy and breastfeeding, plus pregnancy and parenting coaching.",
    bio: ["Dr. Fathima Pothuraju is a clinical pharmacologist with more than 10 years in patient safety, pharmacovigilance and maternal wellness. She has designed large wellness programmes for mothers and families.", "She is also a pregnancy and parenting coach trained in garbh sanskar and prenatal yoga. On ParentVeda she checks our medicine-safety guidance."],
    specialties: ["Medicine safety", "Pregnancy planning", "Garbh sanskar", "Parenting coaching", "Prenatal and postnatal yoga"],
    qualifications: [{ degree: "PharmD (Clinical Pharmacology)" }, { degree: "Yoga teacher training and yoga therapy (garbh sanskar)" }, { degree: "Child and adolescent counselling" }, { degree: "Parenting coach certification" }],
    memberships: [],
    experience: "10+ years in healthcare",
    field: "Medicines & wellness",
    group: "pregnancy",
  },
  {
    slug: "shalini-chakraborty",
    kind: "expert",
    name: "Shalini Chakraborty",
    role: "Senior nutritionist",
    shortBio: "Nutrition for fertility, pregnancy, children and cancer care, with a preventive focus.",
    bio: ["Shalini Chakraborty is a senior nutritionist who works in preventive nutrition across fertility, pregnancy, child health and cancer care. She previously worked at CMC Vellore.", "On ParentVeda she guides couples and families on eating for fertility and through pregnancy."],
    specialties: ["Fertility nutrition", "Pregnancy nutrition", "Child nutrition", "Preventive nutrition"],
    qualifications: [{ degree: "Formerly at Christian Medical College, Vellore" }],
    memberships: [],
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "shahla-ansari",
    kind: "expert",
    name: "Dt. Shahla Ansari",
    role: "Clinical dietitian, IVF and fertility nutrition",
    shortBio: "Eating for fertility and IVF, PCOS and pregnancy nutrition.",
    bio: ["Shahla Ansari is a clinical dietitian with more than five years of work across infertility, PCOS, IVF support and pregnancy nutrition.", "She also advises ParentVeda on how our programmes are designed."],
    specialties: ["IVF nutrition", "Fertility nutrition", "PCOS", "Pregnancy nutrition"],
    qualifications: [{ degree: "Certified IVF nutritionist" }, { degree: "Certified infertility expert" }, { degree: "Certified in PCOS management and nutrition" }, { degree: "Certified in psychological nutrition" }],
    memberships: [],
    experience: "5+ years in practice",
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "purabi-gunjal",
    kind: "expert",
    name: "Purabi Gunjal",
    credentials: "MSc",
    role: "Women's health and fertility nutritionist",
    shortBio: "Fertility and IVF nutrition, PCOS, thyroid and eating well after 35.",
    bio: ["Purabi Gunjal is a consultant nutritionist who has worked with fertility and IVF patients since 2019. Many come to her after 35, or with thyroid, diabetes or weight concerns they know will matter in pregnancy.", "She has led PCOS care programmes and written on nutrition for the Indian Express. On ParentVeda she guides couples on eating for fertility."],
    specialties: ["Fertility and IVF nutrition", "PCOS", "Thyroid", "Preconception", "Weight"],
    qualifications: [{ degree: "MSc Nutrition and Dietetics, Symbiosis School of Biomedical Sciences" }, { degree: "BSc Zoology, Abasaheb Garware College" }, { degree: "Functional Nutrition and Lab Analysis, VitaOne" }],
    memberships: ["Indian Association for Parenteral and Enteral Nutrition"],
    experience: "Consulting since 2019",
    languages: ["English", "Hindi", "Marathi"],
    location: "Mumbai",
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "vijayalakshmi-km",
    kind: "expert",
    name: "Dr. Vijayalakshmi KM",
    role: "Ayurvedic doctor, garbh sanskar and parenting coach",
    shortBio: "Garbh sanskar, beej sanskar and conscious parenting.",
    bio: ["Dr. Vijayalakshmi KM is an Ayurvedic doctor and a garbh sanskar, parenting and life coach. She helps couples prepare for a conscious pregnancy and carry those values into parenting.", "On ParentVeda she guides our garbh sanskar and parenting sessions."],
    specialties: ["Garbh sanskar", "Beej sanskar", "Conscious parenting", "Life coaching"],
    qualifications: [{ degree: "Ayurvedic doctor" }],
    memberships: [],
    field: "Garbh sanskar",
    group: "yoga",
  },
  {
    slug: "archana-goyal",
    kind: "expert",
    name: "Archana Goyal",
    role: "Maternal, infant and fertility nutritionist",
    shortBio: "Diet for IVF cycles, egg freezing, pregnancy, postpartum and a baby's first foods.",
    bio: ["Archana Goyal is a dietitian who works with women trying to conceive, going through IVF, pregnant or newly postpartum. She starts by understanding each woman's lifestyle and gaps before she plans a diet.", "Her postpartum diets blend modern nutrition with Ayurveda and naturopathy. On ParentVeda she guides daily pregnancy eating and recovery after birth."],
    specialties: ["IVF and egg freezing diet", "Pregnancy nutrition", "Postpartum diet", "Starting solids"],
    qualifications: [],
    memberships: [],
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "juhi-agrawal",
    kind: "expert",
    name: "Juhi Agrawal",
    role: "Garbh sanskar educator and yoga trainer",
    shortBio: "A structured garbh sanskar practice for every month of pregnancy.",
    bio: ["Juhi Agrawal is a garbh sanskar educator, certified yoga trainer and the author of a bestselling book on garbh sanskar. She brings together Ayurveda, yoga, meditation and garbh sanskar for a calm, connected pregnancy.", "She created ParentVeda's garbh sanskar programme."],
    specialties: ["Garbh sanskar", "Pregnancy meditation", "Prenatal yoga", "Talking to your baby"],
    qualifications: [{ degree: "Certified yoga trainer" }, { degree: "Author of a book on garbh sanskar" }],
    memberships: [],
    field: "Garbh sanskar",
    group: "yoga",
  },
  {
    slug: "neha-kumari",
    kind: "expert",
    name: "Dr. Neha Kumari",
    credentials: "Physiotherapist",
    role: "Women's health physiotherapist and lactation consultant",
    shortBio: "Breastfeeding, diastasis recti and recovery after birth.",
    bio: ["Dr. Neha Kumari is a women's health physiotherapist and lactation consultant with six years of practice. She helps women recover after birth, from diastasis recti and the pelvic floor to a safe return to fitness.", "She also supports mothers with breastfeeding."],
    specialties: ["Breastfeeding", "Postpartum recovery", "Diastasis recti", "Pelvic floor"],
    qualifications: [{ degree: "Bachelor's in Physiotherapy" }, { degree: "Lactation consultant" }],
    memberships: [],
    experience: "6 years in practice",
    languages: ["English", "Hindi"],
    location: "Delhi",
    field: "Birth & breastfeeding",
    group: "birth",
  },
  {
    slug: "kashyap-shah",
    kind: "expert",
    name: "Dr. Kashyap Shah",
    credentials: "BSc (Hons), DHMS",
    role: "Clinical nutritionist",
    shortBio: "PCOS, pregnancy and gestational diabetes diets, and child nutrition.",
    bio: ["Dr. Kashyap Shah is a clinical nutritionist with more than 17 years of practice. He builds plans around each person's metabolism, hormones and lifestyle rather than calorie counting.", "On ParentVeda he covers nutrition from preconception and pregnancy to a child's early years."],
    specialties: ["PCOS", "Pregnancy nutrition", "Gestational diabetes", "Child nutrition", "Weight"],
    qualifications: [{ degree: "BSc (Hons) Food and Nutrition" }, { degree: "Diploma in Homeopathic Medicine and Surgery (DHMS)" }, { degree: "Certificate in Maternal, Infant, Young Child and Adolescent Nutrition" }, { degree: "Certificate in Diabetes Education" }],
    memberships: [],
    experience: "17+ years in practice",
    languages: ["English", "Hindi"],
    location: "Thane, Mumbai",
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "neera-parmar",
    kind: "expert",
    name: "Dr. Neera Parmar",
    role: "Reproductive, maternal and child health nutritionist",
    shortBio: "Evidence-based nutrition for conception, pregnancy and children.",
    bio: ["Dr. Neera Parmar specialises in reproductive, maternal and child health nutrition. Her background is in nutrition research and nutritional assessment.", "On ParentVeda she reviews pregnancy and child nutrition guidance."],
    specialties: ["Pregnancy nutrition", "Child nutrition", "Nutritional assessment"],
    qualifications: [{ degree: "Postdoctoral research in nutritional biochemistry" }],
    memberships: [],
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "ritu-chauhan",
    kind: "expert",
    name: "Dr. Ritu Chauhan",
    credentials: "DNB, FNB",
    role: "Consultant IVF specialist",
    shortBio: "IVF cycles step by step, injections, and care before you start trying.",
    bio: ["Dr. Ritu Chauhan is an obstetrician-gynaecologist with a fellowship in reproductive medicine, and a consultant IVF specialist.", "On ParentVeda she explains each stage of an IVF cycle, including injections and what to expect."],
    specialties: ["IVF", "Reproductive medicine", "Preconception care"],
    qualifications: [{ degree: "DNB, Obstetrics & Gynaecology" }, { degree: "FNB, Reproductive Medicine" }],
    memberships: [],
    location: "South Delhi",
    field: "Fertility & IVF",
    group: "fertility",
  },
  {
    slug: "kajal-singh",
    kind: "expert",
    name: "Dr. Kajal Singh",
    credentials: "MD (Ayurveda)",
    role: "Ayurvedic fertility consultant",
    shortBio: "Ayurvedic garbh sanskar, beej sanskar and antenatal counselling.",
    bio: ["Dr. Kajal Singh is an Ayurvedic fertility consultant and antenatal counsellor, and a Lamaze-certified childbirth educator. She has run a garbh sanskar and antenatal care programme since 2016.", "She guides couples from preparing for conception through pregnancy using Ayurvedic garbh sanskar."],
    specialties: ["Ayurvedic garbh sanskar", "Beej sanskar", "Antenatal counselling", "Ayurvedic fertility"],
    qualifications: [{ degree: "MD (Ayurveda)" }, { degree: "Lamaze certified childbirth educator" }],
    memberships: [],
    experience: "Running a garbh sanskar programme since 2016",
    location: "Aligarh",
    field: "Garbh sanskar",
    group: "yoga",
  },
  {
    slug: "sunita-patel",
    kind: "expert",
    name: "Dr. Sunita Patel",
    credentials: "Physiotherapist",
    role: "Pelvic floor rehab therapist and educator",
    shortBio: "Pelvic floor rehab before and after birth.",
    bio: ["Dr. Sunita Patel is a pelvic floor rehabilitation therapist and educator who also trains other physiotherapists."],
    specialties: ["Pelvic floor rehab", "Prenatal and postnatal physio"],
    qualifications: [],
    memberships: [],
    field: "Pelvic health",
    group: "pelvic",
  },
  {
    slug: "anusha-potlapalli",
    kind: "expert",
    name: "Dr. Anusha Potlapalli",
    credentials: "MPT",
    role: "Women's health physiotherapist",
    shortBio: "Physio from preconception through pregnancy and recovery after delivery.",
    bio: ["Dr. Anusha Potlapalli is a women's health physiotherapist with a master's in physiotherapy. She helps women prepare for pregnancy, stay active through it and recover after delivery."],
    specialties: ["Prenatal physio", "Postnatal recovery", "Post-delivery rehab", "Pelvic floor"],
    qualifications: [{ degree: "Master of Physiotherapy (Women's Health)" }],
    memberships: [],
    location: "Hyderabad",
    field: "Pelvic health",
    group: "pelvic",
  },
  {
    slug: "akanksha-srivastava",
    kind: "expert",
    name: "Akanksha Srivastava",
    role: "Maternal and child nutritionist",
    shortBio: "Pregnancy food, a baby's first solids and healthy eating for children.",
    bio: ["Akanksha Srivastava is an IIPH-UNICEF certified maternal and child nutritionist and a public health nutritionist. She turns nutrition science into everyday Indian meals.", "She is the author of a book on healthy eating in children and adolescents."],
    specialties: ["Pregnancy nutrition", "Starting solids", "Picky eating", "Child nutrition"],
    qualifications: [{ degree: "IIPH-UNICEF certified in maternal and child nutrition" }, { degree: "Author, Healthy Eating in Children and Adolescents" }],
    memberships: [],
    experience: "5+ years",
    field: "Nutrition",
    group: "nutrition",
  },
  {
    slug: "stuti-kumar",
    kind: "expert",
    name: "Dr. Stuti Kumar",
    credentials: "MA",
    role: "RCI-licensed child psychologist",
    shortBio: "Early intervention, behaviour therapy and support for children with special needs.",
    bio: ["Dr. Stuti Kumar is an RCI-licensed child psychologist who heads a child therapy team. She uses behaviour, play and art therapy for early intervention and special needs, including hearing impairment.", "She has also written books for children."],
    specialties: ["Early intervention", "Behaviour therapy", "Special needs", "Play and art therapy"],
    qualifications: [{ degree: "MA Clinical Psychology, Savitribai Phule Pune University" }],
    memberships: [],
    registration: "Rehabilitation Council of India",
    location: "Pune",
    field: "Child development",
    group: "child",
  },
  {
    slug: "surbhi-sharma",
    kind: "expert",
    name: "Dr. Surbhi Sharma",
    role: "Senior IVF consultant",
    shortBio: "IVF treatment and fertility workups.",
    bio: ["Dr. Surbhi Sharma is a senior IVF consultant who guides couples through fertility testing and IVF treatment."],
    specialties: ["IVF", "Fertility workup"],
    qualifications: [],
    memberships: [],
    field: "Fertility & IVF",
    group: "fertility",
  },
  {
    slug: "muskan-rastogi",
    kind: "expert",
    name: "Dr. Muskan Rastogi",
    credentials: "MPT (OBG)",
    role: "Women's health physiotherapist and lactation consultant",
    shortBio: "Pelvic floor rehab, pregnancy and postnatal exercise, and breastfeeding.",
    bio: ["Dr. Muskan Rastogi is a women's health physiotherapist who specialises in antenatal and postnatal exercise and pelvic floor rehabilitation, including leaks and prolapse. She has published research on pelvic floor disorders.", "She is also a certified lactation consultant."],
    specialties: ["Pelvic floor rehab", "Antenatal exercise", "Postnatal exercise", "Breastfeeding"],
    qualifications: [{ degree: "MPT (Obstetrics & Gynaecology)" }, { degree: "BPT" }, { degree: "Lactation consultant (ACLP)" }],
    memberships: ["DCPTOT"],
    languages: ["English", "Hindi"],
    location: "Noida",
    field: "Pelvic health",
    group: "pelvic",
  },
  {
    slug: "vaishnavi-kokate",
    kind: "expert",
    name: "Dr. Vaishnavi Kokate",
    credentials: "MPT (OBG)",
    role: "Pelvic floor physiotherapist",
    shortBio: "Bladder leaks, vaginismus, painful sex, prolapse and recovery after birth.",
    bio: ["Dr. Vaishnavi Kokate is a pelvic floor physiotherapist. She treats bladder leaks, vaginismus, pelvic pain and prolapse, and supports women before and after birth.", "On ParentVeda she leads our pelvic floor and sexual health guidance."],
    specialties: ["Pelvic floor", "Bladder leaks", "Vaginismus and painful sex", "Prolapse", "Postnatal recovery"],
    qualifications: [{ degree: "MPT (Obstetrics & Gynaecology)" }],
    memberships: [],
    languages: ["English"],
    location: "Mumbai",
    field: "Pelvic health",
    group: "pelvic",
  },
  {
    slug: "rani-balgude",
    kind: "expert",
    name: "Dr. Rani Balgude",
    credentials: "BHMS, IBCLC",
    role: "Lactation consultant and infant massage trainer",
    shortBio: "Breastfeeding for full-term and premature babies, and baby massage.",
    bio: ["Dr. Rani Balgude is an IBCLC lactation consultant with more than eight years of practice, including NICU work with premature babies. She has worked with a human milk bank.", "She is a certified infant massage trainer and babywearing expert."],
    specialties: ["Breastfeeding", "Premature babies", "Infant massage", "Returning to work"],
    qualifications: [{ degree: "BHMS" }, { degree: "International Board Certified Lactation Consultant (IBCLC)" }, { degree: "Infant and Young Child Feeding counselling specialist" }, { degree: "Certified infant massage trainer" }],
    memberships: [],
    experience: "8+ years in practice",
    languages: ["English", "Hindi", "Marathi"],
    location: "Pune",
    field: "Birth & breastfeeding",
    group: "birth",
  },
];

/* ---------------- Lookup ---------------- */

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

/** The field shown on a card's cover. */
export function authorField(a: Author): string {
  return a.field ?? a.role;
}

/** The person who wrote a post. Always someone: an unknown slug falls back to the default. */
export function resolveWriter(post: { authorSlug: string }): Author {
  return getAuthorBySlug(post.authorSlug) ?? getAuthorBySlug(DEFAULT_AUTHOR_SLUG)!;
}

/** The expert who reviewed a post, or undefined when no expert has. */
export function resolveReviewer(post: { reviewedBy?: string }): Author | undefined {
  return post.reviewedBy ? getAuthorBySlug(post.reviewedBy) : undefined;
}

export const EXPERTS = AUTHORS.filter((a) => a.kind === "expert");

/* The roster's order, most active first. */
const ROSTER_ORDER = [
  "gunjan-sabherwal",
  "smitha-avula",
  "gurbani-kohli",
  "sugandh-yadav",
  "kiran-sharma",
  "maneesha-mohan",
  "shilpi-srivastava",
  "swati-shivhare",
  "fathima-pothuraju",
  "shalini-chakraborty",
  "shahla-ansari",
  "purabi-gunjal",
  "vijayalakshmi-km",
  "archana-goyal",
  "keya-sampat",
  "juhi-agrawal",
  "neha-kumari",
  "kashyap-shah",
  "neera-parmar",
  "ritu-chauhan",
  "kajal-singh",
  "sunita-patel",
  "aishwarya-jain",
  "madhvi-khurana",
  "anusha-potlapalli",
  "akanksha-srivastava",
  "stuti-kumar",
  "simranpreet-kaur-sandhu",
  "surbhi-sharma",
  "muskan-rastogi",
  "vaishnavi-kokate",
  "rani-balgude"
];
const rank = (a: Author) => {
  const i = ROSTER_ORDER.indexOf(a.slug);
  return i < 0 ? ROSTER_ORDER.length : i;
};

/** The experts shown on /experts/: founding experts first, then in roster order. */
export const LISTED_EXPERTS = EXPERTS.filter((a) => a.listed !== false).sort(
  (a, b) => Number(!!b.founding) - Number(!!a.founding) || rank(a) - rank(b),
);

export function authorPath(slug: string): string {
  return `${AUTHORS_BASE}/${slug}`;
}

/** Initials for the fallback avatar — "Dr. Mahender Singh" → "MS". */
export function authorInitials(name: string): string {
  return name
    .replace(/^(dr|dt|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
