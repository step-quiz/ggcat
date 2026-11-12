// ════════════════════════════════════════════════════════
// validators.js — Validator functions for each repte and chapter exercise
//
// Each entry in VALIDATORS maps a goalId string to a function(api, GV) that
// returns true when the construction is correct and, when it is not, a short
// Catalan sentence that tells the student what is missing or wrong. The page
// shows it after «✗ Encara no és correcte.» (curs/capitols.js); anything
// other than true counts as a fail.
//
// api  = live GeoGebra applet (window.ggbApplet)
// GV   = GeoValidator utility object (from geovalidator.js)
//
// Rules for writing validators:
//   1. Never check specific labels the student may not have used.
//   2. Use getAllObjectNames(type) and iterate by property.
//   3. Use the tolerant GV helpers (GV.names, GV.hasPointAt, GV.pointOnLine,
//      GV.angleIs…): never getAllObjectNames('polygon'|'conic') or IsOnPath.
//   4. Validate only the final state, never construction steps.
//   5. Avoid trivial validators (e.g. "does any line exist?").
//   6. Every failing path returns a reason, never false. Check the conditions
//      in the order the student builds the construction, so that the reason
//      is the next thing to do, and never give away a value the student is
//      asked to find (a circumcentre, an intersection…).
// ════════════════════════════════════════════════════════

