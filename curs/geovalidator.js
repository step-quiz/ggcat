// ════════════════════════════════════════════════════════
// geovalidator.js — Llibreria d'assertions geomètriques
//
// Objecte global: GV
// Tots els helpers accedeixen a window.ggbApplet, que és
// injectat per georunner.js quan l'applet està llest.
//
// Principis de validació robusta (secció 7.3 de l'arquitectura):
//   1. Mai comprovar labels específics que l'alumne potser no ha usat.
//   2. Usar getAllObjectNames(type) i iterar per propietat.
//   3. Usar tolerància eps per a totes les comparacions numèriques.
//   4. Validar només l'estat final, mai els passos de construcció.
//   5. Evitar validators trivials (p.ex. "existeix alguna recta?").
// ════════════════════════════════════════════════════════

const GV = {

  // ── Tolerància per a comparacions de punt flotant ─────
  eps: 0.001,

  // ── Existència i tipus ────────────────────────────────

  /**
   * Retorna true si l'objecte 'label' existeix a la construcció.
   */
  pointExists: function(label) {
    return ggbApplet.isDefined(label) &&
           ggbApplet.getObjectType(label) === 'point';
  },

  /**
   * Retorna true si l'objecte 'label' existeix i és del tipus 'type'.
   * El tipus és l'específic de GeoGebra: 'point', 'line', 'segment', 'ray',
   *   'circle', 'ellipse', 'triangle', 'quadrilateral', 'pentagon', 'hexagon',
   *   'polygon' (la resta, i els regulars), 'function', 'angle', 'numeric'…
   *   Per a «qualsevol polígon» o «qualsevol cònica», useu GV.names().
   */
  objectOfType: function(label, type) {
    return ggbApplet.isDefined(label) &&
           ggbApplet.getObjectType(label) === type;
  },

  // ── Coordenades i distàncies ──────────────────────────

  /**
   * Retorna true si el punt 'label' té les coordenades (x, y) ± eps.
   */
  coordsEqual: function(label, x, y) {
    return Math.abs(ggbApplet.getXcoord(label) - x) < GV.eps &&
           Math.abs(ggbApplet.getYcoord(label) - y) < GV.eps;
  },

  /**
   * Retorna true si la distància entre els punts labelA i labelB
   * és igual a 'expected' ± eps.
   */
  distanceEqual: function(labelA, labelB, expected) {
    var d = ggbApplet.getValue('Distance(' + labelA + ',' + labelB + ')');
    return Math.abs(d - expected) < GV.eps;
  },

  /**
   * Retorna true si tots els costats del polígon definit per
   * la llista de labels de punts (en ordre) són iguals ± eps.
   * Exemple: GV.allSidesEqual('A','B','C')  → triangle equilàter
   */
  allSidesEqual: function() {
    var points = Array.prototype.slice.call(arguments);
    if (points.length < 2) return false;
    var dists = [];
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      var b = points[(i + 1) % points.length];
      dists.push(ggbApplet.getValue('Distance(' + a + ',' + b + ')'));
    }
    return dists.every(function(d) { return Math.abs(d - dists[0]) < GV.eps; });
  },

  /**
   * Retorna true si exactament 'count' costats del polígon definit
   * pels 'points' (en ordre) tenen almenys un altre costat d'igual
   * longitud ± eps.
   * Exemple per isòsceles: GV.exactSidesEqual(['A','B','C'], 2)
   *   → els dos costats iguals compten, el tercer no.
   */
  exactSidesEqual: function(points, count) {
    if (points.length < 2) return false;
    var dists = [];
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      var b = points[(i + 1) % points.length];
      dists.push(ggbApplet.getValue('Distance(' + a + ',' + b + ')'));
    }
    // Per cada costat, mirem si algun altre costat té la mateixa longitud
    var equalCount = 0;
    for (var i = 0; i < dists.length; i++) {
      for (var j = 0; j < dists.length; j++) {
        if (j === i) continue;
        if (Math.abs(dists[i] - dists[j]) < GV.eps) {
          equalCount++;
          break;   // aquest costat ja compta, passem al següent
        }
      }
    }
    return equalCount === count;
  },

  // ── Relacions entre objectes ──────────────────────────

  /**
   * Retorna true si el punt pointLabel és sobre el camí/objecte pathLabel.
   * Funciona per a rectes, segments, circumferències, etc.
   */
  isOnPath: function(pointLabel, pathLabel) {
    // «IsOnPath» no és cap comanda de GeoGebra (getValue en tornaria sempre 0):
    // es mira la distància del punt a l'objecte.
    return GV.pointOnLine(pointLabel, pathLabel);
  },

  /**
   * Retorna true si les rectes/segments l1 i l2 són perpendiculars.
   */
  arePerpendicular: function(l1, l2) {
    return ggbApplet.getValue('ArePerpendicular(' + l1 + ',' + l2 + ')') === 1;
  },

  /**
   * Retorna true si les rectes/segments l1 i l2 són paral·leles.
   */
  areParallel: function(l1, l2) {
    return ggbApplet.getValue('AreParallel(' + l1 + ',' + l2 + ')') === 1;
  },

  /**
   * Retorna true si l'angle ABC (en graus) és igual a expectedDeg ± 0.5°.
   * Nota: GeoGebra retorna l'angle en radians des de getValue.
   */
  angleEqual: function(a, b, c, expectedDeg) {
    var rad = ggbApplet.getValue('Angle(' + a + ',' + b + ',' + c + ')');
    return Math.abs(rad * 180 / Math.PI - expectedDeg) < 0.5;
  },

  // ── Helpers d'iteració per a validators robustos ─────

  /**
   * Retorna true si algun objecte del tipus 'type' satisfà el predicat fn.
   * fn rep el label de l'objecte i ha de retornar boolean.
   * Exemple:
   *   GV.anyOfType('line', l => GV.arePerpendicular(l, 'f'))
   */
  anyOfType: function(type, fn) {
    var names = ggbApplet.getAllObjectNames(type);
    for (var i = 0; i < names.length; i++) {
      try { if (fn(names[i])) return true; } catch(_) {}
    }
    return false;
  },

  /**
   * Retorna tots els objectes del tipus 'type' que satisfan el predicat fn.
   */
  filterOfType: function(type, fn) {
    var names = ggbApplet.getAllObjectNames(type);
    var result = [];
    for (var i = 0; i < names.length; i++) {
      try { if (fn(names[i])) result.push(names[i]); } catch(_) {}
    }
    return result;
  },

  /**
   * Crea un punt temporal sobre l'objecte pathLabel a la posició t (0..1),
   * executa la funció fn(tempLabel) i després l'elimina.
   * Útil per comprovar propietats de punts sobre objectes.
   * Retorna el resultat de fn.
   */
  withPointOnPath: function(pathLabel, t, fn) {
    var tempLabel = null;
    try {
      var cmd = 'TempPt_GV=Point(' + pathLabel + ', ' + t + ')';
      tempLabel = ggbApplet.evalCommandGetLabels(cmd);
      if (!tempLabel) return false;
      return fn(tempLabel);
    } catch(e) {
      return false;
    } finally {
      if (tempLabel) {
        try { ggbApplet.deleteObject(tempLabel); } catch(_) {}
      }
    }
  },

  /**
   * Retorna true si la circumferència 'circLabel' passa pels tres punts.
   * Tolerància: distància al centre = radi ± eps.
   */
  circlePassesThroughPoints: function(circLabel, p1, p2, p3) {
    if (!ggbApplet.isDefined(circLabel)) return false;
    // El centre és accessible via ggbApplet.getValue('x(Center(c))')
    var cx = ggbApplet.getValue('x(Center(' + circLabel + '))');
    var cy = ggbApplet.getValue('y(Center(' + circLabel + '))');
    var r  = ggbApplet.getValue('Radius(' + circLabel + ')');
    var pts = [p1, p2, p3];
    return pts.every(function(p) {
      var px = ggbApplet.getXcoord(p);
      var py = ggbApplet.getYcoord(p);
      var d  = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
      return Math.abs(d - r) < GV.eps * 10;   // ±0.01 per circumferència
    });
  },
  // ── Tolerant helpers for the grid challenges (repte-<theme><level>) ──
  // All of them read the applet through the global ggbApplet, like the
  // helpers above. `exclude` is an optional array of labels to skip
  // (normally the pre-built, fixed objects of the challenge).
  //
  // Three facts about the real applet, checked on 2026-11-10, shape them:
  //   · getObjectType / getAllObjectNames use the SPECIFIC type: a circle is
  //     'circle' (not 'conic'); Polygon(A,B,C) is 'triangle', a 4-gon
  //     'quadrilateral', then 'pentagon', 'hexagon', and only the rest (and
  //     the regular Polygon(A,B,n)) are 'polygon'.  → GV.names()
  //   · IsOnPath is not a GeoGebra command, and getValue() of an unknown
  //     expression returns 0, not NaN.  → GV.pointOnLine()
  //   · Angles are oriented: the same three points clicked clockwise give
  //     the reflex angle (2π − α).  → GV.angleIs()

  /** Default tolerance for coordinates, lengths and radii. */
  tol: 0.15,

  /** Real object types behind each family name accepted by GV.names(). */
  FAMILIES: {
    polygon: ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'polygon'],
    conic:   ['circle', 'ellipse', 'hyperbola', 'parabola', 'conic']
  },

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

};
