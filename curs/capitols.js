// ════════════════════════════════════════════════════════
// curs/capitols.js — Dades dels capítols i helpers de UI (GeoCat)
//
// Adaptat de PyCat: canviat _LS_KEY, dades capítols/reptes,
// logo, renderSimuladors estès amb .geogebra → geogebra.html
//
// Funcions exportades al window global:
//   injectCursLogo()           — pobla .logo-icon
//   renderSidebar(currentNum)  — omple #sidebar-nav (amb ✓ de progrés)
//   renderReptesSidebar(num)   — sidebar pels reptes (amb ✓ de progrés)
//   renderSimuladors()         — converteix .geogebra → iframes
//   initSidebarToggle()        — hamburger mòbil
//   initGlossariCurs()         — glossari modal
//
// Dependència: glossari-data.js (ha de carregar-se ABANS)
// ════════════════════════════════════════════════════════


// ── Logo ─────────────────────────────────────────────────
function injectCursLogo() {
  document.querySelectorAll('.logo-icon').forEach(function(el) {
    if (!el.innerHTML.trim()) {
      // Compàs geomètric com a logo de GeoCat
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1.4em" height="1.4em" style="vertical-align:middle"><circle cx="50" cy="22" r="10" fill="#2563eb"/><line x1="50" y1="32" x2="30" y2="82" stroke="#2563eb" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="32" x2="70" y2="82" stroke="#2563eb" stroke-width="6" stroke-linecap="round"/><line x1="26" y1="72" x2="74" y2="72" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/></svg>';
    }
  });
}


// ── Dades dels capítols ──────────────────────────────────
// goalId: identificador del widget d'exercici del capítol (null si no en té).

var CAPITOLS_DATA = [
  { num: 1,  titol: 'Benvingut a GeoGebra',          arxiu: 'capitol-1.html',  goalId: 'cap-1-ex' },
  { num: 2,  titol: 'Rectes i segments',              arxiu: 'capitol-2.html',  goalId: 'cap-2-ex' },
  { num: 3,  titol: 'Circumferències',                arxiu: 'capitol-3.html',  goalId: 'cap-3-ex' },
  { num: 4,  titol: 'Mesures',                        arxiu: 'capitol-4.html',  goalId: 'cap-4-ex' },
  { num: 5,  titol: 'Construccions clàssiques I',     arxiu: 'capitol-5.html',  goalId: 'cap-5-ex' },
  { num: 6,  titol: 'Construccions clàssiques II',    arxiu: 'capitol-6.html',  goalId: 'cap-6-ex' },
  { num: 7,  titol: 'Polígons',                       arxiu: 'capitol-7.html',  goalId: 'cap-7-ex' },
  { num: 8,  titol: 'Transformacions',                arxiu: 'capitol-8.html',  goalId: 'cap-8-ex' },
  { num: 9,  titol: 'Funcions i gràfiques',           arxiu: 'capitol-9.html',  goalId: 'cap-9-ex' },
  { num: 10, titol: 'Lliscadors i constr. dinàmiques',arxiu: 'capitol-10.html', goalId: null },
];

var REPTES_DATA = [
  { num: 1,  titol: 'El primer punt',      arxiu: 'repte-1.html',  goalId: 'repte-1',  dificultat: 'facil'  },
  { num: 2,  titol: 'Un segment',          arxiu: 'repte-2.html',  goalId: 'repte-2',  dificultat: 'facil'  },
  { num: 3,  titol: 'La circumferència',   arxiu: 'repte-3.html',  goalId: 'repte-3',  dificultat: 'facil'  },
  { num: 4,  titol: 'El triangle',         arxiu: 'repte-4.html',  goalId: 'repte-4',  dificultat: 'facil'  },
  { num: 5,  titol: 'El punt mig',         arxiu: 'repte-5.html',  goalId: 'repte-5',  dificultat: 'facil'  },
  { num: 6,  titol: 'La perpendicular',    arxiu: 'repte-6.html',  goalId: 'repte-6',  dificultat: 'mitja'  },
  { num: 7,  titol: 'La mediatriu',        arxiu: 'repte-7.html',  goalId: 'repte-7',  dificultat: 'mitja'  },
  { num: 8,  titol: 'La bisectriu',        arxiu: 'repte-8.html',  goalId: 'repte-8',  dificultat: 'mitja'  },
  { num: 9,  titol: 'Triangle equilàter',  arxiu: 'repte-9.html',  goalId: 'repte-9',  dificultat: 'mitja'  },
  { num: 10, titol: 'Triangle isòsceles',  arxiu: 'repte-10.html', goalId: 'repte-10', dificultat: 'mitja'  },
  { num: 11, titol: 'La paral·lela',       arxiu: 'repte-11.html', goalId: 'repte-11', dificultat: 'mitja'  },
  { num: 12, titol: 'Cercle circumscrit',  arxiu: 'repte-12.html', goalId: 'repte-12', dificultat: 'dificil' },
  { num: 13, titol: 'Translació',          arxiu: 'repte-13.html', goalId: 'repte-13', dificultat: 'dificil' },
  { num: 14, titol: 'Reflexió',            arxiu: 'repte-14.html', goalId: 'repte-14', dificultat: 'dificil' },
  { num: 15, titol: 'La funció quadràtica',arxiu: 'repte-15.html', goalId: 'repte-15', dificultat: 'dificil' },
];


