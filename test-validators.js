#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// test-validators.js — Simulador d'humà per verificar validators
//
// Crea un mock de l'API GeoGebra amb la solució correcta de
// cada exercici (reptes i capítols), executa el validador, i comprova que:
//   ✓  La solució correcta retorna true
//   ✗  L'escena inicial (buida, o amb els objectes que ja porta la pàgina)
//      retorna false
//   ✗  Una solució parcialment correcta retorna false
//
// El mock imita tres coses de l'applet real que, si no s'imiten, amaguen
// errors (comprovades amb el GeoGebra real el 10/11/2026):
//   · Els tipus són els ESPECÍFICS: 'circle' (no 'conic'), 'triangle',
//     'quadrilateral', 'pentagon', 'hexagon' i 'polygon' (la resta i els
//     regulars). Una escena amb un tipus que GeoGebra no fa servir és un error.
//   · «IsOnPath» no és cap comanda: getValue d'una expressió desconeguda
//     torna 0 (no NaN).
//   · Els angles són orientats: fets a l'inrevés, mesuren 360° − α.
// ════════════════════════════════════════════════════════════

const vm  = require('vm');
const fs  = require('fs');
const path = require('path');

// ── 1. Carregar GV i VALIDATORS en un sandbox ─────────────

const cursDir = path.join(__dirname, 'curs');

const sandbox = {
  Math, console, isFinite, parseInt, parseFloat,
  NaN, Infinity, undefined, Array, Object, Error,
  ggbApplet: null          // serà assignat per cada test
};
const ctx = vm.createContext(sandbox);

// const no crea propietats al global del sandbox; cal usar this.X = X
var gvCode  = fs.readFileSync(path.join(cursDir, 'geovalidator.js'), 'utf8');
var valCode = fs.readFileSync(path.join(cursDir, 'validators.js'),   'utf8');
vm.runInContext(gvCode  + '\nthis.GV = GV;',              ctx);
vm.runInContext(valCode + '\nthis.VALIDATORS = VALIDATORS;', ctx);

const GV         = sandbox.GV;
const VALIDATORS = sandbox.VALIDATORS;

// ── 2. Fàbrica de mock GeoGebra API ──────────────────────

// Tipus d'objecte que torna de debò getObjectType (els que fan servir les escenes)
const TIPUS_REALS = ['point', 'segment', 'line', 'ray', 'circle', 'ellipse',
  'triangle', 'quadrilateral', 'pentagon', 'hexagon', 'polygon',
  'angle', 'numeric', 'function', 'locus'];

