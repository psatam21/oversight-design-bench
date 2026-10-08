// Every API route is public on the internet, so each call must carry the presenter's passcode.
// Fails closed: with no DEMO_PASSCODE set, nothing works.
export function guard(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "post_only" }); return false; }
  const pass = process.env.DEMO_PASSCODE?.trim();
  if (!pass || String(req.headers["x-demo-pass"] || "").trim() !== pass) { res.status(401).json({ error: "bad_passcode" }); return false; }
  return true;
}
