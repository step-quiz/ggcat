#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// test-validators.js — Simulador d'humà per verificar validators
//
// Crea un mock de l'API GeoGebra amb la solució correcta de
// cada exercici (reptes i capítols), executa el validador, i comprova que:
//   ✓  La solució correcta retorna true
//   ✗  L'escena inicial (buida, o amb els objectes que ja porta la pàgina)
//      retorna un motiu: un text en català que diu què falta
//   ✗  Una solució parcialment correcta retorna un motiu
// Els motius s'escriuen a la sortida: és la manera de llegir-los tots.
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
  'angle', 'numeric', 'function', 'vector', 'locus'];

function createMockAPI(objects) {
  // objects: array de { name, type, x?, y?, value?, length?, midpoint?, center?,
  //                     radius?, verts?, moveable?, fn?, valueFn?, centerFn?,
  //                     radiusFn?, vertsFn? }
  // valueFn(valorDe), centerFn(valorDe), radiusFn(valorDe), vertsFn(valorDe):
  // el valor, el centre, el radi o els vèrtexs ([[x, y], …]) d'un objecte que
  // depèn d'altres (p. ex. un polígon que depèn d'un lliscador);
  // valorDe('n') torna el valor actual de n.
  const byName = {};
  objects.forEach(function(o) {
    if (TIPUS_REALS.indexOf(o.type) === -1) {
      throw new Error('Escena amb un tipus que GeoGebra no fa servir: ' + o.type);
    }
    byName[o.name] = o;
  });

  function valorDe(nom) { return byName[nom] ? byName[nom].value : NaN; }
  function centreDe(o) { return o.centerFn ? o.centerFn(valorDe) : o.center; }
  function radiDe(o)   { return o.radiusFn ? o.radiusFn(valorDe) : o.radius; }
  function vertexsDe(o) { return o.vertsFn ? o.vertsFn(valorDe) : o.verts; }

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

    // Canvia el valor d'un objecte (un lliscador). Com a l'applet real, el que
    // en depèn (valueFn) canvia a l'instant.
    // Un lliscador amb interval (min, max) hi queda dins, com a l'applet real.
    setValue: function(label, v) {
      var o = byName[label];
      if (!o) return;
      if (o.min != null) v = Math.max(o.min, v);
      if (o.max != null) v = Math.min(o.max, v);
      o.value = v;
    },

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

      // x(Center(name)), y(Center(name))
      m = expr.match(/^([xy])\(Center\((\w+)\)\)$/);
      if (m) {
        var o = byName[m[2]], c = o && centreDe(o);
        return c ? c[m[1] === 'x' ? 0 : 1] : NaN;
      }

      // Radius(name)
      m = expr.match(/^Radius\((\w+)\)$/);
      if (m) {
        var o = byName[m[1]], r = o && radiDe(o);
        return r != null ? r : NaN;
      }

      // x(Vertex(polígon, i)), y(Vertex(polígon, i)): el vèrtex i-èsim (des d'1)
      m = expr.match(/^([xy])\(Vertex\((\w+),(\d+)\)\)$/);
      if (m) {
        var o = byName[m[2]], vs = o && vertexsDe(o), v = vs && vs[parseInt(m[3], 10) - 1];
        return v ? v[m[1] === 'x' ? 0 : 1] : NaN;
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
      if (o && o.valueFn) return o.valueFn(valorDe);
      if (o) return o.value != null ? o.value : NaN;

      // Qualsevol altra cosa (p. ex. «IsOnPath(...)», que no existeix): 0,
      // com fa l'applet real amb una expressió que no entén.
      return 0;
    }
  };

  return api;
}

// ── 3. Escenes dels reptes ──────────────────────────────
// INITIAL (més avall): els objectes que la pàgina ja porta (data-commands).
// Les solucions s'hi afegeixen.