// ── Sistema de progrés ───────────────────────────────────
// Guarda a localStorage un objecte { goalId: true, ... }

var _LS_KEY = 'geocat_progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(_LS_KEY) || '{}');
  } catch(_) { return {}; }
}

function saveGoalCompleted(goalId) {
  if (!goalId) return;
  var p = getProgress();
  if (p[goalId]) return;  // ja guardat
  p[goalId] = true;
  try { localStorage.setItem(_LS_KEY, JSON.stringify(p)); } catch(_) {}
}

function isGoalCompleted(goalId) {
  if (!goalId) return false;
  return !!getProgress()[goalId];
}


// ── Sidebar: capítols ────────────────────────────────────

function renderSidebar(currentNum) {
  var nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  var progress = getProgress();

  var html = '<div class="sidebar-section-title">Capítols</div>';
  html += '<ul class="sidebar-list">';
  for (var i = 0; i < CAPITOLS_DATA.length; i++) {
    var c = CAPITOLS_DATA[i];
    var isActive = c.num === currentNum;
    var check = (c.goalId && progress[c.goalId])
      ? '<span class="sidebar-check" aria-label="completat">✓</span>' : '';
    html += '<li class="sidebar-item' + (isActive ? ' active' : '') + '">' +
      '<a href="' + c.arxiu + '">' +
        check + c.num + '. ' + c.titol +
      '</a></li>';
  }
  html += '</ul>';
  nav.innerHTML = html;
}

// ── Sidebar: reptes ──────────────────────────────────────

function renderReptesSidebar(currentNum) {
  var nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  var progress = getProgress();

  var difLabels = { facil: 'Fàcil', mitja: 'Mitjà', dificil: 'Difícil' };

  var html = '<div class="sidebar-section-title">Reptes</div>';
  html += '<ul class="sidebar-list">';
  for (var i = 0; i < REPTES_DATA.length; i++) {
    var r = REPTES_DATA[i];
    var isActive = r.num === currentNum;
    var check = (r.goalId && progress[r.goalId])
      ? '<span class="sidebar-check" aria-label="completat">✓</span>' : '';
    html += '<li class="sidebar-item' + (isActive ? ' active' : '') + '">' +
      '<a href="' + r.arxiu + '">' +
        check + 'Repte ' + r.num + ': ' + r.titol +
      '</a></li>';
  }
  html += '</ul>';
  nav.innerHTML = html;
}


// ── Renderitzador de widgets GeoGebra (EMBED DIRECTE) ────
//
// Com ho fan els llibres/activitats de GeoGebra:
//  1. Carreguem deployggb.js UNA SOLA VEGADA a la pàgina
//  2. Per a cada .geogebra, injectem l'applet DIRECTAMENT al DOM
//  3. Sense iframes intermediaris, sense curses de layout
//
// Avantatges:
//  - Un sol motor GeoGebra compartit per tots els widgets
//  - Sense problemes d'alçada/amplada d'iframe
//  - Validació directa, sense postMessage

var _ggbScriptLoaded = false;
var _ggbScriptCallbacks = [];
var _ggbWidgetCount = 0;

