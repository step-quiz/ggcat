# Ggcat — TODO

> **Audience:** an AI assistant that continues the development of Ggcat from a cold start.
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
- **Name.** The site is called **Ggcat** since 2026-11-12 (it was GeoCat; the owner keeps the two colours on the landing page: «Gg» black, «cat» blue). The `localStorage` keys keep their old prefix (`geocat_progress`, `geocat_ultim_repte`, `geocat-theme`): renaming them would wipe every student's progress.
- **Local progress only**: `localStorage['geocat_progress']` (plus two conveniences: `geocat_ultim_repte`, the last challenge visited, and `geocat-theme`). No accounts, no server, no student data in the repository.
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

As of 2026-11-12. **Blocks 0, A, B, C and D are done**: the site runs the grid ids and offers all 30 challenges. The legacy pages `repte-1` … `repte-10` are gone. Blocks E and F were closed on 2026-11-12, and block M (the final review) the same day. Nothing is planned; see section 5 for what remains unchecked.

| Area | State |
|---|---|
| Data and UI (`curs/capitols.js`) | ✅ `TEMES_DATA`, `REPTES_DATA` (grid shape, 30 entries), sidebar grouped by theme, migration of the four legacy progress keys |
| `curs/validators.js` | ✅ 10 chapter exercises + 30 cells; each returns `true` or a Catalan reason that the page shows (block M); all pass the end-to-end tester |
| `curs/geovalidator.js` | ✅ only the tolerant helpers of spec 7.3 (the strict legacy ones were removed in block M) |
| Course index (`curs/index.html`) | ✅ chapter list + theme × level table of the challenges (empty cells are dashed boxes) |
| Landing page (`index.html`) | ✅; the stat reads `30` |
| Chapters `curs/capitol-1.html` … `capitol-10.html` | ✅ 10/10, each with a validated exercise (`cap-N-ex`). Command names in their text and in the glossary verified against the live applet (2026-11-11) |
| Challenges | **30/30** live under their final id, each generated from `tools/pages/repte-<id>.json` |
| Generator (`tools/generate-pages.js`, `tools/extreu-pagina.js`) | ✅ grid ids (`"id": "3b"`) and `simulador.tools` → `data-tools`; numeric `num` still works. Chapter pages are hand-written HTML. This copy is now ahead of the one in PyCat and JSCat (the owner knows). |
| Tool palettes | ✅ every challenge page has its `data-tools` |
| Input bar | Shown in every non-read-only applet since 2026-11-10 (check 0.1). |
| Initial view | ✅ `data-view` on the 16 cells and 9 chapter applets whose figure left GeoGebra's default view (block E, 2026-11-12) |
| GeoGebra unreachable | ✅ each widget shows a notice instead of «carregant…» (block F, 2026-11-12) |

Test results on 2026-11-12:

| Command | Result |
|---|---|
| `node tools/generate-pages.js --comprova` | 30 pages checked, all match |
| `node test-validators.js` | 210/210 (30 cells and 10 chapter exercises; every reason printed and well formed; the `cap-10-ex` slider cases) |
| `node test-debug-tester-logic.js` | 213/213 |
| `node test-glossari.js` | 553/553 |
| `node --check` on every `.js` | all pass |
| End-to-end (`curs/index.html?debug=1`, real GeoGebra, headless Chromium) | **50/50 green** (30 cells, 10 chapter exercises, 10 chapter demo checks) |
| Hints typed by hand (the Catalan commands of each hint typed into the input bar, then «Comprova») | **30/30 ✓** |
| Progress migration (a browser holding `repte-3` and `repte-9`) | ✓ appears on 3A and 5B |

### Grid status

⬜ = to build · ✅ = live