function createMockAPI(objects) {
  // objects: array de { name, type, x?, y?, value?, length?, midpoint?, center?,
  //                     radius?, moveable?, fn? }
  const byName = {};
  objects.forEach(function(o) {
    if (TIPUS_REALS.indexOf(o.type) === -1) {
      throw new Error('Escena amb un tipus que GeoGebra no fa servir: ' + o.type);
    }
    byName[o.name] = o;
  });

  // Coordenades d'un punt: nom («A»), Midpoint(X,Y) o literal «(1,2)»
  function puntDe(expr) {
    var lit = expr.match(/^\((-?[\d.]+),(-?[\d.]+)\)$/);
    if (lit) return [parseFloat(lit[1]), parseFloat(lit[2])];
    var mm = expr.match(/^Midpoint\((\w+),(\w+)\)$/);
    if (mm) {
      var X = puntDe(mm[1]), Y = puntDe(mm[2]);
      return X && Y ? [(X[0] + Y[0]) / 2, (X[1] + Y[1]) / 2] : null;
    }
    var o = byName[expr];
    return o && o.x != null ? [o.x, o.y] : null;
  }

  // Recta o segment com a { p: punt, d: direcció }
  function rectaDe(nom) {
    var sg = nom.match(/^Segment\((\w+),(\w+)\)$/);
    if (sg) {
      var S1 = puntDe(sg[1]), S2 = puntDe(sg[2]);
      return S1 && S2 ? { p: S1, d: [S2[0] - S1[0], S2[1] - S1[1]] } : null;
    }
    var o = byName[nom];
    if (!o) return null;
    if (o.p && o.d) return { p: o.p, d: o.d };
    if (o.a && o.b) {
      var A = puntDe(o.a), B = puntDe(o.b);
      return A && B ? { p: A, d: [B[0] - A[0], B[1] - A[1]] } : null;
    }
    return null;
  }

  const api = {
    getAllObjectNames: function(type) {
      return objects.filter(function(o) { return o.type === type; })
                    .map(function(o) { return o.name; });
    },

    getXcoord: function(label) {
      var o = byName[label];
      return o && o.x != null ? o.x : 0;
    },

    getYcoord: function(label) {
      var o = byName[label];
      return o && o.y != null ? o.y : 0;
    },

    getObjectNumber: function() { return objects.length; },

    getObjectName: function(i) {
      return i >= 0 && i < objects.length ? objects[i].name : null;
    },

    getObjectType: function(label) {
      var o = byName[label];
      return o ? o.type : '';
    },

    isDefined: function(label) { return !!byName[label]; },

    isMoveable: function(label) {
      var o = byName[label];
      return !!(o && o.moveable);
    },

    getXmax: function() { return 10; },
    getXmin: function() { return -10; },

    getValue: function(expr) {
      var m;

      // Length(name)
      m = expr.match(/^Length\((\w+)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.length != null ? o.length : NaN;
      }

      // x(Midpoint(name))
      m = expr.match(/^x\(Midpoint\((\w+)\)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.midpoint ? o.midpoint[0] : NaN;
      }

      // y(Midpoint(name))
      m = expr.match(/^y\(Midpoint\((\w+)\)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.midpoint ? o.midpoint[1] : NaN;
      }

      // x(Center(name))
      m = expr.match(/^x\(Center\((\w+)\)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.center ? o.center[0] : NaN;
      }

      // y(Center(name))
      m = expr.match(/^y\(Center\((\w+)\)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.center ? o.center[1] : NaN;
      }

      // Radius(name)
      m = expr.match(/^Radius\((\w+)\)$/);
      if (m) {
        var o = byName[m[1]];
        return o && o.radius != null ? o.radius : NaN;
      }

      // Distance(punt, punt) i Distance(punt, recta). El punt pot ser un nom,
      // Midpoint(X,Y) o un literal (x,y). Les rectes i els segments del mock
      // porten els extrems: { a: 'A', b: 'B' } (noms de punts) o
      // { p: [x, y], d: [dx, dy] } (un punt i la direcció).
      m = expr.match(/^Distance\((\w+|Midpoint\(\w+,\w+\)|\(-?[\d.]+,-?[\d.]+\)),(\w+)\)$/);
      if (m) {
        var P = puntDe(m[1]), Q = puntDe(m[2]), r = rectaDe(m[2]);
        if (P && Q) return Math.hypot(P[0] - Q[0], P[1] - Q[1]);
        if (P && r) {
          var creu = (P[0] - r.p[0]) * r.d[1] - (P[1] - r.p[1]) * r.d[0];
          return Math.abs(creu) / Math.hypot(r.d[0], r.d[1]);
        }
        return NaN;
      }

      // ArePerpendicular / AreParallel(r1, r2): com GeoGebra, tornen 1 o 0.
      // Cada recta és un nom o Segment(X,Y).
      m = expr.match(/^(ArePerpendicular|AreParallel)\((\w+|Segment\(\w+,\w+\)),(\w+)\)$/);
      if (m) {
        var r1 = rectaDe(m[2]), r2 = rectaDe(m[3]);
        if (!r1 || !r2) return NaN;
        var n1 = Math.hypot(r1.d[0], r1.d[1]), n2 = Math.hypot(r2.d[0], r2.d[1]);
        var cos = (r1.d[0] * r2.d[0] + r1.d[1] * r2.d[1]) / (n1 * n2);
        if (m[1] === 'ArePerpendicular') return Math.abs(cos) < 1e-6 ? 1 : 0;
        return Math.abs(Math.abs(cos) - 1) < 1e-6 ? 1 : 0;
      }

      // f(k) i f'(k) d'una funció: { type: 'function', fn: function(x) {…} }
      m = expr.match(/^(\w+)('?)\((-?[\d.]+)\)$/);
      if (m && byName[m[1]] && byName[m[1]].fn) {
        var fn = byName[m[1]].fn, k = parseFloat(m[3]);
        return m[2] ? (fn(k + 1e-6) - fn(k - 1e-6)) / 2e-6 : fn(k);
      }

      // Angle(a,b,c)
      m = expr.match(/^Angle\((\w+),(\w+),(\w+)\)$/);
      if (m) return NaN;

      // Nom d'un objecte → el seu valor (NaN si no en té, com un punt)
      var o = byName[expr];
      if (o) return o.value != null ? o.value : NaN;

      // Qualsevol altra cosa (p. ex. «IsOnPath(...)», que no existeix): 0,
      // com fa l'applet real amb una expressió que no entén.
      return 0;
    }
  };

  return api;
}

// ── 3. Definició de les solucions correctes ──────────────

const CORRECT_SOLUTIONS = {

  // ── Repte 1: Triangle A(-2,-1), B(4,-1), C(1,4) + 3 segments
  'repte-1': [
    { name: 'A', type: 'point', x: -2, y: -1 },
    { name: 'B', type: 'point', x:  4, y: -1 },
    { name: 'C', type: 'point', x:  1, y:  4 },
    { name: 'f', type: 'segment', length: 6 },
    { name: 'g', type: 'segment', length: 5.83 },
    { name: 'h', type: 'segment', length: 5.83 },
  ],

  // ── Repte 2: Segment longitud 5, punt mitjà a l'eix Y
  'repte-2': [
    { name: 'A', type: 'point', x: -2.5, y: 0 },
    { name: 'B', type: 'point', x:  2.5, y: 0 },
    { name: 'f', type: 'segment', length: 5, midpoint: [0, 0] },
  ],

  // ── Repte 3: Dues circumferències concèntriques a (0,0) r=2 i r=4
  'repte-3': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 2 },
    { name: 'd', type: 'circle', center: [0, 0], radius: 4 },
  ],

  // ── Repte 4: Triangle A(0,0) B(6,0) C(3,4) + àrea 12 + angle 53.13°
  'repte-4': [
    { name: 'A',    type: 'point',   x: 0, y: 0 },
    { name: 'B',    type: 'point',   x: 6, y: 0 },
    { name: 'C',    type: 'point',   x: 3, y: 4 },
    { name: 'f',    type: 'segment', length: 6 },
    { name: 'g',    type: 'segment', length: 5 },
    { name: 'h',    type: 'segment', length: 5 },
    { name: 'area', type: 'numeric', value: 12 },
    { name: 'alfa', type: 'angle',   value: 53.13 * Math.PI / 180 },
  ],

  // ── Repte 5: Quadrat vèrtex a (0,0) i (3,0), 4 costats de longitud 3
  'repte-5': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 3 },
    { name: 'D', type: 'point', x: 0, y: 3 },
    { name: 'f', type: 'segment', length: 3 },
    { name: 'g', type: 'segment', length: 3 },
    { name: 'h', type: 'segment', length: 3 },
    { name: 'i', type: 'segment', length: 3 },
  ],

  // ── Repte 6: Mediatriu (recta) + punt d'intersecció amb eix Y
  // Escena de curs/repte-6.html: A=(-4,-1), B=(4,3), s=Segment(A,B).
  // Mediatriu: passa pel punt mitjà (0,1) amb direcció (-4,8) ⟂ (8,4);
  // talla l'eix Y a (0,1).
  'repte-6': [
    { name: 'A',  type: 'point', x: -4, y: -1 },
    { name: 'B',  type: 'point', x:  4, y:  3 },
    { name: 's',  type: 'segment', a: 'A', b: 'B', length: Math.sqrt(80) },
    { name: 'f',  type: 'line', p: [0, 1], d: [-4, 8] },
    { name: 'C',  type: 'point', x: 0,  y: 1 },     // intersecció amb l'eix Y
  ],

  // ── Repte 7: Triangle equilàter (polígon) + costats iguals + angle 60°
  'repte-7': [
    { name: 'A',    type: 'point',   x: 0,    y: 0 },
    { name: 'B',    type: 'point',   x: 4,    y: 0 },
    { name: 'C',    type: 'point',   x: 2,    y: 3.464 },
    { name: 'p1',   type: 'polygon' },
    { name: 'f',    type: 'segment', length: 4 },
    { name: 'g',    type: 'segment', length: 4 },
    { name: 'h',    type: 'segment', length: 4 },
    { name: 'alfa', type: 'angle',   value: 60 * Math.PI / 180 },
  ],

  // ── Repte 8: Perpendicular des de P a recta f, peu a (64/17, 16/17)
  'repte-8': [
    { name: 'P',    type: 'point', x: 2,      y: 5 },
    { name: 'f',    type: 'line' },                              // recta donada
    { name: 'perp', type: 'line' },                              // perpendicular
    { name: 'F',    type: 'point', x: 64 / 17, y: 16 / 17 },   // peu
  ],

  // ── Repte 9: Circumcentre de A(0,0) B(6,0) C(2,5) → (3, 1.7)
  'repte-9': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 6, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 5 },
    { name: 'D', type: 'point', x: 3, y: 1.7 },   // circumcentre
  ],

  // ── Repte 10: Rombus a l'origen, 4 costats iguals, cap angle de 90°
  //    Rombus amb costat=3, angle=60°:
  //    A(0,0) B(3,0) C(3+1.5, 2.598)=(4.5, 2.598) D(1.5, 2.598)
  'repte-10': [
    { name: 'A', type: 'point', x: 0,   y: 0 },
    { name: 'B', type: 'point', x: 3,   y: 0 },
    { name: 'C', type: 'point', x: 4.5, y: 2.598 },
    { name: 'D', type: 'point', x: 1.5, y: 2.598 },
    { name: 'f', type: 'segment', length: 3 },
    { name: 'g', type: 'segment', length: 3 },
    { name: 'h', type: 'segment', length: 3 },
    { name: 'i', type: 'segment', length: 3 },
    { name: 'alfa', type: 'angle', value: 60 * Math.PI / 180 },
    { name: 'beta', type: 'angle', value: 120 * Math.PI / 180 },
  ],
};

// ── 4. Solucions incorrectes: parcials o mal fetes ───────

const WRONG_SOLUTIONS = {

  // Repte 1: Punts correctes però sense segments
  'repte-1': [
    { name: 'A', type: 'point', x: -2, y: -1 },
    { name: 'B', type: 'point', x:  4, y: -1 },
    { name: 'C', type: 'point', x:  1, y:  4 },
  ],

  // Repte 2: Segment de longitud 5 però punt mitjà fora de l'eix Y
  'repte-2': [
    { name: 'A', type: 'point', x: 0,   y: 0 },
    { name: 'B', type: 'point', x: 5,   y: 0 },
    { name: 'f', type: 'segment', length: 5, midpoint: [2.5, 0] },
  ],

  // Repte 3: Només una circumferència
  'repte-3': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 2 },
  ],

  // Repte 4: Triangle correcte però sense àrea ni angle
  'repte-4': [
    { name: 'A', type: 'point',   x: 0, y: 0 },
    { name: 'B', type: 'point',   x: 6, y: 0 },
    { name: 'C', type: 'point',   x: 3, y: 4 },
    { name: 'f', type: 'segment', length: 6 },
    { name: 'g', type: 'segment', length: 5 },
    { name: 'h', type: 'segment', length: 5 },
  ],

  // Repte 5: Quadrat amb costats de longitud 2 (no 3)
  'repte-5': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 2 },
    { name: 'D', type: 'point', x: 0, y: 2 },
    { name: 'f', type: 'segment', length: 2 },
    { name: 'g', type: 'segment', length: 2 },
    { name: 'h', type: 'segment', length: 2 },
    { name: 'i', type: 'segment', length: 2 },
  ],

  // Repte 6: Mediatriu correcta, però sense el punt de l'eix Y
  'repte-6': [
    { name: 'A', type: 'point', x: -4, y: -1 },
    { name: 'B', type: 'point', x:  4, y:  3 },
    { name: 's', type: 'segment', a: 'A', b: 'B', length: Math.sqrt(80) },
    { name: 'f', type: 'line', p: [0, 1], d: [-4, 8] },
  ],

  // Repte 7: Polígon amb costats desiguals (no equilàter)
  'repte-7': [
    { name: 'A',  type: 'point',   x: 0, y: 0 },
    { name: 'B',  type: 'point',   x: 5, y: 0 },
    { name: 'C',  type: 'point',   x: 2, y: 3 },
    { name: 'p1', type: 'triangle' },
    { name: 'f',  type: 'segment', length: 5 },
    { name: 'g',  type: 'segment', length: 3.6 },
    { name: 'h',  type: 'segment', length: 3.6 },
    { name: 'alfa', type: 'angle', value: 45 * Math.PI / 180 },
  ],

  // Repte 8: Perpendicular però peu al lloc incorrecte
  'repte-8': [
    { name: 'P',    type: 'point', x: 2, y: 5 },
    { name: 'f',    type: 'line' },
    { name: 'perp', type: 'line' },
    { name: 'F',    type: 'point', x: 3, y: 2 },   // lloc incorrecte
  ],

  // Repte 9: Punt equidistant de A i B però no de C
  'repte-9': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 6, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 5 },
    { name: 'D', type: 'point', x: 3, y: 0 },   // equidist de A,B però no C
  ],

  // Repte 10: Quadrat (angle 90°) en lloc de rombus
  'repte-10': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 3 },
    { name: 'D', type: 'point', x: 0, y: 3 },
    { name: 'f', type: 'segment', length: 3 },
    { name: 'g', type: 'segment', length: 3 },
    { name: 'h', type: 'segment', length: 3 },
    { name: 'i', type: 'segment', length: 3 },
    { name: 'alfa', type: 'angle', value: 90 * Math.PI / 180 },
  ],
};

