# Ggcat — Challenge Specification: the 10 × 3 grid

## 1. Purpose and authority of this document

This is the **technical specification of the Ggcat challenges** (`curs/repte-*.html`), written for an AI implementor that starts cold with the repository loaded. Work order and task status live in `TODO.md`; this file defines *what* each challenge is.

The challenges form a **grid of 10 themes × 3 levels = 30 challenges**. This replaces the previous plan (a flat list of 30 challenges numbered 1–30, split 10 Fàcil + 10 Mitjà + 10 Difícil), which is no longer valid.

Authority and precedence:

1. **This file is the single source of truth for the challenge plan.** `GeoCat-30Reptes.docx` is the original prose draft of the grid; it is kept in the repository for reference only and is **obsolete**. Where they differ, this file wins (the known differences are listed in Appendix B).
2. For anything **already implemented**, the repository rule applies: if code and document disagree, the document is the one to fix. All thirty cells are published: the A and B columns since 2026-11-11, the C column since 2026-11-12. Four of them (2A, 3A, 5B, 7A) continue legacy challenges: their text, data and pass condition are those of the legacy challenge (3A with the tolerance `GV.tol` since 2026-11-12).
3. Every cell is now implemented, so for every cell this file must match the code. Section 7.4 states what has been verified.

Owner decisions recorded on 2026-11-10:

| Decision | Value |
|---|---|
| Structure | 10 themes × 3 levels (A, B, C) |
| Meaning of the levels | Difficulty only. A/B/C are **not** tied to age or school-year bands. |
| Identifier | theme number + level letter: `repte-3b` |
| Published challenges without a cell | Retired (6 pages are deleted; see Appendix A) |
| Navigation order | By theme: 1A → 1B → 1C → 2A → … → 10C |
| Word draft | Obsolete; this file rules |

## 2. The grid

✅ = published (all 30 since 2026-11-12).

| # | Theme (`TEMES_DATA.titol`) | A — Fàcil | B — Mitjà | C — Difícil |
|---|---|---|---|---|
| 1 | El triangle | `1a` Triangle equilàter ✅ | `1b` Triangle 3-4-5 ✅ | `1c` Triangle medial ✅ |
| 2 | El quadrat | `2a` Quadrat a l'origen ✅ | `2b` Quadrat per vèrtexs oposats ✅ | `2c` Duplicació del quadrat ✅ |
| 3 | La circumferència | `3a` Circumferències concèntriques ✅ | `3b` Circumferència per dos punts ✅ | `3c` Circumferència circumscrita ✅ |
| 4 | Polígons regulars | `4a` Pentàgon regular ✅ | `4b` Hexàgon inscrit ✅ | `4c` Octàgon dins d'un quadrat ✅ |
| 5 | Mediatriu i circumcentre | `5a` Mediatriu d'un segment ✅ | `5b` El circumcentre ✅ | `5c` Tales i la hipotenusa ✅ |
| 6 | Bisectriu i incentre | `6a` Bisectriu d'un angle ✅ | `6b` L'incentre ✅ | `6c` Circumferència inscrita ✅ |
| 7 | Perpendiculars i paral·leles | `7a` Perpendicular i peu ✅ | `7b` Paral·leles a distància 2 ✅ | `7c` L'ortocentre ✅ |
| 8 | Transformacions | `8a` Translació d'un triangle ✅ | `8b` Rotació de 60° ✅ | `8c` Reflexió amb lliscament ✅ |
| 9 | Funcions i corbes | `9a` Arrels de la paràbola ✅ | `9b` Paràbola i recta ✅ | `9c` Sinus i cosinus ✅ |
| 10 | Lliscadors i lloc geomètric | `10a` Polígon dinàmic ✅ | `10b` Lloc del punt mig ✅ | `10c` L'el·lipse com a lloc geomètric ✅ |

## 3. Level semantics

The level describes **how much the student has to plan**, inside one theme:

- **A — Fàcil.** Direct entry to the object of the theme: one idea, one constructive step, one main tool.
- **B — Mitjà.** The object combined with a second idea (a measurement, an intersection, an auxiliary property). Needs a short chain of steps planned in advance.
- **C — Difícil.** The theme embedded in a classical theorem or a non-obvious property; several chained steps and usually a verification.

The three challenges of a theme are independent pages: B does not require A to be completed, and no state is shared.

The tool palette (section 6) follows the level: A offers the minimum needed for the object, B adds auxiliary tools (intersection, midpoint, bisectors), C adds verification tools (distance, area, locus).

## 4. Identifiers and data model

### 4.1 Identifier scheme

For theme `t` ∈ 1…10 and level `l` ∈ {`a`, `b`, `c`}:

| Item | Value | Example |
|---|---|---|
| Cell id | `<t><l>` | `3b` |
| Page | `curs/repte-<t><l>.html` | `curs/repte-3b.html` |
| `goalId` = key in `VALIDATORS` = key in `geocat_progress` | `repte-<t><l>` | `repte-3b` |
| Generator source | `tools/pages/repte-<t><l>.json` | `tools/pages/repte-3b.json` |
| Label shown to the student | `Repte <t><L>` (uppercase level) | `Repte 3B` |

New ids always end in a letter, so they can never collide with the legacy ids `repte-1` … `repte-10`. This matters because student progress is stored by `goalId` and a success is never unset.

### 4.2 `TEMES_DATA` and `REPTES_DATA` (in `curs/capitols.js`)

```js
var TEMES_DATA = [
  { num: 1,  titol: 'El triangle' },
  { num: 2,  titol: 'El quadrat' },
  { num: 3,  titol: 'La circumferència' },
  { num: 4,  titol: 'Polígons regulars' },
  { num: 5,  titol: 'Mediatriu i circumcentre' },
  { num: 6,  titol: 'Bisectriu i incentre' },
  { num: 7,  titol: 'Perpendiculars i paral·leles' },
  { num: 8,  titol: 'Transformacions' },
  { num: 9,  titol: 'Funcions i corbes' },
  { num: 10, titol: 'Lliscadors i lloc geomètric' },
];

var REPTES_DATA = [
  { id: '1a', tema: 1, nivell: 'a', titol: 'Triangle equilàter',
    arxiu: 'repte-1a.html', goalId: 'repte-1a', dificultat: 'facil' },
  // …
];
```

Rules:

- `REPTES_DATA` lists **only the cells whose page exists**, in grid order (theme ascending, then `a` < `b` < `c`). This array order is the navigation order.
- `dificultat` is derived from the level: `a` → `'facil'`, `b` → `'mitja'`, `c` → `'dificil'`. No other combination is valid.
- The numeric field `num` disappears from the challenges. Every consumer that reads `r.num` must switch to `r.id` (list in `TODO.md`, block A).

### 4.3 Navigation

- **Previous / next** links follow the order of `REPTES_DATA`: the adjacent *existing* cells. While the grid is incomplete, adding a cell changes the links of its two neighbours, which must be regenerated.
- First cell (1A): **no previous link** (owner's decision, 2026-11-12; the JSON has no `prev`). Last cell: next → `index.html`, label `Inici`. Otherwise the labels are `Repte anterior` and `Repte següent`. Labels carry **no arrow characters**: `curs/curs.css` draws the arrows (`.btn-nav--prev::before`, `.btn-nav--next::after`, a disc with a cut-out arrow, as a CSS mask so it takes the link colour). The chapters' `.chapter-nav` uses the same classes and the same rule.
- The **«Reptes»** link in every page header (chapters, challenges, course index, landing page) points to `repte-1a.html` in the HTML; at load it is rewritten to the **last challenge visited in that browser** (`localStorage['geocat_ultim_repte']` = cell id, saved by `renderReptesSidebar`; rewritten by `_enllacaUltimRepte()` in `curs/capitols.js` and by an inline script in `index.html`).
- The **Ggcat logo** of every header is a link to the landing page (`../index.html` from `curs/`).
- **Sidebar** (`renderReptesSidebar(currentId)`): one collapsible block per theme that has at least one existing cell (`<details class="sidebar-tema">`, summary `<t> · <theme title>`), with one entry per cell: `<t><L> · <title>`, preceded by ✓ when completed. Every theme is closed except the theme of the current cell; themes the student opened stay open when the sidebar is redrawn after «Comprova».
- **Zones of a page** (since 2026-11-12, owner's choice among three mock-ups: large collapsible panels). At load, `_organitzaZones()` in `curs/capitols.js` regroups the page into `<details class="zona zona-…">` panels, each with a thick coloured band: a challenge becomes 🎯 **Objectiu** (the text under `<h2>Objectiu</h2>`), ✏️ **Exercici** (what follows `<h2>Widget</h2>`: the sentence and the applet) and 💡 **Pista** (the generator's `<details class="pista">`, closed); a chapter becomes 📘 **Teoria**, ✏️ **Exercici** (`.chapter-exercise`) and 📌 **Resum** (the section whose `<h2>` is «Resum»). Every zone starts open except the Pista. The HTML of the pages does not change; the `<h2>` Objectiu / Widget / Exercici / Resum are removed at load.
- **Applet labels**: every applet carries a label above it and a matching border: read-only applets (`data-readonly="true"`) «👁 Exemple per mirar — pots moure'n els punts, però aquí no s'hi escriuen ordres» with a grey dashed border; the others «✍️ Et toca a tu — fes servir les eines o escriu ordres a «Entrada…»» with a thick blue border (`_etiquetaApplet()`). Points of a read-only applet can be dragged (checked on the live applet).
- **Course index** (`curs/index.html`): a table with one row per theme and three columns A, B, C; a cell that does not exist yet is rendered empty and not linked.

### 4.4 Student progress and the legacy keys

Progress is `localStorage['geocat_progress'] = { goalId: true, … }` (`curs/progress.js`, a file shared across courses that must not be edited in this repository).

Four legacy challenges continue as grid cells with the same task. On page load, `curs/capitols.js` (`migraProgresReptes()`) copies their progress:

| Legacy key | New key |
|---|---|
| `repte-3` | `repte-3a` |
| `repte-5` | `repte-2a` |
| `repte-8` | `repte-7a` |
| `repte-9` | `repte-5b` |

For each pair, if the legacy key is set and the new one is not, call `saveGoalCompleted(newKey)`. Legacy keys are left in place (they are harmless and progress is never unset). The keys of the six retired challenges (`repte-1`, `-2`, `-4`, `-6`, `-7`, `-10`) stay orphaned.

## 5. Page template

Every challenge is `curs/repte-<id>.html`, generated from `tools/pages/repte-<id>.json` by `tools/generate-pages.js`. The skeleton is the one of the current challenge pages. Per-challenge slots:

| Slot | Where | Value |
|---|---|---|
| `<title>` | `<head>` | `Repte 3B — <title> \| Ggcat` |
| Header title | `.curs-header-title` | `Repte 3B — <title>` |
| Badge | `.chapter-badge` | `⚡ Repte 3B — Mitjà`, colours below |
| `<h1>` | `.chapter-header` | `<title>` |
| Objectiu | first `<p>` of `.chapter-section` | the *Objectiu* of the cell |
| `data-commands` | `.geogebra` div | newline-separated GeoGebra commands (English names) |
| `data-fixed` | `.geogebra` div | comma-separated labels locked with `setFixed` |
| `data-goal-id` | `.geogebra` div | `repte-3b` |
| `data-app` | `.geogebra` div | omitted (classic) or `graphing` |
| `data-tools` | `.geogebra` div | the palette of the cell (section 6) |
| `data-view` | `.geogebra` div | optional: `xmin xmax ymin ymax`, the region that must be visible at load and after «Reinicia» (since 2026-11-12). `curs/capitols.js` centres it and widens one axis so that both axes keep the same scale. GeoGebra's default view shows only y ∈ [−3.9, 3.9] (x ∈ [−10.6, 10.6]) in a challenge applet, so every cell whose initial construction or correct solution leaves that box has one (16 cells; they are listed in the cells' metadata) |
| `data-height` | `.geogebra` div | always `440` |
| Hint | `<details>` after the section | the *Hint* of the cell |
| Navigation | `.chapter-nav` | section 4.3 |
| Sidebar call | final `<script>` | `renderReptesSidebar('3b')` |

Badge colours (unchanged):

| Level | Background | Text |
|---|---|---|
| A — Fàcil | `#d1fae5` | `#065f46` |
| B — Mitjà | `#fef3c7` | `#92400e` |
| C — Difícil | `#fee2e2` | `#991b1b` |

Generator JSON for a challenge (`num` is replaced by `id`; `simulador` gains `tools`):

```jsonc
{
  "type": "repte",
  "id": "3b",
  "titol": "Circumferència per dos punts",
  "difficulty": "mitja",
  "prev": { "url": "repte-3a.html", "label": "Repte anterior" },
  "next": { "url": "repte-3c.html", "label": "Repte següent" },
  "hint": "<p>…</p>",
  "sections": [ { "parts": [
    { "h2": "Objectiu", "body": "<p>…</p>" },
    { "h2": "Widget",
      "body": "<p>Construeix la solució i prem <strong>✓ Comprova</strong> quan acabis.</p>",
      "simulador": { "goalId": "repte-3b", "commands": "A=(-3,0)\nB=(3,0)", "fixed": "A,B",
                     "tools": "0 | 1 19 | 8 4 | 10 11 34 | 15", "view": "-6 6 -2 9", "height": 440 } }
  ] } ]
}
```

**Type scale.** Every text size comes from six variables declared in `curs/curs.css` and `style.css`: `--fs-xs` 11 px (small labels), `--fs-sm` 12 px (menus, sidebar, buttons), `--fs-md` 14 px (all running text, statements, glossary, code), `--fs-lg` 18 px (section and zone titles), `--fs-xl` 24 px (page title), `--fs-xxl` 36 px (landing name). The owner first chose 16 px for running text and then asked for 14 px (2026-11-12).

**Right margin.** From 900 px of window width up (laptops, desktops, landscape tablets), the right 10 % of the window stays empty: `.curs-content { padding-right: max(3rem, 10vw) }`, and no applet reaches into it. Inline `code` takes the size of the text around it. No other font size may be introduced (measured on 2026-11-12: the student sees exactly these six).

All text visible to the student is in **Catalan**. Validators are **never** in the HTML or in the JSON: they live in `curs/validators.js`.

## 6. Tool palettes (`data-tools`)

Each cell restricts the GeoGebra toolbar. `curs/capitols.js` already supports this: a non-empty `data-tools` attribute is passed as the applet parameter `customToolBar`. Every challenge page uses it; in the JSON it is `simulador.tools`.

Syntax (as documented in `capitols.js`): numeric tool ids separated by spaces; `|` starts a new toolbar group. Every palette starts with `0` (Move).

