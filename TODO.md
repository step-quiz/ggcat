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

As of 2026-11-10. **None of the grid work has started**; the site still runs the legacy numbering. Block 0 is done (results below); the next block is A + B.

| Area | State |
|---|---|
| Infrastructure (`curs/capitols.js`, `geovalidator.js`, `glossari-data.js`, `curs.css`, `style.css`) | ✅ complete for the legacy numbering |
| `curs/validators.js` | ✅ the 20 published validators pass the end-to-end tester (fixed on 2026-11-10, check 0.4) |
| `curs/geovalidator.js` | ✅ includes the `GV` extension of spec 7.3 |
| Landing page (`index.html`) | ✅; the stat reads `10/30` |
| Chapters `curs/capitol-1.html` … `capitol-10.html` | ✅ 10/10, each with a validated exercise (`cap-N-ex`) |
| Challenges | 10 legacy pages `curs/repte-1.html` … `repte-10.html` are live. Grid cells under their final id: **0/30**. |
| Generator (`tools/generate-pages.js`) | Works with numeric ids only. Only `repte-1` and `repte-6` have a JSON source in `tools/pages/`. Chapter pages are hand-written HTML. |
| Tool palettes | `capitols.js` reads `data-tools` → `customToolBar` (verified in `classic` and `graphing`, check 0.2); no page uses it and the generator does not emit it. |
| Input bar | Shown in every non-read-only applet since 2026-11-10 (check 0.1). |

Test results on 2026-11-10:

| Command | Result |
|---|---|
| `node tools/generate-pages.js --comprova` | 2 pages checked, both match |
| `node test-validators.js` | 70/70 (challenges and chapter exercises) |
| `node test-debug-tester-logic.js` | 100/100 |
| `node --check` on every `.js` | all pass |
| End-to-end (`curs/index.html?debug=1`, real GeoGebra in a browser) | **20/20 green** after the fixes of check 0.4 (it was 10/20 before them) |

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

Order: **0 (done) → A + B together → C → D**. Blocks E and F can be done at any time.

The ordering guarantees that the live site never offers fewer challenges than today (10): the legacy pages stay until the first grid release (block B) replaces them with 11 cells.

### Block 0 — Browser checks that gate the design

Checks 0.1–0.3 were run on 2026-11-10 with headless Chromium (Playwright) against the real applet loaded from `www.geogebra.org`, serving the repository with `python3 -m http.server`. An assistant whose sandbox allows that host can repeat them; otherwise ask the owner, with numbered steps in Catalan.

- [x] **0.1 Is the input bar available to the student?** **No, it was not** — a live bug, fixed in `curs/capitols.js`:
  - `classic`: `showAlgebraInput: true` alone shows nothing; it also needs `algebraInputPosition: 'bottom'`. Both are now set for every non-read-only applet.
  - `graphing`: the input row and the tools live inside the left panel, which `api.setPerspective('G')` hides (the `cap-9-ex` applet had neither input nor toolbar, so the exercise was impossible). `setPerspective('G')` is now skipped for applets that have a `goalId` **and** `data-app="graphing"`; those show the standard Graphing Calculator panel (tabs «Àlgebra», «Eines», «Taula»).
  - Verified by typing: `A=(3,2)` in chapter 1 and `f(x)=2x+1`, `A=Root(f)` in chapter 9, then «Comprova» → ✓ in both.
  - Consequence for the grid: cells 9A–9C can rely on typing.
- [x] **0.2 Does `customToolBar` work?** **Yes, in both apps.** With `data-tools="0 | 1 | 51"`: the `classic` toolbar shows exactly Move, Point, Regular polygon; in `graphing` the «Eines» tab lists exactly those three. Keep `data-tools` on 9A–9C.
- [x] **0.3 Baseline of the end-to-end tester.** **10/20 green.**
  - Green: `cap-1-ex`, `cap-2-ex`, `cap-4-ex`, `cap-7-ex`, `cap-9-ex`, `repte-1`, `repte-2`, `repte-3`, `repte-5`, `repte-9`.
  - Red (correct solution rejected): `cap-3-ex`, `cap-5-ex`, `cap-6-ex`, `cap-8-ex`, `cap-10-ex`, `repte-4`, `repte-6`, `repte-7`, `repte-8`.
  - Red (wrong solution accepted): `repte-10`.