// ── 4b. Més solucions incorrectes (errors típics) ───────

const EXTRA_WRONG = {
  // Repte 6: una recta pel punt mitjà que no és perpendicular a AB
  // (p. ex. la recta x = 0), amb el punt de l'eix Y
  'repte-6': [
    { name: 'A', type: 'point', x: -4, y: -1 },
    { name: 'B', type: 'point', x:  4, y:  3 },
    { name: 's', type: 'segment', a: 'A', b: 'B', length: Math.sqrt(80) },
    { name: 'f', type: 'line', p: [0, 1], d: [0, 1] },
    { name: 'C', type: 'point', x: 0, y: 1 },
  ],

  // Repte 10: quadrat amb l'angle recte mesurat a l'inrevés (270°)
  'repte-10': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 3 },
    { name: 'D', type: 'point', x: 0, y: 3 },
    { name: 'f', type: 'segment', length: 3 },
    { name: 'g', type: 'segment', length: 3 },
    { name: 'h', type: 'segment', length: 3 },
    { name: 'i', type: 'segment', length: 3 },
    { name: 'alfa', type: 'angle', value: 270 * Math.PI / 180 },
  ],

  // Capítol 5: perpendicular a AB que no passa pel punt mitjà
  'cap-5-ex': [
    { name: 'm', type: 'line', p: [1, 0], d: [0, 1] },
  ],

  // Capítol 6: paral·lela a f que no passa per P
  'cap-6-ex': [
    { name: 'g', type: 'line', p: [0, 1], d: [3, 1] },
  ],

  // Capítol 10: un lliscador sol, sense cap figura
  'cap-10-ex': [
    { name: 'a', type: 'numeric', value: 1, moveable: true },
  ],
};