Tool ids used in this file (checked on 2026-11-10 against the GeoGebra toolbar reference, <https://geogebra.github.io/docs/reference/en/Toolbar/>):

| ID | Tool | ID | Tool | ID | Tool |
|---|---|---|---|---|---|
| 0 | Move | 11 | Circle through 3 points | 32 | Rotate around point |
| 1 | Point | 13 | Tangents | 33 | Dilate from point |
| 2 | Line | 15 | Segment | 34 | Circle: centre and radius |
| 3 | Parallel line | 16 | Polygon | 36 | Angle |
| 4 | Perpendicular line | 18 | Ray | 38 | Distance or length |
| 5 | Intersect | 19 | Midpoint or centre | 47 | Locus |
| 7 | Vector | 25 | Slider | 49 | Area |
| 8 | Perpendicular bisector | 29 | Reflect about point | 51 | Regular polygon |
| 9 | Angle bisector | 30 | Reflect about line | 501 | Point on object |
| 10 | Circle: centre and point | 31 | Translate by vector |  |  |

**Catalan names** (read from the live applet with `language: 'ca'` on 2026-11-11; hints must use exactly these). Tools, as the interface shows them:

| ID | Eina | ID | Eina | ID | Eina |
|---|---|---|---|---|---|
| 0 | Mou | 11 | Circumferència que passa per tres punts | 32 | Rotació al voltant d'un punt |
| 1 | Punt | 13 | Tangents | 33 | Homotècia |
| 2 | Recta | 15 | Segment | 34 | Circumferència: Centre i Radi |
| 3 | Recta paral·lela | 16 | Polígon | 36 | Angle |
| 4 | Recta perpendicular | 18 | Semirecta | 38 | Longitud, perímetre o distància |
| 5 | Intersecció | 19 | Punt mitjà o centre | 47 | Lloc geomètric |
| 7 | Vector entre dos punts | 25 | Punt lliscant | 49 | Àrea |
| 8 | Mediatriu | 29 | Simetria central | 51 | Polígon regular |
| 9 | Bisectriu | 30 | Simetria axial | 501 | Punt en un objecte |
| 10 | Circumferència donats el centre i un punt per on passa | 31 | Translació segons un vector |  |  |

Commands (English → Catalan). In the input bar the student types the Catalan name; `evalCommand` (tester, `data-commands`) takes the English one.

| English | Catalan | English | Catalan |
|---|---|---|---|
| `Polygon(A,B,C)`, `Polygon(A,B,n)` | `Polígon` (there is no `PolígonRegular`) | `Translate` | `Translació` |
| `Midpoint` | `PuntMitjà` | `Rotate` | `Rotació` |
| `Slider(min,max,step)` | `PuntLliscant` | `Reflect` (line or point) | `Simetria` |
| `Intersect` | `Intersecció` | `Dilate` | `Homotècia` |
| `Circle` | `Circumferència` | `Angle` | `Angle` |
| `PerpendicularBisector` | `Mediatriu` | `Distance` | `Distància` |
| `AngleBisector` | `Bisectriu` | `Area` | `Àrea` |
| `PerpendicularLine(P,l)` | `Perpendicular` | `Length` | `Longitud` |
| `Line(A,B)`, `Line(P,l)` (parallel) | `Recta` | `Perimeter` | `Perímetre` |
| `Segment` | `Segment` | `Tangent` | `Tangent` |
| `Ray` | `Semirecta` | `Root` | `Arrel` |
| `Vector` | `Vector` | `Center`, `Radius` | `Centre`, `Radi` |
| `Point(path)` | `Punt` | `Incircle` | `CircumferènciaInscrita` |
| `xAxis`, `yAxis` | `EixX`, `EixY` | `Ellipse` | `El·lipse` |
| `Locus` | `LlocGeomètric` | `Sequence` | `Seqüència` |
| `Function(f,a,b)` | `Funció` | `Circle(A,B,C)` (circumscribed) | `Circumferència(A,B,C)` |

Order of arguments: `Rotació(obj, angle, centre)`, `Homotècia(obj, raó, centre)`, `Perpendicular(punt, recta)`, `Recta(punt, recta)` for the parallel. There is no `Punt(x,y)`: an unnamed point is typed as `(x,y)`.

Typing in the `graphing` app goes through a formula editor: after an exponent the cursor stays in it until the student presses →, and say so in the hint. Accented command names work there: `Intersecció(f,g)` (9B) and `Intersecció(f,EixX)` (9A) typed into the formula editor give ✓ (2026-11-11). An earlier test had concluded otherwise because Playwright's `keyboard.type` drops non-ASCII characters in that editor; a test must send them as CDP key events (`Input.dispatchKeyEvent` with `text: 'ó'`). In `classic` the plain `keyboard.type` works.

The palette guides the student; it is not a security boundary. The student can also type commands: since 2026-11-10 every non-read-only applet shows the input bar (`classic`: at the bottom; `graphing` exercises: in the left panel, next to the «Eines» tab that holds the palette — see `TODO.md`, check 0.1). Therefore:

- Every hint describes the **tool route first** and gives the command as an alternative.
- Cells **9A, 9B and 9C need the input bar** (a function can only be defined by typing). All other cells can be solved with the palette alone.
- The `graphing` app rejects some geometry commands: `Tangent` and `Angle` (with two lines) return false there, while they work in `classic`. That is why 9C runs in `classic` (2026-11-12); 9A and 9B stay in `graphing`.
- `customToolBar` is honoured by the `graphing` app too (9A, 9B): the «Eines» tab lists exactly the tools of the palette (verified on 2026-11-10).

## 7. Validators

### 7.1 Contract

Validators are entries of the `VALIDATORS` map in `curs/validators.js`, keyed by `goalId`:

```js
'repte-3b': function(api, GV) { /* return true (pass) or a reason (fail) */ },
```

- `api` is the live applet; `GV` is the helper library of `curs/geovalidator.js`. While a validator runs, `window.ggbApplet === api`, so `GV` helpers read the right applet.
- Validate the **final state** only. Never rely on labels the student chose: iterate with `getAllObjectNames(type)` and test properties. Labels of pre-built objects (`data-commands`) may be used and should be excluded when looking for the student's objects.
- A validator returns `true` when the construction is correct. Otherwise it returns a **reason**: one short Catalan sentence that says what is missing or wrong, which the page shows after «✗ Encara no és correcte.» (`curs/capitols.js`). Anything other than `true` counts as a fail, so a validator that still returned `false` would fail with the generic «Revisa la construcció.».
- Check the conditions in the order the student builds the construction (first the given points, then the auxiliary objects, then the final object), so that the reason is the next thing to do. A reason never gives away a value the student is asked to find (a circumcentre, an intersection, an area to discover). Changing the order of the checks never changes the pass condition, which is their conjunction.
- A validator must return a reason on the initial state (only `data-commands` executed).
- Validators do not modify the construction. The exceptions are `repte-10a` and `cap-10-ex`, which move sliders and put them back (`cap-10-ex` through `GV.sliderMoves`).

### 7.2 Tolerances

| Quantity | Tolerance |
|---|---|
| Coordinates, lengths, radii | `GV.tol` = 0.15 |
| Images of transformations, centres with irrational coordinates | 0.2 |
| Areas | 0.3 (0.4–0.5 where stated) |
| Angles | 1.5° |
| Angles, orientation | accept α and 360° − α: `GV.angleIs` |
| Point on a line | `GV.pointOnLine`: `Distance(P,l)` < 0.01 (`IsOnPath` does not exist) |
| `ArePerpendicular`, `AreParallel` | GeoGebra's own; compare the result with `=== 1` |

The strict legacy helpers (`GV.eps` = 0.001, `GV.coordsEqual`, `GV.distanceEqual`, `GV.isOnPath`, `GV.circlePassesThroughPoints`…) were too tight for constructions made by clicking, or wrong (`isOnPath` relied on a command that does not exist). They were removed on 2026-11-12, when no validator used them any more.

### 7.3 The `GV` helpers (`curs/geovalidator.js`)

`curs/geovalidator.js` holds only the tolerant helpers that the validators use (the strict legacy ones were removed on 2026-11-12, section 7.2). The code below is a copy of the whole file; the file is the authority.

Use them instead of the raw API for three things, each of which was a bug in the published validators (`TODO.md`, check 0.4):

- **Object lists**: `GV.names('polygon')` and `GV.names('conic')`, never `api.getAllObjectNames('polygon' | 'conic')`. `GV.anyOfType` / `GV.filterOfType` take a specific type and are fine for `'line'`, `'angle'`, `'point'`, `'segment'`.
- **Incidence**: `GV.pointOnLine(P, l)`, never `IsOnPath`.
- **Angle measures**: `GV.angleIs(a, deg)`, unless the validator lists the accepted orientations itself (as 9C does).

```js
// ════════════════════════════════════════════════════════
// geovalidator.js — Helpers for the validators (curs/validators.js)
//
// Global object: GV
// Every helper reads the applet through the global ggbApplet: while a
// validator runs, capitols.js sets window.ggbApplet to that exercise's
// applet (the «✓ Comprova» button, which the debug tester also clicks).
//
// Rules for robust validation:
//   1. Never check specific labels the student may not have used.
//   2. Iterate over getAllObjectNames(type) and test properties.
//   3. Compare numbers with a tolerance (GV.tol by default).
//   4. Validate only the final state, never construction steps.
//   5. Avoid trivial validators (e.g. "does any line exist?").
//
// `exclude` is an optional array of labels to skip (normally the pre-built,
// fixed objects of the exercise).
//
// Three facts about the real applet, checked on 2026-11-10, shape the helpers:
//   · getObjectType / getAllObjectNames use the SPECIFIC type: a circle is
//     'circle' (not 'conic'); Polygon(A,B,C) is 'triangle', a 4-gon
//     'quadrilateral', then 'pentagon', 'hexagon', and only the rest (and
//     the regular Polygon(A,B,n)) are 'polygon'.  → GV.names()
//   · IsOnPath is not a GeoGebra command, and getValue() of an unknown
//     expression returns 0, not NaN.  → GV.pointOnLine()
//   · Angles are oriented: the same three points clicked clockwise give
//     the reflex angle (2π − α).  → GV.angleIs()
// ════════════════════════════════════════════════════════

const GV = {

  /** Default tolerance for coordinates, lengths and radii. */
  tol: 0.15,

  /** Real object types behind each family name accepted by GV.names(). */
  FAMILIES: {
    polygon: ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'polygon'],
    conic:   ['circle', 'ellipse', 'hyperbola', 'parabola', 'conic']
  },

  // ── Object lists ──────────────────────────────────────

  /** Labels of every object of a type ([] instead of null/undefined).
   *  'polygon' and 'conic' are families: they gather every specific type. */
  names: function(type) {
    var types = GV.FAMILIES[type] || [type];
    var out = [];
    types.forEach(function(t) {
      (ggbApplet.getAllObjectNames(t) || []).forEach(function(n) {
        if (out.indexOf(n) === -1) out.push(n);
      });
    });
    return out;
  },

  /** Labels of every object in the construction, whatever its type. */
  allNames: function() {
    var out = [];
    var n = ggbApplet.getObjectNumber ? ggbApplet.getObjectNumber() : 0;
    for (var i = 0; i < n; i++) {
      var nm = ggbApplet.getObjectName(i);
      if (nm) out.push(nm);
    }
    return out;
  },

  /** True if some object of the specific type `type` satisfies fn(label).
   *  An exception in fn counts as false. */
  anyOfType: function(type, fn) {
    var names = ggbApplet.getAllObjectNames(type) || [];
    for (var i = 0; i < names.length; i++) {
      try { if (fn(names[i])) return true; } catch (_) {}
    }
    return false;
  },

  /** Labels of the objects of the specific type `type` that satisfy fn(label). */
  filterOfType: function(type, fn) {
    var names = ggbApplet.getAllObjectNames(type) || [];
    var result = [];
    for (var i = 0; i < names.length; i++) {
      try { if (fn(names[i])) result.push(names[i]); } catch (_) {}
    }
    return result;
  },

  /** True if some object has a type that contains `fragment`
   *  (e.g. 'locus'); scans every object, not a getAllObjectNames filter. */
  hasObjectOfType: function(fragment) {
    return GV.allNames().some(function(nm) {
      try {
        return (ggbApplet.getObjectType(nm) || '').toLowerCase().indexOf(fragment) !== -1;
      } catch (e) { return false; }
    });
  },

  // ── Points, segments, polygons, circles ───────────────

  /** True if some point (not in `exclude`) lies within `tol` of (x, y). */
  hasPointAt: function(x, y, tol, exclude) {
    tol = (tol == null) ? GV.tol : tol;
    exclude = exclude || [];
    return GV.names('point').some(function(p) {
      return exclude.indexOf(p) === -1 &&
             Math.abs(ggbApplet.getXcoord(p) - x) < tol &&
             Math.abs(ggbApplet.getYcoord(p) - y) < tol;
    });
  },

  /** [x, y] of every point not in `exclude`. */
  pointCoords: function(exclude) {
    exclude = exclude || [];
    return GV.names('point').filter(function(p) {
      return exclude.indexOf(p) === -1;
    }).map(function(p) {
      return [ggbApplet.getXcoord(p), ggbApplet.getYcoord(p)];
    });
  },

  /** Number of segments whose length is `len` ± tol. */
  countSegments: function(len, tol) {
    tol = (tol == null) ? GV.tol : tol;
    return GV.names('segment').filter(function(s) {
      try {
        var l = ggbApplet.getValue('Length(' + s + ')');
        return isFinite(l) && Math.abs(l - len) < tol;
      } catch (e) { return false; }
    }).length;
  },

  /** Labels of the polygons (not in `exclude`) whose area is `area` ± tol.
   *  The numeric value of a polygon object is its area. */
  polygonsWithArea: function(area, tol, exclude) {
    tol = (tol == null) ? 0.3 : tol;
    exclude = exclude || [];
    return GV.names('polygon').filter(function(p) {
      if (exclude.indexOf(p) !== -1) return false;
      try {
        var a = ggbApplet.getValue(p);
        return isFinite(a) && Math.abs(a - area) < tol;
      } catch (e) { return false; }
    });
  },

  /** Every circle as { label, cx, cy, r }. */
  circles: function(exclude) {
    exclude = exclude || [];
    var out = [];
    GV.names('circle').forEach(function(c) {
      if (exclude.indexOf(c) !== -1) return;
      try {
        var cx = ggbApplet.getValue('x(Center(' + c + '))');
        var cy = ggbApplet.getValue('y(Center(' + c + '))');
        var r  = ggbApplet.getValue('Radius(' + c + ')');
        if (isFinite(cx) && isFinite(cy) && isFinite(r) && r > 0) {
          out.push({ label: c, cx: cx, cy: cy, r: r });
        }
      } catch (e) {}
    });
    return out;
  },

  /** True if circle `c` (an item of GV.circles()) passes within `tol`
   *  of every [x, y] in `pts`. */
  circleThrough: function(c, pts, tol) {
    tol = (tol == null) ? GV.tol : tol;
    return pts.every(function(p) {
      var d = Math.sqrt((p[0] - c.cx) * (p[0] - c.cx) + (p[1] - c.cy) * (p[1] - c.cy));
      return Math.abs(d - c.r) < tol;
    });
  },

  // ── Angles, incidence, perpendicular bisectors ────────

  /** Value of an angle object in degrees, 0…360 (getValue returns radians). */
  degrees: function(angleLabel) {
    return ggbApplet.getValue(angleLabel) * 180 / Math.PI;
  },

  /** True if the angle object measures `deg` ± tol, in either orientation
   *  (α or 360° − α): the student cannot be asked to click anticlockwise. */
  angleIs: function(angleLabel, deg, tol) {
    tol = (tol == null) ? 1.5 : tol;
    var d = GV.degrees(angleLabel);
    return isFinite(d) &&
           (Math.abs(d - deg) < tol || Math.abs(360 - d - deg) < tol);
  },

  /** True if the point lies on the line (or segment, ray) labelled `l`.
   *  `pointExpr` is a label ('P'), 'Midpoint(A,B)' or a literal '(1,2)'.
   *  `l` must be the label of an existing object: with an undefined one
   *  the distance evaluates to 0 and the test would be true. */
  pointOnLine: function(pointExpr, l, tol) {
    tol = (tol == null) ? 0.01 : tol;
    try {
      var d = ggbApplet.getValue('Distance(' + pointExpr + ',' + l + ')');
      return isFinite(d) && d < tol;
    } catch (e) { return false; }
  },

  /** True if line `l` is the perpendicular bisector of the segment that
   *  joins the points labelled `a` and `b`. */
  isPerpBisector: function(l, a, b) {
    try {
      return GV.pointOnLine('Midpoint(' + a + ',' + b + ')', l) &&
             ggbApplet.getValue('ArePerpendicular(Segment(' + a + ',' + b + '),' + l + ')') === 1;
    } catch (e) { return false; }
  },

  // ── Sliders ───────────────────────────────────────────

  /** Labels of the sliders: numbers the student can move. With
   *  `withAngles`, angle sliders too (an angle measured with Angle(A,B,C)
   *  depends on its points and cannot be moved). */
  sliders: function(withAngles) {
    var cands = GV.names('numeric').concat(withAngles ? GV.names('angle') : []);
    return cands.filter(function(n) {
      try { return ggbApplet.isMoveable(n); } catch (e) { return false; }
    });
  },

  /** What a polygon or a conic looks like, as a list to compare with
   *  GV.sameState(): for a polygon, its area and its first two vertices
   *  (so that a translation or a rotation shows); for a conic, its centre
   *  and radius. Both add the object's value as text (the equation of a
   *  conic), when the applet gives it. */
  figureState: function(nm) {
    var isPolygon = GV.FAMILIES.polygon.indexOf(ggbApplet.getObjectType(nm)) !== -1;
    var exprs = isPolygon
      ? [nm, 'x(Vertex(' + nm + ',1))', 'y(Vertex(' + nm + ',1))',
             'x(Vertex(' + nm + ',2))', 'y(Vertex(' + nm + ',2))']
      : ['x(Center(' + nm + '))', 'y(Center(' + nm + '))', 'Radius(' + nm + ')'];
    var state = exprs.map(function(e) {
      try { return ggbApplet.getValue(e); } catch (er) { return NaN; }
    });
    try { state.push(String(ggbApplet.getValueString(nm))); } catch (er) {}
    return state;
  },

  /** True if two GV.figureState() lists are equal (numbers within 1e-6;
   *  two undefined numbers are equal). */
  sameState: function(a, b) {
    if (a.length !== b.length) return false;
    return a.every(function(v, i) {
      var w = b[i];
      if (typeof v === 'number' && typeof w === 'number') {
        if (!isFinite(v) || !isFinite(w)) return !isFinite(v) && !isFinite(w);
        return Math.abs(v - w) < 1e-6;
      }
      return v === w;
    });
  },

  /** True if moving slider `s` changes at least one of `figures` (labels
   *  of polygons or conics). It tries a few values around the current one
   *  (setValue keeps a slider inside its interval, so one direction may not
   *  move it) and always puts the slider back where it was. This is the
   *  only helper that changes the construction. */
  sliderMoves: function(s, figures) {
    var original = ggbApplet.getValue(s);
    var before = figures.map(GV.figureState);
    var moved = false;
    try {
      [1, -1, 0.5, -0.5, 0.1, -0.1].some(function(d) {
        ggbApplet.setValue(s, original + d);
        if (Math.abs(ggbApplet.getValue(s) - original) < 1e-9) return false;   // stuck at an end
        moved = figures.some(function(f, i) { return !GV.sameState(before[i], GV.figureState(f)); });
        return moved;
      });
    } catch (e) {}
    try { ggbApplet.setValue(s, original); } catch (e) {}
    return moved;
  },

};
```

### 7.4 What has been verified, and what has not

Every reference validator of section 9 is now published and passes the end-to-end tester on the live applet (50/50 on 2026-11-12, after the reasons of section 7.1 were added: 30 cells, 10 chapter exercises and the demo check of the 10 chapters); the only change it forced was moving 9C from `graphing` to `classic` (see 9C). On 2026-11-10 the *published* validators were (end-to-end tester, `TODO.md` block 0): three API assumptions turned out to be false (the ❌ rows below). They are now corrected in the published validators (end-to-end: 20/20), in the `GV` extension of section 7.3 and in the reference validators of section 9, which go through `GV.names`, `GV.circles`, `GV.pointOnLine` and `GV.isPerpBisector`.

Two kinds of checks were done earlier on 2026-11-10:

1. **Geometry.** Every numeric target in section 9 (coordinates, areas, radii, angles) was recomputed numerically.
2. **Validator logic.** The 26 new reference validators, together with the `GV` extension, and the 4 published validators were executed against a throw-away emulator of the applet API. For each cell: the *correct* test solution passes, the initial state fails and the *wrong* test solution fails (30/30). The emulator is not part of the repository and proves nothing about GeoGebra itself.

API usage by evidence level:

| API usage | Evidence | Cells that depend on it |
|---|---|---|
| `getAllObjectNames('point' \| 'segment' \| 'line' \| 'angle' \| 'function' \| 'numeric')`, `getXcoord`, `getYcoord` | ✅ e2e green | all |
| `getAllObjectNames('conic')` returns circles | ❌ **false**: a circle has type `circle` and is not in the `conic` list. Use `GV.circles()` / `GV.names('conic')`. | every cell with a circle |
| `getAllObjectNames('polygon')` returns every polygon | ❌ **false**: `Polygon(A,B,C)` is a `triangle`, a 4-gon a `quadrilateral`; only the rest (and `Polygon(A,B,n)`) are `polygon`. A 5-gon is a `pentagon`, a 6-gon a `hexagon`. Use `GV.names('polygon')`. | every cell with a polygon |
| `getValue('Length(s)')`, `getValue('x(Center(c))')`, `getValue('Radius(c)')` | used by published validators | many |
| `getValue('IsOnPath(P,l)')`, also with `Midpoint(A,B)` as the point | ❌ **false**: `IsOnPath` is not a GeoGebra command and always evaluates to 0 (as does any expression the applet cannot parse). Use `GV.pointOnLine` (`Distance(P,l)` < tol; confirmed with a label, with `Midpoint(A,B)` and with a literal point). | 5a, 5c, 6a, 7c |
| `getValue('ArePerpendicular(Segment(A,B),l)')`, `getValue('AreParallel(f,l)')` | used by published validators (`cap-5-ex`, `cap-6-ex`) | 5a, 5c, 7b, 7c |
| `getValue(fn + '(k)')` on a function | used by a published validator (`cap-9-ex`) | 9a, 9b, 9c |
| `getValue(angle)` in radians | ✅ confirmed; angles are oriented, so a clockwise click order returns the reflex angle (2π − α): accept both | 9c |
| `isMoveable(numeric)` to detect a slider | used by a published validator (`cap-10-ex`) | 10a, 10c |
| `getObjectNumber`, `getObjectName`, `getObjectType` | used by a published validator (`repte-10`) | 10b, 10c |
| A transformed polygon exposes its image vertices as points | ✅ confirmed on the live applet (`A'`, `B'`, `C'`) | 8a, 8b, 8c |
| `getValue(polygonLabel)` returns the area | ✅ confirmed on the live applet | 1c, 2b, 2c, 4a, 4b, 4c, 8a, 8b, 8c, 10a |
| `getValue('Distance((x,y),l)')` with a literal point | ✅ confirmed on the live applet | 7b |
| `getObjectType` of a locus contains `locus` | ✅ confirmed on the live applet (`Locus(M,Q)` → `locus`) | 10b, 10c |
| `setValue(slider, v)` updates dependent objects synchronously | ✅ confirmed on the live applet (`Circle(D,k)`: radius 1 → 3 right after `setValue('k',3)`) | 10a |
| `Polygon(A, B, n)` is accepted as regular polygon by `evalCommand` | used by the e2e tester (`cap-7-ex`) | test solutions |
| `getValue('x(Vertex(p,i))')` on a polygon, `getValueString(conic)` (the equation as text) | ✅ confirmed on the live applet (2026-11-12): a triangle moved by a slider changes its first two vertices, an ellipse its equation | `cap-10-ex` (`GV.figureState`) |
| `isMoveable(angle)` for an angle slider (`Slider(0°, 360°, 1°)`); false for an angle measured with `Angle` | ✅ confirmed on the live applet (2026-11-12) | `cap-10-ex` (`GV.sliders(true)`) |
| `exists(label)` | ✅ used by the demo check of the debug tester, which reported a missing object in a deliberately broken copy of a chapter (2026-11-12) | chapter demos |

"Used by published validators" means the expression is in code that is live on the site; the proof that it works is the end-to-end tester (`curs/index.html?debug=1`), which must be run in a browser.

No row is unverified any more. What remains unproven is each reference validator as a whole, and each test solution: run the end-to-end tester when the cell is implemented. If it fails, change the validator, keep the pass condition, and update this file.

## 8. Tests required for every cell

A cell is not done until all three exist and pass:

1. **`test-validators.js`** (Node, mock API): three scenes per cell — correct solution → `true`, initial scene (`INITIAL`) → a reason, wrong solution → a reason — plus other correct routes and typical errors where useful. A reason must be a Catalan sentence that starts with a capital letter and ends with a full stop (`esMotiu`); the test prints every reason, which is the way to proofread them all. Scenes use the real object types. Extend the mock if a new validator needs an expression it lacks.
2. **`curs/debug-tester.js`** (browser, real applet): one `TEST_SOLUTIONS['repte-<id>']` entry with `correct` and `wrong` command lists. Section 9 provides them for every new cell; they use English command names, which work regardless of the applet language. All 30 pass on the live applet (2026-11-12).
3. **`node tools/generate-pages.js --comprova`**: the page is reproduced exactly by its JSON.

## 9. The 30 cells

Each cell gives: metadata, initial construction, palette, the student-facing text (Catalan), the pass condition, the reference validator, the hint and the test solutions.

---

### Theme 1 — El triangle

*Building triangles with prescribed properties; the polygon as a complete object.*

#### 1A — `repte-1a` · Triangle equilàter

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 15 | 16 51` — Move · Point · Segment · Polygon, Regular polygon
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Construeix un <strong>triangle equilàter de costat 4</strong> amb un vèrtex a l'origen <strong>(0, 0)</strong> i un altre a <strong>(4, 0)</strong>.

**Pass condition:**

- at least one polygon exists;
- points at (0, 0) and (4, 0);
- a point at (2, 2√3) or (2, −2√3) (2√3 ≈ 3.464);
- at least 3 segments of length 4.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-1a': function(api, GV) {
  var h = Math.sqrt(12);                       // 2√3 ≈ 3.464
  if (!GV.hasPointAt(0, 0)) return 'Falta un vèrtex a l\'origen, (0, 0).';
  if (!GV.hasPointAt(4, 0)) return 'Falta un vèrtex a (4, 0).';
  if (!GV.hasPointAt(2, h) && !GV.hasPointAt(2, -h))
    return 'Cal un tercer vèrtex a distància 4 de (0, 0) i de (4, 0): l\'eina «Polígon regular» el posa sola.';
  if (GV.names('polygon').length < 1)
    return 'Tens els tres vèrtexs, però falta el triangle: uneix-los amb l\'eina «Polígon».';
  if (GV.countSegments(4) < 3) return 'Els tres costats del triangle han de fer 4.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea els punts <code>A=(0,0)</code> i <code>B=(4,0)</code>. Amb l'eina «Polígon regular», fes clic a A, després a B i indica 3 vèrtexs. Amb la barra d'entrada: <code>Polígon(A, B, 3)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-1a': {
  label: 'Repte 1A — Triangle equilàter',
  correct: ['A=(0,0)', 'B=(4,0)', 'p=Polygon(A,B,3)'],
  wrong:   ['A=(0,0)', 'B=(4,0)', 'C=(2,3)', 'p=Polygon(A,B,C)']   // isosceles, apex at (2, 3) instead of (2, 3.464)
},
```

#### 1B — `repte-1b` · Triangle 3-4-5

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH12 («Pitàgores visual»)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 5 | 15 | 16 | 38 49` — Move · Point, Intersect · Segment · Polygon · Distance or length, Area
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Crea el triangle rectangle de vèrtexs <strong>A = (0, 0)</strong>, <strong>B = (4, 0)</strong> i <strong>C = (0, 3)</strong> (un polígon tancat). Mesura la longitud dels tres costats: la hipotenusa ha de fer <strong>5</strong>.

**Pass condition:**

- at least one polygon exists;
- points at (0, 0), (4, 0) and (0, 3);
- at least one segment of length 5.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-1b': function(api, GV) {
  if (!GV.hasPointAt(0, 0)) return 'Falta el vèrtex A = (0, 0).';
  if (!GV.hasPointAt(4, 0)) return 'Falta el vèrtex B = (4, 0).';
  if (!GV.hasPointAt(0, 3)) return 'Falta el vèrtex C = (0, 3).';
  if (GV.names('polygon').length < 1)
    return 'Tens els tres vèrtexs, però falta el triangle: uneix-los amb l\'eina «Polígon».';
  if (GV.countSegments(5) < 1) return 'Cap costat no fa 5: la hipotenusa és el costat que va de B a C.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea els tres punts i uneix-los amb l'eina «Polígon» (fes clic a A, B, C i torna a A). Amb la barra d'entrada: <code>A=(0,0)</code>, <code>B=(4,0)</code>, <code>C=(0,3)</code> i <code>Polígon(A, B, C)</code>. Amb l'eina «Longitud, perímetre o distància», fes clic a cada costat: obtindràs 4, 3 i 5. Comprova-ho: 3² + 4² = 9 + 16 = 25 = 5².

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-1b': {
  label: 'Repte 1B — Triangle 3-4-5',
  correct: ['A=(0,0)', 'B=(4,0)', 'C=(0,3)', 't=Polygon(A,B,C)'],
  wrong:   ['A=(0,0)', 'B=(4,0)', 'C=(0,2)', 't=Polygon(A,B,C)']   // C misplaced; hypotenuse √20
},
```

**Notes:**

- The measuring step is not enforced: `Polygon` already creates the three sides as segments, so the validator cannot tell whether the Distance tool was used.

#### 1C — `repte-1c` · Triangle medial

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** old CH26
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 16 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment · Polygon · Distance or length, Area
- **`data-view`:** `-1 9 -1 7` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(8,0)
  C=(2,6)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 0)</strong>, <strong>B = (8, 0)</strong> i <strong>C = (2, 6)</strong> ja està construït. Marca els <strong>punts mitjos dels tres costats</strong> i uneix-los per formar el <strong>triangle medial</strong>. Comprova que la seva àrea és exactament <strong>una quarta part</strong> de la del triangle original.