const CORRECT_SOLUTIONS = {

  // ── 1A: equilàter de costat 4 fet amb «Polígon regular» (tipus 'polygon')
  'repte-1a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 3.4641 },
    { name: 'p', type: 'polygon', value: 6.928 },
    { name: 'f', type: 'segment', length: 4 },
    { name: 'g', type: 'segment', length: 4 },
    { name: 'h', type: 'segment', length: 4 },
  ],


  // ── 1B: triangle rectangle A(0,0) B(4,0) C(0,3); els costats fan 4, 5 i 3
  'repte-1b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 0, y: 3 },
    { name: 't', type: 'triangle', value: 6 },
    { name: 'c', type: 'segment', length: 4 },
    { name: 'a', type: 'segment', length: 5 },
    { name: 'b', type: 'segment', length: 3 },
  ],

  // ── 1C: els tres punts mitjos i el triangle medial (àrea 6)
  'repte-1c': [
    { name: 'D', type: 'point', x: 4, y: 0 },
    { name: 'E', type: 'point', x: 5, y: 3 },
    { name: 'F', type: 'point', x: 1, y: 3 },
    { name: 'm', type: 'triangle', value: 6 },
  ],
  // ── 2A: quadrat amb vèrtexs a (0,0) i (3,0), 4 costats de longitud 3
  'repte-2a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 3 },
    { name: 'D', type: 'point', x: 0, y: 3 },
    { name: 'q', type: 'polygon', value: 9 },
    { name: 'f', type: 'segment', length: 3 },
    { name: 'g', type: 'segment', length: 3 },
    { name: 'h', type: 'segment', length: 3 },
    { name: 'i', type: 'segment', length: 3 },
  ],


  // ── 2B: els vèrtexs que falten, (5,0) i (0,5), i el quadrat d'àrea 25
  'repte-2b': [
    { name: 'B', type: 'point', x: 5, y: 0 },
    { name: 'D', type: 'point', x: 0, y: 5 },
    { name: 'q', type: 'quadrilateral', value: 25 },
  ],

  // ── 2C: Polígon(A,C,4): quadrat sobre la diagonal AC, costat 2√2, àrea 8
  'repte-2c': [
    { name: 'E', type: 'point', x: 0, y: 4 },
    { name: 'F', type: 'point', x: -2, y: 2 },
    { name: 'r', type: 'polygon', value: 8 },
    { name: 'e', type: 'segment', length: 2.8284 },
    { name: 'f', type: 'segment', length: 2.8284 },
    { name: 'g', type: 'segment', length: 2.8284 },
    { name: 'h', type: 'segment', length: 2.8284 },
  ],
  // ── 3A: dues circumferències concèntriques a (0,0), r=2 i r=4
  'repte-3a': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 2 },
    { name: 'd', type: 'circle', center: [0, 0], radius: 4 },
  ],


  // ── 3B: centre (0,4) a l'eix Y, radi 5 = |KA|
  'repte-3b': [
    { name: 'K', type: 'point', x: 0, y: 4 },
    { name: 'd', type: 'circle', center: [0, 4], radius: 5 },
  ],

  // ── 3C: dues mediatrius, el circumcentre (0, 7/8) i la circumferència (radi 25/8)
  'repte-3c': [
    { name: 'm', type: 'line', p: [-1.5, 2], d: [4, -3] },
    { name: 'n', type: 'line', p: [0, 0], d: [0, 1] },
    { name: 'O', type: 'point', x: 0, y: 0.875 },
    { name: 'd', type: 'circle', center: [0, 0.875], radius: 3.125 },
  ],
  // ── 4A: pentàgon regular de costat 2 (àrea ≈ 6.882)
  'repte-4a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'C', type: 'point', x: 2.618, y: 1.902 },
    { name: 'D', type: 'point', x: 1, y: 3.078 },
    { name: 'E', type: 'point', x: -0.618, y: 1.902 },
    { name: 'p', type: 'polygon', value: 6.882 },
    { name: 'f', type: 'segment', length: 2 },
    { name: 'g', type: 'segment', length: 2 },
    { name: 'h', type: 'segment', length: 2 },
    { name: 'i', type: 'segment', length: 2 },
    { name: 'j', type: 'segment', length: 2 },
  ],


  // ── 4B: hexàgon regular inscrit (àrea 27√3/2 ≈ 23.383), fet amb Polígon(A,B,6)
  'repte-4b': [
    { name: 'A', type: 'point', x: 3, y: 0 },
    { name: 'B', type: 'point', x: 1.5, y: 2.598 },
    { name: 'C', type: 'point', x: -1.5, y: 2.598 },
    { name: 'D', type: 'point', x: -3, y: 0 },
    { name: 'E', type: 'point', x: -1.5, y: -2.598 },
    { name: 'F', type: 'point', x: 1.5, y: -2.598 },
    { name: 'h', type: 'polygon', value: 23.383 },
  ],

  // ── 4C: els vuit vèrtexs (±k, ±2), (±2, ±k), k = 2√2 − 2, i l'octàgon (àrea 32(√2 − 1))
  'repte-4c': [
    { name: 'E', type: 'point', x: -0.828, y: -2 },
    { name: 'F', type: 'point', x: 0.828, y: -2 },
    { name: 'G', type: 'point', x: 2, y: -0.828 },
    { name: 'H', type: 'point', x: 2, y: 0.828 },
    { name: 'J', type: 'point', x: 0.828, y: 2 },
    { name: 'K', type: 'point', x: -0.828, y: 2 },
    { name: 'L', type: 'point', x: -2, y: 0.828 },
    { name: 'M', type: 'point', x: -2, y: -0.828 },
    { name: 'o', type: 'polygon', value: 13.255 },
  ],
  // ── 5A: la mediatriu (x = 1) i el punt mig (1, 0)
  'repte-5a': [
    { name: 'm', type: 'line', p: [1, 0], d: [0, 1] },
    { name: 'M', type: 'point', x: 1, y: 0 },
  ],

  // ── 5B: el circumcentre de A(0,0) B(6,0) C(2,5) → (3, 1.7)
  'repte-5b': [
    { name: 'D', type: 'point', x: 3, y: 1.7 },
  ],


  // ── 5C: mediatrius de AC (x = 3) i BC (y = 2), centre (3, 2) i circumferència de radi √13
  'repte-5c': [
    { name: 'm', type: 'line', p: [3, 0], d: [0, 1] },
    { name: 'n', type: 'line', p: [0, 2], d: [1, 0] },
    { name: 'O', type: 'point', x: 3, y: 2 },
    { name: 'd', type: 'circle', center: [3, 2], radius: Math.sqrt(13) },
  ],
  // ── 6A: la bisectriu, recta per O amb pendent tan 22.5°
  'repte-6a': [
    { name: 'b', type: 'line', p: [0, 0], d: [Math.cos(Math.PI / 8), Math.sin(Math.PI / 8)] },
  ],


  // ── 6B: dues bisectrius i l'incentre ≈ (3.449, 2.132)
  'repte-6b': [
    { name: 'm', type: 'line', p: [0, 0], d: [3.449, 2.132] },
    { name: 'n', type: 'line', p: [8, 0], d: [3.449 - 8, 2.132] },
    { name: 'I', type: 'point', x: 3.449, y: 2.132 },
  ],

  // ── 6C: l'incentre (3, 2) i la circumferència inscrita de radi 2
  'repte-6c': [
    { name: 'I', type: 'point', x: 3, y: 2 },
    { name: 'T', type: 'point', x: 3, y: 0 },
    { name: 'd', type: 'circle', center: [3, 2], radius: 2 },
  ],
  // ── 7A: la perpendicular per P i el peu (64/17, 16/17)
  'repte-7a': [
    { name: 'g', type: 'line', p: [3, 4], d: [-1, 4] },
    { name: 'F', type: 'point', x: 64 / 17, y: 16 / 17 },
  ],


  // ── 7B: les dues paral·leles, per O ± 2·(−3/5, 4/5)
  'repte-7b': [
    { name: 'g', type: 'line', p: [-1.2, 1.6], d: [4, 3] },
    { name: 'h', type: 'line', p: [1.2, -1.6], d: [4, 3] },
  ],

  // ── 7C: l'altura per C (x = 3), l'altura per A (perpendicular a BC) i l'ortocentre (3, 2.5)
  'repte-7c': [
    { name: 'h', type: 'line', p: [3, 0], d: [0, 1] },
    { name: 'k', type: 'line', p: [0, 0], d: [6, 5] },
    { name: 'H', type: 'point', x: 3, y: 2.5 },
  ],
  // ── 8A: el triangle traslladat (4, 2)
  'repte-8a': [
    { name: "A'", type: 'point', x: 4, y: 2 },
    { name: "B'", type: 'point', x: 7, y: 2 },
    { name: "C'", type: 'point', x: 5, y: 5 },
    { name: "t'", type: 'triangle', value: 4.5 },
  ],


  // ── 8B: el triangle girat 60° (A'(1, 1.732), B'(2.5, 4.330), C'(0.768, 5.330))
  'repte-8b': [
    { name: "A'", type: 'point', x: 1, y: 1.732 },
    { name: "B'", type: 'point', x: 2.5, y: 4.330 },
    { name: "C'", type: 'point', x: 0.768, y: 5.330 },
    { name: "t'", type: 'triangle', value: 3 },
  ],

  // ── 8C: simetria, translació, simetria, translació: el final és t + (4, 4)
  'repte-8c': [
    { name: "A'", type: 'point', x: 0, y: 1 },
    { name: "B'", type: 'point', x: 0, y: 3 },
    { name: "C'", type: 'point', x: 2, y: 3 },
    { name: 'r', type: 'triangle', value: 2 },
    { name: "A''", type: 'point', x: 2, y: 3 },
    { name: "B''", type: 'point', x: 2, y: 5 },
    { name: "C''", type: 'point', x: 4, y: 5 },
    { name: 'g', type: 'triangle', value: 2 },
    { name: "A'''", type: 'point', x: 3, y: 2 },
    { name: "B'''", type: 'point', x: 5, y: 2 },
    { name: "C'''", type: 'point', x: 5, y: 4 },
    { name: 's', type: 'triangle', value: 2 },
    { name: "A''''", type: 'point', x: 5, y: 4 },
    { name: "B''''", type: 'point', x: 7, y: 4 },
    { name: "C''''", type: 'point', x: 7, y: 6 },
    { name: 'h', type: 'triangle', value: 2 },
  ],
  // ── 9A: f(x) = x² − 4 i les dues arrels
  'repte-9a': [
    { name: 'f', type: 'function', fn: function(x) { return x * x - 4; } },
    { name: 'Z_1', type: 'point', x: -2, y: 0 },
    { name: 'Z_2', type: 'point', x:  2, y: 0 },
  ],


  // ── 9B: f(x) = x², g(x) = x + 2 i els dos punts de tall
  'repte-9b': [
    { name: 'f', type: 'function', fn: function(x) { return x * x; } },
    { name: 'g', type: 'function', fn: function(x) { return x + 2; } },
    { name: 'P_1', type: 'point', x: -1, y: 1 },
    { name: 'P_2', type: 'point', x:  2, y: 4 },
  ],

  // ── 9C: sin i cos, els talls a π/4 i 5π/4, les dues tangents i l'angle de 70.53°
  'repte-9c': [
    { name: 'f', type: 'function', fn: Math.sin },
    { name: 'g', type: 'function', fn: Math.cos },
    { name: 'P', type: 'point', x: Math.PI / 4, y: Math.SQRT1_2 },
    { name: 'Q', type: 'point', x: 5 * Math.PI / 4, y: -Math.SQRT1_2 },
    { name: 'a', type: 'line', p: [Math.PI / 4, Math.SQRT1_2], d: [1, Math.SQRT1_2] },
    { name: 'b', type: 'line', p: [Math.PI / 4, Math.SQRT1_2], d: [1, -Math.SQRT1_2] },
    { name: 'w', type: 'angle', value: 2 * Math.atan(Math.SQRT1_2) },
  ],
  // ── 10A: lliscador n i polígon regular de n costats inscrit en un cercle
  //    de radi 1: l'àrea, (n/2)·sin(2π/n), depèn del lliscador.
  'repte-10a': [
    { name: 'n', type: 'numeric', value: 3, moveable: true },
    { name: 'A', type: 'point', x: 1, y: 0 },
    { name: 'B', type: 'point', x: -0.5, y: 0.866 },
    { name: 'p', type: 'polygon',
      valueFn: function(valorDe) { var n = valorDe('n'); return n / 2 * Math.sin(2 * Math.PI / n); } },
  ],

  // ── 10B: P sobre c, M punt mig de PQ i el lloc geomètric de M
  'repte-10b': [
    { name: 'P', type: 'point', x: 3, y: 0 },
    { name: 'M', type: 'point', x: 4.5, y: 1 },
    { name: 'l', type: 'locus' },
  ],

  // ── 10C: lliscador a = 5, circumferències de radis a i 10 − a, M = (0, 4) i el lloc
  'repte-10c': [
    { name: 'a', type: 'numeric', value: 5, moveable: true },
    { name: 'c', type: 'circle', center: [-3, 0], radius: 5 },
    { name: 'd', type: 'circle', center: [3, 0], radius: 5 },
    { name: 'M', type: 'point', x: 0, y: 4 },
    { name: 'l', type: 'locus' },
  ],
};

