# GeoCat — TODO

> **Audience:** an AI assistant that continues the development of GeoCat from a cold start.
> Read this file completely before touching anything. Talk to the owner in Catalan (see `CLAUDE.md`).

Companion documents:

- `CLAUDE.md` — working rules of the repository (delivery by ZIP to `_uploads/`, commit rules, tests).
- `REPTES_SPECIFICATION.md` — **what** each challenge is (the 10 × 3 grid). Referred to below as *the spec*.
- `tools/README.md` — the page generator.

This file says **what to do next and in which order**.

---

## 1. Invariants

Never break these:

- **Zero install.** Static HTML, CSS and JavaScript; no build step, no server. A page works by opening it in a browser with an internet connection (GeoGebra is loaded from `geogebra.org`; there is no offline mode and no Service Worker).
- **Catalan** for every text the student sees.
- **Local progress only**: `localStorage['geocat_progress']`. No accounts, no server, no student data in the repository.
- **Automatic feedback** ✓ / ✗ through the «Comprova» button.
- **Validators live only in `curs/validators.js`** (map `VALIDATORS`, keyed by `goalId`). Never inline in HTML or JSON.
- **Shared files are read-only here**: `LICENSE`, `LLICENCIA.md` and `curs/progress.js` come from `step-quiz-commons` and are overwritten daily.
- Free practice happens in the student's own GeoGebra; the project does not embed a free-play applet.

---

## 2. Plan of record

Decided by the owner on 2026-11-10. These decisions are closed; do not reopen them without being asked.

| Topic | Decision |
|---|---|
| Structure of the challenges | A grid of **10 themes × 3 levels** (A Fàcil, B Mitjà, C Difícil) = 30 challenges. The flat list "challenges 1–30, 10 + 10 + 10" is abandoned. |
| Meaning of A / B / C | Difficulty inside a theme. **Not** tied to age or school-year bands. |
| Identifier | Theme + level letter: page `curs/repte-3b.html`, `goalId` `repte-3b`, label «Repte 3B». |
| Published challenges with no cell in the grid | **Retired.** Six pages disappear: `repte-1`, `-2`, `-4`, `-6`, `-7`, `-10`. |
| Published challenges that have a cell | Renamed, content unchanged: `repte-3` → `3a`, `repte-5` → `2a`, `repte-8` → `7a`, `repte-9` → `5b`. |
| Navigation order | By theme: 1A → 1B → 1C → 2A → … → 10C. |
| Source of truth | `REPTES_SPECIFICATION.md`. `GeoCat-30Reptes.docx` is an obsolete draft kept for reference. |

---

## 3. State of the code

As of the last commit (2026-10-19). **None of the grid work has started**; the site still runs the legacy numbering.

| Area | State |
|---|---|
| Infrastructure (`curs/capitols.js`, `geovalidator.js`, `validators.js`, `glossari-data.js`, `curs.css`, `style.css`) | ✅ complete for the legacy numbering |
| Landing page (`index.html`) | ✅; the stat reads `10/30` |
| Chapters `curs/capitol-1.html` … `capitol-10.html` | ✅ 10/10, each with a validated exercise (`cap-N-ex`) |
| Challenges | 10 legacy pages `curs/repte-1.html` … `repte-10.html` are live. Grid cells under their final id: **0/30**. |
| Generator (`tools/generate-pages.js`) | Works with numeric ids only. Only `repte-1` and `repte-6` have a JSON source in `tools/pages/`. Chapter pages are hand-written HTML. |
| Tool palettes | `capitols.js` reads `data-tools` → `customToolBar`; no page uses it and the generator does not emit it. |

Test results on 2026-11-10, on the unmodified code:

| Command | Result |
|---|---|
| `node tools/generate-pages.js --comprova` | 2 pages checked, both match |
| `node test-validators.js` | 31/31 |
| `node test-debug-tester-logic.js` | 100/100 |
| `node --check` on every `.js` | all pass |
| End-to-end (`curs/index.html?debug=1`, real GeoGebra in a browser) | **not run** — status unknown |

### Grid status

🔁 = live under a legacy name, to be renamed · ⬜ = to build · ✅ = live under its final id