**Pass condition:**

- points (other than A, B, C) at the three midpoints (4, 0), (5, 3) and (1, 3);
- a polygon other than `t` with area 6 ± 0.3 (Area(t) = 24).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-1c': function(api, GV) {
  var given = ['A', 'B', 'C'];
  var mitjos = [[4, 0], [5, 3], [1, 3]].filter(function(p) {
    return GV.hasPointAt(p[0], p[1], GV.tol, given);
  }).length;
  if (mitjos === 0)
    return 'Falten els punts mitjos dels tres costats: fes-los amb l\'eina «Punt mitjà o centre».';
  if (mitjos < 3) return 'Has marcat ' + mitjos + ' dels 3 punts mitjos dels costats.';
  if (GV.polygonsWithArea(6, 0.3, ['t']).length < 1)
    return 'Tens els tres punts mitjos; falta el triangle medial: uneix-los amb l\'eina «Polígon».';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Punt mitjà o centre», fes clic a cada costat: obtindràs (4, 0), (5, 3) i (1, 3). Uneix-los amb «Polígon». Amb la barra d'entrada: <code>D=PuntMitjà(A, B)</code>, <code>E=PuntMitjà(B, C)</code>, <code>F=PuntMitjà(A, C)</code> i <code>Polígon(D, E, F)</code>. Amb l'eina «Àrea» veuràs que el triangle gran fa 24 i el medial fa 6: una quarta part.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-1c': {
  label: 'Repte 1C — Triangle medial',
  correct: ['D=Midpoint(A,B)', 'E=Midpoint(B,C)', 'F=Midpoint(A,C)', 'm=Polygon(D,E,F)'],
  wrong:   ['D=Midpoint(A,B)', 'E=Midpoint(B,C)', 'm=Polygon(A,D,E)']   // only two midpoints; the polygon is not the medial triangle
},
```

---

### Theme 2 — El quadrat

*The square as a tightly constrained regular polygon; side versus diagonal.*

#### 2A — `repte-2a` · Quadrat a l'origen

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11); continues the legacy challenge `repte-5` with the same text, data and pass condition
- **Origin:** published challenge `repte-5`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 51` — Move · Point · Regular polygon
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Crea un <strong>quadrat de costat 3</strong> amb un vèrtex a l'origen <strong>(0, 0)</strong> i un altre vèrtex a <strong>(3, 0)</strong>. El quadrat ha de tenir exactament 4 costats iguals.

