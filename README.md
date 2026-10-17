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
  capitols.js           Dades, sidebar, injecció de widgets, progrés, glossari
  geovalidator.js       Llibreria d'assertions geomètriques (objecte GV)
  validators.js         Mapa goalId → funció validadora per a cada exercici
  glossari-data.js      Contingut HTML del glossari de comandes
  debug-tester.js       Test end-to-end del botó «Comprova» (curs/index.html?debug=1)
  edit.html             Editor de revisió del text dels capítols (vegeu més avall)
REPTES_SPECIFICATION.md Especificació dels 30 reptes candidats
TODO.md                 Tasques pendents
GeoCat-30Reptes.docx    Versió en Word de la llista de reptes
test-validators.js      Test Node dels validators amb una API de GeoGebra simulada
test-debug-tester-logic.js  Test Node de la lògica de debug-tester.js
```

## Proves

- `node test-validators.js` — comprova els 20 validadors (capítols i reptes) amb una API de
  GeoGebra simulada: per a cada un, escena buida, solució correcta i solució incorrecta. Ara
  en falla 1 de 30 comprovacions: la solució correcta del `repte-6`, per una limitació del
  simulacre, no del validador.
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

## Progrés de l'alumne

Es guarda localment al navegador (`localStorage`, clau `geocat_progress`). Cap dada s'envia a cap servidor.
