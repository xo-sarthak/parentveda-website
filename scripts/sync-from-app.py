#!/usr/bin/env python3
"""Copy the free tools' content from the ParentVeda app into this website.

The website's free tools reuse the app's data so both say the same thing:
  lib/can-i.json + groups in lib/safe-in-pregnancy.ts  <- lib/data/can_i_data.dart, can_i_groups.dart
  lib/baby-names.json                                   <- lib/screens/post_pregnancy/pp_names_catalogue.dart + pp_names_data.dart
  lib/vaccine-info.json                                 <- lib/screens/post_pregnancy/pp_vaccine_data.dart
  lib/who-growth.json                                   <- lib/screens/post_pregnancy/pp_who_growth_lms.dart

Run from the website repo after the app's content changes:
  python scripts/sync-from-app.py C:\\Projects\\parentveda
then check `git diff`, run `npm run typecheck`, and commit.
It only reads the app repo; it never writes there.
"""
import json, os, re, sys


class Dart:
    """Just enough of a Dart literal reader for the app's data files."""

    def __init__(self, text, i=0):
        self.t, self.i = text, i

    def ws(self):
        rx = re.compile(r"(\s+|//[^\n]*|/\*.*?\*/)", re.S)
        while (m := rx.match(self.t, self.i)):
            self.i = m.end()

    def peek(self):
        self.ws()
        return self.t[self.i] if self.i < len(self.t) else ""

    def string(self):
        out = ""
        while self.peek() in ("'", '"') or self.t.startswith(("r'", 'r"'), self.i):
            raw = self.t[self.i] == "r"
            self.i += raw
            q = self.t[self.i]
            if self.t.startswith(q * 3, self.i):
                q = q * 3
            self.i += len(q)
            while not self.t.startswith(q, self.i):
                c = self.t[self.i]
                if c == "\\" and not raw:
                    n = self.t[self.i + 1]
                    out += {"n": "\n", "t": "\t"}.get(n, n)
                    self.i += 2
                else:
                    out += c
                    self.i += 1
            self.i += len(q)
        return out

    def value(self):
        c = self.peek()
        if c in "'\"" or (c == "r" and self.t[self.i + 1 : self.i + 2] in ("'", '"')):
            return self.string()
        if c == "[":
            return self.seq("]")
        if c == "{":
            return self.seq("}")
        if c == "(":
            return self.args()
        m = re.compile(r"(?:const\s+)?([A-Za-z_][\w.]*)(?:<[^>]*>)?").match(self.t, self.i)
        if m:
            self.i = m.end()
            if self.peek() == "(":
                a = self.args()
                return {"__call": m.group(1), **a} if isinstance(a, dict) else {"__call": m.group(1), "pos": a}
            return m.group(1)
        m = re.compile(r"-?[\d.]+").match(self.t, self.i)
        if m:
            self.i = m.end()
            return float(m.group())
        raise ValueError("cannot read: " + self.t[self.i : self.i + 80])

    def seq(self, close):
        self.i += 1
        out = []
        while self.peek() != close:
            out.append(self.value())
            if self.peek() == ",":
                self.i += 1
        self.i += 1
        return out

    def args(self):
        self.i += 1
        pos, named = [], {}
        while self.peek() != ")":
            m = re.compile(r"([A-Za-z_]\w*)\s*:(?!:)").match(self.t, self.i)
            if m:
                self.i = m.end()
                named[m.group(1)] = self.value()
            else:
                pos.append(self.value())
            if self.peek() == ",":
                self.i += 1
        self.i += 1
        if named:
            if pos:
                named["pos"] = pos
            return named
        return pos


def calls(text, name):
    out = []
    for m in re.finditer(r"(?<![\w.])" + name + r"\(", text):
        try:
            out.append(Dart(text, m.end() - 1).args())
        except Exception:
            pass
    return out


def en(v):
    if isinstance(v, dict):
        return v["pos"][0] if v.get("__call") == "_t" else v.get("en")
    return v