// ── 4. Solucions incorrectes: parcials o mal fetes ───────

const WRONG_SOLUTIONS = {

  // 1A: isòsceles amb el tercer vèrtex a (2, 3) (fet amb tres punts: 'triangle')
  'repte-1a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 3 },
    { name: 'p', type: 'triangle', value: 6 },
    { name: 'f', type: 'segment', length: 4 },
    { name: 'g', type: 'segment', length: 3.606 },
    { name: 'h', type: 'segment', length: 3.606 },
  ],


  // 1B: C a (0, 2): la hipotenusa fa √20 ≈ 4.47
  'repte-1b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 0, y: 2 },
    { name: 't', type: 'triangle', value: 4 },
    { name: 'c', type: 'segment', length: 4 },
    { name: 'a', type: 'segment', length: 4.472 },
    { name: 'b', type: 'segment', length: 2 },
  ],

  // 1C: només dos punts mitjos; el polígon A-D-E també fa 6, però no és el medial
  'repte-1c': [
    { name: 'D', type: 'point', x: 4, y: 0 },
    { name: 'E', type: 'point', x: 5, y: 3 },
    { name: 'm', type: 'triangle', value: 6 },
  ],
  // 2A: quadrat de costat 2 (no 3)
  'repte-2a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 2 },
    { name: 'D', type: 'point', x: 0, y: 2 },
    { name: 'q', type: 'polygon', value: 4 },
    { name: 'f', type: 'segment', length: 2 },
    { name: 'g', type: 'segment', length: 2 },
    { name: 'h', type: 'segment', length: 2 },
    { name: 'i', type: 'segment', length: 2 },
  ],


  // 2B: el quart vèrtex a (0, 4): àrea 22.5
  'repte-2b': [
    { name: 'B', type: 'point', x: 5, y: 0 },
    { name: 'D', type: 'point', x: 0, y: 4 },
    { name: 'q', type: 'quadrilateral', value: 22.5 },
  ],

  // 2C: costat doblat: quadrat de costat 4, àrea 16
  'repte-2c': [
    { name: 'E', type: 'point', x: 4, y: 0 },
    { name: 'r', type: 'polygon', value: 16 },
    { name: 'e', type: 'segment', length: 4 },
    { name: 'f', type: 'segment', length: 4 },
    { name: 'g', type: 'segment', length: 4 },
    { name: 'h', type: 'segment', length: 4 },
  ],
  // 3A: només una circumferència
  'repte-3a': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 2 },
  ],


  // 3B: centre (1, 4), fora de l'eix Y: passa per A però no per B
  'repte-3b': [
    { name: 'K', type: 'point', x: 1, y: 4 },
    { name: 'd', type: 'circle', center: [1, 4], radius: Math.sqrt(32) },
  ],

  // 3C: centre a l'origen, radi 3: passa per B i C, però no per A
  'repte-3c': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'd', type: 'circle', center: [0, 0], radius: 3 },
  ],
  // 4A: hexàgon regular de costat 2 (àrea ≈ 10.39)
  'repte-4a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'p', type: 'polygon', value: 10.392 },
    { name: 'f', type: 'segment', length: 2 },
    { name: 'g', type: 'segment', length: 2 },
    { name: 'h', type: 'segment', length: 2 },
    { name: 'i', type: 'segment', length: 2 },
    { name: 'j', type: 'segment', length: 2 },
    { name: 'k', type: 'segment', length: 2 },
  ],


  // 4B: quadrat inscrit (4 punts sobre c, àrea 18)
  'repte-4b': [
    { name: 'A', type: 'point', x: 3, y: 0 },
    { name: 'B', type: 'point', x: 0, y: 3 },
    { name: 'C', type: 'point', x: -3, y: 0 },
    { name: 'D', type: 'point', x: 0, y: -3 },
    { name: 'h', type: 'polygon', value: 18 },
  ],

  // 4C: cantonades retallades 0.8 (en lloc de 1.172): octàgon no regular, àrea 14.72
  'repte-4c': [
    { name: 'E', type: 'point', x: -1.2, y: -2 },
    { name: 'F', type: 'point', x: 1.2, y: -2 },
    { name: 'G', type: 'point', x: 2, y: -1.2 },
    { name: 'H', type: 'point', x: 2, y: 1.2 },
    { name: 'J', type: 'point', x: 1.2, y: 2 },
    { name: 'K', type: 'point', x: -1.2, y: 2 },
    { name: 'L', type: 'point', x: -2, y: 1.2 },
    { name: 'M', type: 'point', x: -2, y: -1.2 },
    { name: 'o', type: 'polygon', value: 14.72 },
  ],
  // 5A: perpendicular per A (no pel punt mig), amb el punt mig
  'repte-5a': [
    { name: 'm', type: 'line', p: [-2, 0], d: [0, 1] },
    { name: 'M', type: 'point', x: 1, y: 0 },
  ],

  // 5B: punt equidistant de A i B però no de C
  'repte-5b': [
    { name: 'D', type: 'point', x: 3, y: 0 },
  ],


  // 5C: la circumferència bona, però sense cap mediatriu
  'repte-5c': [
    { name: 'M', type: 'point', x: 3, y: 2 },
    { name: 'd', type: 'circle', center: [3, 2], radius: Math.sqrt(13) },
  ],
  // 6A: recta per O de pendent 0.5 (la bisectriu té pendent 0.414)
  'repte-6a': [
    { name: 'b', type: 'line', p: [0, 0], d: [4, 2] },
  ],


  // 6B: dues mediatrius i el circumcentre (4, 1.75)
  'repte-6b': [
    { name: 'm', type: 'line', p: [4, 0], d: [0, 1] },
    { name: 'n', type: 'line', p: [5.5, 3], d: [6, 5] },
    { name: 'I', type: 'point', x: 4, y: 1.75 },
  ],

  // 6C: centre a l'incentre, però passa per un vèrtex (radi √13)
  'repte-6c': [
    { name: 'I', type: 'point', x: 3, y: 2 },
    { name: 'd', type: 'circle', center: [3, 2], radius: Math.sqrt(13) },
  ],
  // 7A: la perpendicular, però el peu al lloc equivocat
  'repte-7a': [
    { name: 'g', type: 'line', p: [3, 4], d: [-1, 4] },
    { name: 'F', type: 'point', x: 3, y: 2 },
  ],


  // 7B: totes dues paral·leles a la mateixa banda (distàncies 2 i 4)
  'repte-7b': [
    { name: 'g', type: 'line', p: [-1.2, 1.6], d: [4, 3] },
    { name: 'h', type: 'line', p: [-2.4, 3.2], d: [4, 3] },
  ],

  // 7C: dues medianes i el baricentre (11/3, 2)
  'repte-7c': [
    { name: 'h', type: 'line', p: [0, 0], d: [5.5, 3] },
    { name: 'k', type: 'line', p: [3, 6], d: [1, -6] },
    { name: 'G', type: 'point', x: 11 / 3, y: 2 },
  ],
  // 8A: traslladat amb un altre vector, (2, 4)
  'repte-8a': [
    { name: "A'", type: 'point', x: 2, y: 4 },
    { name: "B'", type: 'point', x: 5, y: 4 },
    { name: "C'", type: 'point', x: 3, y: 7 },
    { name: "t'", type: 'triangle', value: 4.5 },
  ],


  // 8B: gir de 60° en sentit horari
  'repte-8b': [
    { name: "A'", type: 'point', x: 1, y: -1.732 },
    { name: "B'", type: 'point', x: 2.5, y: -4.330 },
    { name: "C'", type: 'point', x: 4.232, y: -3.330 },
    { name: "t'", type: 'triangle', value: 3 },
  ],

  // 8C: la reflexió amb lliscament, aplicada només una vegada
  'repte-8c': [
    { name: "A'", type: 'point', x: 0, y: 1 },
    { name: "B'", type: 'point', x: 0, y: 3 },
    { name: "C'", type: 'point', x: 2, y: 3 },
    { name: 'r', type: 'triangle', value: 2 },
    { name: "A''", type: 'point', x: 2, y: 3 },
    { name: "B''", type: 'point', x: 2, y: 5 },
    { name: "C''", type: 'point', x: 4, y: 5 },
    { name: 'g', type: 'triangle', value: 2 },
  ],
  // 9A: una altra paràbola, x² − 1, amb les seves arrels
  'repte-9a': [
    { name: 'f', type: 'function', fn: function(x) { return x * x - 1; } },
    { name: 'Z_1', type: 'point', x: -1, y: 0 },
    { name: 'Z_2', type: 'point', x:  1, y: 0 },
  ],


  // 9B: les dues funcions, sense marcar els punts de tall
  'repte-9b': [
    { name: 'f', type: 'function', fn: function(x) { return x * x; } },
    { name: 'g', type: 'function', fn: function(x) { return x + 2; } },
  ],

  // 9C: les funcions i els dos talls, però l'angle sense mesurar
  'repte-9c': [
    { name: 'f', type: 'function', fn: Math.sin },
    { name: 'g', type: 'function', fn: Math.cos },
    { name: 'P', type: 'point', x: Math.PI / 4, y: Math.SQRT1_2 },
    { name: 'Q', type: 'point', x: 5 * Math.PI / 4, y: -Math.SQRT1_2 },
  ],
  // 10A: hi ha lliscador, però el polígon (un quadrat) no en depèn
  'repte-10a': [
    { name: 'n', type: 'numeric', value: 3, moveable: true },
    { name: 'A', type: 'point', x: 1, y: 0 },
    { name: 'B', type: 'point', x: 0, y: 1 },
    { name: 'p', type: 'polygon', value: 2 },
  ],

  // 10B: P i M ben fets, però sense el lloc geomètric
  'repte-10b': [
    { name: 'P', type: 'point', x: 3, y: 0 },
    { name: 'M', type: 'point', x: 4.5, y: 1 },
  ],

  // 10C: radis a i 8 − a: el punt M fa suma 8, no 10
  'repte-10c': [
    { name: 'a', type: 'numeric', value: 5, moveable: true },
    { name: 'c', type: 'circle', center: [-3, 0], radius: 5 },
    { name: 'd', type: 'circle', center: [3, 0], radius: 3 },
    { name: 'M', type: 'point', x: 4 / 3, y: Math.sqrt(25 - 169 / 9) },
    { name: 'l', type: 'locus' },
  ],
};