| Theme | A | B | C |
|---|---|---|---|
| 1 El triangle | ✅ 1a | ✅ 1b | ✅ 1c |
| 2 El quadrat | ✅ 2a | ✅ 2b | ✅ 2c |
| 3 La circumferència | ✅ 3a | ✅ 3b | ✅ 3c |
| 4 Polígons regulars | ✅ 4a | ✅ 4b | ✅ 4c |
| 5 Mediatriu i circumcentre | ✅ 5a | ✅ 5b | ✅ 5c |
| 6 Bisectriu i incentre | ✅ 6a | ✅ 6b | ✅ 6c |
| 7 Perpendiculars i paral·leles | ✅ 7a | ✅ 7b | ✅ 7c |
| 8 Transformacions | ✅ 8a | ✅ 8b | ✅ 8c |
| 9 Funcions i corbes | ✅ 9a | ✅ 9b | ✅ 9c |
| 10 Lliscadors i lloc geomètric | ✅ 10a | ✅ 10b | ✅ 10c |

Totals: 30 ✅. The grid is complete.

---

## 4. Work blocks

Order: **0, A, B, C, D, E, F, G, H, I, J, K, L (all done)**.

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
  - In the `graphing` app the input is a formula editor: after an exponent the student must press → (the 9A hint says so), and accented names could not be tested with a simulated keyboard, so 9A offers `Arrel(f)` (that limit was the test's, not GeoGebra's: see block C).
  - `repte-10a` moves the slider and restores it: works on the live applet.

### Block C — The nine remaining B cells (done, 2026-11-11 → 20/30)

`1b`, `2b`, `3b`, `4b`, `6b`, `7b`, `8b`, `9b`, `10b`, built from the spec in one pull request: JSON → page, validator (the reference one of spec section 9; 7B now calls `GV.pointOnLine` instead of a raw `Distance`, same condition), `REPTES_DATA`, `prev`/`next` of every neighbour, test scenes (correct, initial, wrong and a typical error for each; another correct route for 3B and 9B), `TEST_SOLUTIONS`.

What the browser confirmed (headless Chromium, live applet):