function _loadDeployGGB(callback) {
  if (typeof GGBApplet !== 'undefined') { callback(); return; }
  _ggbScriptCallbacks.push(callback);
  if (_ggbScriptLoaded) return;        // ja s'està carregant
  _ggbScriptLoaded = true;

  var script = document.createElement('script');
  script.src = 'https://www.geogebra.org/apps/deployggb.js';
  script.onload = function() {
    var cbs = _ggbScriptCallbacks.slice();
    _ggbScriptCallbacks = [];
    cbs.forEach(function(cb) { cb(); });
  };
  script.onerror = function() {
    console.error('[GeoCat] No s\'ha pogut carregar deployggb.js');
  };
  document.head.appendChild(script);
}

// Carrega geovalidator.js dinàmicament (per als validators que usen GV)
var _gvLoaded = false;
function _loadGV(callback) {
  if (typeof GV !== 'undefined') { callback(); return; }
  if (_gvLoaded) { callback(); return; }
  _gvLoaded = true;
  var script = document.createElement('script');
  script.src = '../js/geovalidator.js';
  script.onload = callback;
  script.onerror = callback;  // Continua encara que falli
  document.head.appendChild(script);
}


function renderSimuladors() {
  var divs = document.querySelectorAll('.geogebra');
  if (divs.length === 0) return;

  // Cua seqüencial: injectem un applet a la vegada
  var pending = [];
  var injecting = false;

  function _processNext() {
    if (injecting || pending.length === 0) return;
    injecting = true;
    var w = pending.shift();
    _injectApplet(w, function() {
      injecting = false;
      // Petit delay perquè GeoGebra estabilitzi el renderitzat
      setTimeout(_processNext, 400);
    });
  }

  function _enqueue(wrapper) {
    pending.push(wrapper);
    _processNext();
  }

  function _injectApplet(wrapper, doneCb) {
    var cfg        = wrapper._ggbCfg;
    var containerId = wrapper._ggbId;
    var container   = document.getElementById(containerId);
    if (!container) { doneCb(); return; }

    var w = container.offsetWidth || 700;
    var h = parseInt(cfg.height, 10) || 420;

    var params = {
      appName:             cfg.app || 'geometry',
      width:               w,
      height:              h,
      showToolBar:         !cfg.readonly,
      showAlgebraInput:    !cfg.readonly,
      showMenuBar:         false,
      showResetIcon:       false,
      enableRightClick:    false,
      enableShiftDragZoom: true,
      showZoomButtons:     true,
      errorDialogsActive:  false,
      language:            'ca',
      appletOnLoad:        function(api) {
        wrapper._ggbApi = api;

        // Aplica comandes inicials
        if (cfg.commands) {
          cfg.commands.forEach(function(cmd) {
            if (cmd) try { api.evalCommand(cmd); } catch(e) {}
          });
        }
        // Fixa objectes
        if (cfg.fixed) {
          cfg.fixed.forEach(function(lbl) {
            if (lbl) try {
              api.setFixed(lbl, true, false);
              api.setColor(lbl, 60, 100, 220);
            } catch(e) {}
          });
        }

        // Actualitza el badge
        var badge = wrapper.querySelector('.ggb-badge');
        if (badge) { badge.textContent = 'llest'; badge.className = 'ggb-badge ggb-ready'; }

        // ResizeObserver per adaptar-se a canvis de mida
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(function() {
            var cw = container.offsetWidth, ch = container.offsetHeight;
            if (cw > 50 && ch > 50) try { api.setSize(cw, ch); } catch(_) {}
          }).observe(container);
        }

        doneCb();
      }
    };
    if (cfg.tools) params.customToolBar = cfg.tools;

    var applet = new GGBApplet(params, true);
    applet.inject(containerId);

    // Fallback: si l'applet no crida appletOnLoad en 45 s, continuem
    setTimeout(function() { if (!wrapper._ggbApi) doneCb(); }, 45000);
  }


  // ── Llegim les dades de cada div ABANS de tocar el DOM ──

  var entries = [];
  divs.forEach(function(div) {
    var id = 'ggb-w' + (_ggbWidgetCount++);

    var commandsRaw = div.getAttribute('data-commands') || '';
    var fixedRaw    = div.getAttribute('data-fixed')    || '';
    var checkRaw    = div.getAttribute('data-check')    || '';

    var commands = commandsRaw
      ? commandsRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean)
      : [];
    var fixed = fixedRaw
      ? fixedRaw.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
      : [];

    var validatorFn = null;
    if (checkRaw) {
      try { validatorFn = new Function('api', 'GV', 'return (' + checkRaw + ')(api)'); }
      catch(_) { try { validatorFn = new Function('api', 'GV', checkRaw); } catch(e) {} }
    }

    entries.push({
      div:       div,
      id:        id,
      commands:  commands,
      fixed:     fixed,
      readonly:  div.getAttribute('data-readonly') === 'true',
      goalId:    div.getAttribute('data-goal-id') || '',
      app:       div.getAttribute('data-app') || '',
      tools:     div.getAttribute('data-tools') || '',
      height:    div.getAttribute('data-height') || '420',
      validator: validatorFn
    });
  });


  // ── Construïm el DOM i observem visibilitat ──

  var observer = null;
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(function(ioEntries) {
      ioEntries.forEach(function(io) {
        if (!io.isIntersecting) return;
        observer.unobserve(io.target);
        _loadDeployGGB(function() { _enqueue(io.target); });
      });
    }, { rootMargin: '300px' });
  }

  entries.forEach(function(cfg) {
    var wrapper = document.createElement('div');
    wrapper.className = 'geogebra-wrap';

    // Contenidor on GeoGebra injectarà l'applet
    var ggbDiv = document.createElement('div');
    ggbDiv.id = cfg.id;
    ggbDiv.style.width = '100%';
    ggbDiv.style.height = cfg.height + 'px';
    ggbDiv.style.border = '1px solid var(--border, #d0d0d0)';
    ggbDiv.style.borderRadius = '8px';
    ggbDiv.style.overflow = 'hidden';
    ggbDiv.style.background = '#f8f8f8';
    wrapper.appendChild(ggbDiv);

    // Toolbar per a widgets no-readonly
    if (!cfg.readonly) {
      var tb = document.createElement('div');
      tb.className = 'ggb-toolbar';
      tb.innerHTML =
        '<span class="ggb-badge">—</span>' +
        (cfg.validator
          ? '<button class="ggb-btn ggb-btn-check" type="button">✓ Comprova</button>'
          : '') +
        '<button class="ggb-btn ggb-btn-reset" type="button">↺ Reinicia</button>';
      wrapper.appendChild(tb);

      // ── Botó Comprova ──
      if (cfg.validator) {
        (function(cfg, wrapper, tb) {
          tb.querySelector('.ggb-btn-check').addEventListener('click', function() {
            var api = wrapper._ggbApi;
            if (!api) return;
            var badge = tb.querySelector('.ggb-badge');
            badge.textContent = '…'; badge.className = 'ggb-badge';

            // GV global per als validators que l'usin
            var prev = window.ggbApplet;
            window.ggbApplet = api;
            var GVref = (typeof GV !== 'undefined') ? GV : {};

            setTimeout(function() {
              var ok = false;
              try { ok = !!cfg.validator(api, GVref); } catch(e) { console.warn('[GeoCat] validator:', e); }
              window.ggbApplet = prev;

              badge.textContent = ok ? '✓ Correcte' : '✗ Incorrecte';
              badge.className   = 'ggb-badge ' + (ok ? 'ggb-ok' : 'ggb-ko');

              if (cfg.goalId) {
                var fb = wrapper.querySelector('.simulador-feedback');
                if (ok) {
                  if (fb) { fb.className = 'simulador-feedback fb-ok'; fb.textContent = '✓ Correcte! Construcció validada.'; }
                  saveGoalCompleted(cfg.goalId);
                  _refreshSidebar();
                } else {
                  if (fb) { fb.className = 'simulador-feedback fb-ko'; fb.textContent = '✗ Encara no és correcte. Revisa la construcció.'; }
                }
              }
            }, 100);
          });
        })(cfg, wrapper, tb);
      }

      // ── Botó Reinicia ──
      (function(cfg, wrapper, tb) {
        tb.querySelector('.ggb-btn-reset').addEventListener('click', function() {
          var api = wrapper._ggbApi;
          if (!api) return;
          try { api.reset(); } catch(e) {}
          cfg.commands.forEach(function(cmd) { if (cmd) try { api.evalCommand(cmd); } catch(e) {} });
          cfg.fixed.forEach(function(lbl) {
            if (lbl) try { api.setFixed(lbl, true, false); api.setColor(lbl, 60, 100, 220); } catch(e) {}
          });
          var badge = tb.querySelector('.ggb-badge');
          if (badge) { badge.textContent = 'llest'; badge.className = 'ggb-badge ggb-ready'; }
        });
      })(cfg, wrapper, tb);
    }

    // Feedback de validació
    if (cfg.goalId) {
      var fb = document.createElement('div');
      fb.className = 'simulador-feedback';
      fb.setAttribute('data-goal-id', cfg.goalId);
      if (isGoalCompleted(cfg.goalId)) {
        fb.className = 'simulador-feedback fb-ok';
        fb.textContent = '✓ Completat anteriorment.';
      }
      wrapper.appendChild(fb);
    }

    wrapper._ggbId  = cfg.id;
    wrapper._ggbCfg = cfg;

    cfg.div.replaceWith(wrapper);

    // Observem o encuem directament
    if (observer) {
      observer.observe(wrapper);
    } else {
      _loadDeployGGB(function() { _enqueue(wrapper); });
    }
  });

  // Carreguem GV si algun widget té validator
  if (entries.some(function(e) { return !!e.validator; })) {
    _loadGV(function() {});
  }
}