// ── 4b. Més solucions incorrectes (errors típics) ───────

const EXTRA_WRONG = {

  // 1B: els tres punts i la hipotenusa com a segment, sense polígon
  'repte-1b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 0, y: 3 },
    { name: 'a', type: 'segment', length: 5 },
  ],


  // 1C: els tres punts mitjos, sense el polígon
  'repte-1c': [
    { name: 'D', type: 'point', x: 4, y: 0 },
    { name: 'E', type: 'point', x: 5, y: 3 },
    { name: 'F', type: 'point', x: 1, y: 3 },
  ],
  // 2B: els dos vèrtexs, sense el polígon
  'repte-2b': [
    { name: 'B', type: 'point', x: 5, y: 0 },
    { name: 'D', type: 'point', x: 0, y: 5 },
  ],


  // 2C: rectangle 2 × 4: àrea 8, però no és un quadrat
  'repte-2c': [
    { name: 'r', type: 'quadrilateral', value: 8 },
    { name: 'e', type: 'segment', length: 4 },
    { name: 'f', type: 'segment', length: 2 },
    { name: 'g', type: 'segment', length: 4 },
    { name: 'h', type: 'segment', length: 2 },
  ],
  // 3B: centre a l'eix Y, però radi 4 (no passa per A ni per B)
  'repte-3b': [
    { name: 'K', type: 'point', x: 0, y: 4 },
    { name: 'd', type: 'circle', center: [0, 4], radius: 4 },
  ],


  // 3C: la circumferència pels tres vèrtexs (Circumferència(A,B,C)), sense marcar el centre
  'repte-3c': [
    { name: 'd', type: 'circle', center: [0, 0.875], radius: 3.125 },
  ],
  // 4B: hexàgon regular cap a fora (Polígon(B,A,6)): només A i B sobre c
  'repte-4b': [
    { name: 'A', type: 'point', x: 3, y: 0 },
    { name: 'B', type: 'point', x: 1.5, y: 2.598 },
    { name: 'C', type: 'point', x: 4.5, y: 2.598 },
    { name: 'D', type: 'point', x: 3, y: 5.196 },
    { name: 'E', type: 'point', x: 6, y: 5.196 },
    { name: 'F', type: 'point', x: 4.5, y: 7.794 },
    { name: 'h', type: 'polygon', value: 23.383 },
  ],

  // 4C: l'octàgon regular cap a fora (Polígon(F,E,8)): només E i F són sobre el quadrat
  'repte-4c': [
    { name: 'E', type: 'point', x: -0.828, y: -2 },
    { name: 'F', type: 'point', x: 0.828, y: -2 },
    { name: 'G', type: 'point', x: 2, y: -3.172 },
    { name: 'H', type: 'point', x: 2, y: -4.828 },
    { name: 'J', type: 'point', x: 0.828, y: -6 },
    { name: 'K', type: 'point', x: -0.828, y: -6 },
    { name: 'L', type: 'point', x: -2, y: -4.828 },
    { name: 'M', type: 'point', x: -2, y: -3.172 },
    { name: 'o', type: 'polygon', value: 13.255 },
  ],
  // 5A: la mediatriu, però sense marcar el punt mig
  'repte-5a': [
    { name: 'm', type: 'line', p: [1, 0], d: [0, 1] },
  ],


  // 5C: les dues mediatrius i el centre, però radi 2
  'repte-5c': [
    { name: 'm', type: 'line', p: [3, 0], d: [0, 1] },
    { name: 'n', type: 'line', p: [0, 2], d: [1, 0] },
    { name: 'O', type: 'point', x: 3, y: 2 },
    { name: 'd', type: 'circle', center: [3, 2], radius: 2 },
  ],
  // 6A: no s'ha fet res més que mesurar l'angle (les semirectes no compten)
  'repte-6a': [
    { name: 'alfa', type: 'angle', value: Math.PI / 4 },
  ],


  // 6B: el punt a l'incentre, però sense cap bisectriu
  'repte-6b': [
    { name: 'I', type: 'point', x: 3.449, y: 2.132 },
  ],

  // 6C: la circumferència bona (CircumferènciaInscrita), sense marcar l'incentre
  'repte-6c': [
    { name: 'd', type: 'circle', center: [3, 2], radius: 2 },
  ],
  // 7A: el peu ben posat, però cap recta nova
  'repte-7a': [
    { name: 'F', type: 'point', x: 64 / 17, y: 16 / 17 },
  ],


  // 7B: només la perpendicular a f per O (passa pels dos punts, però no és paral·lela)
  'repte-7b': [
    { name: 'p', type: 'line', p: [0, 0], d: [-3, 4] },
  ],

  // 7C: l'ortocentre ben posat, però una sola altura
  'repte-7c': [
    { name: 'h', type: 'line', p: [3, 0], d: [0, 1] },
    { name: 'H', type: 'point', x: 3, y: 2.5 },
  ],
  // 8A: els tres punts imatge, sense el polígon
  'repte-8a': [
    { name: 'D', type: 'point', x: 4, y: 2 },
    { name: 'E', type: 'point', x: 7, y: 2 },
    { name: 'F', type: 'point', x: 5, y: 5 },
  ],


  // 8B: els tres punts imatge, sense el polígon
  'repte-8b': [
    { name: 'D', type: 'point', x: 1, y: 1.732 },
    { name: 'E', type: 'point', x: 2.5, y: 4.330 },
    { name: 'F', type: 'point', x: 0.768, y: 5.330 },
  ],

  // 8C: el triangle final directament (t + (4, 4)), sense els passos intermedis
  'repte-8c': [
    { name: 'D', type: 'point', x: 5, y: 4 },
    { name: 'E', type: 'point', x: 7, y: 4 },
    { name: 'F', type: 'point', x: 7, y: 6 },
    { name: 'h', type: 'triangle', value: 2 },
  ],
  // 9A: la funció bona, però només una de les dues arrels
  'repte-9a': [
    { name: 'f', type: 'function', fn: function(x) { return x * x - 4; } },
    { name: 'Z', type: 'point', x: 2, y: 0 },
  ],


  // 9B: les dues funcions i només un dels dos punts de tall
  'repte-9b': [
    { name: 'f', type: 'function', fn: function(x) { return x * x; } },
    { name: 'g', type: 'function', fn: function(x) { return x + 2; } },
    { name: 'P', type: 'point', x: 2, y: 4 },
  ],

  // 9C: l'angle bo, però només un punt de tall
  'repte-9c': [
    { name: 'f', type: 'function', fn: Math.sin },
    { name: 'g', type: 'function', fn: Math.cos },
    { name: 'P', type: 'point', x: Math.PI / 4, y: Math.SQRT1_2 },
    { name: 'w', type: 'angle', value: 2 * Math.atan(Math.SQRT1_2) },
  ],
  // 10A: polígon que depèn d'un nombre que no és cap lliscador
  'repte-10a': [
    { name: 'n', type: 'numeric', value: 3 },
    { name: 'p', type: 'polygon',
      valueFn: function(valorDe) { var n = valorDe('n'); return n / 2 * Math.sin(2 * Math.PI / n); } },
  ],


  // 10B: lloc geomètric, però P no és sobre c (P = (1, 0))
  'repte-10b': [
    { name: 'P', type: 'point', x: 1, y: 0 },
    { name: 'M', type: 'point', x: 3.5, y: 1 },
    { name: 'l', type: 'locus' },
  ],

  // 10C: tot bé, però a és un nombre fix i no un lliscador
  'repte-10c': [
    { name: 'a', type: 'numeric', value: 5 },
    { name: 'c', type: 'circle', center: [-3, 0], radius: 5 },
    { name: 'd', type: 'circle', center: [3, 0], radius: 5 },
    { name: 'M', type: 'point', x: 0, y: 4 },
    { name: 'l', type: 'locus' },
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
  // 1A: equilàter fet amb tres punts (tipus 'triangle'), cap avall
  'repte-1a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 4, y: 0 },
    { name: 'C', type: 'point', x: 2, y: -3.46 },
    { name: 't', type: 'triangle', value: 6.92 },
    { name: 'a', type: 'segment', length: 4 },
    { name: 'b', type: 'segment', length: 4 },
    { name: 'c', type: 'segment', length: 4 },
  ],


  // 3B: centre a l'origen, radi 3 (també val)
  'repte-3b': [
    { name: 'd', type: 'circle', center: [0, 0], radius: 3 },
  ],
  // 4A: el pentàgon fet punt per punt (tipus 'pentagon')
  'repte-4a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'p', type: 'pentagon', value: 6.9 },
    { name: 'a', type: 'segment', length: 2 },
    { name: 'b', type: 'segment', length: 2 },
    { name: 'c', type: 'segment', length: 2 },
    { name: 'd', type: 'segment', length: 2 },
    { name: 'e', type: 'segment', length: 2 },
  ],


  // 4C: la drecera Polígon(E,F,8) sobre el costat de baix (tipus 'polygon', els mateixos vuit punts)
  'repte-4c': [
    { name: 'E', type: 'point', x: -0.828, y: -2 },
    { name: 'F', type: 'point', x: 0.828, y: -2 },
    { name: 'G', type: 'point', x: 2, y: -0.828 },
    { name: 'H', type: 'point', x: 2, y: 0.828 },
    { name: 'J', type: 'point', x: 0.828, y: 2 },
    { name: 'K', type: 'point', x: -0.828, y: 2 },
    { name: 'L', type: 'point', x: -2, y: 0.828 },
    { name: 'M', type: 'point', x: -2, y: -0.828 },
    { name: 'pol1', type: 'polygon', value: 13.25 },
  ],
  // 5A: la mediatriu feta amb dos punts (recta per (1,-3) i (1,3))
  'repte-5a': [
    { name: 'C', type: 'point', x: 1, y: -3 },
    { name: 'D', type: 'point', x: 1, y: 3 },
    { name: 'm', type: 'line', a: 'C', b: 'D' },
    { name: 'M', type: 'point', x: 1, y: 0 },
  ],


  // 9B: la recta escrita com a y = x + 2 (tipus 'line')
  'repte-9b': [
    { name: 'f', type: 'function', fn: function(x) { return x * x; } },
    { name: 'g', type: 'line', p: [0, 2], d: [1, 1] },
    { name: 'A', type: 'point', x: -1, y: 1 },
    { name: 'B', type: 'point', x:  2, y: 4 },
  ],

  // 9C: l'angle mesurat a l'altre costat (109.47°)
  'repte-9c': [
    { name: 'f', type: 'function', fn: Math.sin },
    { name: 'g', type: 'function', fn: Math.cos },
    { name: 'P', type: 'point', x: Math.PI / 4, y: Math.SQRT1_2 },
    { name: 'Q', type: 'point', x: -3 * Math.PI / 4, y: -Math.SQRT1_2 },
    { name: 'w', type: 'angle', value: Math.PI - 2 * Math.atan(Math.SQRT1_2) },
  ],
  // 10A: polígon de costat fix 1 (l'àrea, n/(4·tan(π/n)), també creix amb n)
  'repte-10a': [
    { name: 'k', type: 'numeric', value: 6, moveable: true },
    { name: 'p', type: 'polygon',
      valueFn: function(valorDe) { var n = valorDe('k'); return n / (4 * Math.tan(Math.PI / n)); } },
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

  // Capítol 10: lliscador i polígon regular de n costats (en lloc de circumferència)
  'cap-10-ex': [
    { name: 'n', type: 'numeric', value: 5, moveable: true },
    { name: 'p', type: 'polygon',
      valueFn: function(valorDe) { var n = valorDe('n'); return n / (4 * Math.tan(Math.PI / n)); } },
  ],
};

