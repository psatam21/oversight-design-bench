# DECISIONS.md - Human Oversight Design demo (RAIG)

## Current state
**Goal:** A 10-minute in-class demo of Human Oversight Design for an AI-assisted workflow, built as one Claude artifact (`index.html`). Graded on domain understanding (10), agent quality (10), testing and limits (5), presentation (10).
**Deadline:** not given yet.
**Where we are:** Final build live at https://raig-five.vercel.app (deploy only from human-oversight-demo/). Round 3 test set (C1-C3, C7, C8, C10-C15; 6 PROCEED, 5 PAUSE) recorded with rulebook v2: right call 1 helped (C11), 10 same; briefing 2 helped, 8 same, 1 hurt. The site has been polished for presenting (hero, presenter menu, present mode P, arrow keys) and cut to short copy. Presenter-Guide.docx is a full end-to-end script with 11 screenshots. Next: demo test / rehearsal on 2026-10-09.
**Open questions:** Optional policy v0.4 to fix the rule-6 ambiguity. Rehearsal approach.

## Decision log
### 2026-10-08 - Telegram: one listener per browser, shared with all tabs
**Decided:** One tab per browser holds a Web Lock and reads Telegram (getUpdates with an offset). It broadcasts updates to all tabs over a BroadcastChannel, and the visible tab steals the lock. A tap is handled only by the tab that sent that case.
**Why:** Telegram allows one getUpdates reader at a time. Multiple tabs caused "Conflict: terminated by other getUpdates request" and lost taps. A rolling-window read (offset -100) was tried first and still conflicted.
**Consequence:** Any number of tabs in one browser works. Two different browsers or devices listening at once will still conflict; the next step would be a webhook plus a store.
### 2026-10-08 - Round 3 test set, presentation polish, short copy, deep guide
**Decided:** Removed C4, C5, C6, C9 (overlapping or trivial). Added C12-C15 ("looks risky, is fine") with answers fixed first. Re-recorded 99 runs on rulebook v2. Polished the UI for the projector and cut all copy to one-liners, per the user's attention-span instruction. Rebuilt the guide as a word-for-word script with screenshots.
**Why:** The user wanted more C11-style edge cases, a present-worthy site, "stupid simple" content, and a guide anyone could present from.
**Consequence:** The new edge cases all came out 3/3 in every arm, so C11 stays the only decision-level rulebook win. Honest framing: the rulebook matters when an exception is easy to miss. Future copy must stay short.
### 2026-10-08 - Sample case revised once, then frozen; v1 to v2 card on Results
**Decided:** "Verified change, scary email" was rewritten once with the missing facts (portal request, callback confirmed the exact account, second approval for the full contract) and labelled as revised. Re-run with rulebook v2: no rules 2/3, policy 0/3, rulebook 2/3. The case is now frozen; no more edits to chase a win. Results gained a "rulebook v1 to v2" card.
**Why:** The user chose "rewrite and re-test". The remaining misses come from our own policy's rule 6 (an account change after approval cancels it), which the policy-only arm read literally.
**Consequence:** Headline for class: testing found a flaw in the rulebook and in our own test case, and policy ambiguity caps what any rulebook can do. A policy v0.4 clarifying rule 6 would be the next fix if wanted.
### 2026-10-08 - Rulebook v2 built; the failing sample turned out to be an ambiguous test case
**Decided:** Rulebook v2 adds general exceptions to the pause rules: a verified bank change (callback to the number on file, by someone other than the requester and preparer, with a reference and an exact match), urgency alone, and amounts summed per obligation. The page's live rulebook is now v2. Results are in v2-runs.json.
**Why:** The user asked for v2 after v1 over-blocked "Verified change, scary email" 0/3.
**Consequence:** v2 still paused that sample 0/3. The AI's reasons showed the case text never states that the callback confirmed the details or who requested the change, and that its 3 milestones total INR 14.25L, a fair split-rule question. Lesson: our answer key was arguable, and the AI exposed missing evidence. Otherwise v2 matched v1 (C2 2/3 vs 3/3, likely noise; C9 briefing 100% vs 83%). Awaiting the user's call on how to fix the case.
### 2026-10-08 - Three harder Test-tab samples; rulebook over-blocks on one
**Decided:** The Test-tab samples were replaced with "Verified change, scary email" (PROCEED), "Clean-looking inside job" (PAUSE) and "Split with an email OK" (PAUSE). Each has a fixed right answer, a reason and briefing checks; stage 2 reveals the right answer after the AI answers. The 11-case results table stays as the full record (the user chose this over shrinking it, to avoid cherry-picking).
**Why:** The user wanted complex examples that show the rulebook matters.
**Consequence:** Live test, 3 runs per version: on sample 1, no rules 2/3, policy 1/3, policy+rulebook 0/3. The strong rulebook's "pause on bank change and urgency" overrides its verified-change exception. Proposed next step (awaiting the user): rulebook v2 with that exception wired into the pause rules, then re-run and show before/after (fits the rubric's testing and improvement marks). Presenter-Guide.docx was written for laymen.
### 2026-10-08 - Live case journey map; Telegram auto-listen
**Decided:** The Test tab has a 9-point live "case journey" beside the stages, built from simulation state (not log text). It is green/amber/red with reasons, and the first red point marks where the design failed. Telegram polling now starts automatically on send and at load if a phone is assigned.
**Why:** The user asked for a workflow map showing decisions, rejections and live reasons. Phone taps had been lost because listening switched off on page reload.
**Consequence:** The raw log is now secondary (folded). Only one tab may listen to Telegram; a second open tab would steal taps.
### 2026-10-08 - Test tab rebuilt as a four-stage story; plain-English copy
**Decided:** The Test tab now runs one case through Request arrives -> AI decides -> You check -> Outcome. The old A/B/C sections are merged into it, Jev shows as three labelled question bars, and the checker sees the AI's briefing. The whole site's copy was rewritten in plain English ("rulebook", "checker", "right call", "briefing"), and the Results tab has a legend.
**Why:** The user found the old tab unintuitive and couldn't read the Jev or results terms from the site alone.
**Consequence:** The stage bar doubles as a picture of the oversight process. The site's wording now differs from the SKILL.md file, which keeps technical terms because it is written for an AI.
### 2026-10-08 - Three arms, handoff scoring, five harder cases
**Decided:** The evaluation now has 3 arms (no policy / policy / policy+skill), code-scored handoff checks, and C7-C11 with expected answers written before running.
**Why:** The user found 6/6 ties pointless and chose "all of the above" over the narrower options.
**Consequence:** The honest headline: the skill stopped over-blocking a legitimate case (C11: 3/3 vs 0/3), mostly tied elsewhere, and scored worse on 2 handoffs. The added cases are labeled "added later" on screen.
### 2026-10-08 - Batch shows no skill effect; backup phone dropped
**Decided:** The 6/6 tie result is kept and shown as-is, and the backup reviewer phone is dropped from the demo.
**Why:** The batch ran 36 Haiku 5.5 calls; both arms got every case right, because both arms receive the explicit fictional policy and the cases follow it directly. The brief requires keeping ties. The user said a second phone is not necessary.
**Consequence:** The demo's honest claim becomes "with clear written policy, the skill adds little; the protection comes from code controls". The skill comparison only discriminates if harder, ambiguous cases are added. Escalation shows as "Held" unless a backup phone is assigned.
### 2026-10-08 - Haiku 5.5 instead of Sonnet 5.5
**Decided:** api/claude.js uses anthropic/claude-haiku-5.5 ($0.10/$0.50 per M on OpenRouter, versus $2/$10 for Sonnet).
**Why:** The user asked for a cheaper model. Claude noted that the absolute saving is cents, but that a weaker model may show the skill's effect more clearly.
**Consequence:** The recorded batch must run on the same model as the live demo, or the comparison mixes models. Switch back with one line if judgments degrade.
### 2026-10-08 - Claude via OpenRouter instead of the Anthropic API
**Decided:** `api/claude.js` calls `anthropic/claude-sonnet-5.5` through OpenRouter chat completions, using OPENROUTER_API_KEY. The Anthropic SDK dependency is removed.
**Why:** The user has no Anthropic key and chose OpenRouter over getting one or keeping Claude artifact-only.
**Consequence:** One key covers Claude and Jev. Anthropic's server-side refusal fallback is gone; a refusal now shows as an error. The model reported in run logs comes from OpenRouter's response.
### 2026-10-08 - Jev via OpenRouter Decisions API (correction)
**Decided:** Jev runs through OpenRouter's `POST /api/alpha/decisions` with model `typesafe/jev-1.13`, using OPENROUTER_API_KEY. A TYPESAFE_API_KEY, if one is ever added, takes priority automatically.
**Why:** The user pointed to `typesafe/jev-1.13`. My earlier claim that Jev "isn't on OpenRouter" was wrong: I searched the main model list, which hides decision models. Lesson: check the provider's own docs and the model's endpoint, not only the list. The request and response shape is identical to TypeSafe's native API, so these are real calibrated probabilities.
**Consequence:** No TypeSafe account is needed. Keys go into Vercel through `push-env.mjs`, which the user runs; Claude never handles the key values.
### 2026-10-08 - Telegram taps count only after evidence is opened
**Decided:** A phone Approve is accepted only if that reviewer tapped "Evidence" first, and only if the bench's code locks (verification) are satisfied. Escalation to the backup happens after 30 s, per the fallback dial.
**Why:** The user chose this over "phone approval is valid" and over "anti-pattern only". It shows the convenience of mobile approval and the rubber-stamp risk in the same moment.
**Consequence:** Verification still happens in the bench, never on the phone. With no database, the page holds all Telegram state, so only one presenter tab may listen.

