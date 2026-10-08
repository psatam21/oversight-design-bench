import { guard } from "./_guard.js";

// Claude Haiku 5.5 through OpenRouter (the user's only key). Same model and settings for every call,
// so with/without-skill runs differ only by the prompt. Sampling params stay at defaults.
const MODEL = "anthropic/claude-haiku-5.5"; // ponytail: cheapest current Claude; switch to anthropic/claude-sonnet-5.5 if judgment quality falls short

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const prompt = req.body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 60000) return res.status(400).json({ error: "bad_prompt" });
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
    });
    if (r.status === 429) return res.status(429).json({ error: "rate_limited" });
    const body = await r.json();
    if (!r.ok) return res.status(502).json({ error: "upstream_error" });
    const choice = body.choices?.[0];
    if (choice?.finish_reason === "refusal" || choice?.native_finish_reason === "refusal") return res.status(422).json({ error: "refusal" });
    res.json({ text: choice?.message?.content || "", model: body.model || MODEL });
  } catch {
    res.status(502).json({ error: "upstream_error" });
  }
}
