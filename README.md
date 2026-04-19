# GeoCat

Aprendre GeoGebra en català — curs interactiu al navegador.

## Què és

GeoCat és un curs de geometria interactiva amb GeoGebra, pensat per a estudiants d'ESO i Batxillerat. Inclou capítols guiats, reptes amb validació automàtica i un simulador lliure. Tot funciona directament al navegador, sense instal·lació ni comptes.

## Com obrir-lo

Obre `index.html` al navegador. Des d'allà pots accedir a:
- **Capítols** (`curs/capitol-1.html` ... `capitol-10.html`) — Lliçons guiades amb widgets interactius.
- **Reptes** (`curs/repte-1.html` ... `repte-10.html`) — Exercicis amb validació automàtica ✓/✗.
- **Simulador** (`geogebra.html`) — Applet GeoGebra lliure.

Cal connexió a internet per carregar GeoGebra des del CDN (`geogebra.org`).

## Estructura

```
index.html              Landing page
geogebra.html           Simulador GeoGebra lliure
style.css               Estils del simulador i landing
js/
  constants.js          Configuració central (namespace G)
  state.js              Estat centralitzat de l'applet
  i18n.js               Internacionalització (ca/es/en)
  georunner.js          Cicle de vida de l'applet GeoGebra
  geomain.js            Inicialització del simulador
  geovalidator.js       Llibreria d'assertions geomètriques
  kbd-accessory.js      Teclat virtual per a mòbils
curs/
  index.html            Índex del curs (llista de capítols i reptes)
  capitol-N.html        10 capítols del curs
  repte-N.html          10 reptes (de 30 previstos)
  capitols.js           Dades, sidebar, widgets, progrés, glossari
  glossari-data.js      Contingut del glossari de comandes
  curs.css              Estils del curs
REPTES_SPECIFICATION.md Especificació dels 30 reptes candidats
TODO.md                 Tasques pendents
```

## Estat del projecte

- 10 capítols: ✅ complets
- 10 reptes (fàcils + mitjans): ✅ complets
- 20 reptes (mitjans + difícils): ⬜ pendents (especificats a `REPTES_SPECIFICATION.md`)

## Progrés de l'alumne

Es guarda localment al navegador (`localStorage`, clau `geocat_progress`). Cap dada s'envia a cap servidor.
