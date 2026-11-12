# Ggcat

Aprendre GeoGebra en català — curs interactiu al navegador.

## Què és

Ggcat és un curs de geometria interactiva amb GeoGebra, pensat per a estudiants d'ESO i Batxillerat. Inclou capítols guiats i reptes amb validació automàtica. Tot funciona directament al navegador, sense instal·lació ni comptes. Per a la pràctica lliure, l'alumne pot fer servir directament la seva instal·lació preferida de GeoGebra (web, escriptori o mòbil).

## Com obrir-lo

Obre `index.html` al navegador. Des d'allà pots accedir a:
- **Capítols** (`curs/capitol-1.html` ... `capitol-10.html`) — Lliçons guiades amb widgets interactius i un exercici final validat ✓/✗.
- **Reptes** (`curs/repte-1a.html` ... ) — Exercicis amb validació automàtica ✓/✗, ordenats en una graella de
  10 temes × 3 nivells (A fàcil, B mitjà, C difícil). El repte 3B és `curs/repte-3b.html`.

Cal connexió a internet per carregar GeoGebra des del CDN (`geogebra.org`). Si no s'hi pot connectar, cada
widget ho diu (amb un botó per tornar a carregar la pàgina) en lloc de quedar-se a «carregant…».

## Estructura

```
index.html              Landing page
style.css               Estils compartits (topbar, botons, temes)
curs/
  index.html            Índex del curs (llista de capítols i graella de reptes)
  capitol-N.html        10 capítols del curs
  repte-<tema><nivell>.html   Reptes de la graella (repte-1a.html … repte-10c.html): tots 30. Es generen
                        amb tools/generate-pages.js a partir de tools/pages/*.json: no s'editen a mà
  curs.css              Estils del curs
  capitols.js           Dades, sidebar, injecció de widgets, glossari
  progress.js           Progrés de l'alumne (fitxer comú; clau geocat_progress)
  geovalidator.js       Llibreria d'assertions geomètriques (objecte GV)
  validators.js         Mapa goalId → funció validadora per a cada exercici
  glossari-data.js      Contingut HTML del glossari de comandes
  debug-tester.js       Test end-to-end del botó «Comprova» (curs/index.html?debug=1)
  edit.html             Editor de revisió del text dels capítols (vegeu més avall)
tools/                  Generador de pàgines JSON → HTML i el seu invers (vegeu tools/README.md)
REPTES_SPECIFICATION.md Especificació dels reptes: graella de 10 temes × 3 nivells (30 reptes)
TODO.md                 Pla de treball i tasques pendents
GeoCat-30Reptes.docx    Esborrany original de la graella (obsolet: mana REPTES_SPECIFICATION.md)
test-validators.js      Test Node dels validators amb una API de GeoGebra simulada
test-debug-tester-logic.js  Test Node de la lògica de debug-tester.js
```

## Proves

- `node tools/generate-pages.js --comprova` — comprova que les pàgines descrites a
  `tools/pages/*.json` són les que hi ha a `curs/`. GitHub ho fa a cada canvi
  (`.github/workflows/tests.yml`, juntament amb la sintaxi de tots els fitxers JS i els dos
  tests de sota).
- `node test-validators.js` — comprova els validadors dels 30 reptes i dels 10 exercicis dels
  capítols amb una API de GeoGebra simulada: per a cada un, l'escena inicial, una solució correcta
  i una d'incorrecta, i en alguns casos altres solucions correctes i errors típics (161
  comprovacions). El simulacre fa servir els tipus d'objecte reals de GeoGebra (`circle`,
  `triangle`, `quadrilateral`…) i calcula de debò `Distance`, `ArePerpendicular` i
  `AreParallel` a partir dels punts. GitHub també ho executa a cada canvi.
- `node test-debug-tester-logic.js` — la lògica del provador end-to-end.
- `node test-glossari.js` — cada paraula del glossari té el seu exemple, i la traducció de les ordres
  al nom anglès que entén GeoGebra no deixa cap ordre sense traduir. Que GeoGebra accepti cada exemple
  es comprova al navegador: a la consola d'una pàgina del curs, `GLOSSARI_PROVA_TOTS(console.log)`.
  Resultat del 12/11/2026: 50 exemples, cap error.