// ── 4c. Més solucions correctes (altres maneres de fer-ho bé) ───────

const EXTRA_CORRECT = {
  // Repte 4: l'angle mesurat a l'inrevés (360° − 53.13°)
  'repte-4': [
    { name: 'A',    type: 'point',   x: 0, y: 0 },
    { name: 'B',    type: 'point',   x: 6, y: 0 },
    { name: 'C',    type: 'point',   x: 3, y: 4 },
    { name: 't',    type: 'triangle', value: 12 },
    { name: 'f',    type: 'segment', length: 6 },
    { name: 'g',    type: 'segment', length: 5 },
    { name: 'h',    type: 'segment', length: 5 },
    { name: 'alfa', type: 'angle',   value: (360 - 53.13) * Math.PI / 180 },
  ],

  // Repte 7: equilàter fet amb tres punts (tipus 'triangle', no 'polygon')
  'repte-7': [
    { name: 'A',    type: 'point',   x: 0,    y: 0 },
    { name: 'B',    type: 'point',   x: 4,    y: 0 },
    { name: 'C',    type: 'point',   x: 2,    y: 3.464 },
    { name: 't1',   type: 'triangle', value: 6.93 },
    { name: 'f',    type: 'segment', length: 4 },
    { name: 'g',    type: 'segment', length: 4 },
    { name: 'h',    type: 'segment', length: 4 },
    { name: 'alfa', type: 'angle',   value: 300 * Math.PI / 180 },
  ],

  // Capítol 4: l'angle mesurat a l'inrevés
  'cap-4-ex': [
    { name: 'alfa', type: 'angle', value: (360 - 56.31) * Math.PI / 180 },
  ],

  // Capítol 7: hexàgon fet amb sis punts (tipus 'hexagon')
  'cap-7-ex': [
    { name: 'h', type: 'hexagon', value: 2.6 },
    { name: 'a', type: 'segment', length: 1 }, { name: 'b', type: 'segment', length: 1 },
    { name: 'c', type: 'segment', length: 1 }, { name: 'd', type: 'segment', length: 1 },
    { name: 'e', type: 'segment', length: 1 }, { name: 'f', type: 'segment', length: 1 },
  ],

  // Capítol 10: lliscador i polígon (en lloc de circumferència)
  'cap-10-ex': [
    { name: 'n', type: 'numeric', value: 5, moveable: true },
    { name: 'p', type: 'polygon', value: 1.72 },
  ],
};

