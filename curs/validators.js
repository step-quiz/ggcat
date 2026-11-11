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

  // ── 4A — Pentàgon regular de costat 2 sobre (0,0)–(2,0) ──
  'repte-4a': function(api, GV) {
    var area = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));   // costat 2 → ≈ 6.882
    return GV.hasPointAt(0, 0) && GV.hasPointAt(2, 0) &&
           GV.countSegments(2) >= 5 &&
           GV.polygonsWithArea(area, 0.3).length >= 1;
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

  // ── 6A — Bisectriu de l'angle AOB: recta per O i pel punt mig de AB ──
  // (|OA| = |OB| = 4: el triangle OAB és isòsceles)
  'repte-6a': function(api, GV) {
    return GV.anyOfType('line', function(l) {
      return GV.pointOnLine('O', l) && GV.pointOnLine('Midpoint(A,B)', l);
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

  // ── 8A — Imatge del triangle t per la translació de vector (4, 2) ──
  'repte-8a': function(api, GV) {
    var given = ['A', 'B', 'C'];
    var images = [[4, 2], [7, 2], [5, 5]];
    var allThere = images.every(function(p) { return GV.hasPointAt(p[0], p[1], 0.2, given); });
    return allThere && GV.polygonsWithArea(4.5, 0.3, ['t']).length >= 1;
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