// ── 4d. Exercicis dels capítols ─────────────────────────
// INITIAL: els objectes que la pàgina ja porta (data-commands), per als
// reptes i per als capítols. Totes les solucions s'hi afegeixen.

const INITIAL = {
  'repte-1c': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 8, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 6 },
    { name: 't', type: 'triangle', value: 24 },
  ],
  'repte-2b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'C', type: 'point', x: 5, y: 5 },
  ],
  'repte-2c': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 2, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 2 },
    { name: 'D', type: 'point', x: 0, y: 2 },
    { name: 'q', type: 'quadrilateral', value: 4 },
    { name: 'a', type: 'segment', length: 2 },
    { name: 'b', type: 'segment', length: 2 },
    { name: 'c', type: 'segment', length: 2 },
    { name: 'd', type: 'segment', length: 2 },
  ],
  'repte-3b': [
    { name: 'A', type: 'point', x: -3, y: 0 },
    { name: 'B', type: 'point', x:  3, y: 0 },
  ],
  'repte-3c': [
    { name: 'A', type: 'point', x: 0, y: 4 },
    { name: 'B', type: 'point', x: -3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 0 },
    { name: 't', type: 'triangle', value: 12 },
  ],
  'repte-4b': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
  ],
  'repte-4c': [
    { name: 'P', type: 'point', x: -2, y: -2 },
    { name: 'Q', type: 'point', x: 2, y: -2 },
    { name: 'R', type: 'point', x: 2, y: 2 },
    { name: 'S', type: 'point', x: -2, y: 2 },
    { name: 'q', type: 'quadrilateral', value: 16 },
  ],
  'repte-5a': [
    { name: 'A', type: 'point', x: -2, y: 0 },
    { name: 'B', type: 'point', x:  4, y: 0 },
    { name: 's', type: 'segment', a: 'A', b: 'B', length: 6 },
  ],
  'repte-5b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 6, y: 0 },
    { name: 'C', type: 'point', x: 2, y: 5 },
    { name: 't', type: 'triangle', value: 15 },
  ],
  'repte-5c': [
    { name: 'A', type: 'point', x: 6, y: 0 },
    { name: 'B', type: 'point', x: 0, y: 4 },
    { name: 'C', type: 'point', x: 0, y: 0 },
    { name: 't', type: 'triangle', value: 12 },
  ],
  'repte-6a': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'A', type: 'point', x: 4, y: 0 },
    { name: 'B', type: 'point', x: Math.sqrt(8), y: Math.sqrt(8) },
    { name: 'f', type: 'ray', a: 'O', b: 'A' },
    { name: 'g', type: 'ray', a: 'O', b: 'B' },
  ],
  'repte-6b': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 8, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 6 },
    { name: 't', type: 'triangle', value: 24 },
  ],
  'repte-6c': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 7, y: 0 },
    { name: 'C', type: 'point', x: 2.5, y: 6 },
    { name: 't', type: 'triangle', value: 21 },
  ],
  'repte-7a': [
    { name: 'f', type: 'line', p: [0, 0], d: [4, 1] },
    { name: 'P', type: 'point', x: 3, y: 4 },
  ],
  'repte-7b': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'f', type: 'line', p: [0, 0], d: [4, 3] },
  ],
  'repte-7c': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 8, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 6 },
    { name: 't', type: 'triangle', value: 24 },
  ],
  'repte-8a': [
    { name: 'A', type: 'point', x: 0, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 1, y: 3 },
    { name: 't', type: 'triangle', value: 4.5 },
    { name: 'v', type: 'vector' },
  ],
  'repte-8b': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'A', type: 'point', x: 2, y: 0 },
    { name: 'B', type: 'point', x: 5, y: 0 },
    { name: 'C', type: 'point', x: 5, y: 2 },
    { name: 't', type: 'triangle', value: 3 },
  ],
  'repte-8c': [
    { name: 'A', type: 'point', x: 1, y: 0 },
    { name: 'B', type: 'point', x: 3, y: 0 },
    { name: 'C', type: 'point', x: 3, y: 2 },
    { name: 't', type: 'triangle', value: 2 },
    { name: 'f', type: 'line', p: [0, 0], d: [1, 1] },
    { name: 'v', type: 'vector' },
  ],
  'repte-10b': [
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
    { name: 'Q', type: 'point', x: 6, y: 2 },
  ],
  'repte-10c': [
    { name: 'F_1', type: 'point', x: -3, y: 0 },
    { name: 'F_2', type: 'point', x: 3, y: 0 },
  ],
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
  'cap-10-ex': [                                    // circumferència de radi a
    { name: 'a', type: 'numeric', value: 1, moveable: true },
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0],
      radiusFn: function(valorDe) { return valorDe('a'); } },
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

