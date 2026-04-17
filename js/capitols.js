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


// ── Renderitzador de widgets GeoGebra ─────────────────────

function renderSimuladors() {
  // Esperem que la pàgina estigui completament carregada (layout calculat)
  // perquè el navegador pugui determinar correctament quins iframes
  // són visibles i quins pot diferir amb loading="lazy".
  function _doRender() {
    document.querySelectorAll('.geogebra').forEach(function(div) {
      var params = new URLSearchParams();
      params.set('embed', '1');

      var commands = div.getAttribute('data-commands') || '';
      if (commands) params.set('commands', btoa(unescape(encodeURIComponent(commands))));

      var fixed = div.getAttribute('data-fixed') || '';
      if (fixed) params.set('fixed', btoa(fixed));

      var check = div.getAttribute('data-check') || '';
      if (check) params.set('check', btoa(unescape(encodeURIComponent(check))));

      var goalId  = div.getAttribute('data-goal-id') || '';
      var readonly = div.getAttribute('data-readonly') === 'true';
      var app     = div.getAttribute('data-app') || '';
      var tools   = div.getAttribute('data-tools') || '';
      var height  = div.getAttribute('data-height') || '420';

      if (goalId)   params.set('goalId',   goalId);
      if (readonly) params.set('readonly', '1');
      if (app)      params.set('app',      app);
      if (tools)    params.set('tools',    tools);

      var iframe = document.createElement('iframe');
      iframe.src = '../geogebra.html?' + params.toString();
      iframe.style.width = '100%';
      iframe.style.height = height + 'px';
      iframe.style.border = '1px solid #d0d0d0';
      iframe.style.borderRadius = '8px';
      iframe.setAttribute('loading', 'lazy');

      // Substitueix el div per l'iframe
      var wrapper = document.createElement('div');
      wrapper.className = 'geogebra-wrap';
      wrapper.appendChild(iframe);

      if (goalId) {
        var fb = document.createElement('div');
        fb.className = 'simulador-feedback';
        fb.setAttribute('data-goal-id', goalId);
        if (isGoalCompleted(goalId)) {
          fb.className = 'simulador-feedback fb-ok';
          fb.textContent = '✓ Completat anteriorment.';
        }
        wrapper.appendChild(fb);
      }

      div.replaceWith(wrapper);
    });
  }

  // Si la pàgina ja ha carregat, executem directament.
  // Si no, esperem l'event 'load'.
  if (document.readyState === 'complete') {
    _doRender();
  } else {
    window.addEventListener('load', _doRender);
  }
}


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


// ── Listener de resultats des dels iframes GeoGebra ──────

window.addEventListener('message', function(e) {
  // Acceptem missatges del mateix origen, o de file:// (origin = "null" o "")
  var sameOrigin = e.origin === window.location.origin
                || e.origin === 'null'
                || e.origin === '';
  if (!sameOrigin) return;
  if (!e.data) return;

  var type   = e.data.type;
  var goalId = e.data.goalId;

  if (type === 'geocat-result') {
    var success = e.data.success;
    var fb = goalId
      ? document.querySelector('.simulador-feedback[data-goal-id="' + CSS.escape(goalId) + '"]')
      : null;

    if (success) {
      if (fb) {
        fb.className = 'simulador-feedback fb-ok';
        fb.textContent = '✓ Correcte! Construcció validada.';
      }
      saveGoalCompleted(goalId);
      _refreshSidebar();
    } else {
      if (fb) {
        fb.className = 'simulador-feedback fb-ko';
        fb.textContent = '✗ Encara no és correcte. Revisa la construcció.';
      }
    }
  }
});

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
