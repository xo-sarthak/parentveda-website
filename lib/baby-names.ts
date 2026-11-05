/* Data for /tools/baby-names/. The same catalogue as the app's Name Finder
   (pp_names_catalogue.dart plus the hand-written names in pp_names_data.dart),
   exported to baby-names.json. Re-export from the app when names change.
   Row: [name, Devanagari, "g" | "b" | "u", meaning, community, origin, "T" | "C" | "R"]. */
import DATA from "./baby-names.json";

export type NameRow = [string, string, "g" | "b" | "u", string, string, string, "T" | "C" | "R"];
export const NAMES = DATA as NameRow[];
export const COMMUNITIES = [...new Set(NAMES.map((n) => n[4]))].sort((a, b) => NAMES.filter((n) => n[4] === b).length - NAMES.filter((n) => n[4] === a).length);
