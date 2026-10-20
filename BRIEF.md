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

## State (2026-10-20)
1,851 questions, all with facts. Counts: m 241, s 187, g 184, v 179, h 160, f 155, a 137, c 136, u 135, z 127, p 123, n 87.
Tiers after the 2026-10-20 batch of 500: new questions were 8 tier-2, 278 tier-3, 214 tier-4.
Sami loves anime, video games (LoL, Rematch, Rocket League, Dofus) and finds easy questions boring.
Thin spots: n (animals) 87, p (sport) 123, c (everyday) 136 got few or no new questions. Facts were written from memory, not checked one by one against sources.

## How to add questions (process)
1. `git pull`. Write batches of ~100 in scratch files as 8-field lines: the 6 question fields + "EN fact" + "FR fact".
2. Stable, well-established facts only; no time-sensitive or disputed answers; no distractor that could also be right.
3. Validate with node: 4 distinct answers per language, valid tier/cat, fact present, NO duplicate question text vs existing
   (normalise to lowercase letters/digits). Also review questions whose correct answer matches an existing one.
4. Append questions before the final `];` of questions.js and facts before the final `};` of facts.js.
5. Test with Playwright (Chromium preinstalled; serve folder with `python3 -m http.server`): play full games per category, no page errors.
6. Commit (author "Sami Chafi <csami95@gmail.com>") and push; check Vercel deployment reaches READY.
7. Report: how many added, new total, per-category counts, thin spots.
