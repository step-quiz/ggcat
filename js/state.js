// ════════════════════════════════════════════════════════
// state.js — Estat centralitzat de GeoCat
//
// Substitueix les globals disperses per un únic objecte.
// Patró idèntic a PyCat (P.state) i KarelCat (K.state).
// ════════════════════════════════════════════════════════

G.state = {
  // Idioma de la interfície
  uiLang:       'ca',

  // Estat de la UI
  currentState: 'idle',   // idle | loading | ready | checking | correct | wrong

  // Applet GeoGebra
  appletReady:  false,

  // Exercici (quan s'usa dins d'un iframe del curs)
  goalId:       '',        // identificador únic del repte/exercici
  validatorFn:  null,      // function(ggbApplet) → boolean, definida per cada exercici

  // Estat inicial de la construcció (s'aplica en carregar i en reset)
  initialCmds:  [],        // array de strings: comandes GeoGebra a executar a l'inici
  fixedLabels:  [],        // array de strings: labels d'objectes que queden bloquejats

  // Mode de visualització
  readonly:     false,     // true → toolbar amagada, sense edició (mode demo)
};