// ── 4d. Exercicis dels capítols ─────────────────────────
// INITIAL: els objectes que la pàgina ja porta (data-commands). Les
// solucions de CAP_CORRECT, CAP_WRONG, EXTRA_WRONG i EXTRA_CORRECT d'un
// capítol s'hi afegeixen.

const INITIAL = {
  'cap-2-ex': [
    { name: 'A', type: 'point', x: -3, y: 0 },
    { name: 'B', type: 'point', x:  3, y: 0 },
    { name: 's', type: 'segment', a: 'A', b: 'B', length: 6 },
  ],
  'cap-4-ex': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 3 },
    { name: 'p', type: 'triangle', value: 6 },
  ],
  'cap-5-ex': [
    { name: 'A', type: 'point', x: -3, y: 0 },
    { name: 'B', type: 'point', x:  3, y: 0 },
    { name: 's', type: 'segment', a: 'A', b: 'B', length: 6 },
  ],
  'cap-6-ex': [
    { name: 'f', type: 'line', p: [0, 0], d: [3, 1] },
    { name: 'P', type: 'point', x: 0, y: 3 },
  ],
  'cap-8-ex': [
    { name: 'A', type: 'point', x: 1, y: 1 },
    { name: 'B', type: 'point', x: 4, y: 1 },
    { name: 'C', type: 'point', x: 2, y: 4 },
    { name: 't', type: 'triangle', value: 4.5 },
    { name: 'f', type: 'line', p: [0, -5], d: [0, 10] },
  ],
};

