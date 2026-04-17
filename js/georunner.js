// ════════════════════════════════════════════════════════
// georunner.js — Gestor del cicle de vida de l'applet GeoGebra
//
// Objecte global: GEO
// Equival a pyrunner.js de PyCat però sense Web Worker —
// GeoGebra s'executa al fil principal.
//
// API pública:
//   GEO.init(params)                       — instancia i injecta l'applet
//   GEO._applyInitialState(cmds, labels)   — executa cmds i fixa objectes
//   GEO.reset()                            — neteja i re-aplica l'estat inicial
//   GEO.check(validatorFn) → boolean       — avalua el validator de l'exercici
// ════════════════════════════════════════════════════════

const GEO = {};

/**
 * Inicialitza i injecta l'applet GeoGebra al contenidor #ggb-container.
 *
 * @param {Object} params
 *   params.app        {string}   Variant de l'applet (per defecte: G.DEFAULT_APP)
 *   params.height     {number}   Alçada en px (per defecte: 420)
 *   params.commands   {string[]} Comandes a executar en carregar
 *   params.fixed      {string[]} Labels d'objectes a bloquejar (color blau)
 *   params.readonly   {boolean}  Si true, amaga la toolbar i l'input d'àlgebra
 *   params.tools      {string}   CSV de tool IDs a mostrar (opcional)
 *   params.onReady    {Function} Callback quan l'applet és llest
 */
GEO.init = function(params) {
  params = params || {};

  var container = document.getElementById('ggb-container');

  // El contenidor pot no tenir la mida final si estem dins un iframe
  // que encara no ha fet el layout. Esperem fins que tingui una amplada
  // raonable (> 100px) abans de crear l'applet de GeoGebra.
  function _waitForLayout(callback) {
    var w = container ? container.offsetWidth : 0;
    if (w > 100) {
      callback(w);
    } else {
      requestAnimationFrame(function() { _waitForLayout(callback); });
    }
  }

  _waitForLayout(function(containerW) {
    var containerH = container ? (container.offsetHeight || params.height || 420) : (params.height || 420);

    var appParams = {
      appName:            params.app || G.DEFAULT_APP,
      width:              containerW,
      height:             containerH,
      showToolBar:        !params.readonly,
      showAlgebraInput:   !params.readonly,
      showMenuBar:        false,
      showResetIcon:      false,
      enableRightClick:   false,
      enableShiftDragZoom: true,
      showZoomButtons:    true,
      errorDialogsActive: false,
      language:           'ca',
      appletOnLoad:       function(api) {
        window.ggbApplet = api;
        G.state.appletReady = true;

        // Cancel·la el watchdog i amaga el banner d'error
        if (GEO._loadTimer) {
          clearTimeout(GEO._loadTimer);
          GEO._loadTimer = null;
        }
        var banner = document.getElementById('ggb-error');
        if (banner) banner.style.display = 'none';

        // Aplica l'estat inicial (comandes + objectes fixos)
        GEO._applyInitialState(params.commands, params.fixed);

        // Notifica el mòdul principal
        if (typeof params.onReady === 'function') {
          params.onReady(api);
        }
      }
    };

    // Restricció de toolbar si s'han especificat tools concrets
    if (params.tools) {
      appParams.customToolBar = params.tools;
    }

    var applet = new GGBApplet(appParams, true);
    applet.inject('ggb-container');

    // Watchdog: si GeoGebra no respon en 60 s, mostra el banner d'error
    GEO._loadTimer = setTimeout(function() {
      if (!G.state.appletReady) {
        GEO._showLoadError();
      }
    }, 60000);
  });
};

/**
 * Executa les comandes inicials i bloqueja els objectes fixos.
 * Cridat tant en la càrrega inicial com en cada reset.
 *
 * @param {string[]} commands  — array de strings GeoGebra
 * @param {string[]} fixedLabels — array de labels a setFixed(true)
 */
GEO._applyInitialState = function(commands, fixedLabels) {
  if (Array.isArray(commands)) {
    commands.forEach(function(cmd) {
      if (cmd && cmd.trim()) {
        try {
          ggbApplet.evalCommand(cmd.trim());
        } catch(e) {
          console.warn('[GEO] evalCommand error:', cmd, e);
        }
      }
    });
  }

  if (Array.isArray(fixedLabels)) {
    fixedLabels.forEach(function(lbl) {
      if (lbl && lbl.trim()) {
        try {
          ggbApplet.setFixed(lbl.trim(), true, false);  // fix=true, selectable=false
          ggbApplet.setColor(lbl.trim(), 60, 100, 220); // blau = objecte donat
        } catch(e) {
          console.warn('[GEO] setFixed error:', lbl, e);
        }
      }
    });
  }
};

/**
 * Neteja la construcció i re-aplica l'estat inicial.
 * Equival al botó "Reinicia" de l'alumne.
 */
GEO.reset = function() {
  if (!G.state.appletReady) return;
  try {
    ggbApplet.reset();
  } catch(e) {
    console.warn('[GEO] reset error:', e);
  }
  GEO._applyInitialState(G.state.initialCmds, G.state.fixedLabels);
};

/**
 * Avalua la funció validadora de l'exercici i retorna boolean.
 * La funció rep window.ggbApplet com a argument.
 *
 * @param  {Function} validatorFn  — function(api) → boolean
 * @return {boolean}
 */
GEO.check = function(validatorFn) {
  if (!G.state.appletReady || typeof validatorFn !== 'function') return false;
  try {
    return !!validatorFn(window.ggbApplet);
  } catch(e) {
    console.warn('[GEO] validator error:', e);
    return false;
  }
};

/**
 * Mostra el banner d'error de càrrega de GeoGebra.
 * Cridat pel watchdog de timeout o per l'onerror del script CDN.
 */
GEO._showLoadError = function() {
  var banner = document.getElementById('ggb-error');
  if (banner) banner.style.display = 'flex';
  // Posa el badge en estat d'error si existeix
  var badge = document.getElementById('state-badge');
  if (badge) {
    badge.textContent = '❌ No s\'ha pogut carregar GeoGebra';
    badge.className = 'state-badge state-wrong';
  }
};
