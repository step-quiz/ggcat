// ════════════════════════════════════════════════════════
// geomain.js — Inicialització del simulador GeoCat
//
// Equival a main.js de PyCat.
// Llegeix els paràmetres d'URL, inicialitza GEO i connecta
// la UI (botó Comprova, badge d'estat, postMessage al pare).
//
// Paràmetres d'URL suportats:
//   ?commands=BASE64  → comandes GeoGebra (separades per \n)
//   ?fixed=BASE64     → labels CSV d'objectes bloquejats
//   ?check=BASE64     → cos de la funció validadora JS
//   ?goalId=ID        → identificador del repte (per postMessage)
//   ?readonly=1       → toolbar amagada, mode demo
//   ?app=geometry     → variant de l'applet (geometry/graphing/classic/3d)
//   ?tools=CSV        → IDs de tools de la toolbar
//   ?height=N         → alçada de l'applet en px
//   ?embed=1          → afegeix classe .embed al body (amaga topbar)
// ════════════════════════════════════════════════════════

(function init() {
  var S      = G.state;
  var params = new URLSearchParams(location.search);

  // ── Mode embed: aplicat abans de tot per evitar flash ──
  if (params.get('embed') === '1') {
    document.body.classList.add('embed');
  }

  // ── Helpers de codificació ────────────────────────────

  /** Decodifica base64 → UTF-8 de forma segura. */
  function dec(b64) {
    try { return decodeURIComponent(escape(atob(b64))); } catch(_) { return null; }
  }

  /** Decodifica base64 simple (sense UTF-8). */
  function decSimple(b64) {
    try { return atob(b64); } catch(_) { return null; }
  }

  // ── Origen segur per a postMessage ───────────────────
  G.parentOrigin = (function() {
    try {
      return document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin;
    } catch(_) { return window.location.origin; }
  })();

  // ── 1) Llegir paràmetres d'URL ────────────────────────

  // commands: base64(text amb \n entre comandes)
  var commandsRaw = params.get('commands') ? dec(params.get('commands')) : null;
  S.initialCmds = commandsRaw
    ? commandsRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean)
    : [];

  // fixed: base64(CSV de labels)
  var fixedRaw = params.get('fixed') ? decSimple(params.get('fixed')) : null;
  S.fixedLabels = fixedRaw
    ? fixedRaw.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
    : [];

  // check: base64(cos de funció JS)  → reconstruïm com (api) => { ... }
  var checkRaw = params.get('check') ? dec(params.get('check')) : null;
  if (checkRaw) {
    try {
      // El cos pot venir com "(api) => { ... }" o directament com el cos
      // Intentem avaluar-lo directament com a expressió de funció
      S.validatorFn = new Function('api', 'GV', 'return (' + checkRaw + ')(api)');
    } catch(_) {
      // Fallback: tractem checkRaw com el cos d'una funció
      try {
        S.validatorFn = new Function('api', 'GV', checkRaw);
      } catch(e) {
        console.warn('[geomain] No s\'ha pogut reconstruir el validator:', e);
        S.validatorFn = null;
      }
    }
  }

  // goalId
  S.goalId   = params.get('goalId') || '';

  // readonly
  S.readonly = params.get('readonly') === '1';

  // app, tools, height
  var app    = params.get('app')    || G.DEFAULT_APP;
  var tools  = params.get('tools')  || null;
  var height = parseInt(params.get('height'), 10) || 420;

  // ── 2) Estat inicial de la UI ────────────────────────
  _setStateBadge('loading');

  // ── 3) Inicialitza l'applet GeoGebra ────────────────
  GEO.init({
    app:      app,
    height:   height,
    commands: S.initialCmds,
    fixed:    S.fixedLabels,
    readonly: S.readonly,
    tools:    tools,
    onReady:  _onAppletReady
  });

  // ── 4) Gestió del botó Comprova ──────────────────────
  var btnCheck = document.getElementById('btn-check');
  if (btnCheck) {
    if (S.validatorFn && !S.readonly) {
      btnCheck.hidden = false;
      btnCheck.textContent = G.t('ui.check');
      btnCheck.addEventListener('click', _doCheck);
    } else {
      btnCheck.hidden = true;
    }
  }

  // ── 5) Gestió del botó Reinicia ───────────────────────
  var btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.textContent = G.t('ui.reset');
    btnReset.addEventListener('click', function() {
      GEO.reset();
      _setStateBadge('ready');
    });
    // En mode readonly no cal el botó reset
    if (S.readonly) btnReset.hidden = true;
  }

  // ── 6) Mode readonly: amaga toolbar GeoGebra ─────────
  // (ja controlat per georunner.js via showToolBar: false)
  // Afegim classe al body per CSS addicional si cal
  if (S.readonly) {
    document.body.classList.add('is-readonly');
  }

  // ─────────────────────────────────────────────────────
  // Callbacks interns
  // ─────────────────────────────────────────────────────

  /** Cridat quan l'applet GeoGebra ha acabat de carregar. */
  function _onAppletReady(api) {
    _setStateBadge('ready');

    // Si hi ha validator i NO és readonly, registrem un listener continu
    // per a exercicis simples (Mode B, validació automàtica)
    // NOTA: per a reptes s'usa el botó explícit (Mode A).
    // Per activar la validació contínua, l'autor ha d'afegir ?autocheck=1
    if (S.validatorFn && !S.readonly && params.get('autocheck') === '1') {
      api.registerUpdateListener(function() {
        _doCheck();
      });
    }
  }

  /** Executa el validator i actualitza la UI. */
  function _doCheck() {
    if (!G.state.appletReady) return;
    _setStateBadge('checking');

    // Petit retard per deixar que GeoGebra acabi de processar l'últim canvi
    setTimeout(function() {
      var ok = GEO.check(function(api) {
        return S.validatorFn(api, GV);
      });

      _setStateBadge(ok ? 'correct' : 'wrong');
      _notifyResult(ok);
    }, 80);
  }

  /** Actualitza el badge d'estat i el log. */
  function _setStateBadge(stateKey) {
    G.state.currentState = stateKey;
    var badge = document.getElementById('state-badge');
    if (badge) {
      badge.textContent = G.t('state.' + stateKey);
      badge.className   = 'state-badge state-' + stateKey;
    }
  }

  /** Envia el resultat de la validació al pare (iframe protocol). */
  function _notifyResult(success) {
    if (!S.goalId) return;
    try {
      window.parent.postMessage({
        type:    'geocat-result',
        goalId:  S.goalId,
        success: success
      }, G.parentOrigin);
    } catch(_) {}
  }

})();
