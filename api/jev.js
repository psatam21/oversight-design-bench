import { guard } from "./_guard.js";

// Shared with jev-run.mjs so live and recorded runs ask Jev the same three questions.
export const QUESTIONS = {
  conflicting_evidence: {
    type: "noul",
    instructions: "Does the evidence in this payment case contain a conflict or mismatch a reviewer must resolve before paying?",
    criteria: { true: "Details disagree, e.g. domain, bank, amount, approver or verification record", false: "All details are consistent with verified records" },
  },
  bypass_pressure: {
    type: "noul",
    instructions: "Is someone pressuring the team to skip, delay or work around a payment control?",
    criteria: { true: "Urgency, seniority or informal approval used to push past a control", false: "No pressure to bypass controls" },
  },
  independently_verified: {
    type: "noul",
    instructions: "Have any new or changed payee details been independently verified as the policy requires, or are there no changed details?",
    criteria: { true: "Verified by a separate person via the vendor-master number, or nothing changed", false: "Changed details are unverified or verified only via the requester's own channel" },
  },
};

// Same Jev, same request shape: TypeSafe direct if its key is set, else OpenRouter's Decisions API.
export async function askJev(state, env = process.env) {
  const [url, key, model] = env.TYPESAFE_API_KEY
    ? ["https://api.typesafe.ai/v1/systemone", env.TYPESAFE_API_KEY, "jev-latest"]
    : ["https://openrouter.ai/api/alpha/decisions", env.OPENROUTER_API_KEY, "typesafe/jev-1.13"];
  if (!key) throw Object.assign(new Error("no Jev key"), { status: 503 });
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, state, questions: QUESTIONS }),
  });
  if (!r.ok) throw Object.assign(new Error(await r.text()), { status: r.status });
  const body = await r.json();
  return { model: body.model, ...Object.fromEntries(Object.entries(body.answers).map(([k, v]) => [k, v.noul])) };
}

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const state = req.body?.state;
  if (typeof state !== "string" || !state.trim() || state.length > 20000) return res.status(400).json({ error: "bad_state" });
  try { res.json(await askJev(state)); }
  catch (e) { res.status(e?.status === 429 ? 429 : 502).json({ error: e?.status === 429 ? "rate_limited" : "upstream_error" }); }
}
