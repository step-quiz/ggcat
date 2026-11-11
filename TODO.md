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

As of 2026-11-11. **Blocks 0, A and B are done**: the site runs the grid ids and offers 11 challenges (the ten A cells and 5B). The legacy pages `repte-1` … `repte-10` are gone. The next block is C.

| Area | State |
|---|---|
| Data and UI (`curs/capitols.js`) | ✅ `TEMES_DATA`, `REPTES_DATA` (grid shape, 11 entries), sidebar grouped by theme, migration of the four legacy progress keys |
| `curs/validators.js` | ✅ 10 chapter exercises + 11 cells; all pass the end-to-end tester |
| `curs/geovalidator.js` | ✅ includes the `GV` extension of spec 7.3 |
| Course index (`curs/index.html`) | ✅ chapter list + theme × level table of the challenges (empty cells are dashed boxes) |
| Landing page (`index.html`) | ✅; the stat reads `11/30` |
| Chapters `curs/capitol-1.html` … `capitol-10.html` | ✅ 10/10, each with a validated exercise (`cap-N-ex`). ⚠️ Several Catalan command names in their text and in the glossary are wrong (block E) |
| Challenges | **11/30** live under their final id, each generated from `tools/pages/repte-<id>.json` |
| Generator (`tools/generate-pages.js`, `tools/extreu-pagina.js`) | ✅ grid ids (`"id": "3b"`) and `simulador.tools` → `data-tools`; numeric `num` still works. Chapter pages are hand-written HTML. This copy is now ahead of the one in PyCat and JSCat (the owner knows). |
| Tool palettes | ✅ every challenge page has its `data-tools` |
| Input bar | Shown in every non-read-only applet since 2026-11-10 (check 0.1). |

Test results on 2026-11-11:

| Command | Result |
|---|---|
| `node tools/generate-pages.js --comprova` | 11 pages checked, all match |
| `node test-validators.js` | 81/81 (11 cells and 10 chapter exercises) |
| `node test-debug-tester-logic.js` | 105/105 |
| `node --check` on every `.js` | all pass |
| End-to-end (`curs/index.html?debug=1`, real GeoGebra, headless Chromium) | **21/21 green** |
| Hints typed by hand (the Catalan commands of each hint typed into the input bar, then «Comprova») | **11/11 ✓** |
| Progress migration (a browser holding `repte-3` and `repte-9`) | ✓ appears on 3A and 5B |

### Grid status

⬜ = to build · ✅ = live

| Theme | A | B | C |
|---|---|---|---|
| 1 El triangle | ✅ 1a | ⬜ 1b | ⬜ 1c |
| 2 El quadrat | ✅ 2a | ⬜ 2b | ⬜ 2c |
| 3 La circumferència | ✅ 3a | ⬜ 3b | ⬜ 3c |
| 4 Polígons regulars | ✅ 4a | ⬜ 4b | ⬜ 4c |
| 5 Mediatriu i circumcentre | ✅ 5a | ✅ 5b | ⬜ 5c |
| 6 Bisectriu i incentre | ✅ 6a | ⬜ 6b | ⬜ 6c |
| 7 Perpendiculars i paral·leles | ✅ 7a | ⬜ 7b | ⬜ 7c |
| 8 Transformacions | ✅ 8a | ⬜ 8b | ⬜ 8c |
| 9 Funcions i corbes | ✅ 9a | ⬜ 9b | ⬜ 9c |
| 10 Lliscadors i lloc geomètric | ✅ 10a | ⬜ 10b | ⬜ 10c |

Totals: 11 ✅, 19 ⬜. Keep this table up to date as cells land.

---

## 4. Work blocks

Order: **0, A, B (done) → C → D**. Blocks E and F can be done at any time.

### Block 0 — Browser checks that gate the design

The ids `repte-1` … `repte-10` below are the legacy challenges that were live at the time. Checks 0.1–0.3 were run on 2026-11-10 with headless Chromium (Playwright) against the real applet loaded from `www.geogebra.org`, serving the repository with `python3 -m http.server`. An assistant whose sandbox allows that host can repeat them; otherwise ask the owner, with numbered steps in Catalan.

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

### Blocks A and B — Grid ids and the first 11 cells (done, 2026-11-11)

Delivered in one pull request (the legacy files were deleted in the same commit, so there was no red window).

- **Infrastructure**: `curs/capitols.js` (`TEMES_DATA`, `REPTES_DATA`, `renderReptesSidebar(id)`, `migraProgresReptes()`), the generator and the extractor (grid ids, `tools`, `PROJECTE.primerRepte`), `curs/index.html` (table), `curs/debug-tester.js` (labels from `r.id`), `test-validators.js` (scenes for the cells, sliders in the mock), every hard-coded link `repte-1.html` → `repte-1a.html`.
- **Cells**: `2a`, `3a`, `7a`, `5b` renamed from `repte-5`, `-3`, `-8`, `-9` (text, construction and validator body unchanged; palette added; `7a` is now Fàcil); `1a`, `4a`, `5a`, `6a`, `8a`, `9a`, `10a` built from the spec.
- **Retired**: the pages, validators, scenes and JSON of `repte-1`, `-2`, `-4`, `-6`, `-7`, `-10`.
- **What the browser taught** (all recorded in the spec):
  - Catalan command names in the hints of 1A, 2A, 4A, 5A and 10A were wrong and GeoGebra rejected them. The real ones are `Polígon` (also for regular polygons), `PuntMitjà`, `PuntLliscant`. Tables of tool and command names: spec section 6.
  - In the `graphing` app the input is a formula editor: after an exponent the student must press → (the 9A hint says so), and accented names could not be tested with a simulated keyboard, so 9A offers `Arrel(f)`.
  - `repte-10a` moves the slider and restores it: works on the live applet.