const VALIDATORS = {

  // ════════════════════════════════════════════════════
  // Reptes: graella de 10 temes × 3 nivells (repte-<tema><nivell>).
  // El què de cada casella és a REPTES_SPECIFICATION.md (secció 9).
  // ════════════════════════════════════════════════════

  // ── 1A — Triangle equilàter de costat 4, amb vèrtexs a (0,0) i (4,0) ──
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

  // ── 1B — Triangle rectangle A(0,0) B(4,0) C(0,3): la hipotenusa fa 5 ──
  'repte-1b': function(api, GV) {
    if (!GV.hasPointAt(0, 0)) return 'Falta el vèrtex A = (0, 0).';
    if (!GV.hasPointAt(4, 0)) return 'Falta el vèrtex B = (4, 0).';
    if (!GV.hasPointAt(0, 3)) return 'Falta el vèrtex C = (0, 3).';
    if (GV.names('polygon').length < 1)
      return 'Tens els tres vèrtexs, però falta el triangle: uneix-los amb l\'eina «Polígon».';
    if (GV.countSegments(5) < 1) return 'Cap costat no fa 5: la hipotenusa és el costat que va de B a C.';
    return true;
  },

  // ── 1C — Triangle medial: punts mitjos (4,0) (5,3) (1,3) i àrea 6 = 24/4 ──
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

  // ── 2A — Quadrat a l'origen, costat 3 (era el repte 5) ──
  'repte-2a': function(api, GV) {
    if (!GV.hasPointAt(0, 0)) return 'Falta un vèrtex a l\'origen, (0, 0).';
    if (!GV.hasPointAt(3, 0)) return 'Falta un vèrtex a (3, 0).';
    var costats = GV.countSegments(3);
    if (costats === 0) return 'Falta el quadrat: fes-lo amb l\'eina «Polígon regular», amb 4 vèrtexs.';
    if (costats < 4) return 'Un quadrat té 4 costats de longitud 3, i ara n\'hi ha ' + costats + '.';
    return true;
  },

  // ── 2B — Quadrat de vèrtexs oposats A(0,0) i C(5,5): falten (5,0) i (0,5) ──
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

  // ── 2C — Quadrat d'àrea 8 (el doble): costat 2√2, la diagonal de ABCD ──
  'repte-2c': function(api, GV) {
    var nous = GV.names('polygon').filter(function(p) { return p !== 'q'; });
    if (nous.length === 0) return 'Falta el quadrat nou, d\'àrea 8.';
    if (GV.polygonsWithArea(8, 0.3, ['q']).length < 1)
      return 'El polígon nou ha de tenir àrea 8, el doble que ABCD.';
    if (GV.countSegments(Math.sqrt(8)) < 4)
      return 'El polígon nou té àrea 8, però no és un quadrat: els quatre costats han de ser iguals.';
    return true;
  },

  // ── 3A — Circumferències concèntriques a l'origen, r=2 i r=4 (era el repte 3) ──
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

  // ── 3B — Circumferència per A(−3,0) i B(3,0) amb el centre a l'eix Y ──
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

  // ── 3C — Circumcentre (0, 7/8) i circumferència circumscrita pels tres vèrtexs ──
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

  // ── 4A — Pentàgon regular de costat 2 sobre (0,0)–(2,0) ──
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

  // ── 4B — Hexàgon regular inscrit a la circumferència de radi 3 ──
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

  // ── 4C — Octàgon regular inscrit al quadrat de costat 4 ──
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

  // ── 5A — Mediatriu de AB (A=(-2,0), B=(4,0)) i el punt mig (1,0) ──
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

  // ── 5B — El circumcentre de A(0,0) B(6,0) C(2,5) (era el repte 9) ──
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

  // ── 5C — Dues mediatrius, circumcentre (3,2) al punt mig de la hipotenusa i circumferència ──
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

  // ── 6A — Bisectriu de l'angle AOB: recta per O i pel punt mig de AB ──
  // (|OA| = |OB| = 4: el triangle OAB és isòsceles)
  'repte-6a': function(api, GV) {
    var rectes = GV.names('line');
    if (rectes.length === 0) return 'Falta la bisectriu: fes-la amb l\'eina «Bisectriu», fent clic a A, O i B.';
    var perO = rectes.filter(function(l) { return GV.pointOnLine('O', l); });
    if (perO.length === 0) return 'La bisectriu ha de passar pel vèrtex de l\'angle, O.';
    var ok = perO.some(function(l) { return GV.pointOnLine('Midpoint(A,B)', l); });
    return ok || 'La recta passa per O, però no parteix l\'angle en dos angles iguals de 22,5°.';
  },

  // ── 6B — Incentre del triangle A(0,0) B(8,0) C(3,6) ≈ (3.449, 2.132) ──
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

  // ── 6C — Incentre (3,2) i circumferència inscrita de radi 2 ──
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

  // ── 7A — Perpendicular a f per P i el peu (64/17, 16/17) (era el repte 8) ──
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

  // ── 7B — Dues paral·leles a f a distància 2, una a cada banda ──
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

  // ── 7C — Dues altures i l'ortocentre (3, 2.5) ──
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

  // ── 8A — Imatge del triangle t per la translació de vector (4, 2) ──
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

  // ── 8B — Imatge del triangle t pel gir de 60° antihorari al voltant de O ──
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

  // ── 8C — Dues reflexions amb lliscament seguides = translació de vector 2v ──
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

  // ── 9A — f(x) = x² − 4 i les dues arrels, (2,0) i (−2,0) ──
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
    if (!hasParabola) return 'Falta la paràbola: escriu f(x)=x^2 a la barra d\'entrada.';
    if (!hasLine) return 'Falta la recta: escriu g(x)=x+2 a la barra d\'entrada.';
    var talls = (GV.hasPointAt(2, 4) ? 1 : 0) + (GV.hasPointAt(-1, 1) ? 1 : 0);
    if (talls === 0) return 'Falten els dos punts on es tallen la paràbola i la recta.';
    if (talls === 1) return 'Has marcat un dels dos punts de tall; falta l\'altre.';
    return true;
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

  // ── 10A — Polígon regular que depèn d'un lliscador ──
  // Toca la construcció: mou el lliscador a 3, 5 i 8, mira que l'àrea del
  // polígon creixi, i el torna on era (com cap-10-ex).
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

  // ── 10B — Lloc geomètric del punt mig M de PQ, amb P sobre la circumferència ──
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

  // ── 10C — El·lipse MF₁ + MF₂ = 10 com a lloc geomètric amb un lliscador ──
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

  // ════════════════════════════════════════════════════
  // Validators dels exercicis dels capítols (cap-N-ex).
  // ════════════════════════════════════════════════════

  // ── Capítol 1 — Crear el punt (3, 2) ──────────────────
  'cap-1-ex': function(api, GV) {
    if (GV.names('point').length === 0)
      return 'Falta el punt: escriu P=(3,2) a la barra d\'entrada i prem Retorn.';
    if (GV.hasPointAt(3, 2)) return true;
    return GV.hasPointAt(2, 3)
      ? 'El punt és a (2, 3): primer va la x i després la y. Ha de ser (3, 2).'
      : 'El punt ha de ser a (3, 2): x = 3, y = 2.';
  },

  // ── Capítol 2 — Punt mig de A(-3,0)–B(3,0) → ha d'estar a (0,0) ──
  'cap-2-ex': function(api, GV) {
    if (GV.hasPointAt(0, 0, GV.tol, ['A', 'B'])) return true;
    return GV.pointCoords(['A', 'B']).length
      ? 'El punt que has creat no és el punt mig de AB: eina «Punt mitjà o centre», clic a A i a B.'
      : 'Falta el punt mig M: eina «Punt mitjà o centre», o escriu M=PuntMitjà(A,B).';
  },

  // ── Capítol 3 — Circumferència centre origen, radi 3 ──
  'cap-3-ex': function(api, GV) {
    var totes = GV.circles();
    if (totes.length === 0)
      return 'Falta la circumferència: eina «Circumferència: Centre i Radi», o escriu c=Circumferència((0,0),3).';
    var centrades = totes.filter(function(c) { return Math.abs(c.cx) < 0.15 && Math.abs(c.cy) < 0.15; });
    if (centrades.length === 0) return 'La circumferència ha de tenir el centre a l\'origen, (0, 0).';
    if (centrades.some(function(c) { return Math.abs(c.r - 3) < 0.15; })) return true;
    return 'La circumferència té el centre a l\'origen, però el radi ha de ser 3.';
  },

  // ── Capítol 4 — Angle ≈ 56.31° (vèrtex B amb A=(0,0),B=(4,0),C=(2,3)) ──
  'cap-4-ex': function(api, GV) {
    var angles = GV.names('angle');
    if (angles.length === 0) return 'Falta l\'angle: eina «Angle», clic a A, a B i a C (el vèrtex, B, al mig).';
    var ok = angles.some(function(a) {
      try { return GV.angleIs(a, 56.31); } catch (e) { return false; }
    });
    return ok || 'L\'angle que has mesurat no és el del vèrtex B: fes clic a A, B i C, amb B al mig.';
  },

  // ── Capítol 5 — Mediatriu del segment AB ──────────────
  'cap-5-ex': function(api, GV) {
    var rectes = GV.names('line');
    if (rectes.length === 0) return 'Falta la mediatriu: eina «Mediatriu», clic a A i a B.';
    var ok = rectes.some(function(l) { return GV.isPerpBisector(l, 'A', 'B'); });
    return ok || 'La recta no és la mediatriu de AB: ha de ser perpendicular a AB i passar pel seu punt mig.';
  },

  // ── Capítol 6 — Paral·lela a f que passa per P ────────
  'cap-6-ex': function(api, GV) {
    var noves = GV.names('line').filter(function(l) { return l !== 'f'; });
    if (noves.length === 0) return 'Falta la recta paral·lela a f que passa per P: eina «Recta paral·lela», clic a P i a f.';
    var perP  = noves.filter(function(l) { return GV.pointOnLine('P', l); });
    var paral = noves.filter(function(l) { return api.getValue('AreParallel(f,' + l + ')') === 1; });
    if (perP.some(function(l) { return paral.indexOf(l) !== -1; })) return true;
    if (paral.length) return 'La recta és paral·lela a f, però no passa per P.';
    if (perP.length)  return 'La recta passa per P, però no és paral·lela a f.';
    return 'La recta nova ha de ser paral·lela a f i passar per P.';
  },

  // ── Capítol 7 — Polígon regular de 6 costats iguals ───
  'cap-7-ex': function(api, GV) {
    if (GV.names('polygon').length === 0)
      return 'Falta l\'hexàgon: eina «Polígon regular», clic a dos punts i 6 vèrtexs.';
    var lens = [];
    GV.names('segment').forEach(function(s) {
      try {
        var l = api.getValue('Length(' + s + ')');
        if (isFinite(l) && l > 0.1) lens.push(l);
      } catch (e) {}
    });
    lens.sort(function(a, b) { return a - b; });
    for (var k = 0; k <= lens.length - 6; k++) {
      if (Math.abs(lens[k] - lens[k + 5]) < 0.15) return true;
    }
    return 'El polígon no és un hexàgon regular: ha de tenir 6 costats iguals.';
  },

  // ── Capítol 8 — Reflexió: triangle imatge amb vèrtexs propers a (-1,1),(-4,1),(-2,4) ──
  'cap-8-ex': function(api, GV) {
    if (GV.names('polygon').length < 2)
      return 'Falta el triangle reflectit: eina «Simetria axial», clic al triangle i després a l\'eix f.';
    var ok = [[-1, 1], [-4, 1], [-2, 4]].every(function(tg) { return GV.hasPointAt(tg[0], tg[1], 0.2); });
    return ok || 'El triangle nou no és el reflex de ABC respecte de l\'eix f: cada vèrtex ha de quedar ' +
                 'a la mateixa distància de f, a l\'altra banda.';
  },

  // ── Capítol 9 — Funció f(x)=2x+1 + intersecció amb eix X a (-0.5, 0) ──
  'cap-9-ex': function(api, GV) {
    var fns = GV.names('function');
    var hasF = fns.some(function(fn) {
      try {
        var slope     = api.getValue(fn + "'(0)");
        var intercept = api.getValue(fn + '(0)');
        return Math.abs(slope - 2) < 0.15 && Math.abs(intercept - 1) < 0.15;
      } catch (e) { return false; }
    });
    if (!hasF)
      return fns.length
        ? 'La funció no és f(x) = 2x + 1: revisa-la (s\'escriu f(x)=2x+1).'
        : 'Falta la funció: escriu f(x)=2x+1 a la barra d\'entrada.';
    if (GV.hasPointAt(-0.5, 0)) return true;
    return GV.hasPointAt(0, 1)
      ? 'El punt (0, 1) és on la recta talla l\'eix Y; busca on talla l\'eix X, on y = 0.'
      : 'Falta el punt on la recta talla l\'eix X: crea\'l, per exemple escrivint Intersecció(f, EixX).';
  },

  // ── Capítol 10 — Un lliscador que fa canviar un polígon o una cònica ──
  // Com 10A, toca la construcció: mou cada lliscador i mira si alguna figura
  // canvia (GV.sliderMoves la torna on era).
  'cap-10-ex': function(api, GV) {
    function nom(n) { return String(n).replace(/_\{?(\w+)\}?/g, '$1'); }
    var sliders = GV.sliders(true);              // també els lliscadors d'angle
    if (sliders.length === 0)
      return 'Falta un lliscador: crea\'l amb l\'eina «Punt lliscant» o escrivint, per exemple, a=PuntLliscant(1,5,0.1).';
    var figures = GV.names('polygon').concat(GV.names('conic'));
    if (figures.length === 0) return 'Tens el lliscador; falta un polígon o una circumferència.';
    if (sliders.some(function(s) { return GV.sliderMoves(s, figures); })) return true;
    var s = nom(sliders[0]);
    if (sliders.length === 1 && figures.length === 1) {
      var f = nom(figures[0]);
      return 'Has creat el lliscador ' + s + ' i la figura ' + f + ', però ' + f + ' no depèn de ' + s +
             ': quan mous ' + s + ', ' + f + ' no canvia. Fes servir ' + s + ' quan defineixis la figura: ' +
             'per exemple, Circumferència(O, ' + s + ') té radi ' + s + '.';
    }
    return 'Has creat lliscadors i figures, però cap figura no depèn de cap lliscador: quan els mous, ' +
           'les figures no canvien. Fes servir el nom d\'un lliscador quan defineixis una figura: ' +
           'per exemple, Circumferència(O, ' + s + ') té radi ' + s + '.';
  },

};
// ── End of VALIDATORS map ─────────────────────────────
