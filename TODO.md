# GeoCat — Llista de tasques

> **Audiència:** Aquest document és per a un assistent d'IA que continua el desenvolupament de GeoCat.
> Llegeix-lo sencer abans de començar qualsevol tasca.

---

## Context del projecte

GeoCat és un curs interactiu de GeoGebra per al navegador, en català. Construït sobre la base de PyCat (curs de Python) i KarelCat (curs amb Karel-Robot).

**Principis que mai han de trencar-se:**
- Zero instal·lació: tot funciona obrint un HTML al navegador, sense build step ni servidor.
- Tot el text visible a l'usuari en **català**.
- Progrés local a `localStorage` (`geocat_progress`). Cap servidor, cap compte.
- Feedback automàtic ✓ / ✗ via botó "Comprova".
- Namespace global `G` per al simulador; funcions globals per al curs.

**Document de referència per als reptes:**
- `REPTES_SPECIFICATION.md` — especificació tècnica dels 30 reptes candidats.

---

## Estat actual

### Infraestructura — ✅ Completa
- `js/constants.js` — Namespace `G`, claus `geocat_*`, CDN GeoGebra.
- `js/state.js` — Estat centralitzat de l'applet.
- `js/i18n.js` — Internacionalització ca/es/en.
- `js/georunner.js` — Cicle de vida de l'applet GeoGebra (càrrega dinàmica CDN, ResizeObserver).
- `js/geomain.js` — Inicialització del simulador, lectura de paràmetres URL, postMessage.
- `js/geovalidator.js` — Llibreria d'assertions geomètriques (objecte `GV`). Disponible però no usada pels validators actuals.
- `js/kbd-accessory.js` — Teclat virtual per a mòbils. Preparat per activar quan existeixi un camp `#geo-cmd` a les pàgines del curs.
- `style.css` — Estils del simulador i landing.
- `curs/curs.css` — Estils del curs (sidebar, capítols, reptes, glossari).
- `curs/capitols.js` — Dades dels capítols/reptes, sidebar, injecció de widgets GeoGebra, progrés, glossari.
- `curs/glossari-data.js` — Contingut HTML del glossari de comandes.

### Simulador — ✅ Complet
- `geogebra.html` — Simulador lliure amb topbar, mode embed, mode clar/fosc, banner d'error CDN.

### Landing — ✅ Completa
- `index.html` — Hero, stats (10 capítols, 10/30 reptes), CTAs, feature pills.

### Capítols — ✅ 10/10 complets
Cada capítol té 4 seccions didàctiques + 1 exercici validable:

| Cap | Títol | goalId |
|---|---|---|
| 1 | Benvingut a GeoGebra | cap-1-ex |
| 2 | Rectes i segments | cap-2-ex |
| 3 | Circumferències | cap-3-ex |
| 4 | Mesures | cap-4-ex |
| 5 | Construccions clàssiques I | cap-5-ex |
| 6 | Construccions clàssiques II | cap-6-ex |
| 7 | Polígons | cap-7-ex |
| 8 | Transformacions | cap-8-ex |
| 9 | Funcions i gràfiques | cap-9-ex |
| 10 | Lliscadors i constr. dinàmiques | cap-10-ex |

### Reptes — 10/30 complets

Implementats (challenges 1–10 del spec):

| Repte | Títol | Dificultat | goalId |
|---|---|---|---|
| 1 | Triangle des de zero | Fàcil | repte-1 |
| 2 | Segment de longitud exacta | Fàcil | repte-2 |
| 3 | Circumferències concèntriques | Fàcil | repte-3 |
| 4 | Triangle amb mesures | Fàcil | repte-4 |
| 5 | Quadrat a l'origen | Fàcil | repte-5 |
| 6 | Mediatriu i intersecció | Mitjà | repte-6 |
| 7 | Equilàter comprovat | Mitjà | repte-7 |
| 8 | Perpendicular i peu | Mitjà | repte-8 |
| 9 | El circumcentre | Mitjà | repte-9 |
| 10 | El rombus | Mitjà | repte-10 |

---

## Tasques pendents

### Bloc A — Producció dels 20 reptes restants

**Prerequisit:** el spec (`REPTES_SPECIFICATION.md`) ja té els bugs corregits (CH 19, CH 23, CH 17, CH 22, CH 28, CH 29). Es pot generar directament.

**Distribució objectiu:** 10 Fàcils + 10 Mitjans + 10 Difícils. Per arribar-hi des del spec (que té 5F + 11M + 14D), cal recalibrar:
- Baixar a Fàcil: CH 11, 12, 13, 15, 16 (5 nous fàcils + 5 existents = 10)
- Baixar a Mitjà: CH 19, 20, 21, 27 (4 nous mitjans + 5 existents + 1 restant = 10)
- Difícils restants: CH 17, 18, 22, 23, 24, 25, 26, 28, 29, 30 (10)

Per cada challenge N (11–30):
1. Copiar `curs/repte-7.html` com a base.
2. Substituir els slots (title, h1, badge, objectiu, data-*, hint, nav, sidebar N).
3. Comprimir `data-check` a una sola línia.
4. Afegir entrada a `REPTES_DATA` de `curs/capitols.js`.
5. Actualitzar enllaços prev/next (repte-10 next → repte-11, repte-30 next → index.html).
6. Actualitzar la stat de la landing: "10/30" → "30".

**Temps estimat:** 4–6 h.

### Bloc B — Verificació matemàtica completa

Abans de publicar, verificar manualment els càlculs de cada challenge del spec que involucri coordenades calculades. Candidats amb risc (múltiples passos):
- CH 11, 12, 13, 20.

**Temps estimat:** 1–2 h.

### Bloc C — Refactors opcionals

- **Unificar càrrega CDN GeoGebra:** Les pàgines del curs usen `<script>` síncron al `<head>`, el simulador usa càrrega dinàmica via `georunner.js`. Triar un sol patró.
- **Migrar validators a `GV`:** Els validators actuals inlinen la lògica que `geovalidator.js` ja ofereix. Migrar-los reduiria la mida dels `data-check` i centralitzaria la lògica.
- **README.md:** Ampliar amb instruccions d'ús, estructura de fitxers, i estat del projecte.

---

## Notes per a l'assistent

- Els validators de `data-check` s'escriuen com a funcions JS anònimes inline.
- Usar tolerància `0.15` per coordenades/longituds i `0.5` per angles en graus.
- Mai comprovar labels específics de l'alumne: iterar amb `api.getAllObjectNames(type)`.
- GeoGebra no funciona offline. No cal Service Worker.
- Verificar sintaxi JS amb `node --check fitxer.js` després de cada edició.