- **End-to-end al navegador:** obre `curs/index.html?debug=1`. En lloc de l'índex, es carrega
  `debug-tester.js`, que obre cada capítol i repte en un iframe, hi simula una solució
  correcta i una d'incorrecta, i comprova que «Comprova» digui ✓ i ✗. Resultat del 12/11/2026: 40/40.

## Com es veu una pàgina

Cada capítol es llegeix en tres zones desplegables amb una franja de color (Teoria, Exercici i Resum), i cada repte també (Objectiu, Exercici i Pista, aquesta última tancada). Cada applet porta una etiqueta: «👁 Exemple per mirar» (vora grisa discontínua) o «✍️ Et toca a tu» (vora blava gruixuda). Les mides de lletra són sis i prou (11, 12, 14, 18, 24 i 36 px; el text normal fa 14 px), definides com a variables `--fs-*` a `curs/curs.css` i `style.css`. En pantalles de 900 px d'amplada o més, el 10 % dret de la finestra queda buit.

## Glossari

El botó **📐 Glossari** obre la llista d'ordres i de termes, en dues columnes: totes les descripcions
comencen a la mateixa distància del marge. Cada paraula (en negre, amb subratllat discontinu) obre
un exemple fet expressament per a aquella paraula (`curs/glossari-exemples.js`): les ordres en català en un
quadre que l'alumne pot editar, **▶ Executa** (o Ctrl+Enter), **↺ Exemple original** i un applet amb la
vista algebraica, on es veuen els valors. Una proposta «Prova-ho» diu què canviar. GeoGebra només entén
els noms anglesos de les ordres quan s'executen des del codi, i per això `GLOSSARI_ORDRES` les tradueix.

## Editor de text (`curs/edit.html`)

Eina interna per revisar la redacció dels capítols: carrega un capítol, en separa els blocs
editables (títols, paràgrafs…) i permet corregir-los un per un i marcar-los com a revisats.
Els canvis es desen al `localStorage` del navegador (un registre per capítol) i
**⬇ Descarrega** baixa l'HTML del capítol amb les correccions, per substituir el fitxer del
repositori.

## Estat del projecte

- 10 capítols: ✅ complets (amb exercici validat al final)
- Reptes: una graella de 10 temes × 3 nivells (30 reptes, de `repte-1a` a `repte-10c`). ✅ tots 30 publicats (el
  detall de cada repte és a `REPTES_SPECIFICATION.md`, i el que queda pendent, a `TODO.md`)
- Els 10 reptes de la numeració antiga (`repte-1` … `repte-10`) ja no hi són: 4 continuen a la graella
  (qui els tenia superats conserva el ✓) i 6 s'han retirat.

## Fitxers comuns

`LICENSE`, `LLICENCIA.md` i `curs/progress.js` són **fitxers comuns** dels cursos de la família: l'original és al repositori
[step-quiz-commons](https://github.com/step-quiz/step-quiz-commons), on també hi ha què té de
diferent aquest web (`comuns.json`). El workflow `.github/workflows/comuns.yml` els posa al dia
cada dia (o a mà: Actions → «Fitxers comuns» → Run workflow). **No els editis aquí**: el canvi es
perdria l'endemà. Canvia'ls a step-quiz-commons.


`footer.js` (a l'arrel) és el **peu de pàgina amb l'autoria i la llicència** que porten totes les
pàgines: «© 2026 David Arso Civil · INS Miquel Tarradell. Contingut: CC BY-NC-SA 4.0 · Codi: llicència
MIT». És una còpia del `footer.js` comú de step-quiz-commons amb el mateix text, però Ggcat no el rep de
`comuns.json` (no forma part de la família de cursos amb selector i certificat): si el text canvia allà,
s'ha de copiar aquí a mà.
## Progrés de l'alumne

Es guarda localment al navegador (`localStorage`, clau `geocat_progress`). Cap dada s'envia a cap servidor.
A més, el navegador recorda l'últim repte visitat (clau `geocat_ultim_repte`): l'enllaç «Reptes» de la
capçalera i de la portada hi porta directament.

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
