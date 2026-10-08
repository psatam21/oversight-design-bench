// Copies the keys in .env to the Vercel project's Production environment. Prints names only, never values.
//   node --env-file=.env push-env.mjs
import { spawnSync } from "node:child_process";

const NAMES = ["ANTHROPIC_API_KEY", "OPENROUTER_API_KEY", "TYPESAFE_API_KEY", "TELEGRAM_BOT_TOKEN", "DEMO_PASSCODE"];
const vercel = (args, input) => spawnSync("vercel", args, { input, encoding: "utf8", shell: true });

for (const name of NAMES) {
  const value = process.env[name]?.trim();
  if (!value) { console.log(`skip   ${name} (not in .env)`); continue; }
  vercel(["env", "rm", name, "production", "--yes"]); // replace if it already exists
  const r = vercel(["env", "add", name, "production"], value);
  console.log(r.status === 0 ? `set    ${name}` : `FAILED ${name}: ${(r.stderr || "").split("\n").find(l => l.trim()) || "unknown error"}`);
}
console.log("Done. Redeploy so the new values take effect.");