const CAP_CORRECT = {
  'cap-1-ex': [ { name: 'P', type: 'point', x: 3, y: 2 } ],
  'cap-2-ex': [ { name: 'M', type: 'point', x: 0, y: 0 } ],
  'cap-3-ex': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
  ],
  'cap-4-ex': [ { name: 'alfa', type: 'angle', value: 56.31 * Math.PI / 180 } ],
  'cap-5-ex': [ { name: 'm', type: 'line', p: [0, 0], d: [0, 1] } ],
  'cap-6-ex': [ { name: 'g', type: 'line', p: [0, 3], d: [3, 1] } ],
  'cap-7-ex': [
    { name: 'h', type: 'polygon', value: 2.6 },      // Polygon(A,B,6): regular
    { name: 'a', type: 'segment', length: 1 }, { name: 'b', type: 'segment', length: 1 },
    { name: 'c', type: 'segment', length: 1 }, { name: 'd', type: 'segment', length: 1 },
    { name: 'e', type: 'segment', length: 1 }, { name: 'f', type: 'segment', length: 1 },
  ],
  'cap-8-ex': [
    { name: "A'", type: 'point', x: -1, y: 1 },
    { name: "B'", type: 'point', x: -4, y: 1 },
    { name: "C'", type: 'point', x: -2, y: 4 },
    { name: 't2', type: 'triangle', value: 4.5 },
  ],
  'cap-9-ex': [
    { name: 'f', type: 'function', fn: function(x) { return 2 * x + 1; } },
    { name: 'P', type: 'point', x: -0.5, y: 0 },
  ],
  'cap-10-ex': [
    { name: 'a', type: 'numeric', value: 1, moveable: true },
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 1 },
  ],
};