| Theme | A | B | C |
|---|---|---|---|
| 1 El triangle | ⬜ 1a | ⬜ 1b | ⬜ 1c |
| 2 El quadrat | 🔁 2a (`repte-5`) | ⬜ 2b | ⬜ 2c |
| 3 La circumferència | 🔁 3a (`repte-3`) | ⬜ 3b | ⬜ 3c |
| 4 Polígons regulars | ⬜ 4a | ⬜ 4b | ⬜ 4c |
| 5 Mediatriu i circumcentre | ⬜ 5a | 🔁 5b (`repte-9`) | ⬜ 5c |
| 6 Bisectriu i incentre | ⬜ 6a | ⬜ 6b | ⬜ 6c |
| 7 Perpendiculars i paral·leles | 🔁 7a (`repte-8`) | ⬜ 7b | ⬜ 7c |
| 8 Transformacions | ⬜ 8a | ⬜ 8b | ⬜ 8c |
| 9 Funcions i corbes | ⬜ 9a | ⬜ 9b | ⬜ 9c |
| 10 Lliscadors i lloc geomètric | ⬜ 10a | ⬜ 10b | ⬜ 10c |

Totals: 4 🔁, 26 ⬜, 0 ✅. Keep this table up to date as cells land.

---

## 4. Work blocks

Order: **0 → A + B together → C → D**. Blocks E and F can be done at any time.

The ordering guarantees that the live site never offers fewer challenges than today (10): the legacy pages stay until the first grid release (block B) replaces them with 11 cells.

### Block 0 — Browser checks that gate the design

These need a browser with internet access and the real GeoGebra applet. If you cannot run a browser, ask the owner to do them, with numbered steps in Catalan, and record the answers here.

- [ ] **0.1 Is the input bar available to the student?** `curs/capitols.js` creates every applet with `showAlgebraInput: false` and then calls `api.setPerspective('G')`. Yet chapter 1 tells the student to type in «la barra d'entrada (la caixa de text a la part inferior de l'applet)», and the exercises of chapters 1 and 9 can only be solved by typing. Open `curs/capitol-1.html` and `curs/capitol-9.html` (the latter uses the `graphing` app) and look.
  - If the bar **is** there: nothing to do; note it here.
  - If it is **not**: this is a live bug in the published course, independent of the grid. Fix it first (most likely `showAlgebraInput: true`), because cells 9A, 9B and 9C also require typing.
- [ ] **0.2 Does `customToolBar` work?** Temporarily add `data-tools="0 | 1 | 51"` to one challenge page and check that the toolbar is reduced to those tools: once in a classic applet, once in a `graphing` applet (theme 9). If `graphing` ignores it, drop `data-tools` from 9A–9C in the spec.
- [ ] **0.3 Baseline of the end-to-end tester.** Open `curs/index.html?debug=1` and run all 20 current exercises. Record which are green. The spec (section 7.4) classifies API usages as "used by published validators"; this run is what turns that into evidence.

### Block A — Infrastructure for grid ids

Do not release block A alone: it changes ids that the legacy pages depend on. Ship it together with block B.

Spec sections 4 and 5 define the target. File by file:

- [ ] **`curs/capitols.js`**
  - Add `TEMES_DATA`; replace `REPTES_DATA` with the new shape (`id`, `tema`, `nivell`, `titol`, `arxiu`, `goalId`, `dificultat`; no `num`). Export `window.TEMES_DATA`.
  - `renderReptesSidebar(currentId)`: takes the cell id (string) and groups entries by theme (spec 4.3).
  - One-time progress migration of the four legacy keys (spec 4.4). It goes here, not in `progress.js`.
- [ ] **`curs/geovalidator.js`** — add the `GV` extension of spec 7.3.
- [ ] **`tools/generate-pages.js`**
  - Accept `"id": "3b"` for `type: "repte"` (chapters keep `num`). Affected: `validatePage` (line ~378 requires a numeric `num`), `outputFilename` (~370), the badge and labels that print `page.num` (~185–188, ~251, ~277), the header title (~62), the sidebar call (~42: it must print `renderReptesSidebar('3b')`, quoted) and `--only` (~419).
  - The label shown is the id with the level in upper case: `Repte 3B`.
  - Add `tools` to `atributsSimulador` so that `simulador.tools` becomes `data-tools`.
  - The «Reptes» header link is hard-coded as `repte-1.html` in two templates (~60, ~260): change to `repte-1a.html`.
  - This generator is also used, with a different `PROJECTE` block, by the sibling courses PyCat and JSCat. Keep numeric `num` working so the change can be copied there unchanged, and tell the owner that the generator now differs from the siblings' copy.
