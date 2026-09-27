// The four stages, as the app actually builds them.
// Door lists come from the app repo's lib/data/brackets/*_brackets.dart;
// counts from docs/TTC-SPEC.md, PREGNANCY-DOOR-BUILD.md,
// PARENTING-DOORS-REVIEW.md and SKILLING-DOOR-BUILD.md.
// Nothing here is a claim the app does not already make.

export type StageSlug = "trying-to-conceive" | "pregnancy" | "parenting" | "skilling";

export type Door = { name: string; line: string };
export type Highlight = { title: string; body: string };

// ── The story layout (VOICE.md). A stage that carries `story` is rendered as a
// story; the others keep the list layout until their copy is written, so each
// stage can be rolled out, or reverted, on its own.
export type Pillar = {
  id: string;
  title: string;
  body: string;
  glyph: string;
  tone: string; // each pillar wears its own painting-palette colour
  deep: string;
  // an optional breather before this pillar's guides: a line in the app's own words
  pause?: { quote: string; source: string };
};
export type Guide = {
  name: string; // the app's door, called a guide on the site
  pillar: string; // Pillar.id
  question: string; // what the parent is actually asking, in their words
  why: string; // why it matters for the child
  inside: string[]; // real, built things inside it
  featured?: boolean; // spans two columns
  image?: { slot?: string; fallback?: string; alt: string }; // featured guides only
  // Where it stands in the app. "open": built and filled. "growing": built,
  // with some pieces inside and more to come (the list is what's inside
  // today). "soon": planned; the list is what it will cover. Never claim more.
  status?: "open" | "growing" | "soon";
};
// "Where are you in it?" — a picker that shows what matters at each point.
export type NowStep = {
  label: string; // tab label
  range: string;
  week?: number; // a baby illustration to show, from /weeks
  badge?: { big: string; small: string }; // when there's no week: e.g. "3–6" / "months"
  quote?: string; // a line in the app's own words for that point
  items: { title: string; body: string; guide: string }[];
};
export type Moment = { when: string; title: string; body: string; glyph: string };
export type Doing = { tool: string; action: string };
export type Story = {
  feel: { title: string; body: string }; // beat one: I understand
  pillarsTitle: string; // beat two: what matters for your child now
  pillarsLede: string;
  pillars: Pillar[];
  guidesTitle: string;
  guidesLede: string;
  guides: Guide[];
  startHere: { guide: string; why: string }[]; // a real order for someone new
  now?: { title: string; lede: string; steps: NowStep[] }; // replaces startHere when present
  dayTitle: string; // beat three: how we walk with you
  dayLede: string;
  day: Moment[];
  doingTitle: string;
  doing: Doing[];
};

export type Stage = {
  slug: StageSlug;
  short: string;
  name: string;
  range: string;
  promise: string; // the phase told from the child's side (VOICE.md)
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
  toolsEyebrow?: string; // when the list is not tools (skilling)
  toolsNote?: string;
  tools: string[];
  care: string;
  next?: StageSlug;
  story?: Story;
};