- [x] **0.4 Fix what 0.3 uncovered.** Done on 2026-11-10; the end-to-end tester is now 20/20. Root causes, each confirmed by probing the live applet:

  | Cause | Evidence from the applet | Affected |
  |---|---|---|
  | **`IsOnPath` is not a GeoGebra command.** `getValue` of an unknown expression returns `0`, so the test is always false. | `IsOnPath(Midpoint(A,B),m)` = 0 with `m=PerpendicularBisector(A,B)`; `IsOnPath(P,g)` = 0 with `g=Line(P,f)` | `cap-5-ex`, `cap-6-ex`, `repte-6` (validator bug: **no student can pass**); spec cells 5a, 5c, 6a, 7c |
  | **`getAllObjectNames('conic')` does not return circles.** A circle has object type `circle`. | `c=Circle(O,3)` → `getObjectType` = `circle`; the `conic` list is empty | `cap-3-ex`, `cap-10-ex` (validator bug: **no student can pass**); every spec validator that lists `conic` |
  | **`getAllObjectNames('polygon')` misses triangles and quadrilaterals.** `Polygon(A,B,C)` has type `triangle`, a 4-gon `quadrilateral`; only other polygons (and regular ones built with `Polygon(A,B,n)`) are `polygon`. | `t` → `triangle`, `sq` → `quadrilateral`, `Polygon(A,B,3)` → `polygon` | `cap-8-ex` (validator bug: needs 2 polygons, sees 0); every spec validator that lists `polygon` |
  | **Angles are oriented; a clockwise click order gives the reflex angle.** | `Angle(A,B,C)` = 5.356 rad (306.87°) where 53.13° was meant; `Angle(D,A,B)` = 270° on a square | `repte-4` (tester solution; the validator should also accept 360° − target), `repte-10` (the square with a 270° angle is accepted as a rhombus) |
  | The heuristic `deg = (v > Math.PI) ? v : v * 180 / Math.PI` is wrong: `getValue(angle)` is always in radians, and a reflex angle is > π. | same probes | `cap-4-ex`, `repte-10` |
  | Tester uses commands that do not exist: `Parallel(f,P)`, `Perpendicular(P,f)`. The real ones are `Line(P,f)` and `PerpendicularLine(P,f)`. | `evalCommand` rejects them; the replacements return `true` | `cap-6-ex`, `repte-8` (tester bug; the `repte-8` validator itself is fine) |
  | Tester solution lacks the 60° angle the validator requires. | — | `repte-7` (tester bug) |

  What was done:
  1. `curs/geovalidator.js`: the `GV` extension of spec 7.3, with `GV.names` (families `polygon` and `conic`), `GV.pointOnLine`, `GV.angleIs`, `GV.circles`, `GV.isPerpBisector`, `GV.sliders`…; `GV.isOnPath` now measures a distance.
  2. `curs/validators.js`: `cap-3`, `-4`, `-5`, `-6`, `-7`, `-8`, `-10` and `repte-4`, `-6`, `-7`, `-10` use those helpers. Pass conditions are unchanged, except that an angle measured clockwise (360° − α) is now accepted where α is, and rejected where α is (`repte-10`: 270° counts as a right angle).
  3. `curs/debug-tester.js`: solutions of `cap-6-ex`, `repte-4`, `repte-7`, `repte-8` corrected.
  4. `test-validators.js`: the mock uses the real object types (an unknown type throws), returns 0 for an unknown expression, computes `Distance(point, line)`, and now also covers the ten chapter exercises. With the validators as they were before the fix it reports 11 failures, so it would have caught these bugs.
  5. Spec 7.2, 7.3, 7.4 and the reference validators of 6A and 7C updated.

  **Rule for every new validator:** `GV.names('polygon' | 'conic')`, `GV.pointOnLine`, `GV.angleIs` — never `getAllObjectNames('polygon' | 'conic')`, `IsOnPath`, or a one-sided angle comparison. Remember that `getValue` of an expression the applet cannot parse is 0, not NaN.

  Facts confirmed by the same probes (block E): `getValue(polygonLabel)` is the area (`t` = 12); `Distance((0,3),f)` with a literal point works; the vertices of a transformed polygon are points (`A'`, `B'`, `C'`); `isMoveable(slider)` is true; a locus has object type `locus`; `setValue(slider, v)` updates dependent objects synchronously.