**Pass condition:**

- points at (0, 0) and (3, 0);
- at least 4 segments of length 3.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-2a': function(api, GV) {
  if (!GV.hasPointAt(0, 0)) return 'Falta un vèrtex a l\'origen, (0, 0).';
  if (!GV.hasPointAt(3, 0)) return 'Falta un vèrtex a (3, 0).';
  var costats = GV.countSegments(3);
  if (costats === 0) return 'Falta el quadrat: fes-lo amb l\'eina «Polígon regular», amb 4 vèrtexs.';
  if (costats < 4) return 'Un quadrat té 4 costats de longitud 3, i ara n\'hi ha ' + costats + '.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea <code>A=(0,0)</code> i <code>B=(3,0)</code>. Escriu <code>Polígon(A, B, 4)</code> per crear un quadrat de costat 3 sobre el segment AB.

**Test solutions:** in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-2a']`) and `test-validators.js`.

#### 2B — `repte-2b` · Quadrat per vèrtexs oposats

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,C`
- **`data-tools`:** `0 | 1 19 5 | 15 4 8 | 16` — Move · Point, Midpoint or centre, Intersect · Segment, Perpendicular line, Perpendicular bisector · Polygon
- **`data-view`:** `-1 6 -1 6` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  C=(5,5)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Els punts <strong>A = (0, 0)</strong> i <strong>C = (5, 5)</strong> ja estan construïts: són dos <strong>vèrtexs oposats</strong> d'un quadrat. Troba els altres dos vèrtexs i construeix el <strong>quadrat</strong> (un polígon tancat).

**Pass condition:**

- points (other than A, C) at (5, 0) and (0, 5): two opposite vertices determine the square;
- a polygon with area 25 ± 0.3.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-2b': function(api, GV) {
  var given = ['A', 'C'];
  var vertexs = [[5, 0], [0, 5]].filter(function(p) {
    return GV.hasPointAt(p[0], p[1], GV.tol, given);
  }).length;
  if (vertexs === 0) return 'Falten els altres dos vèrtexs del quadrat.';
  if (vertexs === 1) return 'Has trobat un dels dos vèrtexs que falten; falta l\'altre.';
  if (GV.polygonsWithArea(25, 0.3).length < 1)
    return 'Tens els quatre vèrtexs; falta el quadrat: uneix-los amb l\'eina «Polígon», un darrere l\'altre.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> El segment AC és una diagonal del quadrat. L'altra diagonal fa la mateixa longitud, passa pel punt mig de AC i hi és perpendicular: és un tros de la mediatriu de AC. Els vèrtexs que falten són (5, 0) i (0, 5). Crea'ls i uneix els quatre punts, per ordre, amb «Polígon». Amb la barra d'entrada: <code>B=(5,0)</code>, <code>D=(0,5)</code> i <code>Polígon(A, B, C, D)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-2b': {
  label: 'Repte 2B — Quadrat per vèrtexs oposats',
  correct: ['B=(5,0)', 'D=(0,5)', 'q=Polygon(A,B,C,D)'],
  wrong:   ['B=(5,0)', 'D=(0,4)', 'q=Polygon(A,B,C,D)']   // fourth vertex misplaced; area 22.5
},
```

#### 2C — `repte-2c` · Duplicació del quadrat

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,D,q`
- **`data-tools`:** `0 | 1 19 5 | 15 4 8 | 51 16 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment, Perpendicular line, Perpendicular bisector · Regular polygon, Polygon · Distance or length, Area
- **`data-view`:** `-3 3 -1 5` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(2,0)
  C=(2,2)
  D=(0,2)
  q=Polygon(A,B,C,D)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El quadrat ABCD de costat 2 (àrea 4) ja està construït. Construeix un altre <strong>quadrat que tingui exactament el doble d'àrea</strong> (àrea 8).

**Pass condition:**

- a polygon other than `q` with area 8 ± 0.3;
- at least 4 segments of length 2√2 ≈ 2.828 (a quadrilateral with four sides s and area s² is a square).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-2c': function(api, GV) {
  var nous = GV.names('polygon').filter(function(p) { return p !== 'q'; });
  if (nous.length === 0) return 'Falta el quadrat nou, d\'àrea 8.';
  if (GV.polygonsWithArea(8, 0.3, ['q']).length < 1)
    return 'El polígon nou ha de tenir àrea 8, el doble que ABCD.';
  if (GV.countSegments(Math.sqrt(8)) < 4)
    return 'El polígon nou té àrea 8, però no és un quadrat: els quatre costats han de ser iguals.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Doblar el costat no serveix: l'àrea es multiplicaria per 4. La idea, que ja explica Plató al diàleg <em>Menó</em>, és fer servir la <strong>diagonal</strong> del quadrat com a costat del nou. Amb l'eina «Polígon regular», fes clic a A, després a C i indica 4 vèrtexs (<code>Polígon(A, C, 4)</code>). La diagonal fa 2√2, i (2√2)² = 8.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-2c': {
  label: 'Repte 2C — Duplicació del quadrat',
  correct: ['r=Polygon(A,C,4)'],
  wrong:   ['E=(4,0)', 'r=Polygon(A,E,4)']   // side doubled; area 16
},
```

---

### Theme 3 — La circumferència

*Equivalent ways of fixing a circle: centre + radius, centre + point, three points.*

#### 3A — `repte-3a` · Circumferències concèntriques

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11); continues the legacy challenge `repte-3` with the same text, data and pass condition
- **Origin:** published challenge `repte-3`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 34 10` — Move · Point · Circle: centre and radius, Circle: centre and point
- **`data-view`:** `-5 5 -5 5` — region kept visible at load (section 5)
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Crea <strong>dues circumferències concèntriques</strong> (amb el mateix centre) a l'origen (0, 0), de radi <strong>2</strong> i radi <strong>4</strong> respectivament.

**Pass condition:**

- a circle centred at the origin with radius 2;
- a circle centred at the origin with radius 4.

Both with the tolerance `GV.tol` since 2026-11-12. The legacy body allowed 0.02 for the centre and 0.01 for the radius (`GV.eps * 20`, `GV.eps * 10`), far tighter than any other cell.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-3a': function(api, GV) {
  var totes = GV.circles();
  if (totes.length === 0) return 'Falten les dues circumferències de centre (0, 0).';
  var origen = totes.filter(function(c) {
    return Math.abs(c.cx) < GV.tol && Math.abs(c.cy) < GV.tol;
  });
  if (origen.length === 0) return 'Les circumferències han de tenir el centre a l\'origen, (0, 0).';
  var r2 = origen.some(function(c) { return Math.abs(c.r - 2) < GV.tol; });
  var r4 = origen.some(function(c) { return Math.abs(c.r - 4) < GV.tol; });
  if (!r2 && !r4) return 'Les circumferències de centre (0, 0) han de tenir radi 2 i radi 4.';
  if (!r2) return 'Tens la de radi 4; falta la circumferència de radi 2.';
  if (!r4) return 'Tens la de radi 2; falta la circumferència de radi 4.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>Circumferència((0,0), 2)</code> i després <code>Circumferència((0,0), 4)</code>. Ambdues tenen el centre a l'origen però radis diferents.

**Test solutions:** in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-3a']`) and `test-validators.js`.

#### 3B — `repte-3b` · Circumferència per dos punts

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B`
- **`data-tools`:** `0 | 1 19 | 8 4 | 10 11 34 | 15` — Move · Point, Midpoint or centre · Perpendicular bisector, Perpendicular line · Circle: centre and point, Circle through 3 points, Circle: centre and radius · Segment
- **`data-view`:** `-6 6 -2 9` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(-3,0)
  B=(3,0)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Els punts <strong>A = (−3, 0)</strong> i <strong>B = (3, 0)</strong> ja estan construïts. Construeix una <strong>circumferència que passi per A i per B</strong> i que tingui el <strong>centre sobre l'eix Y</strong>.

**Pass condition:**

- some circle whose centre has x = 0 ± 0.15 and that passes through A and B (radius = √(9 + cy²) ± 0.15).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-3b': function(api, GV) {
  var totes = GV.circles();
  if (totes.length === 0) return 'Falta la circumferència que passa per A i per B.';
  var ok = totes.some(function(c) {
    return Math.abs(c.cx) < GV.tol && GV.circleThrough(c, [[-3, 0], [3, 0]]);
  });
  if (ok) return true;
  var perUn = totes.some(function(c) {
    return GV.circleThrough(c, [[-3, 0]]) || GV.circleThrough(c, [[3, 0]]);
  });
  return perUn
    ? 'La circumferència passa per un dels dos punts, però no per l\'altre: el centre ha de ser sobre l\'eix Y.'
    : 'La circumferència ha de passar per A i per B, amb el centre sobre l\'eix Y.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> El centre d'una circumferència que passa per A i per B és a la mateixa distància de tots dos: és un punt de la mediatriu de AB, que aquí és l'eix Y. Tria'n un qualsevol, per exemple (0, 4), i amb l'eina «Circumferència donats el centre i un punt per on passa» fes clic al centre i després a A. Amb la barra d'entrada: <code>K=(0,4)</code> i <code>Circumferència(K, A)</code>. Hi ha infinites solucions.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-3b': {
  label: 'Repte 3B — Circumferència per dos punts',
  correct: ['K=(0,4)', 'd=Circle(K,A)'],
  wrong:   ['K=(1,4)', 'd=Circle(K,A)']   // centre off the Y axis; the circle misses B
},
```

**Notes:**

- There are infinitely many solutions, one per centre (0, cy); the centre at the origin (radius 3) is accepted.

#### 3C — `repte-3c` · Circumferència circumscrita

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** old CH18
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 8 | 10 34 | 15` — Move · Point, Midpoint or centre, Intersect · Perpendicular bisector · Circle: centre and point, Circle: centre and radius · Segment
- **`data-view`:** `-4 4 -3 5` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,4)
  B=(-3,0)
  C=(3,0)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 4)</strong>, <strong>B = (−3, 0)</strong> i <strong>C = (3, 0)</strong> ja està construït. Troba el <strong>circumcentre</strong> (el punt on es tallen les mediatrius) i dibuixa la <strong>circumferència circumscrita</strong>: la que passa pels tres vèrtexs.

**Pass condition:**

- a point (other than A, B, C) at the circumcentre (0, 7/8) = (0, 0.875);
- a circle that passes within 0.15 of the three vertices (circumradius 25/8 = 3.125).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-3c': function(api, GV) {
  var V = [[0, 4], [-3, 0], [3, 0]];
  if (!GV.hasPointAt(0, 7 / 8, GV.tol, ['A', 'B', 'C']))
    return 'Falta el circumcentre: marca el punt on es tallen dues mediatrius ' +
           '(o el centre de la circumferència, amb «Punt mitjà o centre»).';
  if (GV.circles().some(function(c) { return GV.circleThrough(c, V); })) return true;
  return GV.circles().length
    ? 'La circumferència ha de passar pels tres vèrtexs, A, B i C.'
    : 'Tens el circumcentre; falta la circumferència circumscrita, la que passa pels tres vèrtexs.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix dues mediatrius amb l'eina «Mediatriu» (per exemple, la de AB i la de BC) i marca'n el punt de tall amb «Intersecció»: és el circumcentre. Després, amb «Circumferència donats el centre i un punt per on passa», fes clic al circumcentre i a qualsevol vèrtex. La circumferència passarà també pels altres dos. Amb la barra d'entrada: <code>m=Mediatriu(A, B)</code>, <code>n=Mediatriu(B, C)</code>, <code>O=Intersecció(m, n)</code> i <code>Circumferència(O, A)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-3c': {
  label: 'Repte 3C — Circumferència circumscrita',
  correct: ['m=PerpendicularBisector(A,B)', 'n=PerpendicularBisector(B,C)', 'O=Intersect(m,n)', 'd=Circle(O,A)'],
  wrong:   ['O=(0,0)', 'd=Circle(O,B)']   // circle through B and C only, centre at the origin
},
```

**Notes:**

- Tool 11 (circle through three points) is deliberately left out of the palette and the circumcentre must exist as a point, so that the construction goes through the perpendicular bisectors. A student can still type `Circumcircle`-style commands if the input bar is available; that is accepted only if the centre is also marked.

---

### Theme 4 — Polígons regulars

*The regular polygon as a primitive; its relation to the circumscribed circle.*

#### 4A — `repte-4a` · Pentàgon regular

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 51` — Move · Point · Regular polygon
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Construeix un <strong>pentàgon regular de costat 2</strong> amb un costat sobre l'eix X: dos vèrtexs consecutius han de ser <strong>(0, 0)</strong> i <strong>(2, 0)</strong>.

**Pass condition:**

- points at (0, 0) and (2, 0);
- at least 5 segments of length 2;
- a polygon with area 6.882 ± 0.3 (regular pentagon of side 2: √(5(5 + 2√5)) ≈ 6.882; a square gives 4, a hexagon 10.39).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-4a': function(api, GV) {
  var area = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));   // costat 2 → ≈ 6.882
  if (!GV.hasPointAt(0, 0)) return 'Falta un vèrtex a l\'origen, (0, 0).';
  if (!GV.hasPointAt(2, 0)) return 'Falta un vèrtex a (2, 0).';
  if (GV.names('polygon').length === 0)
    return 'Falta el pentàgon: fes-lo amb l\'eina «Polígon regular», amb 5 vèrtexs.';
  if (GV.countSegments(2) < 5 || GV.polygonsWithArea(area, 0.3).length < 1)
    return 'El polígon no és un pentàgon regular de costat 2: ha de tenir 5 costats iguals i 5 angles iguals.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea <code>A=(0,0)</code> i <code>B=(2,0)</code>. Amb l'eina «Polígon regular», fes clic a A, després a B i indica 5 vèrtexs (<code>Polígon(A, B, 5)</code>).

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-4a': {
  label: 'Repte 4A — Pentàgon regular',
  correct: ['A=(0,0)', 'B=(2,0)', 'p=Polygon(A,B,5)'],
  wrong:   ['A=(0,0)', 'B=(2,0)', 'p=Polygon(A,B,6)']   // hexagon
},
```

#### 4B — `repte-4b` · Hexàgon inscrit

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH25
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,c`
- **`data-tools`:** `0 | 1 5 501 | 10 34 | 51` — Move · Point, Intersect, Point on object · Circle: centre and point, Circle: centre and radius · Regular polygon
- **`data-commands`:**

  ```
  O=(0,0)
  c=Circle(O,3)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> La circumferència <strong>c</strong>, de centre l'origen O i radi 3, ja està construïda. Construeix un <strong>hexàgon regular inscrit</strong>: els sis vèrtexs han de ser sobre la circumferència.

**Pass condition:**