- All nine reference validators and test solutions pass unchanged (end-to-end 30/30).
- Every hint, typed in Catalan into the input bar, leads to ✓. The hints now give the input-bar commands after the tool route (the spec's hints of 1B, 2B, 3B, 4B, 6B, 7B, 10B gave none). `Rotació(A, 60°, O)` with the degree sign is accepted. For 6B and 7B the hint names the objects (`m=Bisectriu(…)`, `P=Intersecció(p, k, 1)`) so that the next command can refer to them.
- **Accented names do work in the `graphing` formula editor.** Playwright's `keyboard.type` drops non-ASCII characters there; sending them as CDP key events (`Input.dispatchKeyEvent` with `text`) types them, and `Intersecció(f,g)` (9B) and `Intersecció(f,EixX)` (9A) both give ✓. So the open question about 9A is settled: its hint (`Arrel(f)`) is right, and the accented alternative works too.
- Labels GeoGebra chooses in Catalan: `Polígon(A,B,C)` typed is called `tri1`, a 4-gon `q1`, a regular polygon `pol1`, a locus `Lloc1`; `Intersecció(f,g)` in `graphing` yields `A` and `B`. No validator depends on them.

### Block D — The ten C cells (done, 2026-11-12 → 30/30)

`1c` … `10c`, built from the spec like block C, and the landing stat is now `30`.

What the browser confirmed (headless Chromium, live applet):

- Nine reference validators and test solutions pass unchanged. **9C did not**: in the `graphing` app GeoGebra rejects `Tangent` and `Angle` (`evalCommand` returns false for `Tangent(P,f)`, `Tangent(pi/4,g)`, `Angle(l,k)` with two lines, and `Tangent` to a circle). 9C now runs in `classic` (no `data-app`), where they work; validator and pass condition are unchanged. End-to-end: 40/40.
- Every hint, typed in Catalan, leads to ✓. Hints that differ from the spec's first draft: the input-bar commands were added to all but 2C; 4C offers a shortcut (circles centred at P and Q through the centre give the two vertices on side PQ, then `Polígon(E, F, 8)`); 9C no longer promises 70.53° or 109.47°, because GeoGebra shows 289.47° with the hint's own commands (the validator accepts all four values); 10C asks to set the slider to 5 first (`a=5`), because `PuntLliscant(2, 8, 0.1)` starts at 2, where the two circles are only tangent.
- Facts learnt: `Intersecció(circle, segment)` returns only the point on the segment, as one labelled point; the sides of `Polygon(P,Q,R,S)` named `q` are `p`, `q_1`, `r`, `s` (the side QR cannot be `q`); assigning `a=5` to a slider keeps it a slider.

### Block E — Verification debts

- [x] Every row of spec 7.4 is confirmed or refuted against the live applet (2026-11-10). What is still unproven is each reference validator of section 9 as a whole: the end-to-end tester proves it when the cell is implemented.
- [x] `getValue(polygonLabel)` is the area: confirmed on 2026-11-10 against the live applet (`t=Polygon((0,0),(6,0),(3,4))` → 12).
- [x] **Catalan names in hints.** Read from the live applet on 2026-11-11 (spec section 6) and applied to every hint of the spec; the 11 published hints were typed and pass. All 30 hints have been typed and pass (the last ten on 2026-11-12).
- [x] **Catalan command names in the chapters and the glossary** — fixed on 2026-11-11. Every command of `curs/capitol-N.html` and `curs/glossari-data.js` was typed into the live applet: `PuntMig` → `PuntMitjà`, `Cercle` → `Circumferència`, `Raig` → `Semirecta`, `Paral·lela(f,A)` → `Recta(A,f)`, `CercleCircumscrit(p)` → `Circumferència(A,B,C)`, `CercleInscrit(p)` → `CircumferènciaInscrita(A,B,C)`, `PolígonRegular` → `Polígon`, `Rotació(obj,A,α)` → `Rotació(obj,α,A)`, `Reflexió` → `Simetria`, `Homotècia(obj,O,k)` → `Homotècia(obj,k,O)`, `Lliscador` → `PuntLliscant`, `Lloc` → `LlocGeomètric`, `f(x,a,b)` → `Funció(f,a,b)`, `eixX` → `EixX`, `Punt(x,y)` (does not exist) → `(x,y)`. Also: chapter 4 `a=Àrea(p)` → `S=Àrea(p)` (`a` is a side of the triangle) and chapter 10 said the midpoint locus is an ellipse (it is a circle). The 95 lines of the chapters' code examples are all accepted by the applet. Not checked: the chapters' prose beyond the commands.
- [x] **Objects outside the initial view** — fixed on 2026-11-12. It was not only 5B: GeoGebra's default view in a challenge applet shows x ∈ [−10.6, 10.6] but only y ∈ [−3.9, 3.9], and a probe on the live applet (initial construction plus the tester's correct solution, points and circles) found 25 applets leaving it: 17 exercises (16 cells and `cap-8-ex`) and 8 chapter demos (chapter 3 #3, chapter 6 #2 #3, chapter 7 #1 #2 #3, chapter 8 #0 #3; numbered from 0 in page order). New optional attribute `data-view="xmin xmax ymin ymax"` (JSON `simulador.view`, generator and extractor updated): `_aplicaVista()` in `curs/capitols.js` keeps that region visible with equal scales on both axes, at load and after «Reinicia». After the change the same probe finds nothing outside the view.
- [x] Known limits of the validators, accepted as they are (decision, nothing to do): "measure it" steps cannot be enforced (`1b`, `8b`: the polygon already carries its sides and its area); `7a` only requires *some* second line plus the foot point.

### Block F — Robustness when the GeoGebra CDN is down

The course pages load `https://www.geogebra.org/apps/deployggb.js` synchronously in `<head>`. If the CDN does not answer, the widgets stay on «carregant…» forever with no message.

- [x] Done on 2026-11-12 (`curs/capitols.js`, `_mostraErrorGeoGebra()`, styles `.ggb-error` in `curs/curs.css`). Each widget shows «No s'ha pogut carregar GeoGebra…» with a reload button, and the badge reads «sense GeoGebra»:
  - at once, when `GGBApplet` is undefined (deployggb.js failed);
  - after 30 s (`_GGB_ESPERA_MS`), when deployggb.js loaded but the applet did not arrive; if it arrives later, `appletOnLoad` removes the notice.
  - Verified with Playwright by aborting requests: every `geogebra.org` request blocked → notice at once (1/1 on 5B, 5/5 on chapter 3); only the applet blocked → nothing at 5 s, notice at 32 s; normal load → no notice.
  - Not covered: a CDN that accepts the connection and never answers. deployggb.js is a synchronous `<script>` in `<head>`, so the browser waits for its own timeout before rendering the page; after that the notice appears. Making the script `async` would change the loading pattern documented at the top of `renderSimuladors()`.


### Block G — UI/UX, first round (done, 2026-11-12)

Asked by the owner after the grid was complete. All in `curs/capitols.js`, `curs/curs.css`, `style.css`, `index.html`, the generator skeleton and the hand-written pages:

1. **No jump to the input bar at load.** The `classic` applet focused «Entrada…» and the browser scrolled down to it (5B opened 294 px down). `preventFocus: true` alone does not stop it; `_evitaFocusInicial()` removes any focus an applet takes before the student's first click, key, wheel or touch, and scrolls back to the top. Measured: `scrollY` 0 and focus on `<body>` after load on 1A, 5B and 9B.
2. **Collapsible themes** in the challenge sidebar (`<details>`), closed except the current theme.
3. **«Reptes» opens the last challenge visited** in that browser (`geocat_ultim_repte`), from every header and the landing page.
4. **The Ggcat logo links to the landing page** everywhere.
5. **Glossary** 25 % wider (540 → 675 px) and its content font 25 % larger (title unchanged).
6. **1A has no «← Capítols» link**; «Repte següent» stays on the right (`margin-left: auto`).
7. **Nicer arrows** on previous/next: drawn by CSS (a disc with a cut-out arrow that slides on hover); the labels lost their `←`/`→`, in the challenges' JSON and in the chapters.


### Block H — UI/UX, second round (done, 2026-11-12)

1. **Header font sizes made equal, to the larger one**: the landing page's menu links were 0.68rem (10.9 px) and the course pages' 0.72rem (11.5 px); both are 0.72rem now, and so is the «Glossari» button. The logo was already 14.4 px on both.
2. **Selected menu option**: no background any more, only a thick pure-black border (`2px solid #000`); unselected links carry a transparent 2 px border so nothing moves. Hover is a faint grey background.
3. **Renamed GeoCat → Ggcat** in every page, script, style and document of this repository (not in the shared files `curs/progress.js`, `LICENSE`, `LLICENCIA.md`; not in the `localStorage` keys).
4. **Landing page trimmed**: the four feature pills, the second sentence of the subtitle and the «0 Instal·lació» stat are gone; the subtitle reads «Aprèn geometria dinàmica amb GeoGebra i en català.»


### Block I — UI/UX, third round: zones, applet labels, type scale (done, 2026-11-12)

The owner looked at a chapter as a 14-year-old would. Decided through mock-ups and a multiple-choice dialog:

1. **Zones**: large collapsible panels with a coloured band (chosen over boxed sections and tabs): chapters Teoria / Exercici / Resum, challenges Objectiu / Exercici / Pista; all open except the Pista. Built at load by `_organitzaZones()` in `curs/capitols.js`, so neither the hand-written chapters nor the generator's output changed (the generator now emits the hint as `<details class="pista">`, `PROJECTE.pista = 'classe'`). Inside a zone an applet is as wide as the zone.
2. **Applet labels**: «👁 Exemple per mirar» (grey dashed border) or «✍️ Et toca a tu» (thick blue border), from `data-readonly`.
3. **Type scale 12 · 14 · 16 · 20 · 28 · 40 px** (variables `--fs-*`; spec section 5). Before: 25 distinct sizes on the student's screen, from 10.4 to 38.4 px, and running text at 14 or 15.2 px depending on the paragraph. After: exactly the six sizes (measured over the landing page, the course index, chapter 3 and challenge 5B, glossary open). Running text is 16 px.
4. **Bug fixed on the way**: Cloudflare Pages serves pages without `.html` (`/curs/repte-5b`), and `_refreshSidebar()` matched `repte-…\.html`, so the sidebar ✓ did not appear after «Comprova» on the published site until the page was reloaded. Both regexes now accept the URL with or without `.html`.


### Block J — UI/UX, fourth round: smaller type, right margin (done, 2026-11-12)

1. **Everything one step smaller**, at the owner's request («tot és massa gran»): the scale is now 11 · 12 · 14 · 18 · 24 · 36 px (running text 16 → 14 px); zone headers a little less padded. Measured: exactly these six sizes on the student's screen.
2. **10 % empty on the right** from 900 px of window width up: `.curs-content { padding-right: max(3rem, 10vw) }`, applets included. Measured: 160 px of 1600 and 102 px of 1024 stay empty; at 800 px (portrait tablet) the old 3rem margin applies.


### Block K — A worked example for every glossary word (done, 2026-11-12)

Asked by the owner: every word of the glossary is a link (dashed underline) to a GeoGebra example built for that word alone, which the student can modify.

- **Data**: `curs/glossari-exemples.js`, `GLOSSARI_EXEMPLES` keyed by the exact text of the glossary `<code>` (53 words, 50 examples at the time; 57 and 54 after block M: `Mediatriu(A,B)`, `Perpendicular(A,f)` and `Recta(A,f)` appear twice in the glossary). Each: `codi` (Catalan commands, one per line), `prova` (what to change), `view`. No figure or coordinate is taken from the chapters or the challenges.
- **UI** (`_preparaExemplesGlossari()` in `curs/capitols.js`): the word becomes a `<button class="glossari-terme">`; the example opens inside the glossary window (wider: 900 px): editable textarea, ▶ Executa (Ctrl+Enter), ↺ Exemple original, «Prova-ho», and one `classic` applet per page with perspective `AG` (algebra view: values of areas, distances… are visible), created on first use; `deployggb.js` is loaded on demand on pages that have no applet (`curs/index.html`). Errors name the line.
- **Live fact**: `evalCommand` does **not** accept Catalan command names (`Circumferència(P,2)` → false) although the input bar does. `GLOSSARI_ORDRES` translates them (table of spec section 6); `test-glossari.js` checks that nothing is left untranslated.
- **Live fact**: a line can return true and its object vanish later: a polygon names its sides `f`, `g`, `h`…, so a later `f=Recta(…)` destroys it (it happened in the `Simetria(obj,f)` example). After running, every `name=…` line whose object no longer exists is reported as an error, to the student and to the tester.
- **Look** (owner's request, 2026-11-12): glossary words in black with a black dashed underline, no link blue anywhere in the glossary; every grid has the same first column (`30ch`, the width of `CircumferènciaInscrita(A,B,C)`), so all descriptions start at the same distance from the margin; on narrow screens the word goes above its indented description.
- **Tests**: `node test-glossari.js` (structure and translation; added to `tests.yml`); in the browser `GLOSSARI_PROVA_TOTS(cb)` runs every example on the live applet: **50/50, no failing line** (2026-11-12). The 50 figures were also looked at one by one.


### Block L — Authorship and licence on every page (done, 2026-11-12)

The owner sent a ZIP of `step-quiz-commons` «to copy all the licences and the authorship», explicitly **not** to join the family of courses (no «EXPLORA» selector, no certificate, no `comuns.json` entry). Findings: `LICENSE` and `LLICENCIA.md` were already identical to the commons ones (they are synced daily), and so was the README authorship block. What the sibling courses had and Ggcat lacked was the commons `footer.js`, a page footer with the authorship and both licences. It is now `footer.js` at the root, loaded by every page (landing, course index, chapters, challenges through the generator; not `curs/edit.html`): same text as commons («© 2026 David Arso Civil · INS Miquel Tarradell. Contingut: CC BY-NC-SA 4.0 · Codi: llicència MIT»), configuration written in (`ggcat-footer`, not fixed) and the course's font and type scale. It is **not** synced: if commons changes the text, copy it by hand.



### Block M — Final review (done, 2026-11-12)

The owner asked for an exhaustive review: is the code clean and bug-free, do UI and UX work on PC, laptop and landscape tablet, is the pedagogy right (can the student do what each page asks), and real, relevant improvements. The findings went to a review artifact with 19 items; the owner approved 18 and **rejected M2** (a «📖 Repassa el capítol N» link on every challenge — do not reopen it). Done:

**Bugs**

- **B1** Chapter 6, parallel demo: `g=Parallel(f,P)` is not a GeoGebra command (an error dialog covered the applet) → `g=Line(P,f)`.
- **B2** Chapter 4, area and perimeter demos: `a=Area(p)` redefined the side `a` of p and destroyed the polygon → `S=Area(p)` and `per=Perimeter(t)`.
- **B3** Labels: in the graphics-only perspective GeoGebra shows no labels, while the texts say «el triangle ABC», «la recta f». `_posaNoms()` (`curs/capitols.js`) shows the label of every point, line, ray, circle, vector and conic at load, after «Reinicia» and for every object the student creates (`registerAddListener`; types in `_TIPUS_AMB_NOM`).
- **B4** Tablet: GeoGebra's virtual keyboard opened by itself at load (iPad landscape) and covered a third of the screen; no applet parameter stops it. `_tancaTeclatGeoGebra()` closes it by dispatching pointer and mouse events on `.closeTabbedKeyboardButton` (a plain `click()` does nothing) at 0.3, 1, 2 and 3.5 s, only while the student has not touched the page (trusted events only); the glossary closes it after running an example. A real tap on «Entrada…» opens it again. Verified in iPad emulation only: confirm on a real school tablet.
- **B5** Glossary: lines `x=…`, `y=…`, `z=…` (equations) were reported as errors by the vanished-object check; closing the glossary with Esc or a click outside left the last example open instead of the list (event `glossari-tancat`).
- **B6** 3A accepted the centre within 0.02 and the radius within 0.01 → `GV.tol` like every other cell.

**UI**

- **U1** Values were invisible: the applets hide the algebra view and the texts refer to it. New attribute `data-algebra="true"` (perspective `AG`) on the 14 chapter applets whose text talks about values (chapters 1, 2, 3, 4, 7 and 9, some with a new `data-view`); the texts say «la columna de l'esquerra (la vista algebraica)».
- **U2** Laptops of 1366×768: «Comprova» was below the fold. A non-read-only applet is now at most `innerHeight − 230` px high (never under 340), so applet and «Comprova» fit; on challenges the objective is repeated in a fixed band under the header (`.objectiu-fix`, `_objectiuEnganxat()`) while the objective zone is out of view and the exercise zone is in view.

**Pedagogy**

- **P1** False sentences or code that did not match its applet: chapter 1 (coordinates), chapter 7 («widget lliure», area and perimeter now visible), chapter 9 (the `Funció(f,a,b)` demo is now `classic` with `g=Function(cos(x),0,2*pi)`), chapters 5 and 8 (the code shown is now the applet's).
- **P2** «cercle» → «circumferència» wherever the curve is meant: chapters 3, 6 and 10; challenges 3C «Circumferència circumscrita» and 6C «Circumferència inscrita» (JSON, regenerated pages, `REPTES_DATA`, debug labels, spec).
- **P3** «comanda» → «ordre» (29 times).
- **P4** Language errors («l'intersecció», «la paral·lelisme», «diferentss», «al original», a broken sentence, «s'intersecten», «dóna»).
- **P5** Chapter 1 title «Ets a Ggcat: aprendràs GeoGebra», without the comparison with Python.
- **P6** Commands the challenges need and the course did not teach: chapter 5 section «Bisectriu(A,B,C)» (6A–6C), chapter 9 «Tangent i angle entre dues corbes» (`Tangent`, `Angle(s,r)` = 108.43°; 9C), chapter 10 «Lloc geomètric amb un lliscador» (`LlocGeomètric(P,a)`; 10C), and four glossary rows with their editable examples: 57 rows, 54 distinct words, 54 examples (all run on the live applet, no failing line). Live fact: GeoGebra measures `Angle(r,s)` between two lines counterclockwise from the first to the second, so `Angle(r,s)` + `Angle(s,r)` = 360° (not 180°): the chapter text and the glossary example say so.
- **P7** `cap-10-ex` passed without the slider controlling anything. It now moves every slider (numbers and angle sliders, `GV.sliders(true)`) and requires a polygon or a conic to change (`GV.sliderMoves`, `GV.figureState`: area and first two vertices of a polygon, so translations and rotations count; centre, radius and equation of a conic). When the slider and the figure exist but do not depend on each other, the reason says exactly that, naming both (owner's request). Verified on the live applet: radius, translation, rotation by an angle slider, ellipse, `Polygon(A,B,n)`, slider at the end of its interval; the slider is always put back.

**Improvements**

- **M1** Every validator returns `true` or a short Catalan reason (spec 7.1), shown as «✗ Encara no és correcte. <reason>». Checks run in construction order and never give away a value to find. Pass conditions unchanged except B6 and P7. `test-validators.js` now requires exactly `true` for correct scenes and a well-formed reason (`esMotiu`) for the initial and wrong ones, and prints every reason: read them there.
- **M3** Demo check in the debug tester («▶ Demostracions dels capítols», also part of «▶ Tots»): loads each chapter and reports, applet by applet, the commands GeoGebra rejected at load (`wrapper._ordresRebutjades`, filled by `curs/capitols.js`) and every named object (`nomDeLOrdre()`, unit-tested in `test-debug-tester-logic.js`) that does not exist or is undefined. It would have caught B1 and B2; it was checked against a deliberately broken copy of chapter 4. 10/10 chapters clean.
- **M4** Removed: the `message` listener for `geocat-result` (it accepted messages from any local page and nothing sent them), the 12 unused strict `GV` helpers and `GV.eps`, and stale comments (georunner.js, «arquitectura §7.3»).

---

## 5. Notes for the assistant

- **Read in full in block M**: the chapters' prose (P1–P5) and every demo (M3 now checks the demos on every run of «▶ Tots»).
- **Virtual keyboard**: closed at load by `_tancaTeclatGeoGebra()` (block M, B4). Verified in iPad emulation only; confirm on a real tablet and a real phone. `showKeyboardOnFocus` and `preventFocus` do not stop it.

- **Tolerances** are in spec 7.2. In short: 0.15 for coordinates and lengths, 0.2 for images and irrational centres, 0.3 for areas, 1.5° for angles. The strict `GV.eps` helpers were removed (block M).
- **Reasons**: a validator returns `true` or a Catalan sentence that says what is missing (spec 7.1). Never return `false`: the student would only read «Revisa la construcció.».
- **Never test labels chosen by the student**: iterate with `getAllObjectNames(type)`. Labels of pre-built objects can be used and excluded.
- **After every edit**: `node --check <file>.js`, then the three commands of section 3. Report the results to the owner before delivering.
- **Delivery**: either a pull request (an assistant with Git access; the owner merges it — files can be deleted this way) or a ZIP whose root is the repository root, uploaded by the owner to `_uploads/` (a ZIP cannot delete files, and files under `.github/` in it are ignored). Give the owner numbered, copy-paste steps for anything they must do (see `CLAUDE.md`).
- **Browser tests**: a sandbox that allows `www.geogebra.org` can run them itself with headless Chromium (Playwright): serve the repository with `python3 -m http.server`, open `curs/index.html?debug=1`, click `#dbg-all` and wait for `#dbg-summary` (50 tests, about 15 minutes). To type like a student in `classic`, click the `input` inside `.geogebra-wrap`; the live API of each applet is `wrapper._ggbApi`.
- **Docs with the code**: when behaviour changes, update `README.md`, `tools/README.md`, this file and the spec in the same delivery.
- **What the spec has and has not verified** is stated in its section 7.4. The reference validators were logic-tested against an emulator that is not in the repository; the real proof is `test-validators.js` plus the end-to-end tester.
- `TODO.md` and `REPTES_SPECIFICATION.md` are written in English for AI readers; `README.md` and `tools/README.md` are in Catalan.
