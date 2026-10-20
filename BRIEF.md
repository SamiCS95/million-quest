# Million Quest — project brief (read this first)

Live site: https://million-quest.vercel.app
Repo: SamiCS95/million-quest (static site, no build step). Vercel project `million-quest`
(team `team_vXfmVw22Z3fCiLBPvonzi5fa`, project `prj_3Zsruc6KfbBYbRnNz2qQbNoDEfec`) auto-deploys every push to `main`.
Owner: Sami (talks in English or French; wants simple numbered steps, French terms in parentheses, blunt honesty).

## Files
- `index.html`, `style.css`, `app.js` — the whole app (vanilla JS).
- `data/questions.js` — `window.QUESTIONS`, one line per question:
  `[tier, "EN question", ["EN correct","EN wrong","EN wrong","EN wrong"], "FR question", ["FR correct",...], "cat"],`
  - Correct answer ALWAYS first (the game shuffles). 4 distinct answers per language.
  - tier: 1 easy, 2 medium, 3 hard, 4 expert. Difficulty plans in app.js (`PLAN`): normal 1→3, hard 2→4, expert 3→4.
  - cat: g geography, h history, s science, a arts & books, p sport & board games, c everyday life,
    m anime & manga, v video games, f films & series, u music, n animals & nature, z fun & random.
- `data/facts.js` — `window.FACTS = { "EN question text": ["EN fun fact", "FR fun fact"], ... }`.
  EVERY question needs a fact (shown after a wrong answer / time-out / walk-away).
- `data/countries.js` + `flags/*.svg` — 195 countries for the "Culture G" tab (flag/capital games + trainer).

## State (2026-10-20, after Open Trivia DB batch 1)
2,258 questions, all with facts. Counts: v 355, m 298, f 255, u 209, s 187, g 184, h 160, a 137, c 136, z 127, p 123, n 87.
Batch 1 from Open Trivia DB (407 added): anime 57, video games 176, films 64 + TV 36 (both "f"), music 74 (+1 Vocaloid in "u"); tiers 187 tier-3, 220 tier-4.
Credit "Some questions from Open Trivia DB (opentdb.com), CC BY-SA 4.0" is in the footer (index.html + app.js i18n, EN and FR).
Sami loves anime, video games (LoL, Rematch, Rocket League, Dofus) and finds easy questions boring.
Thin spots: n (animals) 87, p (sport) 123, c (everyday) 136, z 127. Entertainment is now very heavy vs the rest.
Facts were written from memory, not checked one by one against sources.

## Online fact-check of OpenTDB batch 1 (in progress, 2026-10-20)
- Index of the 407 questions: `notes/otdb-batch1-index.txt` (line N = item N-1). Log with sources: `notes/factcheck-otdb-batch1.md`.
- DONE (searched + read a source): anime 0–57, video games 58–190 and 291–301. Fixed ~35 items (facts/questions/answers).
- LEFT TO CHECK ONLINE: video games 302–333, films 191–254, TV 255–290, music 334–406.
- Tool limit: ~200 web searches per reply, so continue in a new message. Constructed Wikipedia URLs get blocked:
  always WebSearch first, then WebFetch a URL from the results (redirect targets are blocked too).

## How to add questions (process)
1. `git pull`. Write batches of ~100 in scratch files as 8-field lines: the 6 question fields + "EN fact" + "FR fact".
2. Stable, well-established facts only; no time-sensitive or disputed answers; no distractor that could also be right.
3. Validate with node: 4 distinct answers per language, valid tier/cat, fact present, NO duplicate question text vs existing
   (normalise to lowercase letters/digits). Also review questions whose correct answer matches an existing one.
4. Append questions before the final `];` of questions.js and facts before the final `};` of facts.js.
5. Test with Playwright (Chromium preinstalled; serve folder with `python3 -m http.server`): play full games per category, no page errors.
6. Commit (author "Sami Chafi <csami95@gmail.com>") and push; check Vercel deployment reaches READY.
7. Report: how many added, new total, per-category counts, thin spots.

## Next: Open Trivia DB batch 2
- Batch 1 (2026-10-20) used categories 31 anime, 15 video games, 11 film, 14 TV, 12 music (medium+hard). Those are mostly
  exhausted: what's left there is niche/US-centric/time-sensitive and was skipped on purpose.
- Next priority: 27 animals (n), 21 sport (p), then 9 general knowledge, 17 science, 22 geography, 23 history, 10 books, 18 computers.
- OpenTDB API quirk: with a session token, once fewer than 50 questions are left the API returns code 4 (not 1) —
  retry with amount=20, 5, 1 to drain the rest. Max 1 request per 5 s. Use `encode=url3986` and URL-decode (no HTML entities).
  The shell can reach opentdb.com but connections are flaky (resets) → retry.
- Keep: multiple choice, medium/hard, not US-centric, not time-sensitive, no duplicate (normalised text AND same fact).
  Watch for: answers that went stale (e.g. "which isn't an Ed Sheeran album" — he released "-" in 2023), myths (Gandhi nuke bug),
  lyric-based questions (skip: no lyrics), facts that give away the answer of an existing question.
- The game code is inside an IIFE: in Playwright, read the question text from the DOM and look it up in window.QUESTIONS;
  the correct answer button is `#answers .ans[data-ai="0"]`.
- ~400 per chat, then validate, play-test, push, check Vercel READY, update counts here.
