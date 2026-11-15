// Renders every guide in this folder to ../<slug>.pdf with headless Chrome.
// Usage: node content/downloads/src/render.mjs [slug ...]
// Set CHROME_PATH to override the Chrome location.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SLUGS = [
  "cerclage-care-sheet",
  "gdm-diet-chart-veg",
  "fertility-specialist-checklist",
  "thalassemia-partner-test-guide",
  "bp-log-sheet",
  "ivf-next-cycle-questions",
  "semen-report-guide",
  "high-risk-pregnancy-visit-plan",
  "nicu-to-home-checklist",
];

const srcDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(srcDir, "..");
const chrome =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => existsSync(p));

if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}

const wanted = process.argv.slice(2);
const list = wanted.length ? SLUGS.filter((s) => wanted.includes(s)) : SLUGS;
let failed = 0;

for (const slug of list) {
  const html = join(srcDir, `${slug}.html`);
  const pdf = join(outDir, `${slug}.pdf`);
  if (!existsSync(html)) {
    console.error(`missing ${html}`);
    failed++;
    continue;
  }
  try {
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--print-to-pdf=${pdf}`,
        pathToFileURL(html).href,
      ],
      { stdio: "pipe" },
    );
    console.log(`${slug}.pdf  ${Math.round(statSync(pdf).size / 1024)} KB`);
  } catch (err) {
    console.error(`failed ${slug}: ${err.message}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