// ── Listener de resultats (MANTINGUT per compatibilitat amb
//    pàgines que encara puguin usar iframes) ──────────────────

window.addEventListener('message', function(e) {
  var sameOrigin = e.origin === window.location.origin
                || e.origin === 'null'
                || e.origin === '';
  if (!sameOrigin || !e.data) return;

  if (e.data.type === 'geocat-result') {
    var goalId  = e.data.goalId;
    var success = e.data.success;
    var fb = goalId
      ? document.querySelector('.simulador-feedback[data-goal-id="' + CSS.escape(goalId) + '"]')
      : null;

    if (success) {
      if (fb) { fb.className = 'simulador-feedback fb-ok'; fb.textContent = '✓ Correcte! Construcció validada.'; }
      saveGoalCompleted(goalId);
      _refreshSidebar();
    } else {
      if (fb) { fb.className = 'simulador-feedback fb-ko'; fb.textContent = '✗ Encara no és correcte. Revisa la construcció.'; }
    }
  }
});

// ── Sidebar toggle (hamburger mòbil) ─────────────────────

function initSidebarToggle() {
  var toggle  = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar) return;

  var open = function() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
  };
  var close = function() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', function() {
    sidebar.classList.contains('open') ? close() : open();
  });

  if (overlay) overlay.addEventListener('click', close);
}