- at least 6 points (other than O) at distance 3 ± 0.15 from the origin;
- a polygon with area 27√3/2 ≈ 23.383 ± 0.5 (among the hexagons inscribed in a circle the regular one has the largest area, so the area test rejects irregular ones).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-4b': function(api, GV) {
  var onCircle = GV.pointCoords(['O']).filter(function(p) {
    return Math.abs(Math.sqrt(p[0] * p[0] + p[1] * p[1]) - 3) < GV.tol;
  }).length;
  if (onCircle === 0) return 'Falta l\'hexàgon: els sis vèrtexs han de ser sobre la circumferència c.';
  if (onCircle < 6)
    return 'Els sis vèrtexs de l\'hexàgon han de ser sobre la circumferència c, i ara n\'hi ha ' + onCircle + '.';
  if (GV.polygonsWithArea(13.5 * Math.sqrt(3), 0.5).length < 1)   // 27√3/2 ≈ 23.383
    return GV.names('polygon').length
      ? 'El polígon no és un hexàgon regular: els sis costats han de ser iguals.'
      : 'Tens sis punts sobre c; falta l\'hexàgon: uneix-los amb l\'eina «Polígon», un darrere l\'altre.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> En un hexàgon regular inscrit, el costat fa el mateix que el radi. Posa un punt A sobre la circumferència, per exemple (3, 0). Dibuixa la circumferència de centre A que passa per O i marca on talla c: és el vèrtex següent, B. Amb «Polígon regular», fes clic a A i a B i indica 6 vèrtexs. Si l'hexàgon surt cap a fora, fes clic primer a B i després a A. Amb la barra d'entrada: <code>A=(3,0)</code>, <code>B=Rotació(A, 60°, O)</code> i <code>Polígon(A, B, 6)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-4b': {
  label: 'Repte 4B — Hexàgon inscrit',
  correct: ['A=(3,0)', 'B=Rotate(A,pi/3,O)', 'h=Polygon(A,B,6)'],
  wrong:   ['A=(3,0)', 'B=(0,3)', 'h=Polygon(A,B,4)']   // inscribed square: 4 points on the circle
},
```

#### 4C — `repte-4c` · Octàgon dins d'un quadrat

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `P,Q,R,S,q`
- **`data-tools`:** `0 | 1 5 501 | 10 11 34 | 51 16 | 30 32` — Move · Point, Intersect, Point on object · Circle: centre and point, Circle through 3 points, Circle: centre and radius · Regular polygon, Polygon · Reflect about line, Rotate around point
- **`data-commands`:**

  ```
  P=(-2,-2)
  Q=(2,-2)
  R=(2,2)
  S=(-2,2)
  q=Polygon(P,Q,R,S)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El quadrat de costat 4 centrat a l'origen ja està construït. Construeix un <strong>octàgon regular inscrit al quadrat</strong>: els vuit vèrtexs han de ser sobre els costats del quadrat, dos a cada costat.

**Pass condition:**

- points (other than P, Q, R, S) at the 8 vertices (±k, ±2) and (±2, ±k), with k = 2√2 − 2 ≈ 0.828;
- a polygon other than `q` with area 32(√2 − 1) ≈ 13.255 ± 0.4.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-4c': function(api, GV) {
  var k = 2 * Math.SQRT2 - 2;                 // ≈ 0.828
  var given = ['P', 'Q', 'R', 'S'];
  var targets = [[k, -2], [2, -k], [2, k], [k, 2], [-k, 2], [-2, k], [-2, -k], [-k, -2]];
  var trobats = targets.filter(function(t) {
    return GV.hasPointAt(t[0], t[1], GV.tol, given);
  }).length;
  if (trobats === 0)
    return GV.pointCoords(given).length >= 8
      ? 'Els vèrtexs no fan un octàgon regular: els vuit costats han de ser iguals, ' +
        'els que són sobre el quadrat i els que tallen les cantonades.'
      : 'Cal un octàgon regular amb els vuit vèrtexs sobre els costats del quadrat, ' +
        'dos a cada costat, i els vuit costats iguals.';
  if (trobats < 8) return 'Dels 8 vèrtexs de l\'octàgon regular, n\'hi ha ' + trobats + ' de ben posats.';
  if (GV.polygonsWithArea(32 * (Math.SQRT2 - 1), 0.4, ['q']).length < 1)
    return 'Tens els vuit vèrtexs; falta l\'octàgon: uneix-los amb l\'eina «Polígon», un darrere l\'altre.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Cal retallar les quatre cantonades. Dibuixa una circumferència amb centre a cada cantonada que passi pel centre del quadrat, (0, 0). Cada circumferència talla dos costats; els vuit punts de tall són els vèrtexs de l'octàgon. Marca'ls amb «Intersecció» i uneix-los, per ordre, amb «Polígon». Drecera: n'hi ha prou amb els dos vèrtexs del costat de baix, PQ; amb «Polígon regular», fes-hi clic d'esquerra a dreta i indica 8 vèrtexs. Amb la barra d'entrada: <code>c1=Circumferència(P, (0,0))</code>, <code>c2=Circumferència(Q, (0,0))</code>, <code>E=Intersecció(c2, p)</code>, <code>F=Intersecció(c1, p)</code> i <code>Polígon(E, F, 8)</code> (<code>p</code> és el costat PQ).

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-4c': {
  label: 'Repte 4C — Octàgon dins d\'un quadrat',
  correct: ['k=2*sqrt(2)-2', 'E=(k,-2)', 'F=(2,-k)', 'G=(2,k)', 'H=(k,2)', 'J=(-k,2)', 'K=(-2,k)', 'L=(-2,-k)', 'M=(-k,-2)', 'o=Polygon(E,F,G,H,J,K,L,M)'],
  wrong:   ['E=(1.2,-2)', 'F=(2,-1.2)', 'G=(2,1.2)', 'H=(1.2,2)', 'J=(-1.2,2)', 'K=(-2,1.2)', 'L=(-2,-1.2)', 'M=(-1.2,-2)', 'o=Polygon(E,F,G,H,J,K,L,M)']   // octagon with corners cut at 0.8 instead of 1.172: not regular
},
```

**Notes:**

- Geometry: the corner cut is 4 − 2√2 ≈ 1.172, the octagon side is 4(√2 − 1) ≈ 1.657 and its circumradius is 2/cos(π/8) ≈ 2.165. A circle centred at a corner through the centre of the square has radius 2√2, hence meets the two adjacent sides exactly at the octagon vertices.

---

### Theme 5 — Mediatriu i circumcentre

*The locus of points equidistant from two given points.*

#### 5A — `repte-5a` · Mediatriu d'un segment

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,s`
- **`data-tools`:** `0 | 1 19 5 | 15 | 8` — Move · Point, Midpoint or centre, Intersect · Segment · Perpendicular bisector
- **`data-commands`:**

  ```
  A=(-2,0)
  B=(4,0)
  s=Segment(A,B)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El segment AB amb <strong>A = (−2, 0)</strong> i <strong>B = (4, 0)</strong> ja està construït. Construeix la <strong>mediatriu</strong> del segment i marca'n el <strong>punt mig</strong>.

**Pass condition:**

- a line that is the perpendicular bisector of AB (through `Midpoint(A,B)` and perpendicular to AB);
- a point (other than A, B) at (1, 0).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-5a': function(api, GV) {
  var hasBisector = GV.anyOfType('line', function(l) {
    return GV.isPerpBisector(l, 'A', 'B');
  });
  if (!hasBisector)
    return GV.names('line').length
      ? 'La recta no és la mediatriu de AB: ha de ser perpendicular a AB i passar pel seu punt mig.'
      : 'Falta la mediatriu del segment AB: fes-la amb l\'eina «Mediatriu».';
  if (!GV.hasPointAt(1, 0, GV.tol, ['A', 'B'])) return 'Tens la mediatriu; falta marcar el punt mig de AB.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Mediatriu», fes clic al segment (o als dos extrems): <code>Mediatriu(A, B)</code>. Amb l'eina «Punt mitjà o centre», torna a fer clic al segment: <code>PuntMitjà(A, B)</code>. El punt mig és (1, 0), i la mediatriu hi passa.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-5a': {
  label: 'Repte 5A — Mediatriu d\'un segment',
  correct: ['m=PerpendicularBisector(A,B)', 'M=Midpoint(A,B)'],
  wrong:   ['m=PerpendicularLine(A,s)', 'M=Midpoint(A,B)']   // perpendicular through A, not through the midpoint
},
```

#### 5B — `repte-5b` · El circumcentre

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11); continues the legacy challenge `repte-9` with the same text, data and pass condition
- **Origin:** published challenge `repte-9`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 8 | 10 34` — Move · Point, Midpoint or centre, Intersect · Segment · Perpendicular bisector · Circle: centre and point, Circle: centre and radius
- **`data-view`:** `-1 7 -1 6` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(6,0)
  C=(2,5)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 0)</strong>, <strong>B = (6, 0)</strong> i <strong>C = (2, 5)</strong> ja està construït. Construeix les <strong>mediatrius dels tres costats</strong> del triangle. Marca el <strong>punt on es tallen</strong> les tres mediatrius (el circumcentre).

**Pass condition:**

- a point (other than A, B, C) equidistant from the three vertices within 0.2, i.e. at the circumcentre (3, 1.7).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-5b': function(api, GV) {
  var pts = GV.names('point').filter(function(p) { return ['A', 'B', 'C'].indexOf(p) === -1; });
  if (pts.length === 0) return 'Falta el circumcentre: el punt on es tallen les mediatrius.';
  var ok = pts.some(function(p) {
    var x  = api.getXcoord(p), y = api.getYcoord(p);
    var dA = Math.sqrt(x * x + y * y);
    var dB = Math.sqrt((x - 6) * (x - 6) + y * y);
    var dC = Math.sqrt((x - 2) * (x - 2) + (y - 5) * (y - 5));
    return Math.abs(dA - dB) < 0.2 && Math.abs(dB - dC) < 0.2;
  });
  return ok || 'Cap dels punts que has marcat no és a la mateixa distància dels tres vèrtexs: ' +
               'el circumcentre és on es tallen les mediatrius.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix les mediatrius: <code>Mediatriu(A,B)</code>, <code>Mediatriu(B,C)</code> i <code>Mediatriu(A,C)</code>. Les tres rectes es tallen en un únic punt. Marca'l amb <code>Intersecció(m1, m2)</code>. Aquest punt és equidistant dels tres vèrtexs.

**Test solutions:** in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-5b']`) and `test-validators.js`.

#### 5C — `repte-5c` · Tales i la hipotenusa

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** old CH23 («Teorema de Tales»)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 8 | 10 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment · Perpendicular bisector · Circle: centre and point · Distance or length, Area
- **`data-view`:** `-1 7 -2 6` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(6,0)
  B=(0,4)
  C=(0,0)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle rectangle ABC amb <strong>A = (6, 0)</strong>, <strong>B = (0, 4)</strong> i l'angle recte a <strong>C = (0, 0)</strong> ja està construït. Construeix les <strong>mediatrius</strong> de dos costats, marca el <strong>circumcentre</strong> i dibuixa la <strong>circumferència circumscrita</strong>. On cau el centre?

**Pass condition:**

- at least 2 lines that are perpendicular bisectors of sides of the triangle;
- a point (other than A, B, C) at (3, 2), the midpoint of the hypotenuse AB;
- a circle centred at (3, 2) ± 0.15 through the three vertices (radius √13 ≈ 3.606).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-5c': function(api, GV) {
  var sides = [['A', 'B'], ['B', 'C'], ['A', 'C']];
  var bisectors = GV.filterOfType('line', function(l) {
    return sides.some(function(s) { return GV.isPerpBisector(l, s[0], s[1]); });
  }).length;
  if (bisectors === 0) return 'Falten les mediatrius de dos costats del triangle.';
  if (bisectors === 1) return 'Tens una mediatriu; en falta una altra, d\'un altre costat.';
  if (!GV.hasPointAt(3, 2, GV.tol, ['A', 'B', 'C']))
    return 'Falta el circumcentre: marca el punt on es tallen les dues mediatrius.';
  var ok = GV.circles().some(function(c) {
    return Math.abs(c.cx - 3) < GV.tol && Math.abs(c.cy - 2) < GV.tol &&
           GV.circleThrough(c, [[6, 0], [0, 4], [0, 0]]);
  });
  if (ok) return true;
  return GV.circles().length
    ? 'La circumferència ha de tenir el centre al circumcentre i passar pels tres vèrtexs.'
    : 'Falta la circumferència circumscrita: centre al circumcentre i passant pels tres vèrtexs.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix dues mediatrius amb l'eina «Mediatriu» i marca'n el punt de tall amb «Intersecció». Dibuixa la circumferència amb centre en aquest punt que passa per A. Amb la barra d'entrada: <code>m=Mediatriu(A, C)</code>, <code>n=Mediatriu(B, C)</code>, <code>O=Intersecció(m, n)</code> i <code>Circumferència(O, A)</code>. Fixa't que el centre és (3, 2): el punt mig de la hipotenusa AB. Passa a tots els triangles rectangles: la hipotenusa és un diàmetre de la circumferència circumscrita.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-5c': {
  label: 'Repte 5C — Tales i la hipotenusa',
  correct: ['m=PerpendicularBisector(A,C)', 'n=PerpendicularBisector(B,C)', 'O=Intersect(m,n)', 'd=Circle(O,A)'],
  wrong:   ['M=Midpoint(A,B)', 'd=Circle(M,A)']   // right circle, but no perpendicular bisector was constructed
},
```

---

### Theme 6 — Bisectriu i incentre

*The locus of points equidistant from two lines.*

#### 6A — `repte-6a` · Bisectriu d'un angle

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,A,B,f,g`
- **`data-tools`:** `0 | 1 5 | 2 18 | 9 36` — Move · Point, Intersect · Line, Ray · Angle bisector, Angle
- **`data-commands`:**

  ```
  O=(0,0)
  A=(4,0)
  B=(sqrt(8),sqrt(8))
  f=Ray(O,A)
  g=Ray(O,B)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Les semirectes <strong>f</strong> i <strong>g</strong> surten de l'origen O: f segueix l'eix X i g segueix la recta y = x. Formen un angle de 45°. Construeix la <strong>bisectriu</strong> d'aquest angle.

**Pass condition:**

- a line through O and through `Midpoint(A,B)`. Since |OA| = |OB| = 4, the triangle OAB is isosceles and the bisector of the angle at O is the line through O and the midpoint of AB (slope tan 22.5° ≈ 0.414).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-6a': function(api, GV) {
  var rectes = GV.names('line');
  if (rectes.length === 0) return 'Falta la bisectriu: fes-la amb l\'eina «Bisectriu», fent clic a A, O i B.';
  var perO = rectes.filter(function(l) { return GV.pointOnLine('O', l); });
  if (perO.length === 0) return 'La bisectriu ha de passar pel vèrtex de l\'angle, O.';
  var ok = perO.some(function(l) { return GV.pointOnLine('Midpoint(A,B)', l); });
  return ok || 'La recta passa per O, però no parteix l\'angle en dos angles iguals de 22,5°.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Bisectriu», fes clic als punts A, O i B, per aquest ordre (el vèrtex al mig): <code>Bisectriu(A, O, B)</code>. La bisectriu parteix l'angle en dos angles de 22.5°.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-6a': {
  label: 'Repte 6A — Bisectriu d\'un angle',
  correct: ['b=AngleBisector(A,O,B)'],
  wrong:   ['b=Line(O,(4,2))']   // line through O with slope 0.5 instead of 0.414
},
```

**Notes:**

- `B` is placed at distance 4 from O (not on a grid node) precisely so that the validator can use `Midpoint(A,B)`. The rays f and g cannot satisfy the test: neither passes through that midpoint.

