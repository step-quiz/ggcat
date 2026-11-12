# Ggcat — Handout for a cold-start Claude session

> Written 2026-11-11 at the end of a long session; updated after blocks C (2026-11-11), D, E and F (2026-11-12). Audience: a Claude instance that picks the project up with no memory of that session. Talk to the owner (David) in **Catalan**; write MD files for AI readers in English.

## 1. What this is

The site was renamed **GeoCat → Ggcat** on 2026-11-12. The `localStorage` keys keep the `geocat` prefix on purpose (renaming them would wipe students' progress); the repository is `step-quiz/ggcat`.

Ggcat (`step-quiz/ggcat`) is a static course (HTML + CSS + JS, no build, no server) that teaches GeoGebra in Catalan to secondary students: 10 guided chapters and a grid of challenges, each validated by a «Comprova» button against the live GeoGebra applet (loaded from `www.geogebra.org`). Published by Cloudflare Pages on every commit to `main`.

Read, in this order: `CLAUDE.md` (rules), `TODO.md` (plan and state — the authority on *what is next*), `REPTES_SPECIFICATION.md` (the 30 challenges — the authority on *what each one is*), `tools/README.md` (page generator), `README.md`.

## 2. State (2026-11-12)

| Item | State |
|---|---|
| Chapters `curs/capitol-1…10.html` | 10/10, hand-written HTML, each with a validated exercise `cap-N-ex` |
| Challenges | **30/30** live: the grid is complete. Grid = 10 themes × 3 levels (A/B/C); id `3b` → `curs/repte-3b.html`, goalId `repte-3b` |
| Blocks of `TODO.md` | All done (0, A–L; G–J = UI/UX rounds, K = glossary examples, L = authorship footer). One open item: the virtual keyboard on phones (`TODO.md` section 5) | Nothing planned; `TODO.md` section 5 lists what was never checked |
| Tests | `--comprova` 30 pages · `test-validators.js` 161/161 · `test-debug-tester-logic.js` 200/200 · end-to-end on the real applet 40/40 · 30/30 hints typed |

Pull requests: #1 input bar, #2 validators (real object types), #3 grid ids + 11 cells, #4 Catalan command names in chapters and glossary — merged. #5 blocks C and D (all 19 new cells) — merged. #6 blocks E (`data-view`) and F (notice when GeoGebra is unreachable) — merged. #7 Cloudflare incident note (section 7) — merged; merging it redeployed the site. #8 block G (UI/UX, first round) — merged. #9 block H (second UI round) — merged. #10 block I (zones, applet labels, type scale) — merged. #11 block J — merged. #12 holds blocks K (a worked, editable example for every glossary word) and L (authorship and licence footer, `footer.js`, a hand-kept copy of the commons one).

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

The cloud environment «ggcat» allows `www.geogebra.org`. Chromium + Playwright are pre-installed (`require('playwright')`; launch with `proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }`). A session may start on the «Default» environment, which blocks that host: move it to «ggcat» (`switch_environment`) before browser tests.

1. `python3 -m http.server 8765` at the repository root.
2. End-to-end tester: open `http://localhost:8765/curs/index.html?debug=1`, click `#dbg-all`, wait until `#dbg-summary` loses the class `dbg-summary-running` (≈3 min), read its text.
3. Each applet lives in a `.geogebra-wrap`; its API is `wrapper._ggbApi`. Wait until every wrapper has it.
4. To act like a student in `classic`: click the `input` inside the wrapper, `keyboard.type(...)`, Enter, then click «Comprova» and read `.ggb-badge`. **Do this for every new hint**: five of the first eleven hints were wrong.
5. In the `graphing` app the input row is `.avInputItem` (click it; there is no `input` element). Playwright's `keyboard.type` drops accented letters there (it works in `classic`); send each non-ASCII character as a CDP key event instead: `cdp = await page.context().newCDPSession(page)`, then `cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ó', text: 'ó' })` and the matching `keyUp`. With that, `Intersecció(f,g)` is accepted: accented names work for students.

## 6. Recipe for one new cell (used for blocks C and D)

The grid is complete, but the recipe applies if a cell is ever replaced. Spec section 10 is the checklist. In short: write `tools/pages/repte-<id>.json` from the cell's fields → `node tools/generate-pages.js` → validator in `curs/validators.js` → entry in `REPTES_DATA` (`curs/capitols.js`, grid order) → fix `prev`/`next` in the JSON of both neighbours and regenerate → scenes in `test-validators.js` (`CORRECT_SOLUTIONS`, `WRONG_SOLUTIONS`, `INITIAL`) → `TEST_SOLUTIONS` in `curs/debug-tester.js` → Node tests → browser (tester + typed hint) → counters (`index.html` stat, grid table in `TODO.md`, `README.md`, the ✅ marks and **Status** lines in the spec).

Of the 19 cells built from the spec, 18 reference validators passed the real applet unchanged; 9C had to move from `graphing` to `classic` because the `graphing` app rejects `Tangent` and `Angle`. A new validator is proven only by the browser. Give the hint the input-bar commands too, naming objects the next command refers to (`m=Bisectriu(…)`, `P=Intersecció(p, k, 1)`): a line/circle intersection has two points, so use the index form.

## 7. Open items worth knowing

- **Cloudflare Pages deployment can stop silently.** From 2026-11-10 21:07 to 2026-11-12 the Pages project `ggcat` was disconnected from GitHub (dashboard banner «This project is disconnected from your Git account»): `ggcat.step-quiz.net` and `ggcat.pages.dev` kept serving the build of PR #2 while `main` moved on through PR #6. GitHub Pages (`step-quiz.github.io/ggcat`) is a separate host and stayed current, which hid the problem. The owner reconnected the project on 2026-11-12. How to spot it: every commit on `main` and every PR head should carry a check run named «Cloudflare Pages» (MCP `pull_request_read`, method `get_check_runs`); if only `tests` is there, Cloudflare is not receiving pushes. `step-quiz` is a personal GitHub account, not an organization: its GitHub Apps are at `https://github.com/settings/installations` (signed in as `step-quiz`). A new deployment needs a new commit on `main`; «Retry deployment» rebuilds the old commit.
- Initial view: GeoGebra's default shows only y ∈ [−3.9, 3.9]. Give a new applet a `view` (JSON) / `data-view` (hand-written HTML) whenever its construction or its solution leaves that box; `TODO.md` block E has the probe.
- The `classic` applet grabs the focus at load (input bar) and the page scrolls to it; `preventFocus` does not help. `_evitaFocusInicial()` in `curs/capitols.js` undoes it until the student's first interaction. Keep it when touching the injection code.
- `evalCommand` only takes English command names; the input bar takes Catalan ones. The glossary examples translate with `GLOSSARI_ORDRES` (`curs/glossari-exemples.js`).
- Page zones and applet labels are built at load by `_organitzaZones()` and `_etiquetaApplet()` in `curs/capitols.js`; the HTML keeps plain `<section>`s. Font sizes: only the six `--fs-*` variables (spec section 5).
- GeoGebra unreachable: `_mostraErrorGeoGebra()` in `curs/capitols.js` (block F). Test it with Playwright's `page.route(/geogebra\.org/, r => r.abort())`.
- `graphing` rejects some geometry commands (`Tangent`, `Angle` with lines); prefer `classic` for any cell that needs them.
- 9A: settled. `Intersecció(f, EixX)` typed with CDP key events gives ✓; the hint's `Arrel(f)` also works.
- The generator (`tools/generate-pages.js`) is shared with the sibling courses PyCat and JSCat; Ggcat's copy is ahead (grid ids, `tools`, `view`) and still accepts numeric `num`.
- Chapter prose was only audited for command names, not for content.