// Torna el que torna el validador: true o un motiu (un text). Una excepció
// torna { error }, que no és ni una cosa ni l'altra.
function runValidator(goalId, objects) {
  var api = createMockAPI(objects);
  sandbox.ggbApplet = api;        // GV usa ggbApplet global
  var fn = VALIDATORS[goalId];
  if (!fn) throw new Error('Validator no trobat: ' + goalId);
  try {
    return fn(api, GV);
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

// Un motiu ben fet: una frase en català que comença en majúscula, acaba en
// punt i no porta cap valor que no s'hagi pogut escriure.
function esMotiu(res) {
  return typeof res === 'string' && res.length > 8 &&
         /^[A-ZÀ-ÚÇ]/.test(res) && /[.!?]$/.test(res) &&
         !/undefined|NaN|null|\[object/.test(res);
}

// La construcció ha de ser correcta: el validador torna exactament true.
function correcte(label, res) { test(label, res, true); }

// La construcció no és correcta: el validador torna un motiu, que s'escriu.
function motiu(label, res, conte) {
  var ok = esMotiu(res) && (!conte || res.indexOf(conte) !== -1);
  if (ok) {
    totalPass++;
    process.stdout.write(COL.green + '    ✓ ' + COL.reset + label +
      COL.dim + '  «' + res + '»' + COL.reset + '\n');
  } else {
    totalFail++;
    process.stdout.write(COL.red + '    ✗ ' + COL.reset + label +
      COL.dim + '  (esperava un motiu' + (conte ? ' amb «' + conte + '»' : '') +
      ', obtingut ' + JSON.stringify(res) + ')' + COL.reset + '\n');
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
  correcte('Solució correcta → true', runValidator(id, amb(CORRECT_SOLUTIONS[id])));
  if (EXTRA_CORRECT[id]) {
    correcte('Una altra solució correcta → true', runValidator(id, amb(EXTRA_CORRECT[id])));
  }

  // Test 2: Escena inicial (buida, o el que ja porta la pàgina) → motiu
  motiu('Escena inicial → motiu', runValidator(id, inicial));

  // Test 3: Solució parcial/incorrecta → motiu
  motiu('Solució incorrecta → motiu', runValidator(id, amb(WRONG_SOLUTIONS[id])));
  if (EXTRA_WRONG[id]) motiu('Error típic → motiu', runValidator(id, amb(EXTRA_WRONG[id])));

  console.log('');
});

// Cada validador té les seves escenes de prova.
(function() {
  console.log(COL.cyan + COL.bold + '  ▸ Tots els validadors tenen escenes' + COL.reset);
  Object.keys(VALIDATORS).forEach(function(id) {
    test(id + ' té una solució correcta i una d\'incorrecta',
         !!(CORRECT_SOLUTIONS[id] && WRONG_SOLUTIONS[id]), true);
  });
  console.log('');
})();

// El validador del repte 10A mou el lliscador: l'ha de deixar on era.
(function() {
  console.log(COL.cyan + COL.bold + '  ▸ repte-10a: el lliscador' + COL.reset);
  var escena = [
    { name: 'n', type: 'numeric', value: 7, moveable: true },
    { name: 'p', type: 'polygon',
      valueFn: function(valorDe) { var n = valorDe('n'); return n / 2 * Math.sin(2 * Math.PI / n); } },
  ];
  test('Solució correcta → true', runValidator('repte-10a', escena), true);
  test('El lliscador torna a valer 7', escena[0].value, 7);
  console.log('');
})();

// L'exercici del capítol 10 demana que el lliscador faci canviar la figura:
// el validador mou cada lliscador i el torna on era (GV.sliderMoves).
(function() {
  console.log(COL.cyan + COL.bold + '  ▸ cap-10-ex: la figura depèn del lliscador' + COL.reset);
  function radiA(valorDe) { return valorDe('a'); }

  var escena = [
    { name: 'a', type: 'numeric', value: 2.5, moveable: true },
    { name: 'O', type: 'point', x: 0, y: 0 },
    { name: 'c', type: 'circle', center: [0, 0], radiusFn: radiA },
  ];
  correcte('Radi a → true', runValidator('cap-10-ex', escena));
  test('El lliscador torna a valer 2.5', escena[0].value, 2.5);

  correcte('Lliscador al màxim del seu interval (només es pot moure cap avall) → true',
    runValidator('cap-10-ex', [
      { name: 'a', type: 'numeric', value: 5, min: 1, max: 5, moveable: true },
      { name: 'c', type: 'circle', center: [0, 0], radiusFn: radiA },
    ]));

  correcte('Circumferència que es desplaça amb el lliscador (el radi no canvia) → true',
    runValidator('cap-10-ex', [
      { name: 'a', type: 'numeric', value: 1, moveable: true },
      { name: 'c', type: 'circle', radius: 2, centerFn: function(valorDe) { return [valorDe('a'), 0]; } },
    ]));

  correcte('Triangle traslladat pel lliscador (l\'àrea no canvia) → true',
    runValidator('cap-10-ex', [
      { name: 'k', type: 'numeric', value: 0, moveable: true },
      { name: 't', type: 'triangle', value: 6,
        vertsFn: function(valorDe) { var k = valorDe('k'); return [[k, 0], [k + 4, 0], [k, 3]]; } },
    ]));

  correcte('Triangle girat al voltant del primer vèrtex per un lliscador d\'angle → true',
    runValidator('cap-10-ex', [
      { name: 'α', type: 'angle', value: 0.5, moveable: true },
      { name: 't', type: 'triangle', value: 6,
        vertsFn: function(valorDe) {
          var g = valorDe('α');
          return [[0, 0], [4 * Math.cos(g), 4 * Math.sin(g)], [-3 * Math.sin(g), 3 * Math.cos(g)]];
        } },
    ]));

  motiu('Lliscador i circumferència que no en depèn → motiu que ho explica',
    runValidator('cap-10-ex', [
      { name: 'a', type: 'numeric', value: 1, moveable: true },
      { name: 'O', type: 'point', x: 0, y: 0 },
      { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
    ]), 'Has creat el lliscador a i la figura c, però c no depèn de a');

  motiu('Dos lliscadors i dues figures que no en depenen → motiu que ho explica',
    runValidator('cap-10-ex', [
      { name: 'a', type: 'numeric', value: 1, moveable: true },
      { name: 'b', type: 'numeric', value: 2, moveable: true },
      { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
      { name: 't_1', type: 'triangle', value: 6, verts: [[0, 0], [4, 0], [0, 3]] },
    ]), 'cap figura no depèn de cap lliscador');

  motiu('Un angle mesurat (no és cap lliscador) i una circumferència → motiu',
    runValidator('cap-10-ex', [
      { name: 'α', type: 'angle', value: 0.5 },
      { name: 'c', type: 'circle', center: [0, 0], radius: 3 },
    ]), 'Falta un lliscador');
  console.log('');
})();

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
