// ════════════════════════════════════════════════════════
// validators.js — Validator functions for each repte and chapter exercise
//
// Each entry in VALIDATORS maps a goalId string to a
// function(api, GV) → boolean.
//
// api  = live GeoGebra applet (window.ggbApplet)
// GV   = GeoValidator utility object (from geovalidator.js)
//
// Rules for writing validators (from architecture §7.3):
//   1. Never check specific labels the student may not have used.
//   2. Use getAllObjectNames(type) and iterate by property.
//   3. Use the tolerant GV helpers (GV.names, GV.hasPointAt, GV.pointOnLine,
//      GV.angleIs…): never getAllObjectNames('polygon'|'conic') or IsOnPath.
//   4. Validate only the final state, never construction steps.
//   5. Avoid trivial validators (e.g. "does any line exist?").
// ════════════════════════════════════════════════════════

const VALIDATORS = {

  // ════════════════════════════════════════════════════
  // Reptes: graella de 10 temes × 3 nivells (repte-<tema><nivell>).
  // El què de cada casella és a REPTES_SPECIFICATION.md (secció 9).
  // ════════════════════════════════════════════════════

  // ── 1A — Triangle equilàter de costat 4, amb vèrtexs a (0,0) i (4,0) ──
  'repte-1a': function(api, GV) {
    var h = Math.sqrt(12);                       // 2√3 ≈ 3.464
    if (GV.names('polygon').length < 1) return false;
    return GV.hasPointAt(0, 0) && GV.hasPointAt(4, 0) &&
           (GV.hasPointAt(2, h) || GV.hasPointAt(2, -h)) &&
           GV.countSegments(4) >= 3;
  },

  // ── 1B — Triangle rectangle A(0,0) B(4,0) C(0,3): la hipotenusa fa 5 ──
  'repte-1b': function(api, GV) {
    if (GV.names('polygon').length < 1) return false;
    return GV.hasPointAt(0, 0) && GV.hasPointAt(4, 0) && GV.hasPointAt(0, 3) &&
           GV.countSegments(5) >= 1;
  },

  // ── 1C — Triangle medial: punts mitjos (4,0) (5,3) (1,3) i àrea 6 = 24/4 ──
  'repte-1c': function(api, GV) {
    var given = ['A', 'B', 'C'];
    return GV.hasPointAt(4, 0, GV.tol, given) &&
           GV.hasPointAt(5, 3, GV.tol, given) &&
           GV.hasPointAt(1, 3, GV.tol, given) &&
           GV.polygonsWithArea(6, 0.3, ['t']).length >= 1;
  },

  // ── 2A — Quadrat a l'origen, costat 3 (era el repte 5) ──
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

  // ── 2B — Quadrat de vèrtexs oposats A(0,0) i C(5,5): falten (5,0) i (0,5) ──
  'repte-2b': function(api, GV) {
    var given = ['A', 'C'];
    return GV.hasPointAt(5, 0, GV.tol, given) &&
           GV.hasPointAt(0, 5, GV.tol, given) &&
           GV.polygonsWithArea(25, 0.3).length >= 1;
  },

  // ── 2C — Quadrat d'àrea 8 (el doble): costat 2√2, la diagonal de ABCD ──
  'repte-2c': function(api, GV) {
    return GV.polygonsWithArea(8, 0.3, ['q']).length >= 1 &&
           GV.countSegments(Math.sqrt(8)) >= 4;
  },

  // ── 3A — Circumferències concèntriques a l'origen, r=2 i r=4 (era el repte 3) ──
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

  // ── 3B — Circumferència per A(−3,0) i B(3,0) amb el centre a l'eix Y ──
  'repte-3b': function(api, GV) {
    return GV.circles().some(function(c) {
      return Math.abs(c.cx) < GV.tol &&
             GV.circleThrough(c, [[-3, 0], [3, 0]]);
    });
  },

  // ── 3C — Circumcentre (0, 7/8) i circumferència pels tres vèrtexs ──
  'repte-3c': function(api, GV) {
    var V = [[0, 4], [-3, 0], [3, 0]];
    if (!GV.hasPointAt(0, 7 / 8, GV.tol, ['A', 'B', 'C'])) return false;
    return GV.circles().some(function(c) { return GV.circleThrough(c, V); });
  },

  // ── 4A — Pentàgon regular de costat 2 sobre (0,0)–(2,0) ──
  'repte-4a': function(api, GV) {
    var area = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));   // costat 2 → ≈ 6.882
    return GV.hasPointAt(0, 0) && GV.hasPointAt(2, 0) &&
           GV.countSegments(2) >= 5 &&
           GV.polygonsWithArea(area, 0.3).length >= 1;
  },

  // ── 4B — Hexàgon regular inscrit a la circumferència de radi 3 ──
  'repte-4b': function(api, GV) {
    var onCircle = GV.pointCoords(['O']).filter(function(p) {
      return Math.abs(Math.sqrt(p[0] * p[0] + p[1] * p[1]) - 3) < GV.tol;
    }).length;
    return onCircle >= 6 &&
           GV.polygonsWithArea(13.5 * Math.sqrt(3), 0.5).length >= 1;   // 27√3/2 ≈ 23.383
  },

  // ── 4C — Octàgon regular inscrit al quadrat de costat 4 ──
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

  // ── 5A — Mediatriu de AB (A=(-2,0), B=(4,0)) i el punt mig (1,0) ──
  'repte-5a': function(api, GV) {
    var hasBisector = GV.anyOfType('line', function(l) {
      return GV.isPerpBisector(l, 'A', 'B');
    });
    return hasBisector && GV.hasPointAt(1, 0, GV.tol, ['A', 'B']);
  },

  // ── 5B — El circumcentre de A(0,0) B(6,0) C(2,5) (era el repte 9) ──
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

  // ── 5C — Dues mediatrius, circumcentre (3,2) al punt mig de la hipotenusa i circumferència ──
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

  // ── 6A — Bisectriu de l'angle AOB: recta per O i pel punt mig de AB ──
  // (|OA| = |OB| = 4: el triangle OAB és isòsceles)
  'repte-6a': function(api, GV) {
    return GV.anyOfType('line', function(l) {
      return GV.pointOnLine('O', l) && GV.pointOnLine('Midpoint(A,B)', l);
    });
  },

  // ── 6B — Incentre del triangle A(0,0) B(8,0) C(3,6) ≈ (3.449, 2.132) ──
  'repte-6b': function(api, GV) {
    var a = Math.sqrt(61), b = Math.sqrt(45), c = 8;   // |BC|, |CA|, |AB|
    var ix = (b * 8 + c * 3) / (a + b + c);            // ≈ 3.449
    var iy = (c * 6) / (a + b + c);                    // ≈ 2.132
    return GV.names('line').length >= 2 &&
           GV.hasPointAt(ix, iy, 0.2, ['A', 'B', 'C']);
  },

  // ── 6C — Incentre (3,2) i circumferència inscrita de radi 2 ──
  'repte-6c': function(api, GV) {
    if (!GV.hasPointAt(3, 2, GV.tol, ['A', 'B', 'C'])) return false;
    return GV.circles().some(function(c) {
      return Math.abs(c.cx - 3) < GV.tol && Math.abs(c.cy - 2) < GV.tol &&
             Math.abs(c.r - 2) < GV.tol;
    });
  },

  // ── 7A — Perpendicular a f per P i el peu (64/17, 16/17) (era el repte 8) ──
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

  // ── 7B — Dues paral·leles a f a distància 2, una a cada banda ──
  'repte-7b': function(api, GV) {
    function parallelThrough(x, y) {
      return GV.anyOfType('line', function(l) {
        if (l === 'f') return false;
        if (api.getValue('AreParallel(f,' + l + ')') !== 1) return false;
        return GV.pointOnLine('(' + x + ',' + y + ')', l, GV.tol);
      });
    }
    return parallelThrough(-1.2, 1.6) && parallelThrough(1.2, -1.6);   // O ± 2·(−3/5, 4/5)
  },

  // ── 7C — Dues altures i l'ortocentre (3, 2.5) ──
  'repte-7c': function(api, GV) {
    var alt = [['A', 'B', 'C'], ['B', 'C', 'A'], ['A', 'C', 'B']];   // side X-Y, opposite vertex Z
    var altitudes = GV.filterOfType('line', function(l) {
      return alt.some(function(s) {
        return api.getValue('ArePerpendicular(Segment(' + s[0] + ',' + s[1] + '),' + l + ')') === 1 &&
               GV.pointOnLine(s[2], l);
      });
    }).length;
    return altitudes >= 2 && GV.hasPointAt(3, 2.5, 0.2, ['A', 'B', 'C']);
  },

  // ── 8A — Imatge del triangle t per la translació de vector (4, 2) ──
  'repte-8a': function(api, GV) {
    var given = ['A', 'B', 'C'];
    var images = [[4, 2], [7, 2], [5, 5]];
    var allThere = images.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
    return allThere && GV.polygonsWithArea(4.5, 0.3, ['t']).length >= 1;
  },

  // ── 8B — Imatge del triangle t pel gir de 60° antihorari al voltant de O ──
  'repte-8b': function(api, GV) {
    var given = ['O', 'A', 'B', 'C'];
    var co = 0.5, si = Math.sqrt(3) / 2;        // cos 60°, sin 60°
    var images = [[2, 0], [5, 0], [5, 2]].map(function(p) {
      return [p[0] * co - p[1] * si, p[0] * si + p[1] * co];
    });
    var allThere = images.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
    return allThere && GV.polygonsWithArea(3, 0.3, ['t']).length >= 1;
  },

  // ── 8C — Dues reflexions amb lliscament seguides = translació de vector 2v ──
  'repte-8c': function(api, GV) {
    var given = ['A', 'B', 'C'];
    var targets = [[2, 3], [2, 5], [4, 5],      // after one glide reflection
                   [5, 4], [7, 4], [7, 6]];     // after two: t translated by (4, 4)
    var allThere = targets.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
    return allThere && GV.polygonsWithArea(2, 0.3, ['t']).length >= 2;
  },

  // ── 9A — f(x) = x² − 4 i les dues arrels, (2,0) i (−2,0) ──
  'repte-9a': function(api, GV) {
    var hasF = GV.anyOfType('function', function(fn) {
      return Math.abs(api.getValue(fn + '(0)') + 4) < GV.tol &&
             Math.abs(api.getValue(fn + '(1)') + 3) < GV.tol &&
             Math.abs(api.getValue(fn + '(2)'))     < GV.tol;
    });
    return hasF && GV.hasPointAt(2, 0) && GV.hasPointAt(-2, 0);
  },

  // ── 9B — f(x) = x², g(x) = x + 2 i els punts de tall (2,4) i (−1,1) ──
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
    return hasParabola && hasLine && GV.hasPointAt(2, 4) && GV.hasPointAt(-1, 1);
  },

  // ── 9C — sin i cos, dos punts de tall i l'angle entre les tangents (70.53°) ──
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

  // ── 10A — Polígon regular que depèn d'un lliscador ──
  // És l'únic validador que toca la construcció: mou el lliscador a 3, 5 i 8,
  // mira que l'àrea del polígon creixi, i el torna on era.
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

  // ── 10B — Lloc geomètric del punt mig M de PQ, amb P sobre la circumferència ──
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

  // ── 10C — El·lipse MF₁ + MF₂ = 10 com a lloc geomètric amb un lliscador ──
  'repte-10c': function(api, GV) {
    if (GV.sliders().length < 1) return false;
    if (!GV.hasObjectOfType('locus')) return false;
    return GV.pointCoords(['F_1', 'F_2']).some(function(M) {
      var d1 = Math.sqrt((M[0] + 3) * (M[0] + 3) + M[1] * M[1]);
      var d2 = Math.sqrt((M[0] - 3) * (M[0] - 3) + M[1] * M[1]);
      return Math.abs(d1 + d2 - 10) < GV.tol;
    });
  },

  // ════════════════════════════════════════════════════
  // Validators dels exercicis dels capítols (cap-N-ex).
  // Migrats des dels atributs data-check inline dels HTML.
  // ════════════════════════════════════════════════════

  // ── Capítol 1 — Crear el punt (3, 2) ──────────────────
  'cap-1-ex': function(api, GV) {
    var pts = api.getAllObjectNames('point');
    return pts.some(function(l) {
      return Math.abs(api.getXcoord(l) - 3) < 0.15 &&
             Math.abs(api.getYcoord(l) - 2) < 0.15;
    });
  },

  // ── Capítol 2 — Punt mig de A(-3,0)–B(3,0) → ha d'estar a (0,0) ──
  'cap-2-ex': function(api, GV) {
    var pts = api.getAllObjectNames('point');
    return pts.some(function(l) {
      return Math.abs(api.getXcoord(l))     < 0.15 &&
             Math.abs(api.getYcoord(l))     < 0.15 &&
             l !== 'A' && l !== 'B';
    });
  },

  // ── Capítol 3 — Circumferència centre origen, radi 3 ──
  'cap-3-ex': function(api, GV) {
    return GV.circles().some(function(c) {
      return Math.abs(c.cx) < 0.15 && Math.abs(c.cy) < 0.15 &&
             Math.abs(c.r - 3) < 0.15;
    });
  },

  // ── Capítol 4 — Angle ≈ 56.31° (vèrtex B amb A=(0,0),B=(4,0),C=(2,3)) ──
  'cap-4-ex': function(api, GV) {
    var angles = api.getAllObjectNames('angle');
    return angles.some(function(a) {
      try { return GV.angleIs(a, 56.31); } catch (e) { return false; }
    });
  },

  // ── Capítol 5 — Mediatriu del segment AB ──────────────
  'cap-5-ex': function(api, GV) {
    var lines = api.getAllObjectNames('line');
    return lines.some(function(l) {
      return GV.isPerpBisector(l, 'A', 'B');
    });
  },

  // ── Capítol 6 — Paral·lela a f que passa per P ────────
  'cap-6-ex': function(api, GV) {
    var lines = api.getAllObjectNames('line');
    return lines.some(function(l) {
      if (l === 'f') return false;
      try {
        var onP = GV.pointOnLine('P', l);
        var par = api.getValue('AreParallel(f,' + l + ')') === 1;
        return onP && par;
      } catch (e) { return false; }
    });
  },

  // ── Capítol 7 — Polígon regular de 6 costats iguals ───
  'cap-7-ex': function(api, GV) {
    var polys = GV.names('polygon');
    if (polys.length === 0) return false;
    var segs = api.getAllObjectNames('segment') || [];
    var lens = [];
    for (var i = 0; i < segs.length; i++) {
      try {
        var l = api.getValue('Length(' + segs[i] + ')');
        if (isFinite(l) && l > 0.1) lens.push(l);
      } catch (e) {}
    }
    if (lens.length < 6) return false;
    lens.sort(function(a, b) { return a - b; });
    for (var k = 0; k <= lens.length - 6; k++) {
      if (Math.abs(lens[k] - lens[k + 5]) < 0.15) return true;
    }
    return false;
  },

  // ── Capítol 8 — Reflexió: triangle imatge amb vèrtexs propers a (-1,1),(-4,1),(-2,4) ──
  'cap-8-ex': function(api, GV) {
    var polys = GV.names('polygon');
    if (polys.length < 2) return false;
    var pts = api.getAllObjectNames('point');
    var targets = [[-1, 1], [-4, 1], [-2, 4]];
    return targets.every(function(tg) {
      return pts.some(function(p) {
        return Math.abs(api.getXcoord(p) - tg[0]) < 0.2 &&
               Math.abs(api.getYcoord(p) - tg[1]) < 0.2;
      });
    });
  },

  // ── Capítol 9 — Funció f(x)=2x+1 + intersecció amb eix X a (-0.5, 0) ──
  'cap-9-ex': function(api, GV) {
    var fns = api.getAllObjectNames('function');
    var hasF = fns.some(function(fn) {
      try {
        var slope     = api.getValue(fn + "'(0)");
        var intercept = api.getValue(fn + '(0)');
        return Math.abs(slope - 2) < 0.15 && Math.abs(intercept - 1) < 0.15;
      } catch (e) { return false; }
    });
    if (!hasF) return false;
    var pts = api.getAllObjectNames('point');
    return pts.some(function(p) {
      return Math.abs(api.getXcoord(p) + 0.5) < 0.15 &&
             Math.abs(api.getYcoord(p))       < 0.15;
    });
  },

  // ── Capítol 10 — Almenys un lliscador + un polígon o cònica ──
  'cap-10-ex': function(api, GV) {
    return GV.sliders().length > 0 &&
           (GV.names('polygon').length > 0 || GV.names('conic').length > 0);
  },

};
// ── End of VALIDATORS map ─────────────────────────────