#### 6B — `repte-6b` · L'incentre

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH17
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 2 15 | 9 | 10 38` — Move · Point, Midpoint or centre, Intersect · Line, Segment · Angle bisector · Circle: centre and point, Distance or length
- **`data-view`:** `-1 9 -1 7` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(8,0)
  C=(3,6)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 0)</strong>, <strong>B = (8, 0)</strong> i <strong>C = (3, 6)</strong> ja està construït. Construeix les <strong>bisectrius</strong> de dos angles interiors i marca el punt on es tallen: l'<strong>incentre</strong>.

**Pass condition:**

- at least 2 lines exist;
- a point (other than A, B, C) at the incentre ≈ (3.449, 2.132), tolerance 0.2. The incentre is computed in the validator as (a·A + b·B + c·C)/(a + b + c) with a = |BC| = √61, b = |CA| = √45, c = |AB| = 8.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-6b': function(api, GV) {
  var a = Math.sqrt(61), b = Math.sqrt(45), c = 8;   // |BC|, |CA|, |AB|
  var ix = (b * 8 + c * 3) / (a + b + c);            // ≈ 3.449
  var iy = (c * 6) / (a + b + c);                    // ≈ 2.132
  var given = ['A', 'B', 'C'];
  var rectes = GV.names('line').length;
  if (rectes === 0) return 'Falten les bisectrius de dos angles del triangle: eina «Bisectriu».';
  if (rectes === 1) return 'Tens una recta; falta la bisectriu d\'un altre angle.';
  if (GV.hasPointAt(ix, iy, 0.2, given)) return true;
  return GV.pointCoords(given).length
    ? 'Cap punt no és a l\'incentre: comprova que les dues rectes siguin bisectrius d\'angles ' +
      'del triangle (no mediatrius ni altures) i marca on es tallen.'
    : 'Falta l\'incentre: marca el punt on es tallen les dues bisectrius.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Bisectriu», fes clic a tres punts amb el vèrtex al mig: B, A, C per a l'angle A, i A, B, C per a l'angle B. Marca el punt de tall amb «Intersecció». Amb la barra d'entrada: <code>m=Bisectriu(B, A, C)</code>, <code>n=Bisectriu(A, B, C)</code> i <code>I=Intersecció(m, n)</code>. La tercera bisectriu passa pel mateix punt: l'incentre és a la mateixa distància dels tres costats.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-6b': {
  label: 'Repte 6B — L\'incentre',
  correct: ['m=AngleBisector(B,A,C)', 'n=AngleBisector(A,B,C)', 'I=Intersect(m,n)'],
  wrong:   ['m=PerpendicularBisector(A,B)', 'n=PerpendicularBisector(B,C)', 'I=Intersect(m,n)']   // circumcentre (4, 1.75) instead of the incentre
},
```

#### 6C — `repte-6c` · Circumferència inscrita

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 5 | 15 2 | 9 4 | 10 34 | 38` — Move · Point, Intersect · Segment, Line · Angle bisector, Perpendicular line · Circle: centre and point, Circle: centre and radius · Distance or length
- **`data-view`:** `-1 8 -1 7` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(7,0)
  C=(2.5,6)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 0)</strong>, <strong>B = (7, 0)</strong> i <strong>C = (2.5, 6)</strong> ja està construït. Troba l'<strong>incentre</strong> i dibuixa la <strong>circumferència inscrita</strong>: la que és tangent als tres costats.

**Pass condition:**

- a point (other than A, B, C) at the incentre (3, 2);
- a circle with centre (3, 2) ± 0.15 and radius 2 ± 0.15.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-6c': function(api, GV) {
  if (!GV.hasPointAt(3, 2, GV.tol, ['A', 'B', 'C']))
    return 'Falta l\'incentre: marca el punt on es tallen les bisectrius ' +
           '(o el centre de la circumferència inscrita, amb «Punt mitjà o centre»).';
  var ok = GV.circles().some(function(c) {
    return Math.abs(c.cx - 3) < GV.tol && Math.abs(c.cy - 2) < GV.tol &&
           Math.abs(c.r - 2) < GV.tol;
  });
  if (ok) return true;
  return GV.circles().length
    ? 'La circumferència ha de tenir el centre a l\'incentre i tocar els tres costats sense tallar-los.'
    : 'Tens l\'incentre; falta la circumferència inscrita, la que toca els tres costats.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Troba l'incentre tallant dues bisectrius. Per saber el radi, traça la perpendicular al costat AB que passa per l'incentre i marca on talla AB: és el punt de tangència. Dibuixa la circumferència de centre l'incentre que passa per aquest punt. Amb la barra d'entrada: <code>m=Bisectriu(B, A, C)</code>, <code>n=Bisectriu(A, B, C)</code>, <code>I=Intersecció(m, n)</code>, <code>h=Perpendicular(I, c)</code>, <code>T=Intersecció(h, c)</code> i <code>Circumferència(I, T)</code> (<code>c</code> és el costat AB). Ha de sortir de centre (3, 2) i radi 2.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-6c': {
  label: 'Repte 6C — Circumferència inscrita',
  correct: ['m=AngleBisector(B,A,C)', 'n=AngleBisector(A,B,C)', 'I=Intersect(m,n)', 'h=PerpendicularLine(I,Line(A,B))', 'T=Intersect(h,Line(A,B))', 'd=Circle(I,T)'],
  wrong:   ['m=AngleBisector(B,A,C)', 'n=AngleBisector(A,B,C)', 'I=Intersect(m,n)', 'd=Circle(I,A)']   // circle centred at the incentre but through a vertex (radius √13)
},
```

**Notes:**

- The triangle is a 13-14-15 triangle scaled by 1/2 (sides 6.5, 7, 7.5; area 21; semiperimeter 10.5), chosen so that the incentre (3, 2) and the inradius 2 are integers.

---

### Theme 7 — Perpendiculars i paral·leles

*Angle relations between lines; objects derived from incidence or angle conditions.*

#### 7A — `repte-7a` · Perpendicular i peu

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11); continues the legacy challenge `repte-8` with the same text, data and pass condition
- **Origin:** published challenge `repte-8`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `f,P`
- **`data-tools`:** `0 | 1 5 | 2 | 4` — Move · Point, Intersect · Line · Perpendicular line
- **`data-view`:** `-2 8 -1 5` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  f=Line((0,0),(4,1))
  P=(3,4)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> La recta <strong>f</strong> i el punt <strong>P = (3, 4)</strong> ja estan construïts. Crea la <strong>recta perpendicular a f</strong> que passi per P. Marca el <strong>punt d'intersecció</strong> entre f i la perpendicular (el "peu" de la perpendicular).

**Pass condition:**

- some line other than `f` exists;
- a point (other than P) at the foot of the perpendicular, (64/17, 16/17) ≈ (3.765, 0.941), tolerance 0.2.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-7a': function(api, GV) {
  var footX = 64 / 17;
  var footY = 16 / 17;
  var tol   = 0.2;
  var noves = GV.names('line').filter(function(l) { return l !== 'f'; });
  if (noves.length === 0) return 'Falta la recta perpendicular a f que passa per P: eina «Recta perpendicular».';
  var hasFoot = GV.names('point').some(function(p) {
    if (p === 'P') return false;
    return Math.abs(api.getXcoord(p) - footX) < tol &&
           Math.abs(api.getYcoord(p) - footY) < tol;
  });
  if (hasFoot) return true;
  var perp = noves.some(function(l) {
    return api.getValue('ArePerpendicular(f,' + l + ')') === 1 && GV.pointOnLine('P', l);
  });
  return perp
    ? 'Tens la perpendicular; falta marcar el peu: el punt on talla f (eina «Intersecció»).'
    : 'La recta nova ha de ser perpendicular a f i passar per P; després, marca el punt on talla f.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>Perpendicular(P, f)</code> per crear la recta perpendicular a f que passa per P. Després escriu <code>Intersecció(f, g)</code> (on <code>g</code> és el nom de la perpendicular) per marcar el peu. El punt d'intersecció apareixerà sobre f.

**Test solutions:** in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-7a']`) and `test-validators.js`.

#### 7B — `repte-7b` · Paral·leles a distància 2

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH11, reworked
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,f`
- **`data-tools`:** `0 | 1 5 | 2 15 | 3 4 | 34` — Move · Point, Intersect · Line, Segment · Parallel line, Perpendicular line · Circle: centre and radius
- **`data-commands`:**

  ```
  O=(0,0)
  f=Line(O,(4,3))
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> La recta <strong>f</strong>, que passa per l'origen O, ja està construïda. Construeix <strong>dues rectes paral·leles a f a distància 2</strong>, una a cada banda.

**Pass condition:**

- a line other than `f`, parallel to `f`, passing within 0.15 of (−1.2, 1.6);
- a line other than `f`, parallel to `f`, passing within 0.15 of (1.2, −1.6).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-7b': function(api, GV) {
  function parallel(l) {
    return l !== 'f' && api.getValue('AreParallel(f,' + l + ')') === 1;
  }
  function parallelThrough(x, y) {
    return GV.anyOfType('line', function(l) {
      return parallel(l) && GV.pointOnLine('(' + x + ',' + y + ')', l, GV.tol);
    });
  }
  var una = parallelThrough(-1.2, 1.6), altra = parallelThrough(1.2, -1.6);   // O ± 2·(−3/5, 4/5)
  if (una && altra) return true;
  if (una || altra) return 'Tens una paral·lela a distància 2; falta la de l\'altra banda de f.';
  if (GV.anyOfType('line', parallel)) return 'Les paral·leles han d\'estar a distància 2 de f, una a cada banda.';
  return GV.names('line').length > 1
    ? 'Les rectes noves han de ser paral·leles a f.'
    : 'Falten les dues paral·leles a f, a distància 2, una a cada banda.';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Recta perpendicular», traça la perpendicular a f que passa per O. Amb «Circumferència: Centre i Radi», dibuixa la circumferència de centre O i radi 2, i marca amb «Intersecció» els dos punts on talla la perpendicular: són a distància 2 de f, un a cada banda. Amb l'eina «Recta paral·lela», fes passar per cadascun una paral·lela a f. Amb la barra d'entrada: <code>p=Perpendicular(O, f)</code>, <code>k=Circumferència(O, 2)</code>, <code>P=Intersecció(p, k, 1)</code>, <code>Q=Intersecció(p, k, 2)</code>, <code>Recta(P, f)</code> i <code>Recta(Q, f)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-7b': {
  label: 'Repte 7B — Paral·leles a distància 2',
  correct: ['g=Line((-1.2,1.6),f)', 'h=Line((1.2,-1.6),f)'],
  wrong:   ['g=Line((-1.2,1.6),f)', 'h=Line((-2.4,3.2),f)']   // both parallels on the same side (distances 2 and 4)
},
```

**Notes:**

- f has direction (4, 3) and unit normal (−3/5, 4/5); the two test points are O ± 2·normal.
- Old CH11 asked for parallels through two given points; the grid version asks for a given distance, which needs the perpendicular + circle chain.

#### 7C — `repte-7c` · L'ortocentre

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** old CH28
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 5 | 2 15 | 3 4 8 | 38` — Move · Point, Intersect · Line, Segment · Parallel line, Perpendicular line, Perpendicular bisector · Distance or length
- **`data-view`:** `-1 9 -1 7` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(8,0)
  C=(3,6)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle ABC amb <strong>A = (0, 0)</strong>, <strong>B = (8, 0)</strong> i <strong>C = (3, 6)</strong> ja està construït. Construeix <strong>dues altures</strong> (la perpendicular a un costat que passa pel vèrtex oposat) i marca el punt on es tallen: l'<strong>ortocentre</strong>.

**Pass condition:**

- at least 2 lines that are altitudes (perpendicular to a side and through the opposite vertex);
- a point (other than A, B, C) at the orthocentre (3, 2.5), tolerance 0.2.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-7c': function(api, GV) {
  var alt = [['A', 'B', 'C'], ['B', 'C', 'A'], ['A', 'C', 'B']];   // side X-Y, opposite vertex Z
  var altitudes = GV.filterOfType('line', function(l) {
    return alt.some(function(s) {
      return api.getValue('ArePerpendicular(Segment(' + s[0] + ',' + s[1] + '),' + l + ')') === 1 &&
             GV.pointOnLine(s[2], l);
    });
  }).length;
  if (altitudes === 0)
    return GV.names('line').length
      ? 'Les rectes no són altures: cada altura passa per un vèrtex i és perpendicular al costat oposat.'
      : 'Falten les altures: en calen dues (eina «Recta perpendicular», per un vèrtex i el costat oposat).';
  if (altitudes === 1) return 'Tens una altura; en falta una altra.';
  if (!GV.hasPointAt(3, 2.5, 0.2, ['A', 'B', 'C']))
    return 'Falta l\'ortocentre: marca el punt on es tallen les dues altures.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Recta perpendicular», fes clic al vèrtex C i al costat AB; després, al vèrtex A i al costat BC. Marca el punt de tall amb «Intersecció»: és l'ortocentre, (3, 2.5). Amb la barra d'entrada: <code>h=Perpendicular(C, c)</code>, <code>k=Perpendicular(A, a)</code> i <code>H=Intersecció(h, k)</code> (<code>c</code> és el costat AB i <code>a</code>, el costat BC). La tercera altura hi passa també.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-7c': {
  label: 'Repte 7C — L\'ortocentre',
  correct: ['h=PerpendicularLine(C,Line(A,B))', 'k=PerpendicularLine(A,Line(B,C))', 'H=Intersect(h,k)'],
  wrong:   ['M=Midpoint(B,C)', 'N=Midpoint(A,B)', 'h=Line(A,M)', 'k=Line(C,N)', 'G=Intersect(h,k)']   // medians and centroid (11/3, 2)
},
```

---

### Theme 8 — Transformacions

*Plane isometries and what they preserve.*

#### 8A — `repte-8a` · Translació d'un triangle

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH13 («Translació verificada»)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t,v`
- **`data-tools`:** `0 | 1 | 15 16 | 31` — Move · Point · Segment, Polygon · Translate by vector
- **`data-view`:** `-1 8 -1 6` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(0,0)
  B=(3,0)
  C=(1,3)
  t=Polygon(A,B,C)
  v=Vector((0,0),(4,2))
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle <strong>t</strong> i el vector <strong>v = (4, 2)</strong> ja estan construïts. Construeix la <strong>imatge del triangle per la translació de vector v</strong>.

**Pass condition:**

- points (other than A, B, C) at the images A' = (4, 2), B' = (7, 2), C' = (5, 5), tolerance 0.2;
- a polygon other than `t` with area 4.5 ± 0.3.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-8a': function(api, GV) {
  var given = ['A', 'B', 'C'];
  var images = [[4, 2], [7, 2], [5, 5]];
  var trobats = images.filter(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); }).length;
  if (trobats === 0)
    return GV.names('polygon').filter(function(p) { return p !== 't'; }).length
      ? 'El triangle nou no és la imatge de t per la translació de vector v.'
      : 'Falta la imatge del triangle: eina «Translació segons un vector», clic al triangle i després al vector v.';
  if (trobats < 3) return 'Dels 3 vèrtexs de la imatge, n\'hi ha ' + trobats + ' de ben posats.';
  if (GV.polygonsWithArea(4.5, 0.3, ['t']).length < 1)
    return 'Tens els tres vèrtexs de la imatge; falta el triangle: uneix-los amb l\'eina «Polígon».';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Translació segons un vector», fes clic al triangle i després al vector: <code>Translació(t, v)</code>. Cada vèrtex es desplaça 4 unitats a la dreta i 2 amunt; la forma i l'àrea no canvien.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-8a': {
  label: 'Repte 8A — Translació d\'un triangle',
  correct: ['Translate(t,v)'],
  wrong:   ['Translate(t,Vector((0,0),(2,4)))']   // wrong vector
},
```

#### 8B — `repte-8b` · Rotació de 60°

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,A,B,C,t`
- **`data-tools`:** `0 | 1 | 7 | 15 16 | 29 30 31 32 | 49` — Move · Point · Vector · Segment, Polygon · Reflect about point, Reflect about line, Translate by vector, Rotate around point · Area
- **`data-view`:** `-1 6 -1 6` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  O=(0,0)
  A=(2,0)
  B=(5,0)
  C=(5,2)
  t=Polygon(A,B,C)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle <strong>t</strong> i el punt <strong>O = (0, 0)</strong> ja estan construïts. <strong>Gira el triangle 60° en sentit antihorari</strong> al voltant de O. Mesura l'àrea del triangle i la de la seva imatge: han de coincidir.

