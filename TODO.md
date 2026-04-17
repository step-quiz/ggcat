# GeoCat — Llista de tasques pendents

> **Audiència:** Aquest document és per a un assistent d'IA que continua el desenvolupament de GeoCat.
> Llegeix-lo sencer abans de començar qualsevol tasca. **Actualitza'l** marcant ✅ i movent la tasca
> a la secció "Completat" cada vegada que s'acaba un bloc de feina.

---

## Context del projecte

GeoCat és un curs interactiu de GeoGebra per al navegador, en català, construït sobre la base de PyCat
(curs de Python) i KarelCat (curs amb Karel-Robot). Reutilitza ~70–75% del codi de PyCat.

**Fonts de referència obligatòria (llegir abans de cada tasca):**
- `GEOCAT-ARCHITECTURE.md` — document d'arquitectura complet (la bíblia del projecte)
- `pycat-main/` — codi font de PyCat (base de la qual partim)
- `karelcat-main/` — codi font de KarelCat (referència de patrons addicionals)

**Principis que mai han de trencar-se:**
- Zero instal·lació: tot funciona obrint un HTML al navegador, sense build step ni servidor.
- Tot el text visible a l'usuari en **català**.
- Progrés local a `localStorage` (`geocat_progress`). Cap servidor, cap compte.
- Feedback automàtic ✓ / ✗ sense polsar cap botó extra (o via botó "Comprova" als reptes).
- Namespace global `G` (equivalent al `P` de PyCat i `K` de KarelCat).

---

## Bloc 0 — Infraestructura base (fer primer)

### T0.1 — `js/constants.js` ✅
Adaptar `pycat/js/constants.js`:
- Canviar namespace `P` → `G`
- Canviar totes les claus `pycat_*` → `geocat_*`
- Eliminar `P.PYODIDE_CDN`, `P.PYODIDE_CDN_FALLBACK`, `P.EXEC_TIMEOUT`
- Afegir `G.GEOGEBRA_CDN = 'https://www.geogebra.org/apps/deployggb.js'`
- Canviar `P.DEFAULT_CODE` → `G.DEFAULT_APP` (valor: `'geometry'`)
- Conservar `G.escHtml`

### T0.2 — `js/state.js` ✅
Adaptar `pycat/js/state.js` amb els camps de GeoCat (vegeu secció 3.4 de l'arquitectura):
```js
G.state = {
  uiLang:       'ca',
  currentState: 'idle',   // idle | loading | ready | checking | correct | wrong
  appletReady:  false,
  goalId:       '',
  validatorFn:  null,
  initialCmds:  [],
  fixedLabels:  [],
  readonly:     false,
};
```
Eliminar tots els camps relatius a Pyodide/Python.

### T0.3 — `js/i18n.js` ✅
Adaptar `pycat/js/i18n.js`:
- Canviar namespace `P` → `G`
- Substituir totes les claus de traduccions Python per claus GeoGebra:
  - `'ui.check'` → `'✓ Comprova'` (ca), `'✓ Comprobar'` (es), `'✓ Check'` (en)
  - `'ui.reset'` → `'↺ Reinicia'` / `'↺ Reiniciar'` / `'↺ Reset'`
  - `'state.loading'` → `'carregant GeoGebra…'`
  - `'state.ready'` → `'llest'`
  - `'state.checking'` → `'comprovant…'`
  - `'state.correct'` → `'correcte ✓'`
  - `'state.wrong'` → `'incorrecte ✗'`
  - `'log.correct'` → `'✅ Correcte!'`
  - `'log.wrong'` → `'❌ No és correcte encara.'`
  - `'log.loading'` → `'Carregant GeoGebra…'`
  - `'log.ready'` → `'🟢 GeoGebra llest'`
  - Eliminar totes les claus relacionades amb Python/stdin/input

---

## Bloc 1 — El simulador `geogebra.html` (tasca més crítica)

### T1.1 — `js/geovalidator.js` ✅
Crear la llibreria d'assertions geomètriques (secció 3.4 de l'arquitectura).
Implementar l'objecte `GV` amb els helpers:
- `GV.eps` = 0.001
- `GV.pointExists(label)`
- `GV.coordsEqual(label, x, y)`
- `GV.distanceEqual(labelA, labelB, expected)`
- `GV.allSidesEqual(...points)`
- `GV.isOnPath(pointLabel, pathLabel)`
- `GV.arePerpendicular(l1, l2)`
- `GV.areParallel(l1, l2)`
- `GV.angleEqual(a, b, c, expectedDeg)`
- `GV.objectOfType(label, type)`

