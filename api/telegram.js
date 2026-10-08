import { guard } from "./_guard.js";

// Stateless relay. No webhook, no database.
// Telegram allows one getUpdates reader at a time, so the page elects one listening tab per browser
// (Web Locks) and shares updates with its other tabs over a BroadcastChannel.
// ponytail: one browser at a time; two devices listening at once will still conflict. Move to a webhook + store if needed.
const tg = async (method, body) => {
  const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!j.ok) throw Object.assign(new Error(j.description), { status: r.status });
  return j.result;
};

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const { action } = req.body || {};
  try {
    if (action === "send") {
      const { chatId, text, buttons } = req.body;
      if (!Number.isSafeInteger(chatId) || typeof text !== "string" || !text || text.length > 3500) return res.status(400).json({ error: "bad_message" });
      const keyboard = Array.isArray(buttons) ? [buttons.slice(0, 4).map(b => ({ text: String(b.text).slice(0, 40), callback_data: String(b.data).slice(0, 64) }))] : undefined;
      await tg("sendMessage", { chat_id: chatId, text, ...(keyboard && { reply_markup: { inline_keyboard: keyboard } }) });
      return res.json({ ok: true });
    }
    if (action === "poll") {
      const offset = Number.isSafeInteger(req.body.offset) ? req.body.offset : 0;
      const updates = await tg("getUpdates", { offset, timeout: 0, allowed_updates: ["message", "callback_query"] });
      const out = updates.map(u => u.callback_query
        ? { id: u.update_id, type: "tap", queryId: u.callback_query.id, chatId: u.callback_query.message?.chat?.id, name: u.callback_query.from?.first_name || "Reviewer", data: u.callback_query.data }
        : u.message ? { id: u.update_id, type: "msg", chatId: u.message.chat.id, name: u.message.from?.first_name || "Someone", text: u.message.text || "" } : null).filter(Boolean);
      return res.json({ updates: out, offset: updates.length ? updates[updates.length - 1].update_id + 1 : offset });
    }
    if (action === "answer") {
      const { queryId } = req.body;
      if (typeof queryId !== "string" || !queryId) return res.status(400).json({ error: "bad_query" });
      await tg("answerCallbackQuery", { callback_query_id: queryId }).catch(() => {}); // already answered or expired: fine
      return res.json({ ok: true });
    }
    res.status(400).json({ error: "bad_action" });
  } catch (e) {
    res.status(502).json({ error: "telegram_error", detail: String(e?.message || "").slice(0, 200) });
  }
}
