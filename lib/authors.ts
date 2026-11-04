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
  /** Practice / clinic name. */
  practice?: string;
  /** Where they are based, when that is a place rather than a named practice. */
  location?: string;
  /** Public profiles that identify this person: LinkedIn, clinic page, Practo. */
  sameAs?: string[];
};

export const AUTHORS: Author[] = [
  {
    slug: "sarthak-thakur",
    kind: "writer",
    name: "Sarthak Thakur",
    role: "Founder & CTO, ParentVeda",
    photo: "/authors/sarthak-thakur.jpg",
    shortBio:
      "Founder and CTO of ParentVeda, from a technology background, building calm guidance for Indian families.",
    bio: [
      "Sarthak Thakur is the founder and CTO of ParentVeda. He comes from a technology background and built ParentVeda to give Indian families calm, evidence-informed guidance from trying to conceive through parenting, in one place. He leads how the product is built and works alongside the experts on this site.",
    ],
    specialties: [],
    qualifications: [],
    memberships: [],
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
      "He practises in both Hindi and English at Child Care, his clinic, and is registered with the Delhi Medical Council.",
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
    registration: "Delhi Medical Council, 15446",
    languages: ["English", "Hindi"],
    practice: "Child Care",
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
    registration: "Board of Genetic Counselling India, Level II Genetic Counsellor (BGC 2024-204)",
    practice: "Blossom Genomic Wellness Clinic, Amritsar",
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
    registration: "Indian Association of Physiotherapists, Life Member (L-34296)",
    location: "Bengaluru",
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
    location: "Parichay, Mumbai \u00b7 sees clients online",
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
    registration: "Rehabilitation Council of India, Rehabilitation Counsellor (CRR A62874), valid to 2029",
    location: "New Delhi",
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
    registration: "Rehabilitation Council of India, Rehabilitation Counsellor (CRR A126421), valid to 2033",
    location: "New Delhi",
  },
];

/* ---------------- Lookup ---------------- */

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

/** The field shown on a card's cover. Not a stage: no expert belongs to one. */
export const AUTHOR_FIELD: Record<string, string> = {
  "simranpreet-kaur-sandhu": "Genetics and fertility",
  "maneesha-mohan": "Women's health",
  "keya-sampat": "Birth and the mind",
  "aishwarya-jain": "Child development",
  "madhvi-khurana": "Child psychology",
  "dr-mahender-singh": "Paediatrics",
};

/** The person who wrote a post. Always someone: an unknown slug falls back to the default. */
export function resolveWriter(post: { authorSlug: string }): Author {
  return getAuthorBySlug(post.authorSlug) ?? getAuthorBySlug(DEFAULT_AUTHOR_SLUG)!;
}

/** The expert who reviewed a post, or undefined when no expert has. */
export function resolveReviewer(post: { reviewedBy?: string }): Author | undefined {
  return post.reviewedBy ? getAuthorBySlug(post.reviewedBy) : undefined;
}

export const EXPERTS = AUTHORS.filter((a) => a.kind === "expert");

export function authorPath(slug: string): string {
  return `${AUTHORS_BASE}/${slug}`;
}

/** Initials for the fallback avatar — "Dr. Mahender Singh" → "MS". */
export function authorInitials(name: string): string {
  return name
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
