# Oversight Design Bench

RAIG course project · **Human Oversight Design**

**Live demo:** https://raig-five.vercel.app

How should humans supervise an AI-assisted workflow? This interactive demo lets you design the human check on an AI that prepares supplier payments, run a fraud case through it, and see whether your design pays the fraudster or blocks the fraud.

**Main idea:** a rulebook advises the AI. Code enforces.

All companies, people, amounts and policies are fictional. No real money moves.

## What is in the demo

| Tab | What it does |
|---|---|
| Why it matters | The question, the fraud email, and the six design choices |
| Set up | Make the six choices; the site builds a rulebook (SKILL.md) from them |
| Test it | One case in four stages: request arrives, AI decides, you check, outcome. A live case journey shows where the design held or failed |
| Results | 11 test cases × 3 AI versions (no rules, policy, policy + rulebook) × 3 tries, with answers fixed before running |
| Limits | What the demo does not prove |

## How it is built

- `index.html`: the whole front end (one file, no build step)
- `api/claude.js`: Claude Haiku 5.5 via OpenRouter
- `api/jev.js`: Jev 1.13 (TypeSafe) via OpenRouter's Decisions API
- `api/telegram.js`: optional phone approvals through a Telegram bot
- `api/health.js`, `api/_guard.js`: status check and passcode gate for every API call
- `eval-cases.json`, `recorded-runs.json`, `jev-results.json`, `v2-runs.json`: test cases and recorded results
- `Presenter-Guide-final.docx`: step-by-step guide for presenting the demo
- `Project-Report-OnePager.docx`: one-page project report
- `DECISIONS.md`: log of design decisions and why they were made

Hosted on Vercel. API keys live only in Vercel's environment settings and are never in this repository.

## Run your own copy

1. Copy `.env.example` to `.env` and fill in your own keys (OpenRouter, Telegram bot token, a passcode of your choice).
2. `vercel link`, then `node --env-file=.env push-env.mjs` to copy the keys to Vercel.
3. `vercel deploy --prod`.

The page also runs as a Claude artifact, where it uses the viewer's Claude plan instead of the API.
