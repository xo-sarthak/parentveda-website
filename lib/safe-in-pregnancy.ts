/* Types and labels for /tools/is-it-safe-in-pregnancy/. The answers themselves come
   from the can_i_entries and can_i_groups tables, which the app reads too, and are
   edited in Directus: see lib/shared-content.ts. This file is also imported by the
   browser component, so it must not import can-i.json. */

export type Verdict = "safe" | "moderation" | "depends" | "avoid" | "askDoctor";
export type Category = "eat" | "drink" | "take" | "doActivity";

export type CanI = {
  id: string;
  name: string;
  cat: Category;
  verdict: Verdict;
  short: string;
  why: string;
  t1?: string;
  t2?: string;
  t3?: string;
  indian?: string;
  related?: string[];
  aliases?: string[];
};

/** What the tool needs. groups: [label, entry ids]. popular: entry ids, in order. */
export type CanIData = {
  entries: CanI[];
  groups: [string, string[]][];
  popular: string[];
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  safe: "Safe",
  moderation: "In moderation",
  depends: "Depends",
  avoid: "Avoid",
  askDoctor: "Ask your doctor",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  eat: "Eat",
  drink: "Drink",
  take: "Take",
  doActivity: "Do",
};

/** Shelf groups, used only when the tables cannot be read: [label, entry ids]. */
export const CAN_I_GROUPS: [string, string[]][] = [["Fruits", ["papaya", "pineapple", "mango", "banana", "apple", "orange", "grapes", "watermelon", "muskmelon", "guava", "pomegranate", "chikoo", "custard_apple", "litchi", "jackfruit", "dates", "figs", "berries", "kiwi", "pear"]], ["Nuts and dry fruits", ["dry_fruits", "almonds", "walnuts", "cashews", "peanuts", "makhana"]], ["Vegetables and greens", ["spinach", "drumstick", "brinjal", "potato", "tomato", "carrot", "beetroot", "sprouts", "raw_salad", "mushroom"]], ["Eggs, meat and fish", ["egg", "chicken", "mutton", "fish", "prawns", "high_mercury_fish", "sushi", "raw_meat", "deli_meat"]], ["Dairy", ["paneer", "curd", "milk", "cheese", "ghee"]], ["Grains and dal", ["dal", "soya", "rajma_chana", "oats", "poha", "sabudana", "maida"]], ["Sweets and snacks", ["chocolate", "honey", "mawa_sweets", "instant_noodles", "fried_snacks", "pickle", "jaggery", "sugar", "chyawanprash"]], ["Spices and the kitchen", ["ginger", "saffron", "turmeric_milk", "spices", "salt", "spicy_food"]], ["Street food and eating out", ["street_food", "leftovers"]], ["Tea and coffee", ["coffee", "tea", "green_tea", "decaf_coffee", "herbal_tea"]], ["Cool drinks", ["water", "coconut_water", "buttermilk", "lassi", "lemon_water", "aam_panna", "jaljeera", "badam_milk", "ors", "smoothie", "milkshake"]], ["Juices", ["fresh_juice", "packaged_juice", "sugarcane_juice"]], ["Soda, energy drinks and alcohol", ["alcohol", "soft_drinks", "diet_soda", "energy_drinks", "kombucha"]], ["Pain and fever", ["paracetamol", "ibuprofen", "combiflam", "aspirin", "diclofenac"]], ["Cold, cough and allergy", ["common_cold", "cetirizine", "cough_syrup", "lozenges", "vicks_balm", "antibiotics"]], ["Stomach and nausea", ["antacids", "pantoprazole", "ondansetron", "doxylamine", "laxative", "isabgol", "probiotics", "deworming", "antifungal_cream"]], ["Supplements", ["folic_acid", "iron", "calcium", "vitamin_d", "vitamin_c", "multivitamin", "omega3", "b12"]], ["Ongoing conditions and vaccines", ["thyroid_medicine", "bp_medicine", "insulin", "vaccines", "sleeping_pills"]], ["Ayurvedic and herbal", ["ashwagandha", "ayurvedic_medicine", "homeopathy"]], ["Travel and getting about", ["flight_travel", "long_travel", "driving", "public_transport", "crowded_places", "amusement_rides"]], ["Exercise and effort", ["yoga", "swimming", "walking", "cycling", "running", "dancing", "gym", "trekking", "climbing_stairs", "lifting", "standing_long", "household_chores", "hot_yoga"]], ["Hair, skin and beauty", ["hair_color", "waxing", "nail_polish", "keratin", "facial", "chemical_peel", "botox_fillers", "laser_hair", "pedicure", "makeup", "sunscreen", "retinol", "perfume", "hair_oil", "tattoo", "gel_nails", "high_heels", "tight_clothes", "hair_removal_cream"]], ["Around the house", ["mosquito_repellent", "ac_use", "incense", "cleaning_chemicals", "paint_fumes", "pesticides", "pet_cats", "pet_dogs", "gardening", "mobile_phone", "hot_water_bath", "milk_bath", "sauna", "spa", "massage"]], ["Rest, intimacy and mind", ["sleeping_back", "sex", "masturbation", "breastfeeding_pregnant", "meditation", "stress", "fasting"]], ["Smoking, vaping and cannabis", ["smoking", "secondhand_smoke", "vaping", "cannabis"]], ["Dentist, X-rays and heartbeat monitors", ["dental", "xray", "fetal_doppler"]]];

/** Popular searches, used only when the tables cannot be read. */
export const CAN_I_POPULAR = ["pineapple", "coffee", "paracetamol", "flight_travel", "hair_color", "sex"];

/* ---------- One page per answer: /tools/is-it-safe-in-pregnancy/<slug>/ ---------- */

export const SAFE_BASE = "/tools/is-it-safe-in-pregnancy";

/** "flight_travel" -> "flight-travel". Ids are lowercase words joined by underscores. */
export const safeSlug = (id: string) => id.replace(/_/g, "-");
export const safeIdFromSlug = (slug: string) => slug.replace(/-/g, "_");
export const safePath = (id: string) => `${SAFE_BASE}/${safeSlug(id)}/`;

/** The question as people search it: "Papaya in pregnancy: is it safe?" */
export function safeQuestion(e: Pick<CanI, "name">): string {
  return /pregnan/i.test(e.name) ? `${e.name}: is it safe?` : `${e.name} in pregnancy: is it safe?`;
}