### T1.2 — `js/georunner.js` ✅
Crear el gestor del cicle de vida de l'applet GeoGebra (secció 6.1 de l'arquitectura).
Implementar l'objecte `GEO` amb:
- `GEO.init(params)` — instancia `GGBApplet` i injecta a `#ggb-container`
- `GEO._applyInitialState(commands, fixedLabels)` — executa cmds i fixa objectes
- `GEO.reset(commands, fixedLabels)` — `ggbApplet.reset()` + re-aplica estat inicial
- `GEO.check(validatorFn)` → boolean

### T1.3 — `js/geomain.js` ✅
Crear el fitxer d'inicialització (equivalent a `pycat/js/main.js`).
Paràmetres d'URL a llegir:
- `commands` (base64 → array de strings, separats per `\n`)
- `fixed` (base64 → string CSV de labels)
- `check` (base64 → cos de la funció validadora JS)
- `goalId` (string)
- `readonly` (bool)
- `app` (string: `'geometry'` per defecte)
- `tools` (string CSV de tool IDs)
- `height` (número)

Lògica:
1. Llegir i decodificar paràmetres URL
2. Cridar `GEO.init(...)` passant els paràmetres
3. Si `check` és present, reconstruir la funció validadora amb `new Function(...)`
4. Registrar el listener del botó "Comprova" (si n'hi ha)
5. Si `readonly`, amagar toolbar
6. En validació correcta: emetre `postMessage({ type: 'geocat-result', goalId, success: true })`

### T1.4 — `geogebra.html` ✅
Crear la pàgina del simulador (equivalent a `pycat/index.html`).
Estructura mínima (vegeu secció 6 de l'arquitectura):
- `<div id="ggb-container">`
- `<div id="geo-toolbar">` amb `#state-badge` i `#btn-check`
- Cargar scripts en ordre: `constants.js`, `i18n.js`, `state.js`, `geovalidator.js`, `georunner.js`, `geomain.js`
- Mode embed: afegir classe `.embed` al body si `?embed=1` (idèntic a PyCat)
- Preload hint per a `deployggb.js`

---

## Bloc 2 — Infraestructura del curs

### T2.1 — `style.css` ✅
Copiar `pycat/style.css` i adaptar:
- Canviar totes les mencions `PyCat` → `GeoCat` (comentaris)
- Afegir estils per a `.geo-toolbar`, `.btn-check`, `.state-badge` (l'applet no té consola de text)
- Canviar el color accent del logo si s'usa un color nou per a GeoCat (opcional)
- Eliminar estils específics de la consola de text si no s'usen

### T2.2 — `curs/curs.css` ✅
Copiar `pycat/curs/curs.css` verbatim. Canviar només `PyCat` → `GeoCat` en comentaris.
No modificar cap lògica de layout, variables CSS, o estils de component.

### T2.3 — `js/kbd-accessory.js` ✅
Adaptar `pycat/js/kbd-accessory.js`:
- Eliminar tecles Python: `def`, `for`, `True`, `False`, `print`, `input`, `:`, `#`
- Afegir tecles GeoGebra útils (Mode A — comandes): `=`, `(`, `)`, `*`, `/`, `,`, `√`, `π`, `°`
- La resta de la lògica (detecció tàctil, focus/blur, inserció de caràcter) és idèntica

### T2.4 — `curs/capitols.js` ✅
Adaptar `pycat/curs/capitols.js`:
- Canviar `_LS_KEY` de `pycat_progress` → `geocat_progress`
- Substituir `CAPITOLS_DATA` i `REPTES_DATA` amb les dades de GeoCat (10 capítols, 15 reptes)
- Actualitzar `injectCursLogo()` amb un SVG/emoji de GeoCat (ex: compàs o triangle)
- Estendre `renderSimuladors()` per gestionar `<div class="geogebra">` → iframe `../geogebra.html`
  (a més del `.simulador` legacy, que pot quedar per compatibilitat o eliminar-se)
- Afegir listener de `postMessage` per a `type: 'geocat-result'`

Les dades dels capítols (copiar de l'arquitectura, secció 5.3):
```
Cap 1: Benvingut a GeoGebra    Cap 6: Construccions clàssiques II
Cap 2: Rectes i segments        Cap 7: Polígons
Cap 3: Circumferències          Cap 8: Transformacions
Cap 4: Mesures                  Cap 9: Funcions i gràfiques
Cap 5: Construccions clàssiques I  Cap 10: Lliscadors i constr. dinàmiques
```

### T2.5 — `curs/index.html` ✅
Adaptar `pycat/curs/index.html`:
- Canviar títol, logo i textos hero a GeoCat / GeoGebra
- Actualitzar link del simulador: `../geogebra.html`
- La lògica de generació de la llista de capítols i reptes és idèntica (usa `CAPITOLS_DATA` i `REPTES_DATA`)

### T2.6 — `curs/glossari-data.js` ✅
Crear el glossari de termes GeoGebra (equivalent a `pycat/curs/glossari-data.js`).
Termes mínims a incloure (en català):
- punt, recta, segment, circumferència, radi, diàmetre
- mediatriu, bisectriu, perpendicular, paral·lela
- polígon, triangle, quadrilàter, polígon regular
- transformació, translació, rotació, reflexió
- funció, gràfica, intersecció, lliscador, lloc geomètric
- angle, àrea, perímetre, distància

---

## Bloc 3 — Capítols del curs (10 fitxers HTML)

Per a cada capítol, seguir l'esquelet de `pycat/curs/capitol-1.html` adaptat a GeoGebra.
Cada capítol ha de tenir: header, sidebar, 2–4 seccions amb widgets `<div class="geogebra">`,
navegació anterior/següent, i un exercici final amb `data-goal-id`.

### T3.1 — `curs/capitol-1.html` — Benvingut a GeoGebra ✅
Conceptes: la interfície, punts, el pla de coordenades.
Comandes: `A=(x,y)`, `Punt(x,y)`.
Widget demo (readonly): mostrar alguns punts pre-construïts.
Widget exercici: l'alumne construeix el punt `P=(3,2)`.
`data-goal-id="cap-1-ex"`

### T3.2 — `curs/capitol-2.html` — Rectes i segments ✅
Conceptes: recta per dos punts, segment, punt mig.
Comandes: `Recta(A,B)`, `Segment(A,B)`, `PuntMig(A,B)`.
Widget exercici: construir el punt mig d'un segment donat.
`data-goal-id="cap-2-ex"`

### T3.3 — `curs/capitol-3.html` — Circumferències ✅
Conceptes: circumferència per centre i radi, per tres punts.
Comandes: `Cercle(A,r)`, `Cercle(A,B,C)`.
Widget exercici: circumferència de radi 3 centrada en l'origen.
`data-goal-id="cap-3-ex"`

### T3.4 — `curs/capitol-4.html` — Mesures ✅
Conceptes: distància, angle, perímetre, àrea.
Comandes: `Distància(A,B)`, `Angle(A,B,C)`, `Àrea(p)`.
Widget exercici: mesurar l'angle d'un triangle donat.
`data-goal-id="cap-4-ex"`

### T3.5 — `curs/capitol-5.html` — Construccions clàssiques I ✅
Conceptes: mediatriu, bisectriu d'angle, perpendicular.
Comandes: `Mediatriu(A,B)`, `Bisectriu(f,g)`, `Perpendicular(A,f)`.
Widget exercici: construir la mediatriu d'un segment AB donat.
`data-goal-id="cap-5-ex"`

### T3.6 — `curs/capitol-6.html` — Construccions clàssiques II ✅
Conceptes: recta paral·lela, cercle inscrit/circumscrit d'un triangle.
Comandes: `Paral·lela(f,A)`, `CercleInscrit(p)`, `CercleCircumscrit(p)`.
Widget exercici: construir una recta paral·lela a una donada passant per un punt.
`data-goal-id="cap-6-ex"`

### T3.7 — `curs/capitol-7.html` — Polígons ✅
Conceptes: triangle, quadrilàter, polígon regular.
Comandes: `Polígon(A,B,C)`, `PolígonRegular(A,B,n)`.
Widget exercici: construir un hexàgon regular.
`data-goal-id="cap-7-ex"`

### T3.8 — `curs/capitol-8.html` — Transformacions ✅
Conceptes: translació, rotació, reflexió, homotècia.
Comandes: `Translació(obj,v)`, `Rotació(obj,A,α)`, `Reflexió(obj,f)`.
Widget exercici: reflexió d'un triangle respecte un eix donat.
`data-goal-id="cap-8-ex"`

### T3.9 — `curs/capitol-9.html` — Funcions i gràfiques ✅
Conceptes: definir funcions, gràfica, intersecció.
Comandes: `f(x)=x²-3`, `Intersecció(f,g)`, lliscadors bàsics.
Widget exercici: definir la funció `f(x) = 2x + 1` i trobar-ne la intersecció amb l'eix X.
`data-goal-id="cap-9-ex"`

### T3.10 — `curs/capitol-10.html` — Lliscadors i construccions dinàmiques ✅
Conceptes: lliscadors, paràmetres dinàmics, lloc geomètric.
Comandes: `Lliscador(min,max,pas)`, `Lloc(B,A)`.
Widget exercici/projecte: construcció dinàmica lliure amb lliscador.
`data-goal-id="cap-10-ex"` (opcional)

---

## Bloc 4 — Reptes (15 fitxers HTML)

Per a cada repte, seguir l'esquelet de `pycat/curs/repte-1.html`.
Cada repte té: header amb badge de dificultat, descripció de l'objectiu,
un widget `<div class="geogebra">` amb validació, i un bloc `<details>` de pista.

### T4.1 — `curs/repte-1.html` — El primer punt ⬜ (Fàcil)
Validator: punt A existeix a les coordenades especificades (±0.1).

### T4.2 — `curs/repte-2.html` — Un segment ⬜ (Fàcil)
Validator: segment AB existeix entre dos punts donats.

### T4.3 — `curs/repte-3.html` — La circumferència ⬜ (Fàcil)
Validator: circumferència de radi r centrada en un punt donat.

### T4.4 — `curs/repte-4.html` — El triangle ⬜ (Fàcil)
Validator: triangle amb tres vèrtexs especificats existeix.

### T4.5 — `curs/repte-5.html` — El punt mig ⬜ (Fàcil)
Validator: punt col·locat correctament al mig d'un segment donat.

### T4.6 — `curs/repte-6.html` — La perpendicular ⬜ (Mitjà)
Validator: recta perpendicular a una recta donada passant per un punt donat.

### T4.7 — `curs/repte-7.html` — La mediatriu ⬜ (Mitjà)
Validator: mediatriu d'un segment AB donat (passa pel punt mig i és perpendicular).

### T4.8 — `curs/repte-8.html` — La bisectriu ⬜ (Mitjà)
Validator: bisectriu de l'angle format per dues rectes donades.

### T4.9 — `curs/repte-9.html` — Triangle equilàter ⬜ (Mitjà)
Validator: tots tres costats iguals (±eps).

### T4.10 — `curs/repte-10.html` — Triangle isòsceles ⬜ (Mitjà)
Validator: exactament dos costats iguals.

### T4.11 — `curs/repte-11.html` — La paral·lela ⬜ (Mitjà)
Validator: recta paral·lela a una recta donada passant per un punt donat.

### T4.12 — `curs/repte-12.html` — Cercle circumscrit ⬜ (Difícil)
Validator: circumferència que passa pels tres vèrtexs d'un triangle donat.

### T4.13 — `curs/repte-13.html` — Translació ⬜ (Difícil)
Validator: objecte correctament transladat per un vector donat.

### T4.14 — `curs/repte-14.html` — Reflexió ⬜ (Difícil)
Validator: objecte correctament reflectit respecte un eix donat.

### T4.15 — `curs/repte-15.html` — La funció quadràtica ⬜ (Difícil)
Validator: paràbola que passa per tres punts especificats.

---

## Bloc 5 — Proves i poliment

### T5.1 — Verificació manual del simulador `geogebra.html` ⬜
Obrir al navegador i comprovar:
- L'applet GeoGebra carrega correctament des del CDN
- `data-commands` s'executen a l'inici
- `data-fixed` bloqueja els objectes indicats (amb color blau)
- El botó "Comprova" avalua el validator i mostra ✓ / ✗
- El `postMessage` arriba al parent (testar des d'una pàgina del curs)
- Mode readonly funciona (sense toolbar, sense edició)

### T5.2 — Verificació del sistema de progrés ⬜
- Completar un exercici → apareix ✓ a la sidebar
- Recarregar la pàgina → el ✓ persisteix
- Comprovar que `localStorage.geocat_progress` té les claus correctes
- Verificar que no hi ha conflictes amb `pycat_progress` (si PyCat i GeoCat es serveixen des del mateix domini)

### T5.3 — Revisió mòbil ⬜
- L'applet GeoGebra és usable en iOS Safari i Chrome Android
- El teclat virtual (`kbd-accessory.js`) apareix en Mode A (camp de comandes)
- El layout del curs és responsive (sidebar hamburger funciona)

### T5.4 — Revisió dels validators de tots els reptes ⬜
Per a cada repte (T4.1–T4.15):
- El validator no es pot satisfer amb una construcció buida
- El validator accepta construccions correctes fetes per camins alternatius
- El validator usa `getAllObjectNames(type)` i no depèn de labels específics (regles de validació robusta, secció 7.3 de l'arquitectura)

---

## Completat

- **T3.1** `curs/capitol-1.html` — Benvingut a GeoGebra: interfície, punts, coordenades. Exercici: punt P=(3,2). *(2026-04-17)*
- **T3.2** `curs/capitol-2.html` — Rectes i segments: Recta, Segment, PuntMig. Exercici: punt mig de AB. *(2026-04-17)*
- **T3.3** `curs/capitol-3.html` — Circumferències: Cercle(A,r), Cercle(A,B), Cercle(A,B,C). Exercici: cercle radi 3 a l'origen. *(2026-04-17)*
- **T3.4** `curs/capitol-4.html` — Mesures: Distància, Angle, Àrea, Perímetre. Exercici: mesurar angle d'un triangle. *(2026-04-17)*
- **T3.5** `curs/capitol-5.html` — Construccions clàssiques I: Mediatriu, Perpendicular, Bisectriu. Exercici: mediatriu de AB. *(2026-04-17)*
- **T3.6** `curs/capitol-6.html` — Construccions clàssiques II: Paral·lela, CercleCircumscrit, CercleInscrit. Exercici: paral·lela per P. *(2026-04-17)*
- **T3.7** `curs/capitol-7.html` — Polígons: Polígon, PolígonRegular. Exercici: hexàgon regular. *(2026-04-17)*
- **T3.8** `curs/capitol-8.html` — Transformacions: Translació, Rotació, Reflexió, Homotècia. Exercici: reflexió d'un triangle. *(2026-04-17)*
- **T3.9** `curs/capitol-9.html` — Funcions i gràfiques: f(x)=..., Intersecció, eixos. Exercici: f(x)=2x+1 i zeros. *(2026-04-17)*
- **T3.10** `curs/capitol-10.html` — Lliscadors i construccions dinàmiques: Slider, Lloc, animació. Projecte lliure. *(2026-04-17)*

- **T0.1** `js/constants.js` — Namespace `P`→`G`, claus `pycat_*`→`geocat_*`, eliminat Pyodide, afegit `G.GEOGEBRA_CDN`, `G.DEFAULT_APP`. *(2026-04-17)*
- **T0.2** `js/state.js` — Estat adaptat a GeoCat: eliminats camps Pyodide/Python, afegits `appletReady`, `validatorFn`, `initialCmds`, `fixedLabels`, `readonly`. *(2026-04-17)*
- **T1.1** `js/geovalidator.js` — Objecte `GV` amb helpers geomètrics: `pointExists`, `coordsEqual`, `distanceEqual`, `allSidesEqual`, `exactSidesEqual`, `isOnPath`, `arePerpendicular`, `areParallel`, `angleEqual`, `objectOfType`, `anyOfType`, `filterOfType`, `withPointOnPath`, `circlePassesThroughPoints`. *(2026-04-17)*
- **T1.2** `js/georunner.js` — Objecte `GEO` amb cicle de vida de l'applet: `init`, `_applyInitialState`, `reset`, `check`. Sense Web Worker. *(2026-04-17)*
- **T1.3** `js/geomain.js` — Lectura i decodificació de paràmetres URL, inicialització de `GEO`, botó Comprova, botó Reinicia, `postMessage` al pare amb `geocat-result`. *(2026-04-17)*
- **T1.4** `geogebra.html` — Pàgina del simulador: topbar, `#ggb-container`, `.geo-toolbar` (badge + Comprova + Reinicia), mode embed, mode clar/fosc, preload del CDN. *(2026-04-17)*

---

## Notes per a l'assistent

- **Ordre recomanat:** T0 → T1 → T2 → T3 → T4 → T5
- **Cada tasca és independent** un cop el Bloc 0 i el Bloc 1 estan fets.
- Per als capítols (T3.x) i reptes (T4.x), **llegir primer** l'equivalent de PyCat
  (`pycat/curs/capitol-N.html`, `pycat/curs/repte-N.html`) per entendre l'estructura HTML exacta.
- Els validators de `data-check` s'escriuen com a cossos de funció JS anònima
  `(api) => { ... return boolean; }` i s'emmagatzemen en base64 a l'atribut HTML.
- Usar sempre `btoa(unescape(encodeURIComponent(str)))` per codificar i
  `decodeURIComponent(escape(atob(b64)))` per decodificar (gestiona caràcters especials).
- GeoGebra no funciona offline. No cal Service Worker.
- Verificar sintaxi JS amb `node --check fitxer.js` abans de donar per acabada qualsevol tasca JS.
