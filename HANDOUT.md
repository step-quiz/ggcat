# GeoCat — Handout for a cold-start Claude session

> Written 2026-11-11 at the end of a long session. Audience: a Claude instance that picks the project up with no memory of that session. Talk to the owner (David) in **Catalan**; write MD files for AI readers in English.

## 1. What this is

GeoCat (`step-quiz/ggcat`) is a static course (HTML + CSS + JS, no build, no server) that teaches GeoGebra in Catalan to secondary students: 10 guided chapters and a grid of challenges, each validated by a «Comprova» button against the live GeoGebra applet (loaded from `www.geogebra.org`). Published by Cloudflare Pages on every commit to `main`.

Read, in this order: `CLAUDE.md` (rules), `TODO.md` (plan and state — the authority on *what is next*), `REPTES_SPECIFICATION.md` (the 30 challenges — the authority on *what each one is*), `tools/README.md` (page generator), `README.md`.

## 2. State (2026-11-11)

| Item | State |
|---|---|
| Chapters `curs/capitol-1…10.html` | 10/10, hand-written HTML, each with a validated exercise `cap-N-ex` |
| Challenges | **11/30** live: the ten A cells + 5B. Grid = 10 themes × 3 levels (A/B/C); id `3b` → `curs/repte-3b.html`, goalId `repte-3b` |
| Blocks of `TODO.md` | 0, A, B done. **Next: block C** (the nine B cells: 1b 2b 3b 4b 6b 7b 8b 9b 10b), then D (ten C cells). E (debts) and F (CDN-down banner) are open |
| Tests | `--comprova` 11 pages · `test-validators.js` 81/81 · `test-debug-tester-logic.js` 105/105 · end-to-end on the real applet 21/21 |

Pull requests of that session: #1 input bar, #2 validators (real object types), #3 grid ids + 11 cells — merged. **#4** (Catalan command names in chapters and glossary + this file): check whether it is merged; if `main` does not contain `HANDOUT.md`, it is not.

## 3. How the owner wants to work

- You open the pull request yourself (branch given by the session, never push to `main`); the owner merges. Do **not** watch the PR afterwards. If the previous PR of your branch is merged, restart the branch from `origin/main` before new work.
- Give the owner numbered steps in Catalan for anything they must do. Questions to the owner: multiple-choice dialog, not prose.
- Never put `[skip ci]`, `[ci skip]` or `[cf-pages-skip]` in a commit message.
- `LICENSE`, `LLICENCIA.md`, `curs/progress.js` are shared files overwritten daily: do not edit them here.
- Update the docs (`TODO.md`, spec, READMEs) in the same PR as the code. Run the tests and report the numbers.

## 4. Hard-won facts about the GeoGebra applet

All verified on the live applet; details in spec sections 6 and 7.

- **Object types are specific**: a circle is `circle` (not `conic`); `Polygon(A,B,C)` is `triangle`, then `quadrilateral`, `pentagon`, `hexagon`; only the rest and regular `Polygon(A,B,n)` are `polygon`. Use `GV.names('polygon' | 'conic')`, never `getAllObjectNames('polygon' | 'conic')`.
- **`IsOnPath` does not exist**, and `getValue()` of anything the applet cannot parse returns **0**, not NaN. Use `GV.pointOnLine` (a `Distance`).
- **Angles are oriented**: clicked clockwise they measure 360° − α. Use `GV.angleIs`.
- `evalCommand` takes **English** command names; the student types **Catalan** ones in the input bar. Catalan names are *not* guessable: `Polígon` (also regular), `PuntMitjà`, `PuntLliscant`, `Circumferència`, `Semirecta`, `Simetria`, `LlocGeomètric`, `Recta(P,f)` for the parallel… The tables are in spec section 6. To learn a name: create the object with the English command and call `api.getCommandString(label, true)`.
- Creating a polygon auto-labels its sides `a`, `b`, `c`…: an example that later assigns `a=…` or `c=…` fails or destroys the polygon.
- In the `graphing` app the input is a formula editor (after an exponent the cursor stays in it until →), and the tools are in the «Eines» tab. Applets with a `goalId` and `data-app="graphing"` keep that left panel; all others show only the graphics view plus an input bar at the bottom.
- `test-validators.js` runs validators against a **mock**; it only proves logic. The mock rejects scenes with a type GeoGebra does not use. The real proof is the browser.

## 5. Browser testing from the sandbox

The cloud environment «ggcat» allows `www.geogebra.org`. Chromium + Playwright are pre-installed (`require('playwright')`; launch with `proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }`).

1. `python3 -m http.server 8765` at the repository root.
2. End-to-end tester: open `http://localhost:8765/curs/index.html?debug=1`, click `#dbg-all`, wait until `#dbg-summary` loses the class `dbg-summary-running` (≈3 min), read its text.
3. Each applet lives in a `.geogebra-wrap`; its API is `wrapper._ggbApi`. Wait until every wrapper has it.
4. To act like a student in `classic`: click the `input` inside the wrapper, `keyboard.type(...)`, Enter, then click «Comprova» and read `.ggb-badge`. **Do this for every new hint**: five of the first eleven hints were wrong.
5. Simulated typing of accented letters does not work in the `graphing` formula editor (the accent is dropped); it works in `classic`.

## 6. Recipe for one new cell (block C)

Spec section 10 is the checklist. In short: write `tools/pages/repte-<id>.json` from the cell's fields → `node tools/generate-pages.js` → validator in `curs/validators.js` → entry in `REPTES_DATA` (`curs/capitols.js`, grid order) → fix `prev`/`next` in the JSON of both neighbours and regenerate → scenes in `test-validators.js` (`CORRECT_SOLUTIONS`, `WRONG_SOLUTIONS`, `INITIAL`) → `TEST_SOLUTIONS` in `curs/debug-tester.js` → Node tests → browser (tester + typed hint) → counters (`index.html` stat `11/30`, grid table in `TODO.md`, `README.md`, the ✅ marks and **Status** lines in the spec).

The reference validators and test solutions of the 19 unbuilt cells were only run against a throw-away emulator: expect some to fail on the real applet, fix the validator, keep the pass condition, update the spec.

## 7. Open items worth knowing

- 5B: vertex C = (2, 5) is outside the initial view (inherited).
- 9A: `Intersecció(f, EixX)` could not be typed with a simulated keyboard in `graphing`; the hint offers `Arrel(f)`. The owner was asked to try the accented name once by hand.
- The generator (`tools/generate-pages.js`) is shared with the sibling courses PyCat and JSCat; GeoCat's copy is ahead (grid ids, `tools`) and still accepts numeric `num`.
- Chapter prose was only audited for command names, not for content.
