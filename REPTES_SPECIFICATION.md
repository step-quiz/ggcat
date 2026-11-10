# GeoCat — Challenge Specification: the 10 × 3 grid

## 1. Purpose and authority of this document

This is the **technical specification of the GeoCat challenges** (`curs/repte-*.html`), written for an AI implementor that starts cold with the repository loaded. Work order and task status live in `TODO.md`; this file defines *what* each challenge is.

The challenges form a **grid of 10 themes × 3 levels = 30 challenges**. This replaces the previous plan (a flat list of 30 challenges numbered 1–30, split 10 Fàcil + 10 Mitjà + 10 Difícil), which is no longer valid.

Authority and precedence:

1. **This file is the single source of truth for the challenge plan.** `GeoCat-30Reptes.docx` is the original prose draft of the grid; it is kept in the repository for reference only and is **obsolete**. Where they differ, this file wins (the known differences are listed in Appendix B).
2. For anything **already implemented**, the repository rule applies: if code and document disagree, the document is the one to fix. Four cells of the grid are already published under legacy names; their text, data and validator body are reproduced here verbatim from the code as of 2026-10-19.
3. Everything in the 26 cells marked *to build* is a specification, not tested production code. Section 7.4 states exactly what has and has not been verified.

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

✅ = already published under a legacy name (rename only). Everything else is to build.

| # | Theme (`TEMES_DATA.titol`) | A — Fàcil | B — Mitjà | C — Difícil |
|---|---|---|---|---|
| 1 | El triangle | `1a` Triangle equilàter | `1b` Triangle 3-4-5 | `1c` Triangle medial |
| 2 | El quadrat | `2a` Quadrat a l'origen ✅ | `2b` Quadrat per vèrtexs oposats | `2c` Duplicació del quadrat |
| 3 | La circumferència | `3a` Circumferències concèntriques ✅ | `3b` Circumferència per dos punts | `3c` Cercle circumscrit |
| 4 | Polígons regulars | `4a` Pentàgon regular | `4b` Hexàgon inscrit | `4c` Octàgon dins d'un quadrat |
| 5 | Mediatriu i circumcentre | `5a` Mediatriu d'un segment | `5b` El circumcentre ✅ | `5c` Tales i la hipotenusa |
| 6 | Bisectriu i incentre | `6a` Bisectriu d'un angle | `6b` L'incentre | `6c` Cercle inscrit |
| 7 | Perpendiculars i paral·leles | `7a` Perpendicular i peu ✅ | `7b` Paral·leles a distància 2 | `7c` L'ortocentre |
| 8 | Transformacions | `8a` Translació d'un triangle | `8b` Rotació de 60° | `8c` Reflexió amb lliscament |
| 9 | Funcions i corbes | `9a` Arrels de la paràbola | `9b` Paràbola i recta | `9c` Sinus i cosinus |
| 10 | Lliscadors i lloc geomètric | `10a` Polígon dinàmic | `10b` Lloc del punt mig | `10c` L'el·lipse com a lloc geomètric |

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
- First existing cell: previous → `capitol-1.html`, label `← Capítols`. Last existing cell: next → `index.html`, label `Inici →`. Otherwise the labels are `← Repte anterior` and `Repte següent →`.
- The **«Reptes»** link in every page header (chapters, challenges, landing page) points to the first cell, `repte-1a.html`.
- **Sidebar** (`renderReptesSidebar(currentId)`): one block per theme that has at least one existing cell, titled `<t> · <theme title>`, with one entry per cell: `<t><L> · <title>`, preceded by ✓ when completed.
- **Course index** (`curs/index.html`): a table with one row per theme and three columns A, B, C; a cell that does not exist yet is rendered empty and not linked.

### 4.4 Student progress and the legacy keys

Progress is `localStorage['geocat_progress'] = { goalId: true, … }` (`curs/progress.js`, a file shared across courses that must not be edited in this repository).

Four legacy challenges continue as grid cells with the same task. On page load, `curs/capitols.js` must copy their progress once:

| Legacy key | New key |
|---|---|
| `repte-3` | `repte-3a` |
| `repte-5` | `repte-2a` |
| `repte-8` | `repte-7a` |
| `repte-9` | `repte-5b` |

For each pair, if the legacy key is set and the new one is not, call `saveGoalCompleted(newKey)`. Legacy keys are left in place (they are harmless and progress is never unset). The keys of the six retired challenges (`repte-1`, `-2`, `-4`, `-6`, `-7`, `-10`) stay orphaned.

## 5. Page template

Every challenge is `curs/repte-<id>.html`, generated from `tools/pages/repte-<id>.json` by `tools/generate-pages.js` (the generator must first learn the new id; see `TODO.md`, block A). The skeleton is the one of the current challenge pages. Per-challenge slots:

| Slot | Where | Value |
|---|---|---|
| `<title>` | `<head>` | `Repte 3B — <title> \| GeoCat` |
| Header title | `.curs-header-title` | `Repte 3B — <title>` |
| Badge | `.chapter-badge` | `⚡ Repte 3B — Mitjà`, colours below |
| `<h1>` | `.chapter-header` | `<title>` |
| Objectiu | first `<p>` of `.chapter-section` | the *Objectiu* of the cell |
| `data-commands` | `.geogebra` div | newline-separated GeoGebra commands (English names) |
| `data-fixed` | `.geogebra` div | comma-separated labels locked with `setFixed` |
| `data-goal-id` | `.geogebra` div | `repte-3b` |
| `data-app` | `.geogebra` div | omitted (classic) or `graphing` |
| `data-tools` | `.geogebra` div | the palette of the cell (section 6) |
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
  "prev": { "url": "repte-3a.html", "label": "← Repte anterior" },
  "next": { "url": "repte-3c.html", "label": "Repte següent →" },
  "hint": "<p>…</p>",
  "sections": [ { "parts": [
    { "h2": "Objectiu", "body": "<p>…</p>" },
    { "h2": "Widget",
      "body": "<p>Construeix la solució i prem <strong>✓ Comprova</strong> quan acabis.</p>",
      "simulador": { "goalId": "repte-3b", "commands": "A=(-3,0)\nB=(3,0)", "fixed": "A,B",
                     "tools": "0 | 1 19 | 8 4 | 10 11 34 | 15", "height": 440 } }
  ] } ]
}
```

All text visible to the student is in **Catalan**. Validators are **never** in the HTML or in the JSON: they live in `curs/validators.js`.

## 6. Tool palettes (`data-tools`)

Each cell restricts the GeoGebra toolbar. `curs/capitols.js` already supports this: a non-empty `data-tools` attribute is passed as the applet parameter `customToolBar`. No published page uses it yet and `tools/generate-pages.js` does not emit it yet.

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

The palette guides the student; it is not a security boundary. The student can also type commands: since 2026-11-10 every non-read-only applet shows the input bar (`classic`: at the bottom; `graphing` exercises: in the left panel, next to the «Eines» tab that holds the palette — see `TODO.md`, check 0.1). Therefore:

- Every hint describes the **tool route first** and gives the command as an alternative.
- Cells **9A, 9B and 9C need the input bar** (a function can only be defined by typing). All other cells can be solved with the palette alone.
- `customToolBar` is honoured by the `graphing` app too (theme 9): the «Eines» tab lists exactly the tools of the palette (verified on 2026-11-10).

## 7. Validators

### 7.1 Contract

Validators are entries of the `VALIDATORS` map in `curs/validators.js`, keyed by `goalId`:

```js
'repte-3b': function(api, GV) { /* return true (pass) or false (fail) */ },
```

- `api` is the live applet; `GV` is the helper library of `curs/geovalidator.js`. While a validator runs, `window.ggbApplet === api`, so `GV` helpers read the right applet.
- Validate the **final state** only. Never rely on labels the student chose: iterate with `getAllObjectNames(type)` and test properties. Labels of pre-built objects (`data-commands`) may be used and should be excluded when looking for the student's objects.
- A validator must return `false` on the initial state (only `data-commands` executed).
- Validators do not modify the construction. The single exception is `repte-10a`, which moves a slider and restores it.

### 7.2 Tolerances

| Quantity | Tolerance |
|---|---|
| Coordinates, lengths, radii | `GV.tol` = 0.15 |
| Images of transformations, centres with irrational coordinates | 0.2 |
| Areas | 0.3 (0.4–0.5 where stated) |
| Angles | 1.5° |
| Exact incidence (`IsOnPath`, `ArePerpendicular`, `AreParallel`) | GeoGebra's own; compare the result with `=== 1` |

`GV.eps` (0.001) and the existing strict helpers (`GV.coordsEqual`, `GV.distanceEqual`, …) are too tight for constructions made by clicking; do not use them in new validators.

### 7.3 `GV` extension required by the new validators

Add these members to the `GV` object in `curs/geovalidator.js` (after `circlePassesThroughPoints`). The reference validators of section 9 depend on them. The four published validators do not, and stay as they are.

```js
  // ── Tolerant helpers for the grid challenges (repte-<theme><level>) ──
  // All of them read the applet through the global ggbApplet, like the
  // helpers above. `exclude` is an optional array of labels to skip
  // (normally the pre-built, fixed objects of the challenge).

  /** Default tolerance for coordinates, lengths and radii. */
  tol: 0.15,

  /** Labels of every object of a type ([] instead of null/undefined). */
  names: function(type) {
    return ggbApplet.getAllObjectNames(type) || [];
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

  /** Every circle as { label, cx, cy, r } (conics without a finite
   *  centre and radius are skipped). */
  circles: function(exclude) {
    exclude = exclude || [];
    var out = [];
    GV.names('conic').forEach(function(c) {
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

  /** Value of an angle object in degrees (getValue returns radians). */
  degrees: function(angleLabel) {
    return ggbApplet.getValue(angleLabel) * 180 / Math.PI;
  },

  /** True if line `l` is the perpendicular bisector of the segment that
   *  joins the points labelled `a` and `b`. */
  isPerpBisector: function(l, a, b) {
    try {
      return ggbApplet.getValue('IsOnPath(Midpoint(' + a + ',' + b + '),' + l + ')') === 1 &&
             ggbApplet.getValue('ArePerpendicular(Segment(' + a + ',' + b + '),' + l + ')') === 1;
    } catch (e) { return false; }
  },

  /** Labels of the sliders: numeric objects the student can move. */
  sliders: function() {
    return GV.names('numeric').filter(function(n) {
      try { return ggbApplet.isMoveable(n); } catch (e) { return false; }
    });
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
```

### 7.4 What has been verified, and what has not

The reference validators of this file have not been run against a live GeoGebra applet. On 2026-11-10 the *published* validators were (end-to-end tester, `TODO.md` block 0), and **three API assumptions that this file shares with them turned out to be false** — see the ❌ rows below and `TODO.md` block 0.4. Until block 0.4 is done, do not copy a reference validator that uses `IsOnPath`, `getAllObjectNames('conic')` or `getAllObjectNames('polygon')` without applying the correction.

Two kinds of checks were done earlier on 2026-11-10:

1. **Geometry.** Every numeric target in section 9 (coordinates, areas, radii, angles) was recomputed numerically.
2. **Validator logic.** The 26 new reference validators, together with the `GV` extension, and the 4 published validators were executed against a throw-away emulator of the applet API. For each cell: the *correct* test solution passes, the initial state fails and the *wrong* test solution fails (30/30). The emulator is not part of the repository and proves nothing about GeoGebra itself.

API usage by evidence level:

| API usage | Evidence | Cells that depend on it |
|---|---|---|
| `getAllObjectNames('point' \| 'segment' \| 'line' \| 'angle' \| 'function' \| 'numeric')`, `getXcoord`, `getYcoord` | ✅ e2e green | all |
| `getAllObjectNames('conic')` returns circles | ❌ **false**: a circle has type `circle` and is not in the `conic` list. Ask for both. | every cell with a circle |
| `getAllObjectNames('polygon')` returns every polygon | ❌ **false**: `Polygon(A,B,C)` is a `triangle`, a 4-gon a `quadrilateral`; only the rest (and `Polygon(A,B,n)`) are `polygon`. Ask for the three. | every cell with a polygon |
| `getValue('Length(s)')`, `getValue('x(Center(c))')`, `getValue('Radius(c)')` | used by published validators | many |
| `getValue('IsOnPath(P,l)')`, also with `Midpoint(A,B)` as the point | ❌ **false**: `IsOnPath` is not a GeoGebra command and always evaluates to 0. Use `Distance(P,l) < tol`. | 5a, 5c, 6a, 7c |
| `getValue('ArePerpendicular(Segment(A,B),l)')`, `getValue('AreParallel(f,l)')` | used by published validators (`cap-5-ex`, `cap-6-ex`) | 5a, 5c, 7b, 7c |
| `getValue(fn + '(k)')` on a function | used by a published validator (`cap-9-ex`) | 9a, 9b, 9c |
| `getValue(angle)` in radians | ✅ confirmed; angles are oriented, so a clockwise click order returns the reflex angle (2π − α): accept both | 9c |
| `isMoveable(numeric)` to detect a slider | used by a published validator (`cap-10-ex`) | 10a, 10c |
| `getObjectNumber`, `getObjectName`, `getObjectType` | used by a published validator (`repte-10`) | 10b, 10c |
| A transformed polygon exposes its image vertices as points | ✅ confirmed on the live applet (`A'`, `B'`, `C'`) | 8a, 8b, 8c |
| `getValue(polygonLabel)` returns the area | ✅ confirmed on the live applet | 1c, 2b, 2c, 4a, 4b, 4c, 8a, 8b, 8c, 10a |
| `getValue('Distance((x,y),l)')` with a literal point | ✅ confirmed on the live applet | 7b |
| `getObjectType` of a locus contains `locus` | **unverified** | 10b, 10c |
| `setValue(slider, v)` updates dependent objects synchronously | **unverified** | 10a |
| `Polygon(A, B, n)` is accepted as regular polygon by `evalCommand` | used by the e2e tester (`cap-7-ex`) | test solutions |

"Used by published validators" means the expression is in code that is live on the site; the proof that it works is the end-to-end tester (`curs/index.html?debug=1`), which must be run in a browser.

The **unverified** rows must be confirmed with the end-to-end tester when the cell is implemented. If one fails, change the validator, keep the pass condition, and update this file.

## 8. Tests required for every cell

A cell is not done until all three exist and pass:

1. **`test-validators.js`** (Node, mock API): three scenes per cell — correct solution → `true`, empty scene → `false`, wrong solution → `false`. The mock must be extended for the expressions the new validators use (polygon value, `Distance`, `setValue`, object types).
2. **`curs/debug-tester.js`** (browser, real applet): one `TEST_SOLUTIONS['repte-<id>']` entry with `correct` and `wrong` command lists. Section 9 provides them for every new cell; they use English command names, which work regardless of the applet language. They were checked only against the emulator of section 7.4.
3. **`node tools/generate-pages.js --comprova`**: the page is reproduced exactly by its JSON.

## 9. The 30 cells

Each cell gives: metadata, initial construction, palette, the student-facing text (Catalan), the pass condition, the reference validator, the hint and the test solutions.

---

### Theme 1 — El triangle

*Building triangles with prescribed properties; the polygon as a complete object.*

#### 1A — `repte-1a` · Triangle equilàter

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-1a': function(api, GV) {
  var h = Math.sqrt(12);                       // 2√3 ≈ 3.464
  if (GV.names('polygon').length < 1) return false;
  return GV.hasPointAt(0, 0) && GV.hasPointAt(4, 0) &&
         (GV.hasPointAt(2, h) || GV.hasPointAt(2, -h)) &&
         GV.countSegments(4) >= 3;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea els punts <code>A=(0,0)</code> i <code>B=(4,0)</code>. Amb l'eina «Polígon regular», fes clic a A, després a B i indica 3 vèrtexs. Amb la barra d'entrada: <code>PolígonRegular(A, B, 3)</code>.

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-1b': function(api, GV) {
  if (GV.names('polygon').length < 1) return false;
  return GV.hasPointAt(0, 0) && GV.hasPointAt(4, 0) && GV.hasPointAt(0, 3) &&
         GV.countSegments(5) >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea els tres punts i uneix-los amb l'eina «Polígon». Amb l'eina «Distància o longitud», fes clic a cada costat: obtindràs 4, 3 i 5. Comprova-ho: 3² + 4² = 9 + 16 = 25 = 5².

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
- **Status:** to build
- **Origin:** old CH26
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 16 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment · Polygon · Distance or length, Area
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-1c': function(api, GV) {
  var given = ['A', 'B', 'C'];
  return GV.hasPointAt(4, 0, GV.tol, given) &&
         GV.hasPointAt(5, 3, GV.tol, given) &&
         GV.hasPointAt(1, 3, GV.tol, given) &&
         GV.polygonsWithArea(6, 0.3, ['t']).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Punt mig», fes clic a cada costat: obtindràs (4, 0), (5, 3) i (1, 3). Uneix-los amb «Polígon». Amb l'eina «Àrea» veuràs que el triangle gran fa 24 i el medial fa 6: una quarta part.

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
- **Status:** **published** as `repte-5` — rename (page, goalId, validator key, test keys) and add `data-tools`; keep text, data and validator body
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`) — body copied verbatim from the published `'repte-5'` entry; it does not use the new `GV` helpers and must not be rewritten during the rename:

```js
'repte-2a': function(api, GV) {
  var tol  = 0.15;
  var pts  = api.getAllObjectNames('point')   || [];
  var segs = api.getAllObjectNames('segment') || [];
  var hasOrigin = pts.some(function(p) {
    return Math.abs(api.getXcoord(p)) < tol && Math.abs(api.getYcoord(p)) < tol;
  });
  var has30 = pts.some(function(p) {
    return Math.abs(api.getXcoord(p) - 3) < tol && Math.abs(api.getYcoord(p)) < tol;
  });
  var sides3 = 0;
  segs.forEach(function(s) {
    try {
      var len = api.getValue('Length(' + s + ')');
      if (isFinite(len) && Math.abs(len - 3) < tol) sides3++;
    } catch(e) {}
  });
  return hasOrigin && has30 && sides3 >= 4;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea <code>A=(0,0)</code> i <code>B=(3,0)</code>. Escriu <code>PolígonRegular(A, B, 4)</code> per crear un quadrat de costat 3 sobre el segment AB.

**Test solutions:** already present in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-5']`) and `test-validators.js` (`CORRECT_SOLUTIONS` / `WRONG_SOLUTIONS['repte-5']`): rename the keys to `repte-2a` and update the `label`.

#### 2B — `repte-2b` · Quadrat per vèrtexs oposats

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,C`
- **`data-tools`:** `0 | 1 19 5 | 15 4 8 | 16` — Move · Point, Midpoint or centre, Intersect · Segment, Perpendicular line, Perpendicular bisector · Polygon
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-2b': function(api, GV) {
  var given = ['A', 'C'];
  return GV.hasPointAt(5, 0, GV.tol, given) &&
         GV.hasPointAt(0, 5, GV.tol, given) &&
         GV.polygonsWithArea(25, 0.3).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> El segment AC és una diagonal del quadrat. L'altra diagonal fa la mateixa longitud, passa pel punt mig de AC i hi és perpendicular: és un tros de la mediatriu de AC. Els vèrtexs que falten són (5, 0) i (0, 5). Crea'ls i uneix els quatre punts, per ordre, amb «Polígon».

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
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,D,q`
- **`data-tools`:** `0 | 1 19 5 | 15 4 8 | 51 16 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment, Perpendicular line, Perpendicular bisector · Regular polygon, Polygon · Distance or length, Area
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-2c': function(api, GV) {
  return GV.polygonsWithArea(8, 0.3, ['q']).length >= 1 &&
         GV.countSegments(Math.sqrt(8)) >= 4;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Doblar el costat no serveix: l'àrea es multiplicaria per 4. La idea, que ja explica Plató al diàleg <em>Menó</em>, és fer servir la <strong>diagonal</strong> del quadrat com a costat del nou. Amb l'eina «Polígon regular», fes clic a A, després a C i indica 4 vèrtexs (<code>PolígonRegular(A, C, 4)</code>). La diagonal fa 2√2, i (2√2)² = 8.

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
- **Status:** **published** as `repte-3` — rename (page, goalId, validator key, test keys) and add `data-tools`; keep text, data and validator body
- **Origin:** published challenge `repte-3`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 | 34 10` — Move · Point · Circle: centre and radius, Circle: centre and point
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Crea <strong>dues circumferències concèntriques</strong> (amb el mateix centre) a l'origen (0, 0), de radi <strong>2</strong> i radi <strong>4</strong> respectivament.

**Pass condition:**

- a circle centred at the origin with radius 2;
- a circle centred at the origin with radius 4.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`) — body copied verbatim from the published `'repte-3'` entry; it does not use the new `GV` helpers and must not be rewritten during the rename:

```js
'repte-3a': function(api, GV) {
  var found2 = false, found4 = false;
  var n = api.getObjectNumber ? api.getObjectNumber() : 0;
  for (var i = 0; i < n; i++) {
    var nm = api.getObjectName(i);
    if (!nm) continue;
    try {
      var cx = api.getValue('x(Center(' + nm + '))');
      var cy = api.getValue('y(Center(' + nm + '))');
      var r  = api.getValue('Radius('   + nm + ')');
      if (!isFinite(cx) || !isFinite(cy) || !isFinite(r) || r <= 0) continue;
      if (Math.abs(cx) > GV.eps * 20 || Math.abs(cy) > GV.eps * 20) continue;
      if (Math.abs(r - 2) < GV.eps * 10) found2 = true;
      if (Math.abs(r - 4) < GV.eps * 10) found4 = true;
    } catch(e) {}
  }
  return found2 && found4;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>Circumferència((0,0), 2)</code> i després <code>Circumferència((0,0), 4)</code>. Ambdues tenen el centre a l'origen però radis diferents.

**Test solutions:** already present in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-3']`) and `test-validators.js` (`CORRECT_SOLUTIONS` / `WRONG_SOLUTIONS['repte-3']`): rename the keys to `repte-3a` and update the `label`.

#### 3B — `repte-3b` · Circumferència per dos punts

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B`
- **`data-tools`:** `0 | 1 19 | 8 4 | 10 11 34 | 15` — Move · Point, Midpoint or centre · Perpendicular bisector, Perpendicular line · Circle: centre and point, Circle through 3 points, Circle: centre and radius · Segment
- **`data-commands`:**

  ```
  A=(-3,0)
  B=(3,0)
  ```

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Els punts <strong>A = (−3, 0)</strong> i <strong>B = (3, 0)</strong> ja estan construïts. Construeix una <strong>circumferència que passi per A i per B</strong> i que tingui el <strong>centre sobre l'eix Y</strong>.

**Pass condition:**

- some circle whose centre has x = 0 ± 0.15 and that passes through A and B (radius = √(9 + cy²) ± 0.15).

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-3b': function(api, GV) {
  return GV.circles().some(function(c) {
    return Math.abs(c.cx) < GV.tol &&
           GV.circleThrough(c, [[-3, 0], [3, 0]]);
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> El centre d'una circumferència que passa per A i per B és a la mateixa distància de tots dos: és un punt de la mediatriu de AB, que aquí és l'eix Y. Tria'n un qualsevol, per exemple (0, 4), i amb l'eina «Circumferència (centre i punt)» fes clic al centre i després a A. Hi ha infinites solucions.

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

#### 3C — `repte-3c` · Cercle circumscrit

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** to build
- **Origin:** old CH18
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 8 | 10 34 | 15` — Move · Point, Midpoint or centre, Intersect · Perpendicular bisector · Circle: centre and point, Circle: centre and radius · Segment
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-3c': function(api, GV) {
  var V = [[0, 4], [-3, 0], [3, 0]];
  if (!GV.hasPointAt(0, 7 / 8, GV.tol, ['A', 'B', 'C'])) return false;
  return GV.circles().some(function(c) { return GV.circleThrough(c, V); });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix dues mediatrius amb l'eina «Mediatriu» (per exemple, la de AB i la de BC) i marca'n el punt de tall amb «Intersecció»: és el circumcentre. Després, amb «Circumferència (centre i punt)», fes clic al circumcentre i a qualsevol vèrtex. La circumferència passarà també pels altres dos.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-3c': {
  label: 'Repte 3C — Cercle circumscrit',
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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-4a': function(api, GV) {
  var area = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));   // side 2 → ≈ 6.882
  return GV.hasPointAt(0, 0) && GV.hasPointAt(2, 0) &&
         GV.countSegments(2) >= 5 &&
         GV.polygonsWithArea(area, 0.3).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea <code>A=(0,0)</code> i <code>B=(2,0)</code>. Amb l'eina «Polígon regular», fes clic a A, després a B i indica 5 vèrtexs (<code>PolígonRegular(A, B, 5)</code>).

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-4b': function(api, GV) {
  var onCircle = GV.pointCoords(['O']).filter(function(p) {
    return Math.abs(Math.sqrt(p[0] * p[0] + p[1] * p[1]) - 3) < GV.tol;
  }).length;
  return onCircle >= 6 &&
         GV.polygonsWithArea(13.5 * Math.sqrt(3), 0.5).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> En un hexàgon regular inscrit, el costat fa el mateix que el radi. Posa un punt A sobre la circumferència, per exemple (3, 0). Dibuixa la circumferència de centre A que passa per O i marca on talla c: és el vèrtex següent, B. Amb «Polígon regular», fes clic a A i a B i indica 6 vèrtexs. Si l'hexàgon surt cap a fora, fes clic primer a B i després a A.

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-4c': function(api, GV) {
  var k = 2 * Math.SQRT2 - 2;                 // ≈ 0.828
  var given = ['P', 'Q', 'R', 'S'];
  var targets = [[k, -2], [2, -k], [2, k], [k, 2], [-k, 2], [-2, k], [-2, -k], [-k, -2]];
  var allThere = targets.every(function(t) {
    return GV.hasPointAt(t[0], t[1], GV.tol, given);
  });
  return allThere &&
         GV.polygonsWithArea(32 * (Math.SQRT2 - 1), 0.4, ['q']).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Cal retallar les quatre cantonades. Dibuixa una circumferència amb centre a cada cantonada que passi pel centre del quadrat, (0, 0). Cada circumferència talla dos costats; els vuit punts de tall són els vèrtexs de l'octàgon. Marca'ls amb «Intersecció» i uneix-los, per ordre, amb «Polígon».

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-5a': function(api, GV) {
  var hasBisector = GV.anyOfType('line', function(l) {
    return GV.isPerpBisector(l, 'A', 'B');
  });
  return hasBisector && GV.hasPointAt(1, 0, GV.tol, ['A', 'B']);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Mediatriu», fes clic al segment (o als dos extrems): <code>Mediatriu(A, B)</code>. Amb l'eina «Punt mig», torna a fer clic al segment: <code>PuntMig(A, B)</code>. El punt mig és (1, 0), i la mediatriu hi passa.

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
- **Status:** **published** as `repte-9` — rename (page, goalId, validator key, test keys) and add `data-tools`; keep text, data and validator body
- **Origin:** published challenge `repte-9`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 8 | 10 34` — Move · Point, Midpoint or centre, Intersect · Segment · Perpendicular bisector · Circle: centre and point, Circle: centre and radius
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`) — body copied verbatim from the published `'repte-9'` entry; it does not use the new `GV` helpers and must not be rewritten during the rename:

```js
'repte-5b': function(api, GV) {
  var pts = api.getAllObjectNames('point') || [];
  return pts.some(function(p) {
    if (p === 'A' || p === 'B' || p === 'C') return false;
    var x  = api.getXcoord(p), y = api.getYcoord(p);
    var dA = Math.sqrt(x * x + y * y);
    var dB = Math.sqrt((x - 6) * (x - 6) + y * y);
    var dC = Math.sqrt((x - 2) * (x - 2) + (y - 5) * (y - 5));
    return Math.abs(dA - dB) < 0.2 && Math.abs(dB - dC) < 0.2;
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix les mediatrius: <code>Mediatriu(A,B)</code>, <code>Mediatriu(B,C)</code> i <code>Mediatriu(A,C)</code>. Les tres rectes es tallen en un únic punt. Marca'l amb <code>Intersecció(m1, m2)</code>. Aquest punt és equidistant dels tres vèrtexs.

**Test solutions:** already present in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-9']`) and `test-validators.js` (`CORRECT_SOLUTIONS` / `WRONG_SOLUTIONS['repte-9']`): rename the keys to `repte-5b` and update the `label`.

#### 5C — `repte-5c` · Tales i la hipotenusa

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** to build
- **Origin:** old CH23 («Teorema de Tales»)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 15 | 8 | 10 | 38 49` — Move · Point, Midpoint or centre, Intersect · Segment · Perpendicular bisector · Circle: centre and point · Distance or length, Area
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-5c': function(api, GV) {
  var sides = [['A', 'B'], ['B', 'C'], ['A', 'C']];
  var bisectors = GV.filterOfType('line', function(l) {
    return sides.some(function(s) { return GV.isPerpBisector(l, s[0], s[1]); });
  }).length;
  if (bisectors < 2) return false;
  if (!GV.hasPointAt(3, 2, GV.tol, ['A', 'B', 'C'])) return false;
  return GV.circles().some(function(c) {
    return Math.abs(c.cx - 3) < GV.tol && Math.abs(c.cy - 2) < GV.tol &&
           GV.circleThrough(c, [[6, 0], [0, 4], [0, 0]]);
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Construeix dues mediatrius amb l'eina «Mediatriu» i marca'n el punt de tall amb «Intersecció». Dibuixa la circumferència amb centre en aquest punt que passa per A. Fixa't que el centre és (3, 2): el punt mig de la hipotenusa AB. Passa a tots els triangles rectangles: la hipotenusa és un diàmetre de la circumferència circumscrita.

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-6a': function(api, GV) {
  return GV.anyOfType('line', function(l) {
    return api.getValue('IsOnPath(O,' + l + ')') === 1 &&
           api.getValue('IsOnPath(Midpoint(A,B),' + l + ')') === 1;
  });
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
- **Status:** to build
- **Origin:** old CH17
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 19 5 | 2 15 | 9 | 10 38` — Move · Point, Midpoint or centre, Intersect · Line, Segment · Angle bisector · Circle: centre and point, Distance or length
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-6b': function(api, GV) {
  var a = Math.sqrt(61), b = Math.sqrt(45), c = 8;   // |BC|, |CA|, |AB|
  var ix = (b * 8 + c * 3) / (a + b + c);            // ≈ 3.449
  var iy = (c * 6) / (a + b + c);                    // ≈ 2.132
  return GV.names('line').length >= 2 &&
         GV.hasPointAt(ix, iy, 0.2, ['A', 'B', 'C']);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Bisectriu», fes clic a tres punts amb el vèrtex al mig: B, A, C per a l'angle A, i A, B, C per a l'angle B. Marca el punt de tall amb «Intersecció». La tercera bisectriu passa pel mateix punt: l'incentre és a la mateixa distància dels tres costats.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-6b': {
  label: 'Repte 6B — L\'incentre',
  correct: ['m=AngleBisector(B,A,C)', 'n=AngleBisector(A,B,C)', 'I=Intersect(m,n)'],
  wrong:   ['m=PerpendicularBisector(A,B)', 'n=PerpendicularBisector(B,C)', 'I=Intersect(m,n)']   // circumcentre (4, 1.75) instead of the incentre
},
```

#### 6C — `repte-6c` · Cercle inscrit

- **Level:** C — Difícil (`dificultat: 'dificil'`)
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 5 | 15 2 | 9 4 | 10 34 | 38` — Move · Point, Intersect · Segment, Line · Angle bisector, Perpendicular line · Circle: centre and point, Circle: centre and radius · Distance or length
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-6c': function(api, GV) {
  if (!GV.hasPointAt(3, 2, GV.tol, ['A', 'B', 'C'])) return false;
  return GV.circles().some(function(c) {
    return Math.abs(c.cx - 3) < GV.tol && Math.abs(c.cy - 2) < GV.tol &&
           Math.abs(c.r - 2) < GV.tol;
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Troba l'incentre tallant dues bisectrius. Per saber el radi, traça la perpendicular al costat AB que passa per l'incentre i marca on talla AB: és el punt de tangència. Dibuixa la circumferència de centre l'incentre que passa per aquest punt. Ha de sortir de centre (3, 2) i radi 2.

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-6c': {
  label: 'Repte 6C — Cercle inscrit',
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
- **Status:** **published** as `repte-8` — rename (page, goalId, validator key, test keys) and add `data-tools`; keep text, data and validator body
- **Origin:** published challenge `repte-8`
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `f,P`
- **`data-tools`:** `0 | 1 5 | 2 | 4` — Move · Point, Intersect · Line · Perpendicular line
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`) — body copied verbatim from the published `'repte-8'` entry; it does not use the new `GV` helpers and must not be rewritten during the rename:

```js
'repte-7a': function(api, GV) {
  var footX = 64 / 17;
  var footY = 16 / 17;
  var tol   = 0.2;
  var hasPerp = GV.anyOfType('line', function(l) { return l !== 'f'; });
  if (!hasPerp) return false;
  var pts    = api.getAllObjectNames('point') || [];
  var hasFoot = pts.some(function(p) {
    if (p === 'P') return false;
    return Math.abs(api.getXcoord(p) - footX) < tol &&
           Math.abs(api.getYcoord(p) - footY) < tol;
  });
  return hasFoot;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>Perpendicular(P, f)</code> per crear la recta perpendicular a f que passa per P. Després escriu <code>Intersecció(f, g)</code> (on <code>g</code> és el nom de la perpendicular) per marcar el peu. El punt d'intersecció apareixerà sobre f.

**Test solutions:** already present in `curs/debug-tester.js` (`TEST_SOLUTIONS['repte-8']`) and `test-validators.js` (`CORRECT_SOLUTIONS` / `WRONG_SOLUTIONS['repte-8']`): rename the keys to `repte-7a` and update the `label`.

#### 7B — `repte-7b` · Paral·leles a distància 2

- **Level:** B — Mitjà (`dificultat: 'mitja'`)
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-7b': function(api, GV) {
  function parallelThrough(x, y) {
    return GV.anyOfType('line', function(l) {
      if (l === 'f') return false;
      if (api.getValue('AreParallel(f,' + l + ')') !== 1) return false;
      var d = api.getValue('Distance((' + x + ',' + y + '),' + l + ')');
      return isFinite(d) && d < GV.tol;
    });
  }
  return parallelThrough(-1.2, 1.6) && parallelThrough(1.2, -1.6);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Traça la perpendicular a f que passa per O. Dibuixa la circumferència de centre O i radi 2 i marca els dos punts on talla la perpendicular: són a distància 2 de f, un a cada banda. Amb l'eina «Paral·lela», fes passar per cadascun una paral·lela a f.

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
- **Status:** to build
- **Origin:** old CH28
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t`
- **`data-tools`:** `0 | 1 5 | 2 15 | 3 4 8 | 38` — Move · Point, Intersect · Line, Segment · Parallel line, Perpendicular line, Perpendicular bisector · Distance or length
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-7c': function(api, GV) {
  var alt = [['A', 'B', 'C'], ['B', 'C', 'A'], ['A', 'C', 'B']];   // side X-Y, opposite vertex Z
  var altitudes = GV.filterOfType('line', function(l) {
    return alt.some(function(s) {
      return api.getValue('ArePerpendicular(Segment(' + s[0] + ',' + s[1] + '),' + l + ')') === 1 &&
             api.getValue('IsOnPath(' + s[2] + ',' + l + ')') === 1;
    });
  }).length;
  return altitudes >= 2 && GV.hasPointAt(3, 2.5, 0.2, ['A', 'B', 'C']);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Perpendicular», fes clic al vèrtex C i al costat AB; després, al vèrtex A i al costat BC. Marca el punt de tall amb «Intersecció»: és l'ortocentre, (3, 2.5). La tercera altura hi passa també.

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
- **Status:** to build
- **Origin:** old CH13 («Translació verificada»)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t,v`
- **`data-tools`:** `0 | 1 | 15 16 | 31` — Move · Point · Segment, Polygon · Translate by vector
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-8a': function(api, GV) {
  var given = ['A', 'B', 'C'];
  var images = [[4, 2], [7, 2], [5, 5]];
  var allThere = images.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
  return allThere && GV.polygonsWithArea(4.5, 0.3, ['t']).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Translació», fes clic al triangle i després al vector: <code>Translació(t, v)</code>. Cada vèrtex es desplaça 4 unitats a la dreta i 2 amunt; la forma i l'àrea no canvien.

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
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `O,A,B,C,t`
- **`data-tools`:** `0 | 1 | 7 | 15 16 | 29 30 31 32 | 49` — Move · Point · Vector · Segment, Polygon · Reflect about point, Reflect about line, Translate by vector, Rotate around point · Area
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-8b': function(api, GV) {
  var given = ['O', 'A', 'B', 'C'];
  var co = 0.5, si = Math.sqrt(3) / 2;        // cos 60°, sin 60°
  var images = [[2, 0], [5, 0], [5, 2]].map(function(p) {
    return [p[0] * co - p[1] * si, p[0] * si + p[1] * co];
  });
  var allThere = images.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
  return allThere && GV.polygonsWithArea(3, 0.3, ['t']).length >= 1;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Rotació», fes clic al triangle, després al centre O, i indica 60° en sentit antihorari. Amb l'eina «Àrea», fes clic a cada triangle: tots dos fan 3. Un gir no canvia ni les longituds ni les àrees.

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
- **Status:** to build
- **Origin:** new (related to old CH19)
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `A,B,C,t,f,v`
- **`data-tools`:** `0 | 1 | 7 | 2 15 16 | 29 30 31 32 33 | 49` — Move · Point · Vector · Line, Segment, Polygon · Reflect about point, Reflect about line, Translate by vector, Rotate around point, Dilate from point · Area
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-8c': function(api, GV) {
  var given = ['A', 'B', 'C'];
  var targets = [[2, 3], [2, 5], [4, 5],      // after one glide reflection
                 [5, 4], [7, 4], [7, 6]];     // after two: t translated by (4, 4)
  var allThere = targets.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
  return allThere && GV.polygonsWithArea(2, 0.3, ['t']).length >= 2;
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Fes quatre passos: reflecteix t respecte de f, trasllada el resultat amb v, torna a reflectir respecte de f i torna a traslladar amb v. El triangle final és el triangle t desplaçat 4 unitats a la dreta i 4 amunt: aplicar dues vegades una reflexió amb lliscament equival a una translació de vector 2v.

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-9a': function(api, GV) {
  var hasF = GV.anyOfType('function', function(fn) {
    return Math.abs(api.getValue(fn + '(0)') + 4) < GV.tol &&
           Math.abs(api.getValue(fn + '(1)') + 3) < GV.tol &&
           Math.abs(api.getValue(fn + '(2)'))     < GV.tol;
  });
  return hasF && GV.hasPointAt(2, 0) && GV.hasPointAt(-2, 0);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>f(x) = x^2 - 4</code> a la barra d'entrada. Les arrels són on f(x) = 0, és a dir, x² = 4: x = 2 i x = −2. Marca-les amb l'eina «Intersecció» (clic a la paràbola i a l'eix X) o escriu <code>Intersecció(f, EixX)</code>.

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-9b': function(api, GV) {
  var hasParabola = GV.anyOfType('function', function(fn) {
    return Math.abs(api.getValue(fn + '(-1)') - 1) < GV.tol &&
           Math.abs(api.getValue(fn + '(1)')  - 1) < GV.tol &&
           Math.abs(api.getValue(fn + '(2)')  - 4) < GV.tol;
  });
  var hasLine = GV.names('line').length >= 1 ||
    GV.anyOfType('function', function(fn) {
      return Math.abs(api.getValue(fn + '(0)') - 2) < GV.tol &&
             Math.abs(api.getValue(fn + '(1)') - 3) < GV.tol;
    });
  return hasParabola && hasLine && GV.hasPointAt(2, 4) && GV.hasPointAt(-1, 1);
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Escriu <code>f(x) = x^2</code> i <code>g(x) = x + 2</code> a la barra d'entrada. Amb l'eina «Intersecció», fes clic a les dues gràfiques (<code>Intersecció(f, g)</code>). Amb àlgebra: x² = x + 2 → x² − x − 2 = 0 → (x − 2)(x + 1) = 0. Els punts són (2, 4) i (−1, 1).

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
- **Status:** to build
- **Origin:** old CH24, extended with the angle
- **App:** `graphing` (`data-app="graphing"`)
- **`data-fixed`:** *(empty)*
- **`data-tools`:** `0 | 1 5 501 | 13 | 36 38` — Move · Point, Intersect, Point on object · Tangents · Angle, Distance or length
- **`data-commands`:** *(empty — the student starts from a blank view)*

**Objectiu** (Catalan; inner HTML of the first `<p>`):

> Defineix les funcions <strong>f(x) = sin(x)</strong> i <strong>g(x) = cos(x)</strong>. Marca <strong>dos punts on es tallen</strong> les gràfiques i <strong>mesura l'angle</strong> amb què es tallen en un d'ells (l'angle entre les dues rectes tangents).

**Pass condition:**

- a function with value 0 at 0 and 1 at π/2 (sine) and a function with value 1 at 0 and 0 at π/2 (cosine), ± 0.15;
- at least 2 distinct points (x more than 0.5 apart) with |sin x − cos x| < 0.15 and |y − sin x| < 0.15;
- an angle object measuring 70.53° or one of its companions 109.47°, 250.53°, 289.47° (± 1.5°). At x = π/4 the tangent slopes are ±√2/2, so the angle between the tangents is 2·arctan(√2/2) ≈ 70.53°; which of the four values GeoGebra reports depends on the orientation of the two lines.

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-9c': function(api, GV) {
  var H = Math.PI / 2;
  function hasFn(at0, atH) {
    return GV.anyOfType('function', function(fn) {
      return Math.abs(api.getValue(fn + '(0)') - at0) < GV.tol &&
             Math.abs(api.getValue(fn + '(' + H + ')') - atH) < GV.tol;
    });
  }
  if (!hasFn(0, 1) || !hasFn(1, 0)) return false;

  var xs = [];                                 // x of distinct intersection points
  GV.pointCoords().forEach(function(p) {
    var onBoth = Math.abs(Math.sin(p[0]) - Math.cos(p[0])) < GV.tol &&
                 Math.abs(p[1] - Math.sin(p[0])) < GV.tol;
    var isNew = xs.every(function(x) { return Math.abs(x - p[0]) > 0.5; });
    if (onBoth && isNew) xs.push(p[0]);
  });
  if (xs.length < 2) return false;

  var theta = 2 * Math.atan(Math.SQRT1_2) * 180 / Math.PI;   // ≈ 70.53°
  var accepted = [theta, 180 - theta, 180 + theta, 360 - theta];
  return GV.anyOfType('angle', function(a) {
    var deg = GV.degrees(a);
    return accepted.some(function(t) { return Math.abs(deg - t) < 1.5; });
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Les gràfiques es tallen quan sin(x) = cos(x): a x = π/4 ≈ 0.785 i a x = 5π/4 ≈ 3.927. Marca aquests punts amb «Intersecció». En un d'ells, traça la tangent a cada corba amb l'eina «Tangents» i mesura l'angle entre les dues rectes amb l'eina «Angle». Ha de sortir 70.53° (o el seu suplementari, 109.47°).

**Test solutions** (English GeoGebra commands, run after `data-commands`):

```js
'repte-9c': {
  label: 'Repte 9C — Sinus i cosinus',
  correct: ['f(x)=sin(x)', 'g(x)=cos(x)', 'P=Intersect(f,g,0,2)', 'Q=Intersect(f,g,3,5)', 'a=Tangent(P,f)', 'b=Tangent(P,g)', 'w=Angle(a,b)'],
  wrong:   ['f(x)=sin(x)', 'g(x)=cos(x)', 'P=Intersect(f,g,0,2)', 'Q=Intersect(f,g,3,5)']   // intersections marked, angle not measured
},
```

---

### Theme 10 — Lliscadors i lloc geomètric

*Parametric constructions; the locus traced by a dependent point.*

#### 10A — `repte-10a` · Polígon dinàmic

- **Level:** A — Fàcil (`dificultat: 'facil'`)
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-10a': function(api, GV) {
  if (GV.names('polygon').length < 1) return false;

  function largestArea() {
    var best = 0;
    GV.names('polygon').forEach(function(p) {
      var a = api.getValue(p);
      if (isFinite(a) && a > best) best = a;
    });
    return best;
  }

  return GV.sliders().some(function(s) {
    var original = api.getValue(s);
    var ok = false;
    try {
      var areas = [3, 5, 8].map(function(n) { api.setValue(s, n); return largestArea(); });
      ok = areas[0] > 0 && areas[1] > areas[0] * 1.05 && areas[2] > areas[1] * 1.05;
    } catch (e) {}
    try { api.setValue(s, original); } catch (e) {}
    return ok;
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Lliscador», fes clic a la vista i posa-hi nom n, mínim 3, màxim 12 i increment 1 (<code>n = Lliscador(3, 12, 1)</code>). Crea dos punts A i B. Amb «Polígon regular», fes clic a A i a B i, on demana el nombre de vèrtexs, escriu <code>n</code> (<code>PolígonRegular(A, B, n)</code>).

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
- **Status:** to build
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-10b': function(api, GV) {
  if (!GV.hasObjectOfType('locus')) return false;
  var pts = GV.pointCoords(['O', 'Q']);
  return pts.some(function(P) {
    if (Math.abs(Math.sqrt(P[0] * P[0] + P[1] * P[1]) - 3) > GV.tol) return false;
    var mx = (P[0] + 6) / 2, my = (P[1] + 2) / 2;
    return pts.some(function(M) {
      return M !== P && Math.abs(M[0] - mx) < GV.tol && Math.abs(M[1] - my) < GV.tol;
    });
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Amb l'eina «Punt sobre objecte», fes clic a la circumferència per crear P. Amb «Punt mig», fes clic a P i a Q per crear M. Amb l'eina «Lloc geomètric», fes clic primer a M i després a P. El lloc és una circumferència de radi 1.5 (la meitat de 3) amb centre a (3, 1), el punt mig de O i Q.

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
- **Status:** to build
- **Origin:** new
- **App:** `classic` (omit `data-app`)
- **`data-fixed`:** `F_1,F_2`
- **`data-tools`:** `0 | 1 19 5 501 | 25 | 47 | 10 34 | 38` — Move · Point, Midpoint or centre, Intersect, Point on object · Slider · Locus · Circle: centre and point, Circle: centre and radius · Distance or length
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

**Reference validator** (entry of `VALIDATORS` in `curs/validators.js`):

```js
'repte-10c': function(api, GV) {
  if (GV.sliders().length < 1) return false;
  if (!GV.hasObjectOfType('locus')) return false;
  return GV.pointCoords(['F_1', 'F_2']).some(function(M) {
    var d1 = Math.sqrt((M[0] + 3) * (M[0] + 3) + M[1] * M[1]);
    var d2 = Math.sqrt((M[0] - 3) * (M[0] - 3) + M[1] * M[1]);
    return Math.abs(d1 + d2 - 10) < GV.tol;
  });
},
```

**Hint** (Catalan; inner HTML of the hint `<p>`):

> Crea un lliscador <code>a</code> que vagi de 2 a 8. Dibuixa la circumferència de centre F₁ i radi <code>a</code>, i la de centre F₂ i radi <code>10 - a</code> (eina «Circumferència: centre i radi»). Marca un dels punts on es tallen, M: la suma de distàncies als focus és a + (10 − a) = 10. Amb l'eina «Lloc geomètric», fes clic a M i després al lliscador. Surt mitja el·lipse; l'altre punt de tall dibuixa l'altra meitat.

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
7. Ask the owner to run `curs/index.html?debug=1` in a browser for the new cell; record in `TODO.md` any row of section 7.4 that this confirms or refutes.
8. Update the counters: the landing page stat (`index.html`), the status table of `TODO.md` and the "Estat del projecte" section of `README.md`.

## Appendix A — Where the legacy challenges went

Published pages (`curs/repte-N.html`, as of 2026-10-19):

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

"Retired" means: page, `REPTES_DATA` entry, validator, test scenes and generator JSON are removed at cut-over. The text remains in the Git history.

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

Tracked in `TODO.md` (block 0 and block E). Settled on 2026-11-10: the input bar (now shown) and `customToolBar` in the `graphing` app (works). Still open: the three false API assumptions of section 7.4 (`TODO.md` block 0.4); the unverified API rows of section 7.4; the Catalan command names used in hints for commands that no published page uses yet (`Translació`, `Bisectriu`, `PuntMig`, `Mediatriu` come from the previous specification; tool names between «» follow the Word draft and should be checked against the Catalan GeoGebra interface).