**Pass condition:**

- points (other than O, A, B, C) at the images A' = (1, √3) ≈ (1, 1.732), B' = (2.5, 2.5√3) ≈ (2.5, 4.330), C' = (2.5 − √3, 2.5√3 + 1) ≈ (0.768, 5.330), tolerance 0.2;
- a polygon other than `t` with area 3 ± 0.3.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-8b': function(api, GV) {
  var given = ['O', 'A', 'B', 'C'];
  var co = 0.5, si = Math.sqrt(3) / 2;        // cos 60°, sin 60°
  var images = [[2, 0], [5, 0], [5, 2]].map(function(p) {
    return [p[0] * co - p[1] * si, p[0] * si + p[1] * co];
  });
  var trobats = images.filter(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); }).length;
  if (trobats === 0)
    return GV.names('polygon').filter(function(p) { return p !== 't'; }).length
      ? 'El triangle nou no és la imatge de t pel gir de 60° en sentit antihorari al voltant de O: ' +
        'revisa l\'angle, el sentit i el centre.'
      : 'Falta la imatge del triangle: eina «Rotació al voltant d\'un punt», clic al triangle, ' +
        'després a O, i 60° en sentit antihorari.';
  if (trobats < 3) return 'Dels 3 vèrtexs de la imatge, n\'hi ha ' + trobats + ' de ben posats.';
  if (GV.polygonsWithArea(3, 0.3, ['t']).length < 1)
    return 'Tens els tres vèrtexs de la imatge; falta el triangle: uneix-los amb l\'eina «Polígon».';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Rotació al voltant d'un punt», fes clic al triangle, després al centre O, i indica 60° en sentit antihorari. Amb la barra d'entrada: <code>Rotació(t, 60°, O)</code>. Amb l'eina «Àrea», fes clic a cada triangle: tots dos fan 3. Un gir no canvia ni les longituds ni les àrees.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-8b': {
  label: 'Repte 8B — Rotació de 60°',
  correct: ['Rotate(t,pi/3,O)'],
  wrong:   ['Rotate(t,-pi/3,O)']   // clockwise rotation
},
```

**Notes:**

- The area-measuring step is not enforced (the value of a polygon object is already its area).

#### 8C — `repte-8c` · Reflexió amb lliscament

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** new (related to old CH19)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t,f,v`
- **`data-tools`:** `0 | 1 | 7 | 2 15 16 | 29 30 31 32 33 | 49` — Move · Point · Vector · Line, Segment, Polygon · Reflect about point, Reflect about line, Translate by vector, Rotate around point, Dilate from point · Area
- **`data-view`:** `-1 8 -1 7` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  A=(1,0)
  B=(3,0)
  C=(3,2)
  t=Polygon(A,B,C)
  f=Line((0,0),(1,1))
  v=Vector((0,0),(2,2))
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> El triangle <strong>t</strong>, la recta <strong>f</strong> (y = x) i el vector <strong>v = (2, 2)</strong>, paral·lel a f, ja estan construïts. Una <strong>reflexió amb lliscament</strong> consisteix a reflectir respecte de f i després traslladar amb v. <strong>Aplica-la dues vegades seguides</strong>: primer al triangle t, i després al resultat. Quina transformació porta directament de t al triangle final?

**Pass condition:**

- points (other than A, B, C) at the first glide image (2, 3), (2, 5), (4, 5), tolerance 0.2;
- points (other than A, B, C) at the second glide image (5, 4), (7, 4), (7, 6) = t + (4, 4), tolerance 0.2;
- at least 2 polygons other than `t` with area 2 ± 0.3.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-8c': function(api, GV) {
  var given = ['A', 'B', 'C'];
  function hiEs(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); }
  var primera = [[2, 3], [2, 5], [4, 5]].every(hiEs);      // after one glide reflection
  var segona  = [[5, 4], [7, 4], [7, 6]].every(hiEs);      // after two: t translated by (4, 4)
  if (!primera)
    return 'Falta la primera reflexió amb lliscament: reflecteix t respecte de f i trasllada el resultat amb v.';
  if (!segona)
    return 'Tens la primera reflexió amb lliscament; falta aplicar-la una altra vegada al triangle que has obtingut.';
  if (GV.polygonsWithArea(2, 0.3, ['t']).length < 2)
    return 'Tens els vèrtexs, però falten els triangles: aplica les transformacions al polígon, no als punts.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Fes quatre passos: reflecteix t respecte de f («Simetria axial»), trasllada el resultat amb v («Translació segons un vector»), torna a reflectir respecte de f i torna a traslladar amb v. Amb la barra d'entrada: <code>r=Simetria(t, f)</code>, <code>g=Translació(r, v)</code>, <code>s=Simetria(g, f)</code> i <code>Translació(s, v)</code>. El triangle final és el triangle t desplaçat 4 unitats a la dreta i 4 amunt: aplicar dues vegades una reflexió amb lliscament equival a una translació de vector 2v.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-8c': {
  label: 'Repte 8C — Reflexió amb lliscament',
  correct: ['r=Reflect(t,f)', 'g=Translate(r,v)', 's=Reflect(g,f)', 'h=Translate(s,v)'],
  wrong:   ['r=Reflect(t,f)', 'g=Translate(r,v)']   // glide reflection applied only once
},
```

**Notes:**

- Why it works: the reflection and the translation commute because v is parallel to the axis, and the reflection has order 2, so g∘g is the translation by 2v.

---

### Theme 9 — Funcions i corbes

*The curve as a geometric object; intersections as points.*

#### 9A — `repte-9a` · Arrels de la paràbola

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH15
- **App:** `graphing` (`data-app="graphing"`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 5` — Move · Point · Intersect
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Defineix la funció <strong>f(x) = x² − 4</strong>. Marca els <strong>dos punts on la paràbola talla l'eix X</strong> (les arrels de l'equació x² − 4 = 0).

**Pass condition:**

- a function with f(0) = −4, f(1) = −3 and f(2) = 0 (± 0.15);
- points at (2, 0) and (−2, 0).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-9a': function(api, GV) {
  var hasF = GV.anyOfType('function', function(fn) {
    return Math.abs(api.getValue(fn + '(0)') + 4) < GV.tol &&
           Math.abs(api.getValue(fn + '(1)') + 3) < GV.tol &&
           Math.abs(api.getValue(fn + '(2)'))     < GV.tol;
  });
  if (!hasF)
    return GV.names('function').length
      ? 'La funció no és f(x) = x² − 4: revisa-la (s\'escriu f(x)=x^2-4).'
      : 'Falta la funció: escriu f(x)=x^2-4 a la barra d\'entrada.';
  var arrels = (GV.hasPointAt(2, 0) ? 1 : 0) + (GV.hasPointAt(-2, 0) ? 1 : 0);
  if (arrels === 0) return 'Falten les dues arrels: els punts on la paràbola talla l\'eix X.';
  if (arrels === 1) return 'Has marcat una de les dues arrels; falta l\'altra.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>f(x) = x^2 - 4</code> a la barra d'entrada (després d'escriure l'exponent, prem la tecla → per sortir-ne). Les arrels són on f(x) = 0, és a dir, x² = 4: x = 2 i x = −2. Marca-les amb l'eina «Intersecció» de la pestanya «Eines» (clic a la paràbola i a l'eix X) o escriu <code>Arrel(f)</code>.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-9a': {
  label: 'Repte 9A — Arrels de la paràbola',
  correct: ['f(x)=x^2-4', 'Z=Intersect(f,xAxis)'],
  wrong:   ['f(x)=x^2-1', 'Z=Intersect(f,xAxis)']   // different parabola, roots at ±1
},
```

#### 9B — `repte-9b` · Paràbola i recta

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH21
- **App:** `graphing` (`data-app="graphing"`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 5 501 | 36 38` — Move · Point · Intersect, Point on object · Angle, Distance or length
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Defineix la funció <strong>f(x) = x²</strong> i la recta <strong>g(x) = x + 2</strong>. Marca els <strong>dos punts on es tallen</strong> les dues gràfiques.

**Pass condition:**

- a function with f(−1) = 1, f(1) = 1 and f(2) = 4 (± 0.15);
- either a function with g(0) = 2 and g(1) = 3, or any object of type `line` (a student may type `y = x + 2`);
- points at (2, 4) and (−1, 1).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-9b': function(api, GV) {
  var hasParabola = GV.anyOfType('function', function(fn) {
    return Math.abs(api.getValue(fn + '(-1)') - 1) < GV.tol &&
           Math.abs(api.getValue(fn + '(1)')  - 1) < GV.tol &&
           Math.abs(api.getValue(fn + '(2)')  - 4) < GV.tol;
  });
  var hasLine = GV.names('line').length >= 1 ||           // y = x + 2 escrit com a recta
    GV.anyOfType('function', function(fn) {
      return Math.abs(api.getValue(fn + '(0)') - 2) < GV.tol &&
             Math.abs(api.getValue(fn + '(1)') - 3) < GV.tol;
    });
  if (!hasParabola) return 'Falta la paràbola: escriu f(x)=x^2 a la barra d\'entrada.';
  if (!hasLine) return 'Falta la recta: escriu g(x)=x+2 a la barra d\'entrada.';
  var talls = (GV.hasPointAt(2, 4) ? 1 : 0) + (GV.hasPointAt(-1, 1) ? 1 : 0);
  if (talls === 0) return 'Falten els dos punts on es tallen la paràbola i la recta.';
  if (talls === 1) return 'Has marcat un dels dos punts de tall; falta l\'altre.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>f(x) = x^2</code> a la barra d'entrada (després de l'exponent, prem la tecla → per sortir-ne) i després <code>g(x) = x + 2</code>. Amb l'eina «Intersecció» de la pestanya «Eines», fes clic a les dues gràfiques, o escriu <code>Intersecció(f, g)</code>. Amb àlgebra: x² = x + 2 → x² − x − 2 = 0 → (x − 2)(x + 1) = 0. Els punts són (2, 4) i (−1, 1).

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-9b': {
  label: 'Repte 9B — Paràbola i recta',
  correct: ['f(x)=x^2', 'g(x)=x+2', 'P=Intersect(f,g)'],
  wrong:   ['f(x)=x^2', 'g(x)=x+2']   // intersections not marked
},
```

#### 9C — `repte-9c` · Sinus i cosinus

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** old CH24, extended with the angle
- **App:** `classic` (omit `data-app`) — changed from `graphing` on 2026-11-12, see the notes
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 5 501 | 13 | 36 38` — Move · Point, Intersect, Point on object · Tangents · Angle, Distance or length
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Defineix les funcions <strong>f(x) = sin(x)</strong> i <strong>g(x) = cos(x)</strong>. Marca <strong>dos punts on es tallen</strong> les gràfiques i <strong>mesura l'angle</strong> amb què es tallen en un d'ells (l'angle entre les dues rectes tangents).

**Pass condition:**

- a function with value 0 at 0 and 1 at π/2 (sine) and a function with value 1 at 0 and 0 at π/2 (cosine), ± 0.15;
- at least 2 distinct points (x more than 0.5 apart) with |sin x − cos x| < 0.15 and |y − sin x| < 0.15;
- an angle object measuring 70.53° or one of its companions 109.47°, 250.53°, 289.47° (± 1.5°). At x = π/4 the tangent slopes are ±√2/2, so the angle between the tangents is 2·arctan(√2/2) ≈ 70.53°; which of the four values GeoGebra reports depends on the orientation of the two lines.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-9c': function(api, GV) {
  var H = Math.PI / 2;
  function hasFn(at0, atH) {
    return GV.anyOfType('function', function(fn) {
      return Math.abs(api.getValue(fn + '(0)') - at0) < GV.tol &&
             Math.abs(api.getValue(fn + '(' + H + ')') - atH) < GV.tol;
    });
  }
  if (!hasFn(0, 1)) return 'Falta la funció f(x) = sin(x): escriu-la a la barra d\'entrada.';
  if (!hasFn(1, 0)) return 'Falta la funció g(x) = cos(x): escriu-la a la barra d\'entrada.';

  var xs = [];                                 // x of distinct intersection points
  GV.pointCoords().forEach(function(p) {
    var onBoth = Math.abs(Math.sin(p[0]) - Math.cos(p[0])) < GV.tol &&
                 Math.abs(p[1] - Math.sin(p[0])) < GV.tol;
    var isNew = xs.every(function(x) { return Math.abs(x - p[0]) > 0.5; });
    if (onBoth && isNew) xs.push(p[0]);
  });
  if (xs.length === 0) return 'Falten els punts de tall de les dues gràfiques: en cal marcar dos.';
  if (xs.length === 1) return 'Has marcat un punt de tall; en falta un altre.';

  var theta = 2 * Math.atan(Math.SQRT1_2) * 180 / Math.PI;   // ≈ 70.53°
  var accepted = [theta, 180 - theta, 180 + theta, 360 - theta];
  var ok = GV.anyOfType('angle', function(a) {
    var deg = GV.degrees(a);
    return accepted.some(function(t) { return Math.abs(deg - t) < 1.5; });
  });
  if (ok) return true;
  return GV.names('angle').length
    ? 'L\'angle que has mesurat no és el que formen les dues rectes tangents en un punt de tall.'
    : 'Falta mesurar l\'angle entre les dues rectes tangents en un punt de tall (eines «Tangents» i «Angle»).';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>f(x) = sin(x)</code> i <code>g(x) = cos(x)</code> a la barra d'entrada. Les gràfiques es tallen quan sin(x) = cos(x): a x = π/4 ≈ 0.785 i a x = 5π/4 ≈ 3.927. Marca aquests punts amb «Intersecció» o escrivint <code>P=Intersecció(f, g, 0, 2)</code> i <code>Q=Intersecció(f, g, 3, 5)</code> (busca el tall entre x = 0 i x = 2, i entre 3 i 5). En un d'ells, traça la tangent a cada corba amb l'eina «Tangents» (<code>a=Tangent(P, f)</code> i <code>b=Tangent(P, g)</code>) i mesura l'angle entre les dues rectes amb l'eina «Angle» (<code>Angle(a, b)</code>). Segons l'ordre dels clics, GeoGebra mostrarà 70.53°, 109.47°, 250.53° o 289.47°: totes quatre mesures corresponen al mateix angle entre les dues rectes, 70.53°.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-9c': {
  label: 'Repte 9C — Sinus i cosinus',
  correct: ['f(x)=sin(x)', 'g(x)=cos(x)', 'P=Intersect(f,g,0,2)', 'Q=Intersect(f,g,3,5)', 'a=Tangent(P,f)', 'b=Tangent(P,g)', 'w=Angle(a,b)'],
  wrong:   ['f(x)=sin(x)', 'g(x)=cos(x)', 'P=Intersect(f,g,0,2)', 'Q=Intersect(f,g,3,5)']   // intersections marked, angle not measured
},
```

**Notes:**

- **Why `classic`:** in the `graphing` app GeoGebra rejects the commands `Tangent` and `Angle` (`evalCommand` returns false for `Tangent(P,f)`, `Tangent(pi/4,g)`, `Angle(l,k)` with two lines, and for `Tangent` to a circle); the cell could not be solved there. In `classic` they work, and functions are typed in the input bar at the bottom. The pass condition is unchanged. With the hint's commands GeoGebra reports the angle as 289.47°, one of the accepted companions.

---

### Theme 10 — Lliscadors i lloc geomètric

*Parametric constructions; the locus traced by a dependent point.*

#### 10A — `repte-10a` · Polígon dinàmic

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** **published** (2026-11-11)
- **Origin:** old CH30
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 25 | 51` — Move · Point · Slider · Regular polygon
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Crea un lliscador <strong>n</strong> que vagi de 3 a 12, d'un en un. Dibuixa un <strong>polígon regular de n costats</strong>. Quan moguis el lliscador, el polígon ha de canviar: de triangle a dodecàgon.