const CAP_WRONG = {
  'cap-1-ex': [ { name: 'P', type: 'point', x: 0, y: 0 } ],
  'cap-2-ex': [ { name: 'N', type: 'point', x: 1, y: 1 } ],
  'cap-3-ex': [                                     // radi 2
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 2 },
  ],
  'cap-4-ex': [ { name: 'alfa', type: 'angle', value: 67.38 * Math.PI / 180 } ],
  'cap-5-ex': [ { name: 'm', type: 'line', p: [-3, 0], d: [1, 0] } ],   // la recta AB
  'cap-6-ex': [ { name: 'g', type: 'line', p: [0, 3], d: [-1, 3] } ],   // perpendicular per P
  'cap-7-ex': [                                     // triangle regular
    { name: 't', type: 'polygon', value: 3.9 },
    { name: 'a', type: 'segment', length: 3 }, { name: 'b', type: 'segment', length: 3 },
    { name: 'c', type: 'segment', length: 3 },
  ],
  'cap-8-ex': [                                     // reflectit sobre l'eix X
    { name: 'A2', type: 'point', x: 1, y: -1 },
    { name: 'B2', type: 'point', x: 4, y: -1 },
    { name: 'C2', type: 'point', x: 2, y: -4 },
    { name: 't2', type: 'triangle', value: 4.5 },
  ],
  'cap-9-ex': [                                     // punt al tall amb l'eix Y
    { name: 'f', type: 'function', fn: function(x) { return 2 * x + 1; } },
    { name: 'P', type: 'point', x: 0, y: 1 },
  ],
  'cap-10-ex': [                                    // sense lliscador
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
  ],
};

Object.keys(CAP_CORRECT).forEach(function(id) {
  CORRECT_SOLUTIONS[id] = CAP_CORRECT[id];
  WRONG_SOLUTIONS[id]   = CAP_WRONG[id];
});

// ── 5. Execució dels tests ──────────────────────────────

function runValidator(goalId, objects) {
  var api = createMockAPI(objects);
  sandbox.ggbApplet = api;        // GV usa ggbApplet global
  var fn = VALIDATORS[goalId];
  if (!fn) throw new Error('Validator no trobat: ' + goalId);
  try {
    return !!fn(api, GV);
  } catch (e) {
    return { error: e.message };
  }
}

// ── Formatatge ──────────────────────────────────────────

var COL = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  dim:    '\x1b[2m',
  bold:   '\x1b[1m',
};

var totalPass = 0, totalFail = 0;

function test(label, actual, expected) {
  var ok = actual === expected;
  if (ok) {
    totalPass++;
    process.stdout.write(COL.green + '    ✓ ' + COL.reset + label + '\n');
  } else {
    totalFail++;
    process.stdout.write(COL.red + '    ✗ ' + COL.reset + label +
      COL.dim + '  (esperava ' + expected + ', obtingut ' + JSON.stringify(actual) + ')' +
      COL.reset + '\n');
  }
}

// ── Llançar ─────────────────────────────────────────────

console.log('');
console.log(COL.bold + '═══════════════════════════════════════════════════' + COL.reset);
console.log(COL.bold + '  Test de validators — Simulador d\'humà          ' + COL.reset);
console.log(COL.bold + '═══════════════════════════════════════════════════' + COL.reset);
console.log('');

Object.keys(CORRECT_SOLUTIONS).forEach(function(id) {
  console.log(COL.cyan + COL.bold + '  ▸ ' + id + COL.reset);
  var inicial = INITIAL[id] || [];
  var amb = function(objs) { return inicial.concat(objs); };

  // Test 1: Solució correcta → true
  test('Solució correcta → true',  runValidator(id, amb(CORRECT_SOLUTIONS[id])), true);
  if (EXTRA_CORRECT[id]) {
    test('Una altra solució correcta → true', runValidator(id, amb(EXTRA_CORRECT[id])), true);
  }

  // Test 2: Escena inicial (buida, o el que ja porta la pàgina) → false
  test('Escena inicial → false',   runValidator(id, inicial), false);

  // Test 3: Solució parcial/incorrecta → false
  test('Solució incorrecta → false', runValidator(id, amb(WRONG_SOLUTIONS[id])), false);
  if (EXTRA_WRONG[id]) test('Error típic → false', runValidator(id, amb(EXTRA_WRONG[id])), false);

  console.log('');
});

// ── Resum ───────────────────────────────────────────────

console.log(COL.bold + '═══════════════════════════════════════════════════' + COL.reset);
if (totalFail === 0) {
  console.log(COL.green + COL.bold +
    '  ✓ TOTS ELS TESTS PASSEN  (' + totalPass + '/' + totalPass + ')' +
    COL.reset);
} else {
  console.log(COL.red + COL.bold +
    '  ✗ FALLADES: ' + totalFail + '/' + (totalPass + totalFail) +
    COL.reset);
}
console.log(COL.bold + '═══════════════════════════════════════════════════' + COL.reset);
console.log('');

process.exit(totalFail > 0 ? 1 : 0);
