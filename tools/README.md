# GeoCat — Eines de desenvolupament (`tools/`)

## `generate-pages.js` — Generador de pàgines del curs

Eina per generar HTML de capítols i reptes a partir de descripcions JSON a `tools/pages/*.json`. Permet editar en un sol lloc l'esquelet comú i canviar-lo per totes les pàgines alhora.

L'esquelet és el de les pàgines actuals de GeoCat: la capçalera (`<header class="curs-header">`)
i la barra lateral escrites a la pàgina, GeoGebra (`deployggb.js`) al `<head>`, i al final
`glossari-data.js`, `geovalidator.js`, `validators.js`, `progress.js`, `capitols.js` i el
`<script>` que pinta la barra lateral i els applets. El mateix generador és a PyCat i JSCat; només
hi canvia el bloc `PROJECTE` del principi del fitxer (l'esquelet de cada curs).

### Ús

```bash
# Genera totes les pàgines a curs/
node tools/generate-pages.js

# Genera només una (per nom del fitxer de sortida sense extensió)
node tools/generate-pages.js --only repte-6

# Dry run: mostra què generaria sense escriure cap fitxer
node tools/generate-pages.js --dry-run

# Comprova (sense escriure res) que cada JSON produeix la pàgina que hi ha a curs/
# (GitHub ho fa a cada canvi: tests.yml)
node tools/generate-pages.js --comprova

# Canvia els directoris d'entrada/sortida
node tools/generate-pages.js --input tools/pages --out curs
```

### Format del fitxer JSON

Cada pàgina és un `tools/pages/{nom}.json` amb aquesta estructura:

```jsonc
{
  "type":  "capitol" | "repte",       // obligatori
  "num":   6,                          // número del capítol/repte
  "titol": "Parell o senar",           // títol visible
  "difficulty": "facil" | "mitja" | "dificil",   // només reptes
  "lead":  "<p>Text d'introducció…</p>",              // només capítols (opcional)
  "prev":  { "url": "repte-5.html", "label": "← Repte anterior" },   // opcional
  "next":  { "url": "repte-7.html", "label": "Repte següent →" },     // opcional
  "hint":  "<p>Pista HTML opcional…</p>",             // només reptes (opcional)
  "sections": [
    // Forma simple: una secció amb un h2 i body
    { "h2": "Títol", "body": "<p>HTML…</p>" },

    // Forma agrupada: una <section> amb múltiples h2s
    {
      "parts": [
        { "h2": "Objectiu",  "body": "<p>…</p>" },
        { "h2": "Simulador", "body": "<p>…</p>", "simulador": { /* veure sota */ } }
      ]
    }
  ]
}
```

### Atributs de l'applet

Dins d'una `part` o `section`, el camp `simulador` genera el `<div class="geogebra" data-*>` que
`curs/capitols.js` converteix en un applet de GeoGebra:

```jsonc
"simulador": {
  "goalId":   "repte-11",          // per al progrés i per trobar el validador
  "commands": "A=(0,0)\nB=(4,0)",  // ordres de GeoGebra inicials (una per línia)
  "fixed":    "A,B",               // objectes que l'alumne no pot moure
  "app":      "graphing",          // només per als reptes de funcions (si no: classic)
  "height":   440
}
```

**Els validadors no van al JSON ni a l'HTML**: són a `curs/validators.js`, al mapa `VALIDATORS`
(clau: `goalId`). Cada repte nou en necessita un, i també la seva entrada a `REPTES_DATA`
(`curs/capitols.js`). Vegeu `REPTES_SPECIFICATION.md`.

### Pàgines d'exemple

- `tools/pages/repte-1.json` — repte fàcil (sense ordres inicials).
- `tools/pages/repte-6.json` — repte mitjà.

Els reptes 11–30 estan especificats a `REPTES_SPECIFICATION.md`: es poden escriure com a JSON i
generar amb aquesta eina.

### Verificació

Després de generar:

1. `node tools/generate-pages.js --comprova` ha de dir que totes les pàgines coincideixen.
2. `node test-validators.js` prova els validadors de `curs/validators.js`.
3. Serveix el projecte amb `python3 -m http.server` i obre la pàgina al navegador (cal connexió:
   GeoGebra es carrega de geogebra.org).

### Migrar pàgines existents

L'eina **no migra automàticament** les pàgines actuals. Per passar-ne una a JSON: obre'n l'HTML,
identifica-hi el títol, les seccions (`<h2>` + contingut), el simulador (`<div class="simulador"
data-*>`) i la pista (`<details>`), i tradueix-ho a l'estructura de dalt. Després,
`--comprova` et dirà si el JSON reprodueix exactament la pàgina (no hi compten els espais ni la
indentació de l'HTML, però sí qualsevol canvi de text, d'atributs o de codi).

## `extreu-pagina.js` — De pàgina a JSON

Fa el camí invers: llegeix un repte de `curs/` i n'escriu el JSON.

```bash
node tools/extreu-pagina.js curs/repte-1.html          # el mostra
node tools/extreu-pagina.js curs/repte-1.html --desa   # el desa a tools/pages/repte-1.json
```

Després, `node tools/generate-pages.js --comprova` diu si el JSON reprodueix exactament la pàgina.
Comprovat amb tots els reptes publicats el 18/10/2026: tots surten idèntics.