- [ ] **`tools/extreu-pagina.js`** — the badge regex `⚡ Repte (\d+)` and `pagina.num = Number(…)` (~66) must read `3B` and produce `id: "3b"`; add `tools` to the known applet attributes.
- [ ] **`curs/index.html`** — the challenge list uses `r.num` (~85). Replace the flat list of challenges with the theme × level table of spec 4.3. Header link `repte-1.html` (~19) → `repte-1a.html`.
- [ ] **`curs/debug-tester.js`** — labels built from `r.num` (~609, ~668–670) → `r.id`. `TEST_SOLUTIONS` keys follow the goalIds.
- [ ] **`test-validators.js`** — the main loop is `for (n = 1..10) id = 'repte-' + n` (~459): iterate over the keys of `CORRECT_SOLUTIONS` instead. Extend the mock API for what the new validators use: the numeric value of a polygon (its area), `Distance((x,y),line)`, `setValue` on a slider with dependent objects, `getObjectType` for loci, `isMoveable`.
- [ ] **`test-debug-tester-logic.js`** — only the header comment mentions "10 reptes"; the checks iterate `REPTES_DATA` and need no change.
- [ ] **Hard-coded links to `repte-1.html`** → `repte-1a.html`: the header of each `curs/capitol-N.html` (10 files, one link each), the closing paragraph of `curs/capitol-10.html` (a second link), and the landing page `index.html` (`curs/repte-1.html`, ~173). These pages are hand-written HTML: edit them directly.
- [ ] **`.github/workflows/`** — nothing to change (`tests.yml` runs the same three commands). Remember that workflow files cannot be changed through a ZIP.

### Block B — First grid release: the ten A cells + 5B (11 cells)

- [ ] **Rename the four published cells** and give them their palette (`data-tools`). Text, initial construction and validator body stay exactly as they are (the spec reproduces them):

  | Legacy | New | `data-tools` |
  |---|---|---|
  | `repte-5` | `repte-2a` | `0 \| 1 \| 51` |
  | `repte-3` | `repte-3a` | `0 \| 1 \| 34 10` |
  | `repte-8` | `repte-7a` | `0 \| 1 5 \| 2 \| 4` |
  | `repte-9` | `repte-5b` | `0 \| 1 19 5 \| 15 \| 8 \| 10 34` |

  For each: new JSON in `tools/pages/`, generated page, `VALIDATORS` key, `REPTES_DATA` entry, keys in `test-validators.js` (`CORRECT_SOLUTIONS`, `WRONG_SOLUTIONS`) and in `debug-tester.js` (`TEST_SOLUTIONS`). `repte-8` changes level from Mitjà to Fàcil (badge and `dificultat`).
- [ ] **Build the seven missing A cells**: `1a`, `4a`, `5a`, `6a`, `8a`, `9a`, `10a`. Follow the per-cell checklist of spec section 10. `9a` depends on check 0.1 and `10a` on the `setValue` row of spec 7.4.
- [ ] **Remove the legacy challenges from the code**: the six retired validators (`repte-1`, `-2`, `-4`, `-6`, `-7`, `-10`) and their scenes in `test-validators.js` and `debug-tester.js`.
- [ ] **Delete the legacy files.** A ZIP uploaded to `_uploads/` can add and overwrite files but **cannot delete** them, so the owner has to do it. Give the owner these steps (in Catalan, explaining each one), to be run in a Codespace terminal **right after** the release ZIP has been processed by the «Extract and commit zip uploads» action:

  ```bash
  git pull
  git rm curs/repte-1.html curs/repte-2.html curs/repte-3.html curs/repte-4.html curs/repte-5.html \
         curs/repte-6.html curs/repte-7.html curs/repte-8.html curs/repte-9.html curs/repte-10.html \
         tools/pages/repte-1.json tools/pages/repte-6.json
  git commit -m "Retira els reptes de la numeració antiga (1-10)"
  git push
  ```

  Between the ZIP and this push the «Tests» action will be red: `--comprova` still finds the two legacy JSON files, whose pages no longer match the new generator. That is expected and ends with the push. The commit message must not contain any skip-CI tag.
