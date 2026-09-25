// The four stages, as the app actually builds them.
// Door lists come from the app repo's lib/data/brackets/*_brackets.dart;
// counts from docs/TTC-SPEC.md, PREGNANCY-DOOR-BUILD.md,
// PARENTING-DOORS-REVIEW.md and SKILLING-DOOR-BUILD.md.
// Nothing here is a claim the app does not already make.

export type StageSlug = "trying-to-conceive" | "pregnancy" | "parenting" | "skilling";

export type Door = { name: string; line: string };
export type Highlight = { title: string; body: string };

export type Stage = {
  slug: StageSlug;
  short: string;
  name: string;
  range: string;
  colour: string; // painting-palette ground
  deep: string; // a darker partner for text on the ground
  painting: string; // /paintings/<name>.webp — the app's own onboarding art
  image: string; // /images/<file> — a richer scene, supplied later
  title: string; // may contain *emphasis*
  intro: string;
  doorsTitle: string;
  doors: Door[];
  highlights: Highlight[];
  toolsTitle: string;
  tools: string[];
  care: string;
  next?: StageSlug;
};

export const stages: Stage[] = [
  {
    slug: "trying-to-conceive",
    short: "Trying",
    name: "Trying to conceive",
    range: "Before the positive test",
    colour: "#E8D9C0",
    deep: "#6B4A1F",
    painting: "trying",
    image: "stage-trying",
    title: "Trying, *without the countdown.*",
    intro:
      "Understand your cycle, know when it is time to ask for help, and get through the months that feel long — with the whole picture and none of the pressure.",
    doorsTitle: "Seven doors, one for each question you are really asking",
    doors: [
      { name: "Fertile window", line: "How conception actually works, the timing, and the myths worth dropping." },
      { name: "PCOS", line: "Symptoms, insulin and food, and getting a readable cycle back. Includes a 20-question check." },
      { name: "IVF & IUI", line: "When to seek help, which tests matter, what treatment involves — cost included. No success rates, anywhere." },
      { name: "Getting ready", line: "Food, folic acid, weight, tests and vaccines before you begin." },
      { name: "His side", line: "Sperm health, and when a test is worth doing. It takes two." },
      { name: "After a loss", line: "Physical recovery, and support for the part that has no timeline." },
      { name: "Mind & body", line: "Stress, a small daily practice, and Garbh Sanskar from before the start." },
    ],
    highlights: [
      {
        title: "Your periods, and what they say",
        body: "The Cycle Companion reads your cycle back to you in plain words — what is ordinary, what is worth mentioning to a doctor, and why.",
      },
      {
        title: "When a clinic takes over, we step back",
        body: "Once your doctor owns the timing — medication, a trigger shot, a transfer — ParentVeda stops predicting and starts explaining. Their plan wins, always.",
      },
      {
        title: "Never your ‘chance this month’",
        body: "No percentages, no scores, no personalised odds. Population facts appear only where they take pressure off, never to set a target.",
      },
      {
        title: "Tests, with Indian prices",
        body: "A library of the tests doctors order, what each one looks for and what it roughly costs here — and a reader for his semen report.",
      },
      {
        title: "His own view",
        body: "Partner Mode gives him a Today of his own. He sees the chapter you are in, never your raw cycle.",
      },
      {
        title: "The day it is positive",
        body: "Everything you logged carries straight into pregnancy. Nothing to re-enter, no new app to learn.",
      },
    ],
    toolsTitle: "Twenty-two quiet tools",
    tools: [
      "Cycle companion", "Ovulation companion", "Symptom companion", "Weight & BMI", "Sleep", "Mood", "Stress",
      "Lifestyle", "Partner health", "Supplements log", "Medical test library", "Semen report reader",
      "IVF readiness", "Time to get help?", "Medication & treatment", "Vaccines", "Records", "Shared journal",
    ],
    care: "Everything here explains; nothing here diagnoses. If your doctor has told you something different from what you read in ParentVeda, your doctor is right.",
    next: "pregnancy",
  },
  {
    slug: "pregnancy",
    short: "Pregnancy",
    name: "Pregnancy",
    range: "Weeks 4 to 40",
    colour: "#E8C4CE",
    deep: "#7A3348",
    painting: "pregnant",
    image: "stage-pregnancy",
    title: "Every week has *its own page.*",
    intro:
      "From week 4 to week 40 — what your baby is doing, what your body is doing, and what is worth doing this week. Written for an Indian kitchen, an Indian family and an Indian hospital.",
    doorsTitle: "Ten doors for the ten things that keep you up at night",
    doors: [
      { name: "Scans & tests", line: "Nine scan guides, 27 report findings explained in plain words, and a locker for your reports." },
      { name: "Symptoms", line: "Thirty-three ordinary symptoms by body area — and five that mean call now, routed straight to a call." },
      { name: "Is it safe?", line: "Forty-two ‘Can I…?’ answers — food, medicines, travel, beauty." },
      { name: "Nutrition", line: "Trimester diets from an Indian kitchen, around 40 recipes, 19 diet charts and fasting days." },
      { name: "Complications", line: "Gestational diabetes, thyroid, BP, anaemia, placenta previa — calm, clear, never alarming." },
      { name: "Garbh Sanskar", line: "Trimester-wise practice — sound, thought, conversation and breath." },
      { name: "Mind & mood", line: "Twenty-six reads, a breathing tool, a 60-second grounding, and a path for when it is more." },
      { name: "Yoga & fitness", line: "Movement that is safe for the trimester you are in." },
      { name: "Labour prep", line: "Contraction timer, hospital bag, understanding the birth — and a page for your partner." },
      { name: "Belly & skin", line: "What changes, what is safe to use, and a small bump ritual." },
    ],
    highlights: [
      {
        title: "Your baby, this week",
        body: "A painted illustration for every week from 4 to 40, the size in things from your own kitchen — a rajma bean, a mango, a coconut — and a short film on what changed.",
      },
      {
        title: "Symptoms, sorted by where they are",
        body: "Tap the part of you that feels different. Ordinary things get a calm read and something that helps; the five that matter get a direct route to a call.",
      },
      {
        title: "Scans you can actually read",
        body: "What each scan is for, when it happens, and what the words on the report mean — so you walk into the next appointment with better questions.",
      },
      {
        title: "Hindi, when you want it",
        body: "Much of the pregnancy journey is written in Hindi in Devanagari, with warm narration you can listen to instead of read.",
      },
      {
        title: "Garbh Sanskar, done gently",
        body: "Four practices — listening, talking to your baby, breath, and a few quiet minutes of your own. Tradition, offered without pressure.",
      },
      {
        title: "Your due date stays your doctor’s",
        body: "When the date comes from a scan or your doctor, ParentVeda follows it. We never second-guess a date your clinic set.",
      },
    ],
    toolsTitle: "Tools you will actually open",
    tools: [
      "Kick counter", "Contraction timer", "Weight tracker", "Kegel guide", "Due date calculator", "Medicines",
      "Reminders", "Hospital bag", "Birth plan", "Report help", "Checklist", "Journal",
    ],
    care: "If something feels wrong — bleeding, severe pain, your baby moving less — ParentVeda does not try to answer. It tells you, calmly, to call your doctor now.",
    next: "parenting",
  },
  {
    slug: "parenting",
    short: "Parenting",
    name: "Parenting",
    range: "Birth to 5 years",
    colour: "#D8CCE8",
    deep: "#4A3470",
    painting: "parenting",
    image: "stage-parenting",
    title: "Only what changes, *when it changes.*",
    intro:
      "Sleep, feeding, fevers, first words, tantrums and potty days — one companion that knows your child’s age and shows you what matters now, not a feed of everything at once.",
    doorsTitle: "Eleven doors, from the first 40 days to the first school bag",
    doors: [
      { name: "First 40 days", line: "Newborn care — and the mother’s own recovery, which usually gets left out." },
      { name: "Sleep", line: "Safe sleep, schedules and the regressions everyone warns you about." },
      { name: "Feeding", line: "Latch, bottles, and starting solids the Indian way." },
      { name: "Health", line: "Fever, rashes, colic, teething — and when it stops being ordinary." },
      { name: "Development", line: "Milestones and leaps, explained without the comparison." },
      { name: "Behaviour", line: "Tantrums, screens, sharing — what is normal, and what helps." },
      { name: "Potty training", line: "Readiness, methods, and setbacks that are part of it." },
      { name: "Early learning", line: "Montessori at home, habits and school readiness — 36 activities." },
      { name: "You, Maa", line: "Healing, mood, pelvic floor, and going back to work." },
      { name: "Traditions", line: "Annaprashan, mundan, naming and malish — held up honestly against the evidence." },
      { name: "What to buy", line: "An honest guide: the watch-outs as prominent as the praise." },
    ],
    highlights: [
      {
        title: "Something changed?",
        body: "Twenty-nine everyday concerns — a new rash, a skipped nap, a sudden clinginess — checked against your child’s age, with a clear line for when to call the doctor.",
      },
      {
        title: "Leaps and milestones, without the race",
        body: "Ten leaps and 18 milestones, each with what to expect and what to try. No scores, no ‘behind’. Children arrive on their own schedule.",
      },
      {
        title: "The IAP vaccination schedule",
        body: "Every vaccine on the Indian schedule, why it is given, and what to do after — with reminders so nothing slips.",
      },
      {
        title: "A mother is a patient too",
        body: "The First 40 Days and You, Maa doors look after the person who just gave birth — healing, mood and the slow way back.",
      },
      {
        title: "Traditions, honestly",
        body: "Annaprashan, mundan, malish and naming — what each means, and what the evidence says about each, side by side.",
      },
      {
        title: "Growth, food and a few nuskhe",
        body: "A growth journey, weaning recipes, and a home-remedies library that says clearly which ones help and which ones to skip.",
      },
    ],
    toolsTitle: "Everyday tools",
    tools: [
      "Growth journey", "Vaccination tracker", "Fever check", "What changed?", "Health records", "Feeding log",
      "Sleep log", "Activities", "Recipes", "Home remedies", "Baby names", "Memories",
    ],
    care: "ParentVeda helps you notice and prepare. It never diagnoses your child, and your paediatrician always has the final word.",
    next: "skilling",
  },
  {
    slug: "skilling",
    short: "Skilling",
    name: "Skilling",
    range: "Ages 6 to 14",
    colour: "#D9A08A",
    deep: "#6E3522",
    painting: "skilling",
    image: "stage-skilling",
    title: "The skills school *doesn’t grade.*",
    intro:
      "Focus, confidence, thinking, feelings, making things — twelve doors of small daily activities for children from 6 to 14, planned by age and done together at home.",
    doorsTitle: "Twelve doors, each with a five-minute start",
    doors: [
      { name: "Focus", line: "Holding attention a little longer, one playful exercise at a time." },
      { name: "Confidence", line: "Speaking up — record, listen back, try again." },
      { name: "Expression", line: "Communication and storytelling." },
      { name: "Thinking", line: "Puzzles, reasoning and light, friendly debate." },
      { name: "Values", line: "Moral stories, never preachy." },
      { name: "Maths", line: "Vedic maths, abacus and mental arithmetic." },
      { name: "Coding", line: "Unplugged first, then blocks, then projects — plus AI literacy." },
      { name: "Reading", line: "Age-right lists and a reading habit that sticks." },
      { name: "Making", line: "Art and music, with a private portfolio." },
      { name: "Feelings", line: "A private journal, and a clear path to real help if it is needed." },
      { name: "Stillness", line: "Guided sitting and yoga made for children." },
      { name: "Memory", line: "Memory techniques and study skills." },
    ],
    highlights: [
      {
        title: "Planned by age band",
        body: "Three bands — 6 to 8, 8 to 11, 11 to 14 — so a seven-year-old and a thirteen-year-old never get the same activity.",
      },
      {
        title: "Same shape, every door",
        body: "Each door opens on Today, then Activities, Lessons, a Cross-band stretch and a Keepsake. Once your child learns one, they know all twelve.",
      },
      {
        title: "No scores. No streaks.",
        body: "No points, no leaderboards, no public galleries. Children grow by doing, not by being measured.",
      },
      {
        title: "A grown-up gate",
        body: "Anything meant for parents sits behind a gate your child can’t open. Their private journal stays theirs.",
      },
    ],
    toolsTitle: "What a week can look like",
    tools: [
      "A 5-minute focus game", "A Vedic maths trick", "A story to retell", "A puzzle to argue about",
      "A drawing for the portfolio", "Two minutes of stillness", "A book from the age list", "An unplugged coding game",
    ],
    care: "Feelings is private by design. If a child writes something that needs a grown-up, ParentVeda shows a real helpline — never a product.",
  },
];

export function getStage(slug: string) {
  return stages.find((s) => s.slug === slug);
}