export const stages: Stage[] = [
  {
    slug: "trying-to-conceive",
    short: "Trying",
    name: "Trying to conceive",
    range: "Before the positive test",
    promise: "Become the best place for a baby to begin.",
    colour: "#E8D9C0",
    deep: "#6B4A1F",
    painting: "trying",
    image: "stage-trying",
    title: "Trying, *without the countdown.*",
    // Kept for revert — intro "Understand your cycle, know when it is time to ask for help, and get
    // through the months that feel long, with the whole picture and none of the pressure."
    intro:
      "Understand your body, get ready together, and know when it’s time to ask for help. Everything you do now is part of your child’s start, and none of it needs a countdown.",
    doorsTitle: "Seven guides, one for each question you’re really asking",
    doors: [
      { name: "Fertile window", line: "How conception actually works, the timing, and the myths worth dropping." },
      { name: "PCOS", line: "Symptoms, insulin and food, and getting a readable cycle back. Includes a 20-question check." },
      { name: "IVF & IUI", line: "When to seek help, which tests matter, what treatment involves, cost included. No success rates, anywhere." },
      { name: "Getting ready", line: "Food, folic acid, weight, tests and vaccines before you begin." },
      { name: "His side", line: "Sperm health, and when a test is worth doing. It takes two." },
      { name: "After a loss", line: "Physical recovery, and support for the part that has no timeline." },
      { name: "Mind & body", line: "Stress, a small daily practice, and Garbh Sanskar from before the start." },
    ],
    highlights: [
      {
        title: "Your periods, and what they say",
        body: "The Cycle Companion reads your cycle back to you in plain words: what is ordinary, what is worth mentioning to a doctor, and why.",
      },
      {
        title: "When a clinic takes over, we step back",
        body: "Once your doctor owns the timing (medication, a trigger shot, a transfer), ParentVeda stops predicting and starts explaining. Their plan wins, always.",
      },
      {
        title: "Never your ‘chance this month’",
        body: "No percentages, no scores, no personalised odds. Population facts appear only where they take pressure off, never to set a target.",
      },
      {
        title: "Tests, with Indian prices",
        body: "A library of the tests doctors order, what each one looks for and what it roughly costs here, and a reader for his semen report.",
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
    toolsTitle: "Quiet tools for the long months", // was "Twenty-two quiet tools" — the list shows 18
    tools: [
      "Cycle companion", "Ovulation companion", "Symptom companion", "Weight & BMI", "Sleep", "Mood", "Stress",
      "Lifestyle", "Partner health", "Supplements log", "Medical test library", "Semen report reader",
      "IVF readiness", "Time to get help?", "Medication & treatment", "Vaccines", "Records", "Shared journal",
    ],
    care: "Everything here explains; nothing here diagnoses. If your doctor has told you something different from what you read in ParentVeda, your doctor is right.",
    next: "pregnancy",
    story: {
      feel: {
        title: "It’s hopeful, and it can be hard.",
        body: "Some months you’re excited, some months you’re tired of waiting, and everyone seems to have an opinion. You don’t owe anyone an update on your body. We’ll help with the rest.",
      },
      pillarsTitle: "What matters most before your baby",
      pillarsLede: "Three things shape these months more than anything else. Every guide below serves one of them.",
      pillars: [
        {
          id: "body",
          title: "Knowing your body",
          body: "Your own rhythm, learned without watching it too closely. Which days count, what your cycle is saying, and what’s simply you.",
          glyph: "cycle",
          tone: "#C5D6C4",
          deep: "#2E5E45",
        },
        {
          id: "ready",
          title: "Getting ready, together",
          body: "Food, sleep, habits and calm, for both of you. The months before a baby are a chance to start from your best.",
          glyph: "sprout",
          tone: "#E8D9C0",
          deep: "#6B4A1F",
          // the app's own line, lib/ttc/ttc_daily_data.dart
          pause: { quote: "Share the planning. This is something you do together.", source: "From your daily thought" },
        },
        {
          id: "longer",
          title: "When it’s taking longer",
          body: "Knowing when a check makes sense, what treatment involves, and how to heal after a loss. Gently, and at your pace.",
          glyph: "heart",
          tone: "#D8CCE8",
          deep: "#4A3470",
          // the app's own line, lib/ttc/ttc_daily_data.dart
          pause: { quote: "Treatment is a path, not a verdict.", source: "From your daily thought" },
        },
      ],
      guidesTitle: "Nine guides, for the questions you’re really asking",
      guidesLede: "Each one starts from something you might be wondering tonight, and points you to your own doctor when it matters.",
      guides: [
        {
          name: "Body and cycle",
          pillar: "body",
          question: "Is my cycle normal?",
          why: "Knowing your own rhythm is where trying begins. Your periods, read back to you in plain words, and what’s worth mentioning to a doctor.",
          inside: ["Cycle Companion: your periods, and what they say", "Reads on your body and your cycle", "When a check with a specialist makes sense"],
        },
        {
          name: "Fertile window",
          pillar: "body",
          question: "Which days actually count?",
          why: "About six days in each cycle are the ones that count. Knowing them takes the guesswork out, without turning closeness into a timetable.",
          inside: ["Your best days this month, shown plainly", "“Should I test?”, talked through step by step", "Myths about timing and positions, answered"],
        },
        {
          name: "PCOS",
          pillar: "body",
          question: "I have PCOS. What does that mean for us?",
          why: "It’s managed rather than cured, and it’s common. What helps, what doesn’t, and how to get a readable cycle back.",
          inside: ["Where do I stand: 8 optional questions, never a score", "PCOS or a cyst? PCOS or thyroid? Side by side", "Food without panic, including whether rice must go"],
        },
        {
          name: "Getting ready",
          pillar: "ready",
          question: "What should we do before we start?",
          why: "Food, folic acid, sleep and the habits worth leaving behind. Nothing urgent and nothing to rush, but every bit of it is part of your baby’s start.",
          inside: ["A pre-pregnancy checklist for both of you", "Tests and vaccines worth doing first", "A week of Indian meals for trying"],
        },
        {
          name: "His side",
          pillar: "ready",
          question: "Is it just me, or both of us?",
          why: "His fertility matters just as much, and his habits are part of your baby’s start too. Written from WHO and NICE guidance, with nothing to sell.",
          inside: ["Read his semen report, with no verdict", "Improving his health: what helps, and what doesn’t", "Why one result is never the final word"],
        },
        {
          name: "Mind & body",
          pillar: "ready",
          question: "How do we stay calm through this?",
          why: "Trying can take over everything. A few calm minutes a day, for both of you, and nothing here you have to believe in.",
          inside: ["12 short practices, like box breathing", "A free 8-session Garbh Sanskar course", "Three kind answers to “Koi good news?”"],
        },
        {
          name: "Taking a while",
          pillar: "longer",
          question: "It’s been months. Is something wrong?",
          why: "Most couples need time, not treatment, and going early is still fine. When a simple check for both of you makes sense, and what it involves.",
          inside: ["When guidelines suggest a check", "The signs not to wait for", "What a first check looks like for both of you"],
        },
        {
          name: "IVF & IUI",
          pillar: "longer",
          question: "What does treatment actually involve?",
          why: "IUI and IVF are treatments, not a last resort. What happens step by step, and the questions to ask a clinic. Never a success rate.",
          inside: ["Six questions: is it time to get help?", "How to read a clinic’s numbers, and what to ask", "Track your treatment rounds and records"],
        },
        {
          name: "After a loss",
          pillar: "longer",
          question: "When will we be ready to try again?",
          why: "No rush, and no timeline to keep. Your body first, then understanding, then trying again, whenever you are ready.",
          inside: ["Your body first: what to watch for, and when", "The six-month wait, and where it came from", "Support, with no tool and nothing to buy"],
        },
      ],
      startHere: [],
      now: {
        title: "How long have you been trying?",
        lede: "Each stretch of trying needs something different. Pick yours.",
        steps: [
          {
            label: "Just starting",
            range: "The first few months",
            badge: { big: "0–3", small: "months" },
            quote: "Missing a day ruins nothing.",
            items: [
              { title: "Start from your best", body: "Food, folic acid, sleep and the habits worth changing, for both of you.", guide: "Getting ready" },
              { title: "Learn your rhythm", body: "Your cycle in plain words, without watching it too closely.", guide: "Body and cycle" },
              { title: "It takes two", body: "His health matters as much as yours, from the very start.", guide: "His side" },
            ],
          },
          {
            label: "A few months in",
            range: "Three months to a year",
            badge: { big: "3–12", small: "months" },
            quote: "Each cycle starts fresh. Last month doesn’t count against this one.",
            items: [
              { title: "The days that count", body: "Your best days each month, and what makes a difference.", guide: "Fertile window" },
              { title: "The waiting days", body: "A few calm minutes for both of you, and kind answers for nosy questions.", guide: "Mind & body" },
              { title: "Signs not to wait for", body: "Irregular periods, painful periods, or a known condition: when to ask sooner.", guide: "Taking a while" },
            ],
          },
          {
            label: "A year or more",
            range: "Or six months, at 35 and over",
            badge: { big: "12+", small: "months" },
            quote: "Treatment is a path, not a verdict.",
            items: [
              { title: "A simple check, for both of you", body: "What a first check involves. Most causes are findable, and many are easy to treat.", guide: "Taking a while" },
              { title: "If treatment comes up", body: "IUI and IVF explained step by step, and what to ask a clinic.", guide: "IVF & IUI" },
              { title: "His results, read calmly", body: "What a semen report says, and why one result is never the last word.", guide: "His side" },
            ],
          },
        ],
      },
      dayTitle: "A day of trying, with ParentVeda beside you",
      dayLede: "No countdowns and no odds. A few small things, at the right moment.",
      day: [
        { when: "Morning", title: "A thought for today", body: "One short, kind thought for where you are in your cycle.", glyph: "sun" },
        { when: "Midday", title: "Your cycle, in plain words", body: "What today means, said plainly. Likely, never certain.", glyph: "cycle" },
        { when: "Evening", title: "Ten slow breaths together", body: "A two-minute practice for both of you, nothing to believe in.", glyph: "breath" },
        { when: "Night", title: "Tonight, ask her", body: "His side of the app gives him one question to ask, and one small thing to do.", glyph: "talk" },
        { when: "Hard days", title: "Talk it through", body: "When a period comes, a gentle place to say how it feels.", glyph: "heart" },
      ],
      doingTitle: "Small things you’ll do",
      doing: [
        { tool: "Cycle companion", action: "Log your period and see what your cycle is saying." },
        { tool: "Your best days", action: "See the days that count this month, as a list or a curve." },
        { tool: "Symptom notes", action: "Notice patterns in how you feel. It never diagnoses." },
        { tool: "Semen report reader", action: "Read his results against WHO limits, calmly." },
        { tool: "Pre-pregnancy checklist", action: "Tick off the tests, vaccines and habits, together." },
        { tool: "Supplements and medicines", action: "Remember what you take, and when." },
        { tool: "Treatment rounds", action: "Keep dates and records if a clinic is involved." },
        { tool: "Shared journal", action: "Write it down, for yourselves, and maybe one day for them." },
      ],
    },
  },
  {
    slug: "pregnancy",
    short: "Pregnancy",
    name: "Pregnancy",
    range: "Weeks 4 to 40",
    promise: "What you eat, feel and live around, your baby shares.",
    colour: "#E8C4CE",
    deep: "#7A3348",
    painting: "pregnant",
    image: "stage-pregnancy",
    // Kept for revert — title "Every week has *its own page.*", intro "From week 4 to week 40 — what
    // your baby is doing, what your body is doing, and what is worth doing this week. Written for an
    // Indian kitchen, an Indian family and an Indian hospital."
    title: "Forty weeks of *growing together.*",
    intro:
      "From week 4 to week 40: what your baby is doing, what your body is doing, and the best you can do for them this week. Written for an Indian kitchen, an Indian family and an Indian hospital, and there for every question in between.",
    doorsTitle: "Ten guides for the ten things that keep you up at night",
    doors: [
      { name: "Scans & tests", line: "Nine scan guides, 27 report findings explained in plain words, and a locker for your reports." },
      { name: "Symptoms", line: "Thirty-three ordinary symptoms by body area, and five that mean call now, routed straight to a call." },
      { name: "Is it safe?", line: "193 ‘Can I…?’ answers: food, drinks, medicines, everyday things." }, // was "Forty-two" — the app has 193
      { name: "Nutrition", line: "Trimester diets from an Indian kitchen, around 40 recipes, 19 diet charts and fasting days." },
      { name: "Complications", line: "Gestational diabetes, thyroid, BP, anaemia, placenta previa, explained calmly and clearly." },
      { name: "Garbh Sanskar", line: "Trimester-wise practice: sound, thought, conversation and breath." },
      { name: "Mind & mood", line: "Thirty-four reads, a three-minute reset, breathing, and a path for when it is more." }, // was "Twenty-six" — the app has 34
      { name: "Yoga & fitness", line: "Movement that is safe for the trimester you are in." },
      { name: "Labour prep", line: "Contraction timer, hospital bag, understanding the birth, and a page for your partner." },
      { name: "Belly & skin", line: "What changes, what is safe to use, and a small bump ritual." },
    ],
    highlights: [
      {
        title: "Your baby, this week",
        // was: "…and a short film on what changed." — the week film is still a placeholder in the app
        body: "A painted illustration for every week from 4 to 40, the size in things from your own kitchen (a rajma bean, a mango, a coconut) and what changed this week.",
      },
      {
        title: "Symptoms, sorted by where they are",
        body: "Tap the part of you that feels different. Ordinary things get a calm read and something that helps; the five that matter get a direct route to a call.",
      },
      {
        title: "Scans you can actually read",
        body: "What each scan is for, when it happens, and what the words on the report mean, so you walk into the next appointment with better questions.",
      },
      {
        title: "Hindi, when you want it",
        // was: "…with warm narration you can listen to instead of read." — recorded narration is partial
        body: "Much of the pregnancy journey is written in Hindi in Devanagari, and it can be read aloud to you.",
      },
      {
        title: "Garbh Sanskar, done gently",
        body: "Four practices: listening, talking to your baby, breath, and a few quiet minutes of your own. Tradition, offered without pressure.",
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
    care: "If something feels wrong, like bleeding, severe pain or your baby moving less, ParentVeda doesn’t try to answer. It tells you, calmly, to call your doctor now.",
    next: "parenting",
    story: {
      feel: {
        title: "It’s joyful, and it’s a lot.",
        body: "Every week your body does something new, and the questions arrive faster than the appointments. Is this normal? Can I eat this? What is that scan for? You aren’t supposed to know all of this already. That’s what we’re here for.",
      },
      pillarsTitle: "What matters most for your baby now",
      pillarsLede: "Four things shape these forty weeks more than anything else. Every guide below serves one of them.",
      pillars: [
        {
          id: "normal",
          title: "Knowing what’s normal",
          body: "Most of what you feel is ordinary, and knowing that lets you rest. The few things that aren’t, you’ll recognise early, and you’ll know who to call.",
          glyph: "shield",
          tone: "#C5D6C4",
          deep: "#2E5E45",
        },
        {
          id: "food",
          title: "What reaches them through you",
          body: "What you eat, drink and put on your skin, your baby shares. Not perfection: good, ordinary food from your own kitchen, and clear answers on the rest.",
          glyph: "thali",
          tone: "#E8D9C0",
          deep: "#6B4A1F",
        },
        {
          id: "calm",
          title: "Your calm, their first lullaby",
          body: "Your baby comes to know your voice, and how you feel reaches them too. Looking after your mind is looking after them.",
          glyph: "heart",
          tone: "#D8CCE8",
          deep: "#4A3470",
          // the app's own line, lib/data/home/week_18.json
          pause: { quote: "Your baby hears how you feel before they hear what you say.", source: "From your week 18 page" },
        },
        {
          id: "ready",
          title: "Ready for the day you meet",
          body: "Knowing what happens at the birth, what to decide beforehand and what to carry turns the unknown into a plan.",
          glyph: "list",
          tone: "#E8C4CE",
          deep: "#7A3348",
          // the app's own line, lib/data/home/week_31.json
          pause: { quote: "Everything you do for your baby begins from this one warm place.", source: "From your week 31 page" },
        },
      ],
      guidesTitle: "Ten guides, for the questions you’re really asking",
      guidesLede: "Each one starts from something you might be wondering tonight, and points you to your own doctor when it matters.",
      guides: [
        {
          name: "Scans & tests",
          pillar: "normal",
          question: "What is this scan actually looking for?",
          why: "Understanding each scan before the day means better questions in the room, and fewer frightening surprises after it.",
          inside: ["Nine scans explained, from dating to Group B Strep", "27 report findings, in plain words", "A locker for your reports, and what to ask next time"],
        },
        {
          name: "Symptoms",
          pillar: "normal",
          question: "Is this normal, or should I call?",
          why: "Most changes are ordinary and have something that helps. Five are not, and those get a straight answer: call now.",
          inside: ["33 ordinary symptoms, by where you feel them", "10 quick “Is this normal?” answers", "Send my week: a note for your doctor"],
        },
        {
          name: "Complications",
          pillar: "normal",
          question: "My doctor used a word I don’t understand.",
          why: "When a condition comes up, understanding it helps you follow your doctor’s plan calmly, and notice when to call. Most pregnancies meet none of these.",
          inside: ["27 conditions, plain name first", "When each one usually comes up", "Living with sugar, thyroid and low iron"],
        },
        {
          name: "Nutrition",
          pillar: "food",
          featured: true,
          image: { slot: "indian-kitchen", alt: "A steel thali with dal, roti and sabzi on a kitchen counter" },
          question: "What should I actually be eating this week?",
          why: "Your baby builds from what you eat. The answer is rarely a superfood. It’s good, ordinary food from your own kitchen, eaten well, with room for cravings.",
          inside: [
            "What to eat now, for your trimester",
            "41 recipes from an Indian kitchen",
            "19 three-day diet charts to download",
            "Fasting days, handled safely",
            "12 nutrients, and where to find them",
            "Diet guides for conditions like sugar and thyroid",
          ],
        },
        {
          name: "Is it safe?",
          pillar: "food",
          question: "Can I have this? Can I do this?",
          why: "One clear answer, so you don’t spend the evening searching. Food, drinks, medicines and everyday things.",
          inside: ["193 answers: eat, drink, take, do", "Scan a packet’s barcode to check it", "Medicines stay your doctor’s call"],
        },
        {
          name: "Garbh Sanskar",
          pillar: "calm",
          featured: true,
          image: { slot: "garbh-sanskar", fallback: "plan", alt: "A pregnant woman listening to music with her eyes closed" },
          question: "How do I connect with my baby before they arrive?",
          why: "The part science is clearest about is your voice: your baby comes to know it. So there’s something to say aloud every day, something to listen to together, and quiet minutes for you. It promises nothing about how clever your baby will be, and we say so.",
          inside: [
            "Something to say aloud every day, in your own voice",
            "Raga and nature recordings, with the musicians named",
            "Stories, affirmations, mantras and lullabies",
            "A journal of everything your baby heard, to keep",
          ],
        },
        {
          name: "Mind & mood",
          pillar: "calm",
          question: "Why do I feel like this, and is it okay?",
          why: "How you feel matters, for you and for your baby. Some days need a reset, some need words, and some need a real person.",
          inside: ["A three-minute reset for hard days", "34 reads on what nobody talks about", "A gentle check-in, never a score"],
        },
        {
          name: "Labour prep",
          pillar: "ready",
          question: "What actually happens on the day?",
          why: "Knowing the stages, your pain-relief options and what to carry turns the unknown into a plan you share with whoever comes with you.",
          inside: ["A contraction timer that keeps the pattern", "A hospital bag that shows how ready you are", "A one-page birth plan your hospital can read"],
        },
        {
          name: "Yoga & fitness",
          pillar: "ready",
          question: "What movement is safe for me now?",
          why: "Staying gently active is good for you through pregnancy, and what’s safe changes as you go, so it’s sorted by month.",
          inside: ["27 yoga sessions, sorted by month", "Walking, swimming and more: what’s fine when", "A Kegel guide for the pelvic floor"],
        },
        {
          name: "Belly & skin",
          pillar: "ready",
          question: "What’s happening to my skin, and what can I use?",
          why: "Almost all of it settles after birth. Until then: what actually helps, and what’s safe to put on your skin.",
          inside: ["19 reads, from stretch marks to melasma", "An ingredient checker: safe, limit or avoid", "A bump photo timeline to keep"],
        },
      ],
      startHere: [
        { guide: "Scans & tests", why: "See what’s coming this trimester, and what each scan is for." },
        { guide: "Is it safe?", why: "Check the foods and medicines you’re unsure about, once, clearly." },
        { guide: "Symptoms", why: "Learn the few signs that mean call now, so you can relax about the rest." },
      ],
      now: {
        title: "Where are you in your pregnancy?",
        lede: "Each trimester has its own few things that matter most. Pick yours.",
        steps: [
          {
            label: "First trimester",
            range: "Weeks 4 to 13",
            week: 12,
            quote: "Maa, we did it. We’ve completed our first big chapter together.",
            items: [
              { title: "Your first scans", body: "The dating scan at 6 to 9 weeks and the NT scan at 11 to 13: what each one looks for.", guide: "Scans & tests" },
              { title: "Nausea, and “can I eat this?”", body: "What helps with morning sickness, and one clear answer for every food you’re unsure about.", guide: "Is it safe?" },
              { title: "Folic acid and steady meals", body: "Simple food from your own kitchen, and the nutrients that matter most right now.", guide: "Nutrition" },
            ],
          },
          {
            label: "Second trimester",
            range: "Weeks 14 to 27",
            week: 22,
            quote: "Maa, I can hear you now. Your voice is becoming one of my favorite sounds.",
            items: [
              { title: "The anomaly scan", body: "Usually at 18 to 22 weeks. What it checks, and what to ask in the room.", guide: "Scans & tests" },
              { title: "Your baby can hear you", body: "Something to say aloud every day, and music to listen to together.", guide: "Garbh Sanskar" },
              { title: "The sugar test", body: "Usually at 24 to 28 weeks. What it means, and what happens if the numbers are high.", guide: "Complications" },
            ],
          },
          {
            label: "Third trimester",
            range: "Weeks 28 to 40",
            week: 36,
            quote: "Maa, I am getting ready. Soon we won’t need imagination to meet each other.",
            items: [
              { title: "Knowing your baby’s movements", body: "What’s usual for your baby, and why less movement always means call now.", guide: "Symptoms" },
              { title: "The bag and the birth plan", body: "Pack in four parts, and write one page your hospital can read at 3 a.m.", guide: "Labour prep" },
              { title: "Growth scan and GBS test", body: "The last scans and tests, from 28 weeks to 37, and what they’re for.", guide: "Scans & tests" },
            ],
          },
        ],
      },
      dayTitle: "A day in pregnancy, with ParentVeda beside you",
      dayLede: "Nothing to keep up with and no streaks. Just the right thing at the right moment.",
      day: [
        { when: "Morning", title: "Your week, in one page", body: "What your baby is doing, what your body is doing, and one thing worth doing today.", glyph: "sun" },
        { when: "Lunch", title: "“Can I eat this?”", body: "One search and one clear answer, with a recipe if you want one.", glyph: "thali" },
        { when: "Evening", title: "Ten quiet minutes", body: "Something to say aloud to your baby, or a raga to listen to together.", glyph: "notes" },
        { when: "Before bed", title: "A check-in", body: "Tap how you feel. Most things are ordinary, and it says so. If something isn’t, it says who to call.", glyph: "heart" },
        { when: "2 a.m.", title: "Ask Veda", body: "Ask in your own words and get a calm answer. If it needs a doctor, Veda says so straight away.", glyph: "talk" },
      ],
      doingTitle: "Small things you’ll do",
      doing: [
        { tool: "Kick counter", action: "Count your baby’s movements and see what’s usual for them." },
        { tool: "Contraction timer", action: "Tap at each one; it keeps the pattern so you don’t have to." },
        { tool: "Weight tracker", action: "Note your weight now and then, without judgement." },
        { tool: "Due date calculator", action: "Work out your weeks, unless your scan or doctor already has." },
        { tool: "Medicines and reminders", action: "Remember the tablets your doctor prescribed." },
        { tool: "Hospital bag", action: "Pack in four parts and see how ready you are." },
        { tool: "Birth plan", action: "One page of preferences your hospital can read at 3 a.m." },
        { tool: "Journal", action: "Write to your baby, or just for yourself." },
      ],
    },
  },
  {
    slug: "parenting",
    short: "Parenting",
    name: "Parenting",
    range: "Birth to 5 years",
    promise: "Be the parent they need, one day at a time.",
    colour: "#D8CCE8",
    deep: "#4A3470",
    painting: "parenting",
    image: "stage-parenting",
    // Kept for revert — title "Only what changes, *when it changes.*"
    title: "Be the parent they need, *one day at a time.*",
    // Kept for revert — intro "Sleep, feeding, fevers, first words, tantrums and potty days: one companion
    // that knows your child’s age and shows you what matters now, not a feed of everything at once."
    intro:
      "Sleep, feeding, fevers, first words, tantrums and potty days, shown for your child’s age, with a calm answer when something changes. And looking after you too, because a rested, supported parent is a child’s safest place.",
    doorsTitle: "Eleven guides, from the first 40 days to the first school bag",
    doors: [
      { name: "First 40 days", line: "Newborn care, and the mother’s own recovery, which usually gets left out." },
      { name: "Sleep", line: "Safe sleep, schedules and the regressions everyone warns you about." },
      { name: "Feeding", line: "Latch, bottles, and starting solids the Indian way." },
      { name: "Health", line: "Fever, rashes, colic, teething, and when it stops being ordinary." },
      { name: "Development", line: "Milestones and leaps, explained without the comparison." },
      { name: "Behaviour", line: "Tantrums, screens, sharing: what is normal, and what helps." },
      { name: "Potty training", line: "Readiness, methods, and setbacks that are part of it." },
      { name: "Early learning", line: "Montessori at home, habits and school readiness, with 36 activities." },
      { name: "You, Maa", line: "Healing, mood, pelvic floor, and going back to work." },
      { name: "Traditions", line: "Annaprashan, mundan, naming and malish, held up honestly against the evidence." },
      { name: "What to buy", line: "An honest guide: the watch-outs as prominent as the praise." },
    ],
    highlights: [
      {
        title: "Something changed?",
        body: "Twenty-nine everyday concerns, like a new rash, a skipped nap or sudden clinginess, checked against your child’s age, with a clear line for when to call the doctor.",
      },
      {
        title: "Leaps and milestones, without the race",
        body: "Ten leaps and 18 milestones, each with what to expect and what to try. No scores, no ‘behind’. Children arrive on their own schedule.",
      },
      {
        // was "The IAP vaccination schedule" — the app follows a government/IAP mix, birth to two
        title: "The vaccination schedule",
        body: "Every vaccine from birth to two, why it is given, and what to do after, with reminders so nothing slips.",
      },
      {
        title: "A mother is a patient too",
        body: "The First 40 Days and You, Maa guides look after the person who just gave birth: healing, mood and the slow way back.",
      },
      {
        title: "Traditions, honestly",
        body: "Annaprashan, mundan, malish and naming: what each means, and what the evidence says about each, side by side.",
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
    story: {
      feel: {
        title: "Nobody hands you a manual.",
        body: "You’re guiding someone new, often on very little sleep, while everyone around you has advice. Most days you won’t know whether you’re doing it right. That’s normal, and it’s exactly why we’re here.",
      },
      pillarsTitle: "What matters most for your child now",
      pillarsLede: "Four things shape these years more than anything else. Every guide below serves one of them.",
      pillars: [
        {
          id: "first",
          title: "The first weeks",
          body: "A newborn, and a mother who is healing too. Rest is treatment, not laziness.",
          glyph: "heart",
          tone: "#E8C4CE",
          deep: "#7A3348",
        },
        {
          id: "care",
          title: "Everyday care",
          body: "Sleep, food and the days they’re unwell. A fast, calm answer when something is wrong, and reassurance when nothing is.",
          glyph: "moon",
          tone: "#C5D6C4",
          deep: "#2E5E45",
        },
        {
          id: "grow",
          title: "Growing and learning",
          body: "What’s coming, what’s late, and what is simply a different child. No scores, and no scoreboard.",
          glyph: "steps",
          tone: "#E8D9C0",
          deep: "#6B4A1F",
          // the app's own line, lib/data/pp_phases_data.dart
          pause: { quote: "Walking at twelve months and walking at seventeen months are both entirely normal.", source: "From your child’s month-by-month guide" },
        },
        {
          id: "home",
          title: "Home and family",
          body: "Big feelings, family customs held up honestly, and buying only what you need.",
          glyph: "home",
          tone: "#D8CCE8",
          deep: "#4A3470",
          // the app's own line, lib/data/pp_phases_data.dart
          pause: { quote: "Separation anxiety is a developmental achievement wearing an exhausting disguise.", source: "From your child’s month-by-month guide" },
        },
      ],
      guidesTitle: "Eleven guides, for the questions you’re really asking",
      guidesLede: "Each one opens on your child’s age, and points you to your paediatrician when it matters.",
      guides: [
        {
          name: "First 40 days",
          pillar: "first",
          featured: true,
          image: { slot: "download-hello", fallback: "parenting", alt: "A mother smiling at her phone, her baby asleep in a sling" },
          question: "What’s normal in these first weeks, for both of us?",
          why: "Newborn care day by day, and the mother’s own recovery, which usually gets left out. Rest is treatment, not laziness.",
          inside: [
            "Day-by-day guides, from day 1 to day 40",
            "“Is my baby OK?”: four quick checks, one by one",
            "When to rush to the doctor",
            "The old practices: which help, and which harm",
          ],
        },
        {
          name: "You, Maa",
          pillar: "first",
          question: "Who’s looking after me?",
          why: "Healing, mood, your pelvic floor and going back to work: the half of this stage nobody asks about. Because you matter too.",
          inside: ["A gentle pelvic-floor programme", "Baby blues, or something more?", "Your mother-in-law, and what your leave entitles you to"],
        },
        {
          name: "Sleep",
          pillar: "care",
          question: "Will any of us sleep again?",
          why: "Safe sleep, how much is normal, and the regressions that undo everything for a fortnight. Gentle first, always.",
          inside: ["On their back, every sleep: safe sleep, calmly", "Regressions at 4 months, 8 to 10 months and 2 years", "What to do at 3 a.m., step by step"],
        },
        {
          name: "Feeding",
          pillar: "care",
          question: "Is my baby eating enough?",
          why: "Milk feeds, starting solids the Indian way, and the week they decide rice is the enemy. Fed is fine.",
          inside: ["“Can they eat this?”, for their age", "Day plans from 6 months to toddler", "What to do if they choke"],
        },
        {
          name: "Health",
          pillar: "care",
          question: "Is this fever serious?",
          why: "When something is wrong, a fast and calm answer, and a clear line for when to see a doctor. If they seem wrong to you, believe yourself.",
          inside: ["A fever check: see a doctor now, today, or watch at home", "The signs that mean go now", "The vaccination schedule, from birth to two"],
        },
        {
          name: "Development",
          pillar: "grow",
          question: "Is my child on track?",
          why: "What’s coming, what’s late, and what is simply a different child. A box you haven’t ticked is not one they’ve missed.",
          inside: ["Milestones, never a test", "When will my baby roll, sit, walk, talk?", "A gentle check-in, and when to ask a doctor"],
        },
        {
          name: "Early learning",
          pillar: "grow",
          question: "What can I do with them today?",
          why: "Montessori at home without the fees, stories and good habits, and what school actually expects. Never a worksheet.",
          inside: ["About 36 activities, like playing sabzi shop", "58 stories, from Panchatantra to Tenali Rama", "Getting ready for school"],
        },
        {
          name: "Potty training",
          pillar: "grow",
          question: "When do we start, and how long does it take?",
          why: "Readiness, methods, nights, and the setbacks nobody warns you about. A puddle is an event, not a verdict.",
          inside: ["How long this actually takes", "Su-su cueing, alongside diapers", "The Indian toilet, and going out"],
        },
        {
          name: "Behaviour",
          pillar: "home",
          question: "Why won’t they listen?",
          why: "Tantrums, biting, screens, sharing, and what’s actually going on underneath. Warm and firm, together.",
          inside: ["What to say when: 13 real situations", "The five steps, in the moment", "Balloon breathing for big feelings"],
        },
        {
          name: "Traditions",
          pillar: "home",
          question: "Which customs should we keep?",
          why: "Annaprashan, mundan, naming and malish, held up honestly against the evidence. Small is complete.",
          inside: ["Ceremonies across faiths", "What a ceremony actually costs", "Kajal, honey and the cord: what’s safe"],
        },
        {
          name: "What to buy",
          pillar: "home",
          question: "What do we actually need?",
          why: "What you need, what you don’t, and how to tell the difference, with the watch-outs as clear as the praise.",
          inside: ["Nine honest guides, from diapers to strollers", "Compare side by side", "Anything sponsored says so"],
        },
      ],
      startHere: [],
      now: {
        title: "How old is your child?",
        lede: "Each age has its own few things that matter most. Pick yours.",
        steps: [
          {
            label: "Newborn",
            range: "0 to 3 months",
            badge: { big: "0–3", small: "months" },
            quote: "If he is feeding, weeing, and gaining after the first two weeks, he is doing his job.",
            items: [
              { title: "The first 40 days", body: "Day by day, for the baby and for the mother’s recovery.", guide: "First 40 days" },
              { title: "Safe sleep", body: "On their back, every sleep, and what’s normal at night.", guide: "Sleep" },
              { title: "Your own healing", body: "Your body, your mood, and when to ask for help.", guide: "You, Maa" },
            ],
          },
          {
            label: "Baby",
            range: "3 to 12 months",
            badge: { big: "3–12", small: "months" },
            quote: "Separation anxiety is a developmental achievement wearing an exhausting disguise.",
            items: [
              { title: "Starting solids", body: "From six months, the Indian way, and what to avoid before one.", guide: "Feeding" },
              { title: "Fevers and vaccines", body: "A calm fever check, and every vaccine visit this year.", guide: "Health" },
              { title: "Rolling, sitting, crawling", body: "What’s coming, and why the range is so wide.", guide: "Development" },
            ],
          },
          {
            label: "Toddler",
            range: "1 to 3 years",
            badge: { big: "1–3", small: "years" },
            quote: "Walking at twelve months and walking at seventeen months are both entirely normal.",
            items: [
              { title: "The ziddi years", body: "Tantrums, biting, and what to say in the moment.", guide: "Behaviour" },
              { title: "Potty training", body: "Readiness first, and how long it really takes.", guide: "Potty training" },
              { title: "Something to do today", body: "Small activities from your own kitchen shelf.", guide: "Early learning" },
            ],
          },
          {
            label: "Preschooler",
            range: "3 to 5 years",
            badge: { big: "3–5", small: "years" },
            quote: "It is a shape, not a verdict.",
            items: [
              { title: "Getting ready for school", body: "What school actually expects, and what it doesn’t.", guide: "Early learning" },
              { title: "Screens and big feelings", body: "Sharing, screens and calm-down corners.", guide: "Behaviour" },
              { title: "Keeping well", body: "Coughs, colds, and the signs that mean see a doctor.", guide: "Health" },
            ],
          },
        ],
      },
      dayTitle: "A day with your little one, and ParentVeda beside you",
      dayLede: "Only what matters at their age, and a calm answer when something changes.",
      day: [
        { when: "Morning", title: "Three things to try today", body: "Small activities for their age, from your own kitchen shelf.", glyph: "sun" },
        { when: "Mealtime", title: "“Can they eat this?”", body: "An answer for their age: yes, not yet, or avoid.", glyph: "bottle" },
        { when: "Afternoon", title: "Something changed?", body: "A new rash, a skipped nap, sudden clinginess: checked calmly against their age.", glyph: "shield" },
        { when: "Evening", title: "How they’re doing", body: "Only what’s changing at their age, and never a score.", glyph: "steps" },
        { when: "3 a.m.", title: "What to do at 3 a.m.", body: "A calm, step-by-step guide for the night wakings.", glyph: "moon" },
      ],
      doingTitle: "Small things you’ll do",
      doing: [
        { tool: "Fever check", action: "Answer a few questions: see a doctor now, today, or watch at home." },
        { tool: "What changed?", action: "29 everyday worries, checked against their age." },
        { tool: "Feeding log", action: "Note feeds, with no scores and no streaks." },
        { tool: "Sleep log", action: "See the pattern, with no target to hit." },
        { tool: "Vaccination tracker", action: "Every visit from birth to two, with reminders." },
        { tool: "Growth", action: "Weight and height through the first year, on WHO curves." },
        { tool: "Milestones", action: "First-year milestones, never a test." },
        { tool: "Home remedies", action: "Nuskhe with the age limits, and when not to use them." },
      ],
    },
  },
  {
    slug: "skilling",
    short: "Skilling",
    name: "Skilling",
    range: "Ages 6 to 14",
    promise: "Skills for the world they’ll grow up in.",
    colour: "#D9A08A",
    deep: "#6E3522",
    painting: "skilling",
    image: "stage-skilling",
    // Kept for revert — title "The skills school *doesn’t grade.*"
    title: "Skills for the world *they’ll grow up in.*",
    intro:
      "Speaking up, thinking clearly, making things, handling big feelings: small activities for children from 6 to 14, planned by age and done together at home. Nothing measured. Nothing ranked.",
    doorsTitle: "Twelve skills, each with a five-minute start",
    doors: [
      { name: "Focus", line: "Holding attention a little longer, one playful exercise at a time." },
      { name: "Confidence", line: "Speaking up: record, listen back, try again." },
      { name: "Expression", line: "Communication and storytelling." },
      { name: "Thinking", line: "Puzzles, reasoning and light, friendly debate." },
      { name: "Values", line: "Moral stories, never preachy." },
      { name: "Maths", line: "Vedic maths, abacus and mental arithmetic, coming soon." }, // was stated as built — the Maths door is a plan sheet
      { name: "Coding", line: "Unplugged first, then blocks, then projects, plus AI literacy." },
      { name: "Reading", line: "Age-right lists and a reading habit that sticks." },
      { name: "Making", line: "Art and music, with a private portfolio." },
      { name: "Feelings", line: "A private journal, and a clear path to real help if it is needed." },
      { name: "Stillness", line: "Guided sitting and yoga made for children." },
      { name: "Memory", line: "Memory techniques and study skills." },
    ],
    highlights: [
      {
        title: "Planned by age band",
        body: "Three bands (6 to 8, 8 to 11, 11 to 14), so a seven-year-old and a thirteen-year-old never get the same activity.",
      },
      {
        title: "Same shape, every skill",
        body: "Each skill opens on Today, then Activities, Lessons, a Cross-band stretch and a Keepsake. Once your child learns one, they know all twelve.",
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
    toolsEyebrow: "A week of skilling",
    toolsNote: "Five minutes at a time, done together at home.",
    tools: [
      "A 5-minute focus game", "A Vedic maths trick", "A story to retell", "A puzzle to argue about",
      "A drawing for the portfolio", "Two minutes of stillness", "A book from the age list", "An unplugged coding game",
    ],
    care: "Feelings is private by design. If a child writes something that needs a grown-up, ParentVeda shows a real helpline, never a product.",
    story: {
      feel: {
        title: "You want them ready, not rushed.",
        body: "Every parent wants a child who can think clearly, speak up and cope when things go wrong. Nobody wants childhood turned into tuition. Skilling sits in between: a few minutes of real practice, chosen for their age, that feels like play.",
      },
      pillarsTitle: "What we help them grow",
      pillarsLede: "Twelve skills in four families. Three are open today with 36 activities each, and the rest are on their way, each one marked honestly below.",
      pillars: [
        {
          id: "voice",
          title: "Finding their voice",
          body: "Saying what they mean, standing up in front of people, and making something of their own. The skills that decide how a child is heard.",
          glyph: "mic",
          tone: "#E8C4CE",
          deep: "#7A3348",
        },
        {
          id: "world",
          title: "Tools for the world ahead",
          body: "Coding is the language we use to talk to machines, and now to AI. Numbers and books are the other two: exercise for the mind, and a habit for life.",
          glyph: "code",
          tone: "#D2DDEA",
          deep: "#2E4A6B",
          // the app's own line, from the Be My Robot activity
          pause: { quote: "If the robot ends up in the wrong place, that is not a mistake, it is a clue.", source: "From a coding activity for ages 6 to 8" },
        },
        {
          id: "mind",
          title: "A sharper mind",
          body: "Asking why, holding attention, learning how to learn. Practice for thinking, not a race for marks.",
          glyph: "puzzle",
          tone: "#C5D6C4",
          deep: "#2E5E45",
        },
        {
          id: "heart",
          title: "A steady heart",
          body: "Naming big feelings, finding calm, knowing what they stand for. School rarely teaches these; home can.",
          glyph: "heart",
          tone: "#D8CCE8",
          deep: "#4A3470",
        },
      ],
      guidesTitle: "Twelve skills, and where each one stands",
      guidesLede: "Three are open today. The rest are marked plainly: what’s already inside, and what’s coming.",
      guides: [
        {
          name: "Confidence",
          pillar: "voice",
          status: "open",
          question: "My child freezes in front of people.",
          why: "A quiet child isn’t a problem to fix. Confidence grows from small, safe chances to speak, and from hearing yourself back.",
          inside: ["36 activities, from the puppet speaks to a real talk", "Hear yourself back: record, listen, notice one thing", "A breathing circle for nerves"],
        },
        {
          name: "Expression",
          pillar: "voice",
          status: "open",
          question: "Can my child say what they mean, clearly?",
          why: "Describing, explaining, telling a story, making a point with a reason. Everyday talk, practised on purpose.",
          inside: ["36 activities across three age bands", "Say it back, once upon a time, point and reason", "Record and listen back, kept only on your phone"],
        },
        {
          name: "Making",
          pillar: "voice",
          status: "growing",
          question: "How do I keep them making things?",
          why: "Art, music and making, from rangoli to a kitchen-shelf instrument to a kite. There’s no wrong, and nothing is ranked.",
          inside: ["A private portfolio for what they make", "Show it: a full-screen show for family in the room"],
        },
        {
          name: "Coding",
          pillar: "world",
          status: "open",
          question: "Is coding for my child real, or just a sales pitch?",
          why: "Coding here is thinking made visible: steps in order, spotting the mistake, breaking a big job into small ones. It starts with no screen at all, and it promises nothing about anyone’s future.",
          inside: ["36 activities; 6 to 8 is completely screen-free", "8 to 11 moves to Scratch; 11 to 14 builds real projects", "Why AI gets it wrong, explored with a grown-up"],
        },
        {
          name: "Maths",
          pillar: "world",
          status: "soon",
          question: "How do I make numbers feel less scary?",
          why: "Maths is exercise for the mind, not only marks. This guide will bring mental maths, Vedic maths and the abacus, levelled to where your child actually is.",
          inside: ["Mental arithmetic, a few minutes at a time", "Vedic maths and the abacus", "Levelled by where your child is, not their class"],
        },
        {
          name: "Reading",
          pillar: "world",
          status: "soon",
          question: "How do I get my child to love reading?",
          why: "A reading habit outlasts any test. This guide will bring book lists by age, and challenges that grow the habit rather than a count.",
          inside: ["Book lists for each age band", "Challenges that build the habit, not the count"],
        },
        {
          name: "Thinking",
          pillar: "mind",
          status: "growing",
          question: "How do I raise a questioner, not an arguer?",
          why: "Asking why, checking if something is true, and changing your mind when the facts change. Questioning an idea while respecting the person is the real skill.",
          inside: ["Six thinking skills, planned for three age bands", "Puzzles, why-chains and “Is this true?” sets on the way"],
        },
        {
          name: "Focus",
          pillar: "mind",
          status: "soon",
          question: "Why can’t my child stay with one thing?",
          why: "Attention grows with practice. This guide will bring games that stretch it a little at a time, and help them come back when their mind wanders.",
          inside: ["Attention games for each age", "Coming back when the mind wanders"],
        },
        {
          name: "Memory",
          pillar: "mind",
          status: "soon",
          question: "How do I help them learn, not just memorise?",
          why: "School assumes children already know how to learn. This guide will teach it: memory techniques and study skills, for their age.",
          inside: ["Memory techniques for each age", "How to study, the part school skips"],
        },
        {
          name: "Feelings",
          pillar: "heart",
          status: "growing",
          question: "How do I help with big feelings?",
          why: "Naming what they feel, handling the big ones, and knowing it’s always okay to ask for help. A skill to practise, never therapy.",
          inside: ["A private journal, locked on the phone, that only they can read", "A “talk to someone” button on every screen"],
        },
        {
          name: "Stillness",
          pillar: "heart",
          status: "growing",
          question: "Can my child learn to calm down?",
          why: "Guided sitting and simple yoga, made for a child’s attention span. No streak to keep, and no day to miss.",
          inside: ["Settle: a breathing circle, in for three, out for five"],
        },
        {
          name: "Values",
          pillar: "heart",
          status: "soon",
          question: "How do I teach values without preaching?",
          why: "Stories and good habits, rooted in where we come from, and never preachy.",
          inside: ["Stories for each age", "“Dadi says, science says” cards for the family"],
        },
      ],
      startHere: [],
      now: {
        title: "How old is your child?",
        lede: "The same skill grows with them. Here’s a taste of what they’d try at each age.",
        steps: [
          {
            label: "Ages 6 to 8",
            range: "Play it out loud",
            badge: { big: "6–8", small: "years" },
            quote: "If the robot ends up in the wrong place, that is not a mistake, it is a clue.",
            items: [
              { title: "Be My Robot", body: "Someone at home becomes the robot, and your child gives the steps. No screen at all.", guide: "Coding" },
              { title: "Loud and Proud Name", body: "Saying their own name out loud, proudly, as a first small step.", guide: "Confidence" },
              { title: "Describe It, I’ll Guess", body: "Finding the words to describe something without naming it.", guide: "Expression" },
            ],
          },
          {
            label: "Ages 8 to 11",
            range: "Tell it and explain it",
            badge: { big: "8–11", small: "years" },
            quote: "In for three, out for five, with the butterflies, not without them.",
            items: [
              { title: "Make it Move", body: "Their first moving thing in Scratch, building on the robot game.", guide: "Coding" },
              { title: "Two-Minute Talk", body: "Two minutes on something they love, to someone who listens.", guide: "Confidence" },
              { title: "Retell the Movie", body: "Telling a story in order, with the important bits kept in.", guide: "Expression" },
            ],
          },
          {
            label: "Ages 11 to 14",
            range: "Make something real",
            badge: { big: "11–14", small: "years" },
            quote: "Notice one thing you did. Just for you. Nothing is written down.",
            items: [
              { title: "Build a Chatbot", body: "A real project, over more than one sitting.", guide: "Coding" },
              { title: "Why AI Gets It Wrong", body: "With a grown-up: why AI can sound sure and still be wrong.", guide: "Coding" },
              { title: "Give the Real Talk", body: "A proper talk, handled calmly, questions and all.", guide: "Confidence" },
            ],
          },
        ],
      },
      dayTitle: "A week of skilling, done together",
      dayLede: "A few minutes at a time, at home. Nothing to keep up with, and nothing scored.",
      day: [
        { when: "After school", title: "A five-minute try", body: "One small activity, chosen for their age, read aloud if they like.", glyph: "sun" },
        { when: "Dinner", title: "Say it back", body: "An everyday game that turns table talk into real practice.", glyph: "talk" },
        { when: "Weekend", title: "Make something real", body: "A longer project, or something new for their private portfolio.", glyph: "code" },
        { when: "Before bed", title: "Settle", body: "Two minutes of breathing: in for three, out for five.", glyph: "moon" },
        { when: "Any time", title: "I tried it", body: "A keepsake that notes what they tried, with no number on it.", glyph: "journal" },
      ],
      doingTitle: "Small things you’ll do together",
      doing: [
        { tool: "Hear yourself back", action: "Record a talk, listen back, notice one thing. Saved only on your phone." },
        { tool: "Private journal", action: "Your child’s own, locked on the phone. You can clear it, never read it." },
        { tool: "Portfolio", action: "Keep what they make, and show it to family in the room." },
        { tool: "Settle", action: "A breathing circle for nerves, bedtime or a hard moment." },
        { tool: "Keepsake", action: "“I tried it. I did it again. I made something.” No score." },
        { tool: "Grown-up gate", action: "Your notes and settings sit behind a gate your child can’t open." },
      ],
    },
  },
];

export function getStage(slug: string) {
  return stages.find((s) => s.slug === slug);
}