// Refresca la sidebar actual
function _refreshSidebar() {
  var path = window.location.pathname;
  var capMatch = path.match(/capitol-(\d+)\.html/);
  var repMatch = path.match(/repte-(\d+)\.html/);
  if (capMatch) renderSidebar(parseInt(capMatch[1], 10));
  else if (repMatch) renderReptesSidebar(parseInt(repMatch[1], 10));
}


// ── Glossari — injectat dinàmicament a capítols i reptes ──

function initGlossariCurs() {
  var header = document.querySelector('.curs-header');
  if (!header) return;

  var btn = document.createElement('button');
  btn.className = 'glossari-curs-btn';
  btn.id = 'btn-glossari-curs';
  btn.textContent = '📐 Glossari';
  btn.type = 'button';
  var actions = header.querySelector('.curs-header-actions');
  (actions || header).appendChild(btn);

  var overlay = document.createElement('div');
  overlay.className = 'glossari-overlay';
  overlay.id = 'glossari-overlay';
  overlay.innerHTML = (typeof GLOSSARI_HTML !== 'undefined')
    ? GLOSSARI_HTML
    : '<div class="glossari-modal"><p>Glossari no disponible.</p></div>';
  document.body.appendChild(overlay);

  btn.addEventListener('click', function() { overlay.classList.toggle('is-open'); });
  overlay.querySelector('#glossari-close').addEventListener('click', function() {
    overlay.classList.remove('is-open');
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') overlay.classList.remove('is-open');
  });
}

// Auto-init
initGlossariCurs();


// ── Exporta ──────────────────────────────────────────────
window.injectCursLogo       = injectCursLogo;
window.renderSidebar        = renderSidebar;
window.renderReptesSidebar  = renderReptesSidebar;
window.renderSimuladors     = renderSimuladors;
window.initSidebarToggle    = initSidebarToggle;
window.initGlossariCurs     = initGlossariCurs;
window.getProgress          = getProgress;
window.saveGoalCompleted    = saveGoalCompleted;
window.isGoalCompleted      = isGoalCompleted;
window.CAPITOLS_DATA        = CAPITOLS_DATA;
window.REPTES_DATA          = REPTES_DATA;
