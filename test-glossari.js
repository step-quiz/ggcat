#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// test-glossari.js — Comprova els exemples del glossari sense navegador
//
//   · cada paraula del glossari (<code> de les graelles de glossari-data.js)
//     té el seu exemple a glossari-exemples.js, i cap exemple sobra;
//   · cada exemple té ordres, una proposta «Prova-ho» i una regió visible vàlida;
//   · la traducció català → anglès (tradueixOrdreGlossari) no deixa cap ordre
//     sense traduir: evalCommand només entén els noms anglesos.
//
// Que GeoGebra accepti cada línia només es pot veure al navegador: a la consola
// d'una pàgina del curs, GLOSSARI_PROVA_TOTS(console.log) (vegeu TODO.md, bloc K).
// ════════════════════════════════════════════════════════════

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ctx = vm.createContext({});
for (const f of ['glossari-data.js', 'glossari-exemples.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'curs', f), 'utf8'), ctx);
}
const { GLOSSARI_HTML, GLOSSARI_EXEMPLES, GLOSSARI_ORDRES, tradueixOrdreGlossari } =
  vm.runInContext('({ GLOSSARI_HTML, GLOSSARI_EXEMPLES, GLOSSARI_ORDRES, tradueixOrdreGlossari })', ctx);

let ok = 0, ko = 0;
function test(nom, cond, detall) {
  if (cond) { ok++; }
  else { ko++; console.log('  ✗ ' + nom + (detall ? '  (' + detall + ')' : '')); }
}

// ── 1. Paraules del glossari ↔ exemples ──
const paraules = new Set();
const graelles = GLOSSARI_HTML.match(/<div class="glossari-grid">[\s\S]*?<\/div>/g) || [];
graelles.forEach(g => {
  for (const m of g.matchAll(/<code>([^<]*)<\/code><span>/g)) paraules.add(m[1].trim());
});
test('el glossari té paraules', paraules.size > 40, paraules.size + ' paraules');
paraules.forEach(p => test('exemple per a «' + p + '»', !!GLOSSARI_EXEMPLES[p]));
Object.keys(GLOSSARI_EXEMPLES).forEach(k => test('«' + k + '» és una paraula del glossari', paraules.has(k)));

// ── 2. Camps de cada exemple ──
const ANGLES = new Set(GLOSSARI_ORDRES.map(p => p[1]).concat(['ShowAxes', 'ShowGrid']));
// Funcions matemàtiques de GeoGebra, que es diuen igual en català i en anglès
const MATES = new Set(['sin', 'cos', 'tan', 'sqrt', 'exp', 'ln', 'log', 'abs']);
Object.entries(GLOSSARI_EXEMPLES).forEach(([k, ex]) => {
  test(k + ': ordres', Array.isArray(ex.codi) && ex.codi.length > 0 && ex.codi.every(l => typeof l === 'string' && l.trim()));
  test(k + ': prova-ho', typeof ex.prova === 'string' && ex.prova.length > 10);
  const v = String(ex.view || '').trim().split(/\s+/).map(Number);
  test(k + ': regió visible', v.length === 4 && v.every(isFinite) && v[0] < v[1] && v[2] < v[3], ex.view);

  // ── 3. Traducció: després de traduir, cada nom seguit de «(» és una ordre anglesa
  //       coneguda o una funció definida a l'exemple (f(x)=…)
  const funcions = new Set(ex.codi.map(l => (l.match(/^\s*([a-z]\w*)\s*\(x\)\s*=/) || [])[1]).filter(Boolean));
  ex.codi.forEach(l => {
    const t = tradueixOrdreGlossari(l);
    for (const m of t.matchAll(/([A-Za-zÀ-ÖØ-öø-ÿ·_][A-Za-z0-9À-ÖØ-öø-ÿ·_]*)\s*\(/g)) {
      const nom = m[1];
      test(k + ': «' + nom + '(» es pot executar', ANGLES.has(nom) || funcions.has(nom) || MATES.has(nom) || nom === 'x' || nom === 'y', l);
    }
    test(k + ': sense EixX/EixY sense traduir', !/Eix[XY]/.test(t), l);
  });
});

// ── 4. La traducció en casos concrets ──
[
  ['c=Circumferència(C,2.5)', 'c=Circle(C,2.5)'],
  ['c=CircumferènciaInscrita(K,L,M)', 'c=Incircle(K,L,M)'],
  ['M=PuntMitjà(R,S)', 'M=Midpoint(R,S)'],
  ['a=PuntLliscant(1,4,0.5)', 'a=Slider(1,4,0.5)'],
  ['P=Punt(c)', 'P=Point(c)'],
  ['Semirecta(O,D)', 'Ray(O,D)'],
  ['Intersecció(f,EixX)', 'Intersect(f,xAxis)'],
  ['Seqüència(Circumferència((0,0),k),k,1,4)', 'Sequence(Circle((0,0),k),k,1,4)'],
  ['Q=Rotació(P,180°,(0,0))', 'Q=Rotate(P,180°,(0,0))'],
  ['Punts=(1,2)', 'Punts=(1,2)'],                 // un nom que comença com una ordre no es toca
  ['EixXY=3', 'EixXY=3']
].forEach(([ca, en]) => test('tradueix «' + ca + '»', tradueixOrdreGlossari(ca) === en, tradueixOrdreGlossari(ca)));

console.log('');
console.log(ko === 0
  ? '  ✓ GLOSSARI: TOTES LES COMPROVACIONS PASSEN (' + ok + '/' + ok + ')'
  : '  ✗ GLOSSARI: FALLADES ' + ko + '/' + (ok + ko));
process.exit(ko ? 1 : 0);