### 2026-10-08 - Public API routes gated by a passcode
**Decided:** Every `/api` call needs an `x-demo-pass` header matching DEMO_PASSCODE. Routes fail closed if it is unset.
**Why:** Vercel URLs are public, and without a gate anyone could spend the Claude, Jev and Telegram keys.
**Consequence:** The presenter types the passcode once per browser.
### 2026-10-08 - Move to Vercel with live Claude + Jev, add Telegram bot and typed scenarios
**Decided:** The user overruled the recommendation to stay artifact-only. The demo gets hosted on Vercel, with keys held as Vercel environment variables. It adds a Telegram bot for reviewer routing and a free-text "invent a fraud scenario" input.
**Why:** The user wants Jev live rather than recorded, and wants more live interaction. Low API cost is expected (a few Sonnet calls; Jev output tokens are free).
**Rejected:** The artifact-only build (safer on stage, but no live Jev). Routing Jev through OpenRouter (not listed there, per the docs).
**Consequence:** More live failure points in class, so recorded fallbacks must stay on screen. The user enters keys in the Vercel dashboard and they never pass through chat. The same index.html should keep working as the claude.ai artifact.

### 2026-10-08 - Configuration drives the outcome, including failure
**Decided:** Loose dials let the fraudulent payment go through in the simulation. Tight dials block it.
**Why:** The user picked this over an "always block" demo. Visible failure makes the design choices matter, and it maps to the testing-and-limits marks.
**Consequence:** Every outcome card names the dial that decided it. The engine must stay generic across templates.