**Pass condition:**

- at least one polygon and one slider exist;
- dynamic test: for some slider, setting it to 3, 5 and 8 makes the largest polygon area strictly grow (by more than 5 % each step). A regular n-gon grows with n both for a fixed side and for a fixed circumradius. The slider is restored to its original value afterwards.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-10a': function(api, GV) {
  if (GV.sliders().length === 0)
    return 'Falta el lliscador n: crea\'l amb l\'eina «Punt lliscant», de 3 a 12, d\'un en un.';
  if (GV.names('polygon').length < 1) return 'Tens el lliscador; falta el polígon regular de n costats.';

  function largestArea() {
    var best = 0;
    GV.names('polygon').forEach(function(p) {
      var a = api.getValue(p);
      if (isFinite(a) && a > best) best = a;
    });
    return best;
  }

  var ok = GV.sliders().some(function(s) {
    var original = api.getValue(s);
    var creix = false;
    try {
      var areas = [3, 5, 8].map(function(n) { api.setValue(s, n); return largestArea(); });
      creix = areas[0] > 0 && areas[1] > areas[0] * 1.05 && areas[2] > areas[1] * 1.05;
    } catch (e) {}
    try { api.setValue(s, original); } catch (e) {}
    return creix;
  });
  return ok || 'Has creat el lliscador i el polígon, però el polígon no depèn del lliscador: ' +
               'quan el mous, el nombre de costats no canvia. Fes-lo amb Polígon(A, B, n).';
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Punt lliscant», fes clic a la vista i posa-hi nom n, mínim 3, màxim 12 i increment 1 (<code>n = PuntLliscant(3, 12, 1)</code>). Crea dos punts A i B. Amb «Polígon regular», fes clic a A i a B i, on demana el nombre de vèrtexs, escriu <code>n</code> (<code>Polígon(A, B, n)</code>).

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-10a': {
  label: 'Repte 10A — Polígon dinàmic',
  correct: ['n=Slider(3,12,1)', 'A=(1,0)', 'B=Rotate(A,2*pi/n,(0,0))', 'p=Polygon(A,B,n)'],
  wrong:   ['n=Slider(3,12,1)', 'A=(1,0)', 'B=(0,1)', 'p=Polygon(A,B,4)']   // slider present but the polygon does not depend on it
},
```

**Notes:**

- This is the only kind of validator that changes the construction (`api.setValue`). If `setValue` on a slider misbehaves in the live applet, fall back to the static test used by `cap-10-ex` (a slider and a polygon exist) and record the downgrade in TODO.md.

#### 10B — `repte-10b` · Lloc del punt mig

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** **published** (2026-11-11)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,c,Q`
- **`data-tools`:** `0 | 1 19 501 | 25 | 47 | 15` — Move · Point, Midpoint or centre, Point on object · Slider · Locus · Segment
- **`data-commands`:**

  ```
  O=(0,0)
  c=Circle(O,3)
  Q=(6,2)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> La circumferència <strong>c</strong> (centre l'origen O, radi 3) i el punt <strong>Q = (6, 2)</strong> ja estan construïts. Posa un punt <strong>P sobre la circumferència</strong>, construeix el <strong>punt mig M</strong> del segment PQ i dibuixa el <strong>lloc geomètric de M</strong> quan P recorre la circumferència. Quina figura és?

**Pass condition:**

- an object of type locus exists;
- there are two points P and M (other than O, Q) such that P is at distance 3 ± 0.15 from the origin and M is within 0.15 of the midpoint of P and Q.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-10b': function(api, GV) {
  var pts = GV.pointCoords(['O', 'Q']);
  var sobreC = pts.filter(function(P) {
    return Math.abs(Math.sqrt(P[0] * P[0] + P[1] * P[1]) - 3) < GV.tol;
  });
  if (sobreC.length === 0)
    return 'Falta el punt P sobre la circumferència c: eina «Punt en un objecte», clic sobre c.';
  var ambM = sobreC.some(function(P) {
    var mx = (P[0] + 6) / 2, my = (P[1] + 2) / 2;
    return pts.some(function(M) {
      return M !== P && Math.abs(M[0] - mx) < GV.tol && Math.abs(M[1] - my) < GV.tol;
    });
  });
  if (!ambM) return 'Tens P sobre c; falta el punt mig M del segment PQ.';
  if (!GV.hasObjectOfType('locus'))
    return 'Tens P i M; falta el lloc geomètric de M quan P es mou: eina «Lloc geomètric», clic a M i després a P.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Punt en un objecte», fes clic a la circumferència per crear P. Amb «Punt mitjà o centre», fes clic a P i a Q per crear M. Amb l'eina «Lloc geomètric», fes clic primer a M i després a P. Amb la barra d'entrada: <code>P=Punt(c)</code>, <code>M=PuntMitjà(P, Q)</code> i <code>LlocGeomètric(M, P)</code>. El lloc és una circumferència de radi 1.5 (la meitat de 3) amb centre a (3, 1), el punt mig de O i Q.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-10b': {
  label: 'Repte 10B — Lloc del punt mig',
  correct: ['P=Point(c)', 'M=Midpoint(P,Q)', 'l=Locus(M,P)'],
  wrong:   ['P=Point(c)', 'M=Midpoint(P,Q)']   // locus not drawn
},
```

**Notes:**

- The locus is the circle of radius 1.5 centred at (3, 1): the image of c under the homothety of centre Q and ratio 1/2.
- A slider is not required: the point on the circle can be dragged directly, which is the route available with tools only. Driving P with a slider (`Point(c, t)`) is also accepted.

#### 10C — `repte-10c` · L'el·lipse com a lloc geomètric

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** **published** (2026-11-12)
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `F_1,F_2`
- **`data-tools`:** `0 | 1 19 5 501 | 25 | 47 | 10 34 | 38` — Move · Point, Midpoint or centre, Intersect, Point on object · Slider · Locus · Circle: centre and point, Circle: centre and radius · Distance or length
- **`data-view`:** `-6 6 -5 5` — region kept visible at load (section 5)
- **`data-commands`:**

  ```
  F_1=(-3,0)
  F_2=(3,0)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Els focus <strong>F₁ = (−3, 0)</strong> i <strong>F₂ = (3, 0)</strong> ja estan construïts. Una el·lipse és el conjunt dels punts M en què la suma de distàncies als dos focus és constant. Dibuixa, com a <strong>lloc geomètric</strong>, l'el·lipse dels punts amb <strong>MF₁ + MF₂ = 10</strong>.

**Pass condition:**

- at least one slider exists;
- an object of type locus exists;
- a point (other than the foci) whose distances to (−3, 0) and (3, 0) add up to 10 ± 0.15.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`, copied from the file, which is the authority; every failing path returns the reason shown to the student):

```js
'repte-10c': function(api, GV) {
  if (GV.sliders().length < 1)
    return 'Falta un lliscador (eina «Punt lliscant»): farà de distància de M a F₁.';
  var ok = GV.pointCoords(['F_1', 'F_2']).some(function(M) {
    var d1 = Math.sqrt((M[0] + 3) * (M[0] + 3) + M[1] * M[1]);
    var d2 = Math.sqrt((M[0] - 3) * (M[0] - 3) + M[1] * M[1]);
    return Math.abs(d1 + d2 - 10) < GV.tol;
  });
  if (!ok) return 'Falta un punt M amb MF₁ + MF₂ = 10.';
  if (!GV.hasObjectOfType('locus'))
    return 'Tens el punt M; falta el lloc geomètric de M quan es mou el lliscador: ' +
           'eina «Lloc geomètric», clic a M i després al lliscador.';
  return true;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea un lliscador <code>a</code> que vagi de 2 a 8 i posa'l a 5. Dibuixa la circumferència de centre F₁ i radi <code>a</code>, i la de centre F₂ i radi <code>10 - a</code> (eina «Circumferència: Centre i Radi»). Marca un dels punts on es tallen, M: la suma de distàncies als focus és a + (10 − a) = 10. Amb l'eina «Lloc geomètric», fes clic a M i després al lliscador. Amb la barra d'entrada: <code>a=PuntLliscant(2, 8, 0.1)</code>, <code>a=5</code>, <code>c=Circumferència(F_1, a)</code>, <code>d=Circumferència(F_2, 10 - a)</code>, <code>M=Intersecció(c, d, 1)</code> i <code>LlocGeomètric(M, a)</code>. Surt mitja el·lipse; l'altre punt de tall dibuixa l'altra meitat.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-10c': {
  label: 'Repte 10C — L\'el·lipse com a lloc geomètric',
  correct: ['a=Slider(2,8,0.1)', 'SetValue(a,5)', 'c=Circle(F_1,a)', 'd=Circle(F_2,10-a)', 'M=Intersect(c,d,1)', 'l=Locus(M,a)'],
  wrong:   ['a=Slider(2,8,0.1)', 'SetValue(a,5)', 'c=Circle(F_1,a)', 'd=Circle(F_2,8-a)', 'M=Intersect(c,d,1)', 'l=Locus(M,a)']   // focal sum 8 instead of 10
},
```

**Notes:**

- The curve is x²/25 + y²/16 = 1 (semi-axes 5 and 4). The slider must stay within [2, 8] for the two circles to meet.
- The result is a locus object, not a conic, so the validator cannot read semi-axes; it checks the defining property on the generating point instead.

---

## 10. Checklist for implementing one cell

1. Write `tools/pages/repte-<id>.json` from the cell's fields (section 5) and generate the page: `node tools/generate-pages.js --only repte-<id>`.
2. Add the validator to `VALIDATORS` in `curs/validators.js` (key `repte-<id>`).
3. Add the entry to `REPTES_DATA` in `curs/capitols.js`, at its place in grid order.
4. Update the `prev` / `next` of the neighbouring cells' JSON and regenerate them (section 4.3).
5. Add the three scenes to `test-validators.js` and the `TEST_SOLUTIONS` entry to `curs/debug-tester.js` (section 8).
6. Run `node tools/generate-pages.js --comprova`, `node test-validators.js`, `node test-debug-tester-logic.js` and `node --check` on every edited `.js` file.
7. Browser: run `curs/index.html?debug=1` for the new cell (yourself if your sandbox reaches `www.geogebra.org`, otherwise ask the owner), and **type the commands of the hint into the input bar**, in Catalan, then «Comprova»: the hint must lead to ✓. Record in `TODO.md` what this confirms or refutes.
8. Update the counters: the landing page stat (`index.html`), the status table of `TODO.md` and the "Estat del projecte" section of `README.md`.

## Appendix A — Where the legacy challenges went

Pages published until 2026-11-11 (`curs/repte-N.html`), all removed on that date:

| Legacy | Title | Fate |
|---|---|---|
| `repte-1` | Triangle des de zero | retired |
| `repte-2` | Segment de longitud exacta | retired |
| `repte-3` | Circumferències concèntriques | → `repte-3a` |
| `repte-4` | Triangle amb mesures | retired |
| `repte-5` | Quadrat a l'origen | → `repte-2a` |
| `repte-6` | Mediatriu i intersecció | retired (5A covers the perpendicular bisector) |
| `repte-7` | Equilàter comprovat | retired (1A covers the equilateral triangle) |
| `repte-8` | Perpendicular i peu | → `repte-7a` (level changes from Mitjà to Fàcil) |
| `repte-9` | El circumcentre | → `repte-5b` |
| `repte-10` | El rombus | retired |

"Retired" means: page, `REPTES_DATA` entry, validator, test scenes and generator JSON were removed. The text remains in the Git history.

Unpublished challenges of the previous specification (`CH n` = its numbering):

| Previous | Fate | Previous | Fate |
|---|---|---|---|
| CH 11 Paral·leles a distància | → 7B, reworked | CH 21 Paràbola i recta | → 9B |
| CH 12 Pitàgores visual | → 1B | CH 22 Centres del triangle equilàter | dropped |
| CH 13 Translació verificada | → 8A | CH 23 Teorema de Tales | → 5C |
| CH 14 Estrelles del pentàgon | dropped | CH 24 Sinus i cosinus | → 9C, extended |
| CH 15 Arrels de la paràbola | → 9A | CH 25 Hexàgon inscrit | → 4B |
| CH 16 Isòsceles i simetria | dropped | CH 26 Triangle medial | → 1C |
| CH 17 L'incentre | → 6B | CH 27 Reflexió obliqua | dropped |
| CH 18 Cercle circumscrit | → 3C | CH 28 L'ortocentre | → 7C |
| CH 19 Transformacions encadenades | dropped (8C is related) | CH 29 Tres transformacions | dropped |
| CH 20 Diagonals del quadrat | dropped | CH 30 Polígon dinàmic | → 10A |

Totals: 17 cells come from the previous specification (4 of them published), 13 are new (1A, 2B, 2C, 3B, 4A, 4C, 5A, 6A, 6C, 8B, 8C, 10B, 10C).

## Appendix B — Differences from the Word draft (`GeoCat-30Reptes.docx`)

The draft describes each cell in prose, without data, validator code or hints. This file follows it except where a concrete, checkable challenge required a decision:

| Cell | Word draft | This file | Reason |
|---|---|---|---|
| 1C | vertices may be draggable | A, B, C fixed | fixed targets for the validator |
| 3C | palette includes tool 11 | tool 11 removed; the circumcentre must be marked | the draft itself asks for the step-by-step construction |
| 4C | "cut = (L − x)/2" with L = 2 | cut = 4 − 2√2 ≈ 1.172 (i.e. (4 − x)/2 with the full side) | the draft formula used the half side; its values x ≈ 1.657 and R ≈ 2.165 are right |
| 5C | any right triangle, built by the student | fixed triangle A = (6, 0), B = (0, 4), C = (0, 0) | the validator needs known vertices |
| 6A | no data | A and B at distance 4 from O | lets the validator use `Midpoint(A,B)` |
| 6C | no data | 13-14-15 triangle scaled by 1/2 | integer incentre (3, 2) and inradius 2 |
| 7B | palette `0 \| 1 5 \| 2 15 \| 3 4` | tool 34 added | the draft's own strategy needs a circle of radius 2 |
| 8B | palette without Area | tool 49 added | the task asks to measure areas |
| 8C | "oblique axis", no data | axis y = x, v = (2, 2) | integer image coordinates |
| 9C | palette includes tool 47 (Locus) | tool 47 replaced by 13 (Tangents) | the angle between curves needs tangents |
| 10A | validator checks the slider range | dynamic test: the polygon must change with the slider | "a slider and a polygon exist" is trivially satisfied |
| 10B | validator requires a slider | slider optional | the tool route drags a point on the circle; no slider needed |
| 10C | validator expects a conic | validator expects a locus object and the focal sum on a point | `Locus` does not produce a conic |

Not carried over from the draft: the informal proofs attached to some cells. They are not needed to implement the challenges.

## Appendix C — Open items

Tracked in `TODO.md` (block 0 and block E). Settled on 2026-11-10: the input bar (now shown) and `customToolBar` in the `graphing` app (works). Also settled: the API rows of section 7.4 (three were false and are corrected). Still open: nothing about names: the Catalan tool and command names are now the applet's own (tables in section 6), and the hints of all 30 cells were typed into the input bar and pass (the last ten on 2026-11-12).