def main(app, web):
    read = lambda p: open(os.path.join(app, p), encoding="utf-8").read()
    out = lambda p: os.path.join(web, p)

    # Is it safe in pregnancy  <-  Can I?
    t = read("lib/data/can_i_data.dart")
    t = t[t.index("final List<CanIEntry> kCanIEntries") :]
    rows = []
    for e in calls(t, "CanIEntry"):
        r = {"id": e["id"], "name": en(e["name"]), "cat": e["category"].split(".")[1], "verdict": e["verdict"].split(".")[1],
             "short": en(e["short"]), "why": en(e["why"])}
        for k in ("t1", "t2", "t3", "indian"):
            if e.get(k):
                r[k] = en(e[k])
        for k in ("related", "aliases"):
            if e.get(k):
                r[k] = e[k]
        rows.append(r)
    json.dump(rows, open(out("lib/can-i.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    g = read("lib/data/can_i_groups.dart")
    groups = [[m.group(2), re.findall(r"'([^']+)'", m.group(4))] for m in re.finditer(
        r"CanIGroup\(id: '([^']+)', label: '([^']+)', category: CanICategory\.(\w+), entryIds: \[(.*?)\]\)", g, re.S)]
    ts = open(out("lib/safe-in-pregnancy.ts"), encoding="utf-8").read()
    ts = re.sub(r"(CAN_I_GROUPS: \[string, string\[\]\]\[\] = ).*?;\n", lambda m: m.group(1) + json.dumps(groups, ensure_ascii=False) + ";\n", ts, flags=re.S)
    open(out("lib/safe-in-pregnancy.ts"), "w", encoding="utf-8").write(ts)
    print(f"Is it safe: {len(rows)} entries, {len(groups)} groups")

    # Baby names
    t = read("lib/screens/post_pregnancy/pp_names_catalogue.dart")
    raw = t[t.index("'''") + 3 :]
    raw = raw[: raw.index("'''")]
    names = {}
    for line in raw.strip().split("\n"):
        p = line.split("|")
        if len(p) >= 8:
            names[p[0]] = [p[0], p[1], p[2], p[6], p[3], p[5], p[7].strip()]
    a = read("lib/screens/post_pregnancy/pp_names_data.dart")
    for b in calls(a[a.index("kBabyNamesAuthored") :], "BabyName"):
        if isinstance(b, dict) and "name" in b:
            old = names.get(b["name"], [b["name"], "", "b", "", "Hindu", "", "C"])
            g = {"boy": "b", "girl": "g", "unisex": "u"}.get(b.get("gender", "boy"), "b")
            names[b["name"]] = [b["name"], b.get("script", old[1]), g, b["meaningShort"], b.get("community", old[4]) if isinstance(b.get("community"), str) else old[4],
                                b.get("origin", old[5]) if isinstance(b.get("origin"), str) else old[5], old[6]]
    rows = sorted(names.values(), key=lambda r: r[0])
    json.dump(rows, open(out("lib/baby-names.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"Baby names: {len(rows)}")

    # Vaccine Learn Why (the app text is written for one sample boy; the web is neutral)
    t = read("lib/screens/post_pregnancy/pp_vaccine_data.dart")
    s = t[t.index("const List<Vaccine> kVaccines") :]
    s = s[: s.index("\n];")]
    neutral = [("Can he have it", "Can my baby have it"), ("What if he spits it out?", "What if my baby spits it out?"),
               ("Why does he need injected polio when he also gets drops?", "Why does my baby need injected polio as well as the drops?"),
               ("He spat some out", "My baby spat some out"), ("If he spits out", "If your baby spits out"), ("Can he feed", "Can my baby feed"),
               ("Does he still need it?", "Does my child still need it?"), ("It protects him", "It protects your child"),
               ("the babies around him", "the babies around them"), ("He had hepatitis A already.", "My child had hepatitis A already."),
               ("He got chickenpox", "My child got chickenpox"), ("He had a lot of shots", "My child had a lot of shots")]
    vax = []
    for v in calls(s, "Vaccine"):
        if not isinstance(v, dict) or v.get("id") in (None, "vitk"):
            continue
        for k in ("__call", "products", "comfort"):
            v.pop(k, None)
        j = json.dumps(v, ensure_ascii=False)
        for x, y in neutral:
            j = j.replace(x, y)
        vax.append(json.loads(j))
    left = re.findall(r"\b(he|his|him|He|His|Him)\b", json.dumps(vax, ensure_ascii=False))
    json.dump(vax, open(out("lib/vaccine-info.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"Vaccines: {len(vax)}" + (f"  CHECK: new he/his/him wording to neutralise: {left}" if left else ""))

    # WHO growth tables
    t = read("lib/screens/post_pregnancy/pp_who_growth_lms.dart")
    def tab(n):
        s = t[t.index(f"kWho{n} = [") :]
        s = s[: s.index("];")]
        return [[float(x) for x in m] for m in re.findall(r"\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)", s)]
    who = {k: {"boys": tab(n + "Boys"), "girls": tab(n + "Girls")} for k, n in (("wfa", "Weight"), ("lhfa", "Length"), ("hcfa", "Head"))}
    assert all(len(v[x]) == 61 for v in who.values() for x in v), "WHO tables should have 61 months"
    json.dump(who, open(out("lib/who-growth.json"), "w"), separators=(",", ":"))
    print("WHO growth tables: ok")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python scripts/sync-from-app.py <path to the app repo>")
    main(sys.argv[1], os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