### 2026-10-08 - Interactive single flow instead of four separate tabs
**Decided:** One guided flow: intro, configure, run live, preloaded evidence, limits. This replaced a tab-per-feature tour.
**Why:** The user wanted live interaction, not a walkthrough of static content.
**Consequence:** The builder and the simulation share one dial state. The SKILL.md is generated from the dials.

### 2026-10-08 - Jev runs are recorded locally, never live in the page
**Decided:** `jev-run.mjs` calls Jev with the key read from env var `TYPESAFE_API_KEY`. Its output (`jev-results.json`) gets published next to the page and labeled "recorded".
**Why:** The artifact's security policy blocks all outbound fetch calls, and an artifact has no backend, so any key in the HTML is saved in every version. Jev is also not on OpenRouter and its API is not OpenAI-compatible (per docs.typesafe.ai, checked 2026-10-07).
**Consequence:** No live Jev in class. Jev covers only three narrow yes/no probabilities per eval case.

### 2026-10-08 - Both A/B arms get the same policy; only the skill differs
**Decided:** With and without skill both receive identical facts, the fictional policy, and model tier "default". The skill arm adds SKILL.md.
**Why:** This matches the brief's identical-conditions requirement. It isolates method from context.
**Consequence:** The skill effect may be small (ties are likely). Two of the six cases expect PROCEED, so over-blocking shows up as "worse". The model can't be pinned beyond tier, and the page says so on screen.

### 2026-10-08 - Added genuine-change scenario
**Decided:** A "the change is genuine" switch was added to the simulation.
**Why:** Without it, Approve could never unlock in the tight design, so the "approval voids on change" control could not be shown. It also shows over-control as a cost ("Over-blocked").
**Consequence:** There are four outcome stamps: Paid out, Blocked, Held, plus Released / Lucky / Over-blocked.
