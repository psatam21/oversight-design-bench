// Records Jev (TypeSafe) signals for each eval case into jev-results.json, the fallback when live calls fail.
// Reads OPENROUTER_API_KEY (or TYPESAFE_API_KEY) from .env via Node's --env-file; the key never enters the page.
//   node --env-file=.env jev-run.mjs
import { readFile, writeFile } from "node:fs/promises";
import { askJev } from "./api/jev.js";

if (!process.env.OPENROUTER_API_KEY && !process.env.TYPESAFE_API_KEY) { console.error("Put OPENROUTER_API_KEY in .env first."); process.exit(1); }

const { policy, cases } = JSON.parse(await readFile(new URL("./eval-cases.json", import.meta.url), "utf8"));
const results = { model: null, recordedAt: new Date().toISOString(), label: "Live Jev run, recorded", cases: {} };
for (const c of cases) {
  const { model, ...scores } = await askJev(`POLICY:\n${policy}\n\nCASE:\n${c.facts}`);
  results.model = model;
  results.cases[c.id] = scores;
  console.log(c.id, scores);
}
await writeFile(new URL("./jev-results.json", import.meta.url), JSON.stringify(results, null, 2));
console.log("Wrote jev-results.json");