### Block A — Infrastructure for grid ids

Do not release block A alone: it changes ids that the legacy pages depend on. Ship it together with block B.

Spec sections 4 and 5 define the target. File by file:

- [ ] **`curs/capitols.js`**
  - Add `TEMES_DATA`; replace `REPTES_DATA` with the new shape (`id`, `tema`, `nivell`, `titol`, `arxiu`, `goalId`, `dificultat`; no `num`). Export `window.TEMES_DATA`.
  - `renderReptesSidebar(currentId)`: takes the cell id (string) and groups entries by theme (spec 4.3).
  - One-time progress migration of the four legacy keys (spec 4.4). It goes here, not in `progress.js`.
- [x] **`curs/geovalidator.js`** — the `GV` extension of spec 7.3 is in (2026-11-10).
- [ ] **`tools/generate-pages.js`**
  - Accept `"id": "3b"` for `type: "repte"` (chapters keep `num`). Affected: `validatePage` (line ~378 requires a numeric `num`), `outputFilename` (~370), the badge and labels that print `page.num` (~185–188, ~251, ~277), the header title (~62), the sidebar call (~42: it must print `renderReptesSidebar('3b')`, quoted) and `--only` (~419).
  - The label shown is the id with the level in upper case: `Repte 3B`.
  - Add `tools` to `atributsSimulador` so that `simulador.tools` becomes `data-tools`.
  - The «Reptes» header link is hard-coded as `repte-1.html` in two templates (~60, ~260): change to `repte-1a.html`.
  - This generator is also used, with a different `PROJECTE` block, by the sibling courses PyCat and JSCat. Keep numeric `num` working so the change can be copied there unchanged, and tell the owner that the generator now differs from the siblings' copy.
- [ ] **`tools/extreu-pagina.js`** — the badge regex `⚡ Repte (\d+)` and `pagina.num = Number(…)` (~66) must read `3B` and produce `id: "3b"`; add `tools` to the known applet attributes.
- [ ] **`curs/index.html`** — the challenge list uses `r.num` (~85). Replace the flat list of challenges with the theme × level table of spec 4.3. Header link `repte-1.html` (~19) → `repte-1a.html`.
- [ ] **`curs/debug-tester.js`** — labels built from `r.num` (~609, ~668–670) → `r.id`. `TEST_SOLUTIONS` keys follow the goalIds.
- [ ] **`test-validators.js`** — the main loop already iterates over the keys of `CORRECT_SOLUTIONS`, and the mock has the value of a polygon (its area), `Distance(point, line)` with a literal point, `getObjectType` and `isMoveable` (2026-11-10). Still to add for `10a`: `setValue` on a slider with dependent objects. Scenes must use the real object types (the mock throws otherwise).
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

No cell of this block has an unverified API dependency left (`7b` and `10b` were confirmed on 2026-11-10).

### Block D — The ten C cells (→ 30/30)

`1c`, `2c`, `3c`, `4c`, `5c`, `6c`, `7c`, `8c`, `9c`, `10c`.

When the last cell lands, the landing stat becomes `30`.

### Block E — Verification debts

- [x] Every row of spec 7.4 is confirmed or refuted against the live applet (2026-11-10). What is still unproven is each reference validator of section 9 as a whole: the end-to-end tester proves it when the cell is implemented.
- [x] `getValue(polygonLabel)` is the area: confirmed on 2026-11-10 against the live applet (`t=Polygon((0,0),(6,0),(3,4))` → 12).
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
