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