- [ ] **Counters and docs**: landing stat `10/30` → `11/30`; grid status table above; `README.md` (structure list and «Estat del projecte»); `tools/README.md` (JSON format: `id`, `tools`; example pages).
- [ ] **Owner check in the browser**: `curs/index.html?debug=1` green for the 11 cells; progress of a browser that had completed `repte-3`, `-5`, `-8` or `-9` shows ✓ on the renamed cells.

### Block C — The nine remaining B cells (→ 20/30)

`1b`, `2b`, `3b`, `4b`, `6b`, `7b`, `8b`, `9b`, `10b`. Per-cell checklist: spec section 10. Each added cell changes the previous/next links of its neighbours.

Cells with an unverified API dependency: `7b` (`Distance` with a literal point), `10b` (object type of a locus).

### Block D — The ten C cells (→ 30/30)

`1c`, `2c`, `3c`, `4c`, `5c`, `6c`, `7c`, `8c`, `9c`, `10c`.

Unverified API dependency: `10c` (object type of a locus). When the last cell lands, the landing stat becomes `30`.

### Block E — Verification debts

- [ ] Confirm or refute each **unverified** row of spec 7.4 with the end-to-end tester, and update the spec. If `setValue` is unreliable, downgrade `10a` to the static test and say so in the spec.
- [ ] `getValue(polygonLabel)` as area is documented API behaviour but no current test isolates it (the correct solution of legacy `repte-4` also creates `Area(t)` explicitly). Nine cells depend on it; confirm it with the first one implemented (`8a`).
- [ ] **Catalan names in hints.** Hints name tools between «» following the Word draft, and commands as in the previous spec (`PolígonRegular`, `Mediatriu`, `Bisectriu`, `PuntMig`, `Translació`, `Intersecció`, `Lliscador`, `Circumferència`). Check them against the Catalan GeoGebra interface when each page is first opened; fix the hint text in the spec and the JSON together.
- [ ] Known limits of the validators, accepted as they are: "measure it" steps cannot be enforced (`1b`, `8b`: the polygon already carries its sides and its area); `7a` only requires *some* second line plus the foot point.

### Block F — Robustness when the GeoGebra CDN is down

The course pages load `https://www.geogebra.org/apps/deployggb.js` synchronously in `<head>`. If the CDN does not answer, the widgets stay on «carregant…» forever with no message.

- [ ] At the end of `renderSimuladors()`, test `typeof GGBApplet === 'undefined'` and show an error banner in each wrapper instead of the perpetual «carregant…».

---

## 5. Notes for the assistant

- **Tolerances** are in spec 7.2. In short: 0.15 for coordinates and lengths, 0.2 for images and irrational centres, 0.3 for areas, 1.5° for angles; `GV.eps` (0.001) is too strict for student constructions.
- **Never test labels chosen by the student**: iterate with `getAllObjectNames(type)`. Labels of pre-built objects can be used and excluded.
- **After every edit**: `node --check <file>.js`, then the three commands of section 3. Report the results to the owner before delivering.
- **Delivery**: a ZIP whose root is the repository root, uploaded by the owner to `_uploads/`; files under `.github/` in a ZIP are ignored. Give the owner numbered, copy-paste steps for anything they must do (see `CLAUDE.md`).
- **Docs with the code**: when behaviour changes, update `README.md`, `tools/README.md`, this file and the spec in the same delivery.
- **What the spec has and has not verified** is stated in its section 7.4. The reference validators were logic-tested against an emulator that is not in the repository; the real proof is `test-validators.js` plus the end-to-end tester.
- `TODO.md` and `REPTES_SPECIFICATION.md` are written in English for AI readers; `README.md` and `tools/README.md` are in Catalan.