### Block C — The nine remaining B cells (→ 20/30)

`1b`, `2b`, `3b`, `4b`, `6b`, `7b`, `8b`, `9b`, `10b`. Per-cell checklist: spec section 10. Each added cell changes the previous/next links of its neighbours. Type each hint into the input bar once (spec section 10, step 7): five of the first eleven hints failed that test.

No cell of this block has an unverified API dependency left (`7b` and `10b` were confirmed on 2026-11-10).

### Block D — The ten C cells (→ 30/30)

`1c`, `2c`, `3c`, `4c`, `5c`, `6c`, `7c`, `8c`, `9c`, `10c`.

When the last cell lands, the landing stat becomes `30`.

### Block E — Verification debts

- [x] Every row of spec 7.4 is confirmed or refuted against the live applet (2026-11-10). What is still unproven is each reference validator of section 9 as a whole: the end-to-end tester proves it when the cell is implemented.
- [x] `getValue(polygonLabel)` is the area: confirmed on 2026-11-10 against the live applet (`t=Polygon((0,0),(6,0),(3,4))` → 12).
- [x] **Catalan names in hints.** Read from the live applet on 2026-11-11 (spec section 6) and applied to every hint of the spec; the 11 published hints were typed and pass. The 19 remaining hints still have to be typed once each.
- [ ] **Wrong Catalan command names in the chapters and the glossary** (found on 2026-11-11, not fixed: it needs an audit of every command they mention, each typed into the live applet). Known so far: `PuntMig` (chapters 2 and 10, glossary) should be `PuntMitjà`; `PolígonRegular` (chapter 7, glossary) should be `Polígon`; `Lliscador` (chapter 10, glossary) should be `PuntLliscant`; `Paral·lela(f,A)` (chapter 6, glossary) should be `Recta(A, f)`; `CercleCircumscrit` (chapter 6) is unchecked. A student who copies these gets «Comandament desconegut». The tables of spec section 6 give the right names.
- [ ] **5B: vertex C = (2, 5) is outside the initial view** (the applet shows y up to about 4). Inherited from `repte-9`; the student can drag the view. Either set the view in `data-commands` or leave it.
- [ ] Known limits of the validators, accepted as they are: "measure it" steps cannot be enforced (`1b`, `8b`: the polygon already carries its sides and its area); `7a` only requires *some* second line plus the foot point.

### Block F — Robustness when the GeoGebra CDN is down

The course pages load `https://www.geogebra.org/apps/deployggb.js` synchronously in `<head>`. If the CDN does not answer, the widgets stay on «carregant…» forever with no message.

- [ ] At the end of `renderSimuladors()`, test `typeof GGBApplet === 'undefined'` and show an error banner in each wrapper instead of the perpetual «carregant…».

---

## 5. Notes for the assistant

- **Tolerances** are in spec 7.2. In short: 0.15 for coordinates and lengths, 0.2 for images and irrational centres, 0.3 for areas, 1.5° for angles; `GV.eps` (0.001) is too strict for student constructions.
- **Never test labels chosen by the student**: iterate with `getAllObjectNames(type)`. Labels of pre-built objects can be used and excluded.
- **After every edit**: `node --check <file>.js`, then the three commands of section 3. Report the results to the owner before delivering.
- **Delivery**: either a pull request (an assistant with Git access; the owner merges it — files can be deleted this way) or a ZIP whose root is the repository root, uploaded by the owner to `_uploads/` (a ZIP cannot delete files, and files under `.github/` in it are ignored). Give the owner numbered, copy-paste steps for anything they must do (see `CLAUDE.md`).
- **Browser tests**: a sandbox that allows `www.geogebra.org` can run them itself with headless Chromium (Playwright): serve the repository with `python3 -m http.server`, open `curs/index.html?debug=1`, click `#dbg-all` and wait for `#dbg-summary`. To type like a student in `classic`, click the `input` inside `.geogebra-wrap`; the live API of each applet is `wrapper._ggbApi`.
- **Docs with the code**: when behaviour changes, update `README.md`, `tools/README.md`, this file and the spec in the same delivery.
- **What the spec has and has not verified** is stated in its section 7.4. The reference validators were logic-tested against an emulator that is not in the repository; the real proof is `test-validators.js` plus the end-to-end tester.
- `TODO.md` and `REPTES_SPECIFICATION.md` are written in English for AI readers; `README.md` and `tools/README.md` are in Catalan.
