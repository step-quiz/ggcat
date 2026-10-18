# GeoCat

Aprendre GeoGebra en català — curs interactiu al navegador.

## Què és

GeoCat és un curs de geometria interactiva amb GeoGebra, pensat per a estudiants d'ESO i Batxillerat. Inclou capítols guiats i reptes amb validació automàtica. Tot funciona directament al navegador, sense instal·lació ni comptes. Per a la pràctica lliure, l'alumne pot fer servir directament la seva instal·lació preferida de GeoGebra (web, escriptori o mòbil).

## Com obrir-lo

Obre `index.html` al navegador. Des d'allà pots accedir a:
- **Capítols** (`curs/capitol-1.html` ... `capitol-10.html`) — Lliçons guiades amb widgets interactius i un exercici final validat ✓/✗.
- **Reptes** (`curs/repte-1.html` ... `repte-10.html`) — Exercicis amb validació automàtica ✓/✗.

Cal connexió a internet per carregar GeoGebra des del CDN (`geogebra.org`).

## Estructura

```
index.html              Landing page
style.css               Estils compartits (topbar, botons, temes)
curs/
  index.html            Índex del curs (llista de capítols i reptes)
  capitol-N.html        10 capítols del curs
  repte-N.html          10 reptes (de 30 previstos)
  curs.css              Estils del curs
  capitols.js           Dades, sidebar, injecció de widgets, glossari
  progress.js           Progrés de l'alumne (fitxer comú; clau geocat_progress)
  geovalidator.js       Llibreria d'assertions geomètriques (objecte GV)
  validators.js         Mapa goalId → funció validadora per a cada exercici
  glossari-data.js      Contingut HTML del glossari de comandes
  debug-tester.js       Test end-to-end del botó «Comprova» (curs/index.html?debug=1)
  edit.html             Editor de revisió del text dels capítols (vegeu més avall)
tools/                  Generador de pàgines JSON → HTML i el seu invers (vegeu tools/README.md)
REPTES_SPECIFICATION.md Especificació dels 30 reptes candidats
TODO.md                 Tasques pendents
GeoCat-30Reptes.docx    Versió en Word de la llista de reptes
test-validators.js      Test Node dels validators amb una API de GeoGebra simulada
test-debug-tester-logic.js  Test Node de la lògica de debug-tester.js
```

## Proves

- `node tools/generate-pages.js --comprova` — comprova que les pàgines descrites a
  `tools/pages/*.json` són les que hi ha a `curs/`. GitHub ho fa a cada canvi
  (`.github/workflows/tests.yml`, juntament amb la sintaxi de tots els fitxers JS i els dos
  tests de sota).
- `node test-validators.js` — comprova els validadors dels 10 reptes amb una API de GeoGebra
  simulada: per a cada repte, escena buida, solució correcta i solució incorrecta (i, al repte 6,
  també una recta pel punt mitjà que no és perpendicular): 31 comprovacions. El simulacre calcula
  de debò `IsOnPath`, `ArePerpendicular` i `AreParallel` a partir dels punts. Els validadors dels
  capítols (`cap-N-ex`) no hi són: es proven al navegador (vegeu més avall). GitHub també ho
  executa a cada canvi.
- `node test-debug-tester-logic.js` — la lògica del provador end-to-end.
- **End-to-end al navegador:** obre `curs/index.html?debug=1`. En lloc de l'índex, es carrega
  `debug-tester.js`, que obre cada capítol i repte en un iframe, hi simula una solució
  correcta i una d'incorrecta, i comprova que «Comprova» digui ✓ i ✗.

## Editor de text (`curs/edit.html`)

Eina interna per revisar la redacció dels capítols: carrega un capítol, en separa els blocs
editables (títols, paràgrafs…) i permet corregir-los un per un i marcar-los com a revisats.
Els canvis es desen al `localStorage` del navegador (un registre per capítol) i
**⬇ Descarrega** baixa l'HTML del capítol amb les correccions, per substituir el fitxer del
repositori.

## Estat del projecte

- 10 capítols: ✅ complets (amb exercici validat al final)
- 10 reptes (fàcils + mitjans): ✅ complets
- 20 reptes (mitjans + difícils): ⬜ pendents (especificats a `REPTES_SPECIFICATION.md`)

## Fitxers comuns

`LICENSE`, `LLICENCIA.md` i `curs/progress.js` són **fitxers comuns** dels cursos de la família: l'original és al repositori
[step-quiz-commons](https://github.com/step-quiz/step-quiz-commons), on també hi ha què té de
diferent aquest web (`comuns.json`). El workflow `.github/workflows/comuns.yml` els posa al dia
cada dia (o a mà: Actions → «Fitxers comuns» → Run workflow). **No els editis aquí**: el canvi es
perdria l'endemà. Canvia'ls a step-quiz-commons.

## Progrés de l'alumne

Es guarda localment al navegador (`localStorage`, clau `geocat_progress`). Cap dada s'envia a cap servidor.

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
