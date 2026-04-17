// ════════════════════════════════════════════════════════
// i18n.js — Internacionalització de la interfície GeoCat
//
// Conté:
//   G.UI_LANGS      — Diccionari de traduccions per idioma
//   G.t(key)        — Retorna la traducció de la clau per l'idioma actiu
//   G.setLang(code) — Canvia l'idioma de la UI i actualitza els elements
//   G.initLangSelector() — Crea el selector d'idioma a la topbar
//
// Idiomes: ca (català, per defecte), es (castellà), en (anglès)
// Les pàgines del curs (curs/*.html) NO es veuen afectades —
// el seu contingut és sempre en català.
// ════════════════════════════════════════════════════════

// ── Traduccions ─────────────────────────────────────────
G.UI_LANGS = {
  ca: {
    'ui.check':             '✓ Comprova',
    'ui.reset':             '↺ Reinicia',
    'ui.readonly':          'No editable',
    'state.idle':           'llest',
    'state.loading':        'carregant GeoGebra…',
    'state.ready':          'llest',
    'state.checking':       'comprovant…',
    'state.correct':        'correcte ✓',
    'state.wrong':          'incorrecte ✗',
    'log.loading':          'Carregant GeoGebra…',
    'log.ready':            '🟢 GeoGebra llest',
    'log.correct':          '✅ Correcte!',
    'log.wrong':            '❌ No és correcte encara.',
    'log.load_error':       '❌ No s\'ha pogut carregar GeoGebra. Comprova la connexió a internet i recarrega la pàgina.',
  },

  es: {
    'ui.check':             '✓ Comprobar',
    'ui.reset':             '↺ Reiniciar',
    'ui.readonly':          'No editable',
    'state.idle':           'listo',
    'state.loading':        'cargando GeoGebra…',
    'state.ready':          'listo',
    'state.checking':       'comprobando…',
    'state.correct':        'correcto ✓',
    'state.wrong':          'incorrecto ✗',
    'log.loading':          'Cargando GeoGebra…',
    'log.ready':            '🟢 GeoGebra listo',
    'log.correct':          '✅ ¡Correcto!',
    'log.wrong':            '❌ Todavía no es correcto.',
    'log.load_error':       '❌ No se ha podido cargar GeoGebra. Comprueba la conexión a internet y recarga la página.',
  },

  en: {
    'ui.check':             '✓ Check',
    'ui.reset':             '↺ Reset',
    'ui.readonly':          'Read-only',
    'state.idle':           'ready',
    'state.loading':        'loading GeoGebra…',
    'state.ready':          'ready',
    'state.checking':       'checking…',
    'state.correct':        'correct ✓',
    'state.wrong':          'incorrect ✗',
    'log.loading':          'Loading GeoGebra…',
    'log.ready':            '🟢 GeoGebra ready',
    'log.correct':          '✅ Correct!',
    'log.wrong':            '❌ Not correct yet.',
    'log.load_error':       '❌ Could not load GeoGebra. Check your internet connection and reload the page.',
  }
};

// ── Funció de traducció ──────────────────────────────────
G.t = function(key) {
  var lang = G.state ? G.state.uiLang : 'ca';
  var dict = G.UI_LANGS[lang] || G.UI_LANGS.ca;
  return dict[key] !== undefined ? dict[key] : (G.UI_LANGS.ca[key] !== undefined ? G.UI_LANGS.ca[key] : key);
};

// ── Canvia l'idioma i actualitza la UI ───────────────────
G.setLang = function(code) {
  if (!G.UI_LANGS[code]) return;
  if (G.state) G.state.uiLang = code;
  try { localStorage.setItem(G.LS_KEY_LANG, code); } catch(_) {}

  // Actualitza elements de la UI que mostren text traduïble
  _refreshUI();
};

// ── Actualitza textos de la UI amb l'idioma actual ───────
function _refreshUI() {
  // Botó Comprova
  var btnCheck = document.getElementById('btn-check');
  if (btnCheck) btnCheck.textContent = G.t('ui.check');

  // Botó Reset
  var btnReset = document.getElementById('btn-reset');
  if (btnReset) btnReset.textContent = G.t('ui.reset');

  // Badge d'estat
  var stateBadge = document.getElementById('state-badge');
  if (stateBadge && G.state) {
    stateBadge.textContent = G.t('state.' + G.state.currentState);
  }

  // Selector d'idioma — marca l'actiu
  var sel = document.getElementById('lang-select');
  if (sel && G.state) sel.value = G.state.uiLang;
}

// ── Inicialitza el selector d'idioma ─────────────────────
G.initLangSelector = function() {
  var actions = document.querySelector('.topbar-actions');
  if (!actions) return;

  var sel = document.createElement('select');
  sel.id = 'lang-select';
  sel.className = 'lang-select';
  sel.setAttribute('aria-label', 'Idioma de la interfície');

  var langs = [
    { code: 'ca', label: 'CA' },
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' }
  ];

  langs.forEach(function(l) {
    var opt = document.createElement('option');
    opt.value = l.code;
    opt.textContent = l.label;
    sel.appendChild(opt);
  });

  // Carrega preferència guardada
  var saved = null;
  try { saved = localStorage.getItem(G.LS_KEY_LANG); } catch(_) {}
  if (saved && G.UI_LANGS[saved]) {
    sel.value = saved;
    if (G.state) G.state.uiLang = saved;
  } else {
    sel.value = (G.state && G.state.uiLang) || 'ca';
  }

  sel.addEventListener('change', function() {
    G.setLang(sel.value);
  });

  // Insereix el selector a les accions de la topbar
  var themeBtn = document.getElementById('btn-theme');
  if (themeBtn) {
    themeBtn.parentNode.insertBefore(sel, themeBtn);
  } else {
    actions.appendChild(sel);
  }
};
