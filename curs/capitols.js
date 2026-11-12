// ════════════════════════════════════════════════════════
// curs/capitols.js — Dades dels capítols i helpers de UI (GeoCat)
//
// Adaptat de PyCat: canviat _LS_KEY, dades capítols/reptes,
// logo, renderSimuladors injecta applets GeoGebra inline.
//
// Funcions exportades al window global:
//   injectCursLogo()           — pobla .logo-icon
//   renderSidebar(currentNum)  — omple #sidebar-nav (amb ✓ de progrés)
//   renderReptesSidebar(id)    — sidebar pels reptes, per temes (id: «3b»)
//   renderSimuladors()         — converteix .geogebra → applets inline
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
  { num: 10, titol: 'Lliscadors i constr. dinàmiques',arxiu: 'capitol-10.html', goalId: 'cap-10-ex' },
];

// ── Dades dels reptes: una graella de 10 temes × 3 nivells ──
// Cada repte és una casella: tema (1…10) + nivell ('a' Fàcil, 'b' Mitjà,
// 'c' Difícil). L'identificador és «3b»: pàgina repte-3b.html, goalId
// 'repte-3b', etiqueta «Repte 3B». Vegeu REPTES_SPECIFICATION.md (secció 4).

var TEMES_DATA = [
  { num: 1,  titol: 'El triangle' },
  { num: 2,  titol: 'El quadrat' },
  { num: 3,  titol: 'La circumferència' },
  { num: 4,  titol: 'Polígons regulars' },
  { num: 5,  titol: 'Mediatriu i circumcentre' },
  { num: 6,  titol: 'Bisectriu i incentre' },
  { num: 7,  titol: 'Perpendiculars i paral·leles' },
  { num: 8,  titol: 'Transformacions' },
  { num: 9,  titol: 'Funcions i corbes' },
  { num: 10, titol: 'Lliscadors i lloc geomètric' },
];

// Només hi ha les caselles que tenen pàgina, en l'ordre de la graella (per
// tema i, dins del tema, a < b < c). Aquest ordre és el de la navegació.
// La dificultat surt del nivell: a → facil, b → mitja, c → dificil.
var REPTES_DATA = [
  { id: '1a',  tema: 1,  nivell: 'a', titol: 'Triangle equilàter',            arxiu: 'repte-1a.html',  goalId: 'repte-1a',  dificultat: 'facil' },
  { id: '1b',  tema: 1,  nivell: 'b', titol: 'Triangle 3-4-5',                arxiu: 'repte-1b.html',  goalId: 'repte-1b',  dificultat: 'mitja' },
  { id: '1c',  tema: 1,  nivell: 'c', titol: 'Triangle medial',               arxiu: 'repte-1c.html',  goalId: 'repte-1c',  dificultat: 'dificil' },
  { id: '2a',  tema: 2,  nivell: 'a', titol: 'Quadrat a l\'origen',           arxiu: 'repte-2a.html',  goalId: 'repte-2a',  dificultat: 'facil' },
  { id: '2b',  tema: 2,  nivell: 'b', titol: 'Quadrat per vèrtexs oposats',   arxiu: 'repte-2b.html',  goalId: 'repte-2b',  dificultat: 'mitja' },
  { id: '2c',  tema: 2,  nivell: 'c', titol: 'Duplicació del quadrat',        arxiu: 'repte-2c.html',  goalId: 'repte-2c',  dificultat: 'dificil' },
  { id: '3a',  tema: 3,  nivell: 'a', titol: 'Circumferències concèntriques', arxiu: 'repte-3a.html',  goalId: 'repte-3a',  dificultat: 'facil' },
  { id: '3b',  tema: 3,  nivell: 'b', titol: 'Circumferència per dos punts',  arxiu: 'repte-3b.html',  goalId: 'repte-3b',  dificultat: 'mitja' },
  { id: '3c',  tema: 3,  nivell: 'c', titol: 'Cercle circumscrit',            arxiu: 'repte-3c.html',  goalId: 'repte-3c',  dificultat: 'dificil' },
  { id: '4a',  tema: 4,  nivell: 'a', titol: 'Pentàgon regular',              arxiu: 'repte-4a.html',  goalId: 'repte-4a',  dificultat: 'facil' },
  { id: '4b',  tema: 4,  nivell: 'b', titol: 'Hexàgon inscrit',               arxiu: 'repte-4b.html',  goalId: 'repte-4b',  dificultat: 'mitja' },
  { id: '4c',  tema: 4,  nivell: 'c', titol: 'Octàgon dins d\'un quadrat',    arxiu: 'repte-4c.html',  goalId: 'repte-4c',  dificultat: 'dificil' },
  { id: '5a',  tema: 5,  nivell: 'a', titol: 'Mediatriu d\'un segment',       arxiu: 'repte-5a.html',  goalId: 'repte-5a',  dificultat: 'facil' },
  { id: '5b',  tema: 5,  nivell: 'b', titol: 'El circumcentre',               arxiu: 'repte-5b.html',  goalId: 'repte-5b',  dificultat: 'mitja' },
  { id: '5c',  tema: 5,  nivell: 'c', titol: 'Tales i la hipotenusa',         arxiu: 'repte-5c.html',  goalId: 'repte-5c',  dificultat: 'dificil' },
  { id: '6a',  tema: 6,  nivell: 'a', titol: 'Bisectriu d\'un angle',         arxiu: 'repte-6a.html',  goalId: 'repte-6a',  dificultat: 'facil' },
  { id: '6b',  tema: 6,  nivell: 'b', titol: 'L\'incentre',                   arxiu: 'repte-6b.html',  goalId: 'repte-6b',  dificultat: 'mitja' },
  { id: '6c',  tema: 6,  nivell: 'c', titol: 'Cercle inscrit',                arxiu: 'repte-6c.html',  goalId: 'repte-6c',  dificultat: 'dificil' },
  { id: '7a',  tema: 7,  nivell: 'a', titol: 'Perpendicular i peu',           arxiu: 'repte-7a.html',  goalId: 'repte-7a',  dificultat: 'facil' },
  { id: '7b',  tema: 7,  nivell: 'b', titol: 'Paral·leles a distància 2',     arxiu: 'repte-7b.html',  goalId: 'repte-7b',  dificultat: 'mitja' },
  { id: '7c',  tema: 7,  nivell: 'c', titol: 'L\'ortocentre',                 arxiu: 'repte-7c.html',  goalId: 'repte-7c',  dificultat: 'dificil' },
  { id: '8a',  tema: 8,  nivell: 'a', titol: 'Translació d\'un triangle',     arxiu: 'repte-8a.html',  goalId: 'repte-8a',  dificultat: 'facil' },
  { id: '8b',  tema: 8,  nivell: 'b', titol: 'Rotació de 60°',                arxiu: 'repte-8b.html',  goalId: 'repte-8b',  dificultat: 'mitja' },
  { id: '8c',  tema: 8,  nivell: 'c', titol: 'Reflexió amb lliscament',       arxiu: 'repte-8c.html',  goalId: 'repte-8c',  dificultat: 'dificil' },
  { id: '9a',  tema: 9,  nivell: 'a', titol: 'Arrels de la paràbola',         arxiu: 'repte-9a.html',  goalId: 'repte-9a',  dificultat: 'facil' },
  { id: '9b',  tema: 9,  nivell: 'b', titol: 'Paràbola i recta',              arxiu: 'repte-9b.html',  goalId: 'repte-9b',  dificultat: 'mitja' },
  { id: '9c',  tema: 9,  nivell: 'c', titol: 'Sinus i cosinus',               arxiu: 'repte-9c.html',  goalId: 'repte-9c',  dificultat: 'dificil' },
  { id: '10a', tema: 10, nivell: 'a', titol: 'Polígon dinàmic',               arxiu: 'repte-10a.html', goalId: 'repte-10a', dificultat: 'facil' },
  { id: '10b', tema: 10, nivell: 'b', titol: 'Lloc del punt mig',             arxiu: 'repte-10b.html', goalId: 'repte-10b', dificultat: 'mitja' },
  { id: '10c', tema: 10, nivell: 'c', titol: 'L\'el·lipse com a lloc geomètric', arxiu: 'repte-10c.html', goalId: 'repte-10c', dificultat: 'dificil' },
];


// ── Sistema de progrés ───────────────────────────────────
// getProgress(), saveGoalCompleted(goalId) i isGoalCompleted(goalId) són a
// progress.js, un fitxer comú (step-quiz-commons) que cada pàgina carrega
// abans d'aquest. La clau de localStorage no ha canviat.

// Migració (11/11/2026): quatre reptes de la numeració antiga continuen a la
// graella amb la mateixa feina. Qui els tenia superats els conserva: es copia
// l'èxit a la clau nova. Les claus antigues es queden on són (no fan cap mal,
// i un èxit no es desgrava mai). progress.js és un fitxer comú: per això la
// migració és aquí.
var _REPTES_REANOMENATS = {
  'repte-3': 'repte-3a',
  'repte-5': 'repte-2a',
  'repte-8': 'repte-7a',
  'repte-9': 'repte-5b'
};

function migraProgresReptes() {
  if (typeof getProgress !== 'function' || typeof saveGoalCompleted !== 'function') return;
  var p = getProgress();
  for (var antic in _REPTES_REANOMENATS) {
    var nou = _REPTES_REANOMENATS[antic];
    if (p[antic] && !p[nou]) saveGoalCompleted(nou);
  }
}

migraProgresReptes();


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

// currentId: identificador de la casella («3b»), o res si no n'hi ha cap d'activa.
// Un desplegable per tema (només els temes que tenen algun repte), amb una
// entrada per casella: «3B · Títol». Tots plegats, tret del tema del repte
// actual. Si la barra es torna a pintar (després de «Comprova»), els temes que
// l'alumne hagi obert continuen oberts.

function renderReptesSidebar(currentId) {
  var nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  var progress = getProgress();

  var actual = REPTES_DATA.filter(function(r) { return r.id === currentId; })[0];
  if (actual) _desaUltimRepte(actual.id);
  var oberts = {};
  nav.querySelectorAll('details.sidebar-tema[open]').forEach(function(d) {
    oberts[d.getAttribute('data-tema')] = true;
  });

  var html = '<div class="sidebar-section-title">Reptes</div>';
  TEMES_DATA.forEach(function(tema) {
    var reptes = REPTES_DATA.filter(function(r) { return r.tema === tema.num; });
    if (!reptes.length) return;
    var obert = (actual && actual.tema === tema.num) || oberts[tema.num];
    html += '<details class="sidebar-tema" data-tema="' + tema.num + '"' + (obert ? ' open' : '') + '>';
    html += '<summary class="sidebar-tema-title">' + tema.num + ' · ' + tema.titol + '</summary>';
    html += '<ul class="sidebar-list">';
    reptes.forEach(function(r) {
      var isActive = r.id === currentId;
      var check = (r.goalId && progress[r.goalId])
        ? '<span class="sidebar-check" aria-label="completat">✓</span>' : '';
      html += '<li class="sidebar-item' + (isActive ? ' active' : '') + '">' +
        '<a href="' + r.arxiu + '">' +
          check + r.id.toUpperCase() + ' · ' + r.titol +
        '</a></li>';
    });
    html += '</ul></details>';
  });
  nav.innerHTML = html;
}

// ── Últim repte visitat ──────────────────────────────────
// Cada pàgina de repte desa el seu identificador a localStorage (només en
// aquest navegador). L'enllaç «Reptes» de la capçalera porta a aquell repte
// en lloc del 1A. La portada (index.html) llegeix la mateixa clau.
var _CLAU_ULTIM_REPTE = 'geocat_ultim_repte';

function _desaUltimRepte(id) {
  try { localStorage.setItem(_CLAU_ULTIM_REPTE, id); } catch (e) {}
}

function _ultimRepte() {
  var id = null;
  try { id = localStorage.getItem(_CLAU_ULTIM_REPTE); } catch (e) {}
  return REPTES_DATA.filter(function(r) { return r.id === id; })[0] || null;
}

function _enllacaUltimRepte() {
  var r = _ultimRepte();
  if (!r) return;
  document.querySelectorAll('.curs-nav a[href="repte-1a.html"]').forEach(function(a) {
    a.setAttribute('href', r.arxiu);
  });
}
_enllacaUltimRepte();





//
// PATRÓ: deployggb.js es carrega síncronament al <head> de cada
// pàgina HTML, així GGBApplet existeix quan renderSimuladors()
// s'executa. Sense càrrega dinàmica, sense cues, sense IntersectionObserver.

var _ggbWidgetCount = 0;

// Focus inicial. En carregar, l'applet classic posa el cursor a la barra
// d'entrada («Entrada…») i el navegador baixa la pàgina fins allà: l'alumne no
// veu l'enunciat. El paràmetre preventFocus no ho evita. Per això, mentre
// l'alumne no hagi fet res a la pàgina (clic, tecla, roda, tocar la pantalla),
// qualsevol focus que agafi un applet es treu i la pàgina torna a dalt.
var _alumneHaInteractuat = false;
['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function(ev) {
  document.addEventListener(ev, function() { _alumneHaInteractuat = true; }, true);
});

function _evitaFocusInicial(wrapper) {
  wrapper.addEventListener('focusin', function(e) {
    if (_alumneHaInteractuat) return;
    if (e.target && e.target.blur) e.target.blur();
    window.scrollTo(0, 0);
  });
}

// GeoGebra no disponible. deployggb.js i l'applet es carreguen de geogebra.org:
// sense connexió (o si el servidor no respon) el widget es quedaria per sempre a
// «carregant…». En aquest cas es mostra un avís dins el widget.
//   · si deployggb.js no s'ha carregat (GGBApplet no existeix), de seguida;
//   · si s'ha carregat però l'applet no arriba en _GGB_ESPERA_MS, en aquell
//     moment. Si l'applet arriba més tard, appletOnLoad treu l'avís.
var _GGB_ESPERA_MS = 30000;

function _mostraErrorGeoGebra(wrapper) {
  if (!wrapper || wrapper._ggbApi || wrapper.querySelector('.ggb-error')) return;
  var host = document.getElementById(wrapper._ggbId) || wrapper;
  var box = document.createElement('div');
  box.className = 'ggb-error';
  box.setAttribute('role', 'alert');
  box.innerHTML =
    '<p><strong>No s\'ha pogut carregar GeoGebra.</strong></p>' +
    '<p>GeoGebra arriba des de geogebra.org: comprova la connexió a internet i torna-ho a provar.</p>' +
    '<button class="ggb-btn" type="button">↻ Torna a carregar la pàgina</button>';
  box.querySelector('button').addEventListener('click', function() { window.location.reload(); });
  host.appendChild(box);
  var badge = wrapper.querySelector('.ggb-badge');
  if (badge) { badge.textContent = 'sense GeoGebra'; badge.className = 'ggb-badge ggb-ko'; }
}

// Vista inicial. data-view="xmin xmax ymin ymax" és la regió que ha de quedar
// visible (la construcció inicial i la solució). La vista per defecte de
// GeoGebra només mostra y entre −3.9 i 3.9, i molts triangles hi queden tallats.
// Es conserva la mateixa escala als dos eixos (una circumferència ha de semblar
// una circumferència): la regió es centra i s'eixampla pel costat que calgui.
function _aplicaVista(api, cfg) {
  if (!cfg.view) return;
  var r = cfg.view.trim().split(/[\s,]+/).map(Number);
  if (r.length !== 4 || r.some(function(n) { return !isFinite(n); })) {
    console.warn('[GeoCat] data-view no vàlid:', cfg.view);
    return;
  }
  var xmin = r[0], xmax = r[1], ymin = r[2], ymax = r[3];
  try {
    var v = JSON.parse(api.getViewProperties());
    if (v.width > 0 && v.height > 0) {
      var s  = Math.max((xmax - xmin) / v.width, (ymax - ymin) / v.height);   // unitats per píxel
      var cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
      xmin = cx - s * v.width / 2;  xmax = cx + s * v.width / 2;
      ymin = cy - s * v.height / 2; ymax = cy + s * v.height / 2;
    }
  } catch (e) {}
  try { api.setCoordSystem(xmin, xmax, ymin, ymax); } catch (e) {}
}


function renderSimuladors() {
  var divs = document.querySelectorAll('.geogebra');
  if (divs.length === 0) return;

  // ── Llegim data-attributes de cada div ──

  var entries = [];
  divs.forEach(function(div) {
    var id = 'ggb-w' + (_ggbWidgetCount++);
    var commandsRaw = div.getAttribute('data-commands') || '';
    var fixedRaw    = div.getAttribute('data-fixed')    || '';
    var commands = commandsRaw
      ? commandsRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean)
      : [];
    var fixed = fixedRaw
      ? fixedRaw.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
      : [];

    // data-check is no longer used. Validators are looked up by goalId.
    var validatorFn = null;
    var goalIdForLookup = div.getAttribute('data-goal-id') || '';
    if (goalIdForLookup && typeof VALIDATORS !== 'undefined' && VALIDATORS[goalIdForLookup]) {
      (function(fn) {
        validatorFn = function(api, GV) { return fn(api, GV); };
      })(VALIDATORS[goalIdForLookup]);
    }

    entries.push({
      div: div, id: id, commands: commands, fixed: fixed,
      readonly:  div.getAttribute('data-readonly') === 'true',
      goalId:    div.getAttribute('data-goal-id') || '',
      app:       div.getAttribute('data-app') || '',
      tools:     div.getAttribute('data-tools') || '',
      view:      div.getAttribute('data-view') || '',
      height:    div.getAttribute('data-height') || '420',
      validator: validatorFn
    });
  });

  // ── Construïm wrappers al DOM ──

  entries.forEach(function(cfg) {
    var wrapper = document.createElement('div');
    wrapper.className = 'geogebra-wrap';

    var ggbDiv = document.createElement('div');
    ggbDiv.id = cfg.id;
    ggbDiv.style.width = '100%';
    ggbDiv.style.height = cfg.height + 'px';
    ggbDiv.style.border = '1px solid var(--border, #d0d0d0)';
    ggbDiv.style.borderRadius = '8px';
    ggbDiv.style.overflow = 'hidden';
    ggbDiv.style.background = '#f8f8f8';
    wrapper.appendChild(ggbDiv);

    if (!cfg.readonly) {
      var tb = document.createElement('div');
      tb.className = 'ggb-toolbar';
      tb.innerHTML =
        '<span class="ggb-badge">carregant…</span>' +
        (cfg.validator
          ? '<button class="ggb-btn ggb-btn-check" type="button">✓ Comprova</button>'
          : '') +
        '<button class="ggb-btn ggb-btn-reset" type="button">↺ Reinicia</button>';
      wrapper.appendChild(tb);

      if (cfg.validator) {
        (function(cfg, wrapper, tb) {
          tb.querySelector('.ggb-btn-check').addEventListener('click', function() {
            var api = wrapper._ggbApi;
            if (!api) return;
            var badge = tb.querySelector('.ggb-badge');
            badge.textContent = '…'; badge.className = 'ggb-badge';
            var prev = window.ggbApplet;
            window.ggbApplet = api;
            var GVref = (typeof GV !== 'undefined') ? GV : {};
            setTimeout(function() {
              var ok = false;
              var validatorFn = cfg.validator;
              try { ok = !!validatorFn(api, GVref); } catch(e) { console.warn('[GeoCat] validator error:', e); }
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

      (function(cfg, wrapper, tb) {
        tb.querySelector('.ggb-btn-reset').addEventListener('click', function() {
          var api = wrapper._ggbApi;
          if (!api) return;
          try { api.reset(); } catch(e) {}
          cfg.commands.forEach(function(cmd) { if (cmd) try { api.evalCommand(cmd); } catch(e) {} });
          cfg.fixed.forEach(function(lbl) {
            if (lbl) try { api.setFixed(lbl, true, true); api.setColor(lbl, 60, 100, 220); } catch(e) {}
          });
          _aplicaVista(api, cfg);
          var badge = tb.querySelector('.ggb-badge');
          if (badge) { badge.textContent = 'llest'; badge.className = 'ggb-badge ggb-ready'; }
        });
      })(cfg, wrapper, tb);
    }

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
    _evitaFocusInicial(wrapper);
    cfg.div.replaceWith(wrapper);
  });

  // ══════════════════════════════════════════════════════════
  // INJECCIÓ
  //
  // deployggb.js ja està carregat al <head> (síncron).
  // GGBApplet EXISTEIX aquí, garantit.
  // ══════════════════════════════════════════════════════════

  if (typeof GGBApplet === 'undefined') {
    console.warn('[GeoCat] deployggb.js no s\'ha carregat: GeoGebra no és disponible');
    entries.forEach(function(cfg) {
      _mostraErrorGeoGebra(document.getElementById(cfg.id).parentElement);
    });
    return;
  }

  var H;

  entries.forEach(function(cfg) {
    H = Math.round((parseInt(cfg.height, 10) || 420) * 1.1);

    var wrapper = document.getElementById(cfg.id).parentElement;
    // Llegim l'amplada real del contenidor en el moment d'injectar,
    // així el canvas ocupa tota l'amplada disponible (no 640px fix).
    var W = document.getElementById(cfg.id).offsetWidth || 640;

    var ggbParams = {
      appName:             cfg.app || 'classic',
      width:               W,
      height:              H,
      showToolBar:         !cfg.readonly,
      // Barra d'entrada: només als applets on l'alumne construeix. Al classic cal
      // dir-li on va ('bottom'); al graphing és dins la vista d'àlgebra (vegeu més avall).
      showAlgebraInput:    !cfg.readonly,
      algebraInputPosition: 'bottom',
      showMenuBar:         false,
      enableRightClick:    !cfg.readonly,
      enableLabelDrags:    !cfg.readonly,
      enableShiftDragZoom: true,
      showKeyboardOnFocus: false,
      // Que l'applet no agafi el focus en carregar: si no, el cursor va a la barra
      // d'entrada i el navegador baixa la pàgina fins allà.
      preventFocus:        true,
      language:            'ca',
      id:                  cfg.id,
      appletOnLoad: function(api) {
        console.log('[GeoCat] ✓ Applet ' + cfg.id + ' carregat OK');
        wrapper._ggbApi = api;
        var avis = wrapper.querySelector('.ggb-error');     // l'applet ha arribat tard
        if (avis) avis.remove();

        // Només Vista Gràfica (amaga la columna d'àlgebra de l'esquerra).
        // Excepció: als exercicis (goalId) amb l'app graphing. Allà la barra d'entrada
        // i les eines són dins el panell de l'esquerra, i amagar-lo deixaria l'alumne
        // sense manera de construir res.
        if (!(cfg.app === 'graphing' && cfg.goalId && !cfg.readonly)) api.setPerspective('G');

        // Eixos i graella sempre visibles
        api.evalCommand('ShowAxes(true)');
        api.evalCommand('ShowGrid(true)');

        // Comandes inicials
        cfg.commands.forEach(function(cmd) {
          if (cmd) try { api.evalCommand(cmd); } catch(e) {
            console.warn('[GeoCat] evalCommand error:', cmd, e);
          }
        });

        // Objectes fixos
        cfg.fixed.forEach(function(lbl) {
          if (lbl) try {
            api.setFixed(lbl, true, true);
            api.setColor(lbl, 60, 100, 220);
          } catch(e) {}
        });

        // Vista inicial (data-view)
        _aplicaVista(api, cfg);

        // Badge
        var badge = wrapper.querySelector('.ggb-badge');
        if (badge) { badge.textContent = 'llest'; badge.className = 'ggb-badge ggb-ready'; }

        // ── Reset de la validació quan l'usuari modifica la construcció ──
        // Si el badge és ggb-ok o ggb-ko i l'usuari canvia qualsevol objecte,
        // tornem a l'estat "llest" per evitar mostrar un "Correcte" obsolet.
        if (cfg.validator) {
          var _listenerName = cfg.id.replace(/-/g, '_') + '_onChange';
          (function(_wrapper, _badge, _goalId) {
            window[_listenerName] = function() {
              var b = _wrapper.querySelector('.ggb-badge');
              if (b && (b.classList.contains('ggb-ok') || b.classList.contains('ggb-ko'))) {
                b.textContent = 'llest';
                b.className = 'ggb-badge ggb-ready';
                var fb = _wrapper.querySelector('.simulador-feedback');
                if (fb) { fb.className = 'simulador-feedback'; fb.textContent = ''; }
              }
            };
          })(wrapper, badge, cfg.goalId);
          api.registerUpdateListener(_listenerName);
          try { api.registerRemoveListener(_listenerName); } catch(e) {}
        }
      }
    };

    // Toolbar personalitzada: només si l'autor ha posat data-tools="...".
    // Format: IDs numèrics separats per espais, amb ',' '|' '||' per agrupar.
    // Veure https://geogebra.github.io/docs/reference/en/Toolbar/ per la llista.
    if (cfg.tools && cfg.tools.trim()) {
      ggbParams.customToolBar = cfg.tools.trim();
    }

    try {
      new GGBApplet(ggbParams, true).inject(cfg.id);
    } catch (e) {
      console.warn('[GeoCat] GeoGebra no s\'ha pogut injectar:', e);
    }
    setTimeout(function() { _mostraErrorGeoGebra(wrapper); }, _GGB_ESPERA_MS);
  });
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
  var repMatch = path.match(/repte-(\d+[a-c])\.html/);
  if (capMatch) renderSidebar(parseInt(capMatch[1], 10));
  else if (repMatch) renderReptesSidebar(repMatch[1]);
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
window.TEMES_DATA           = TEMES_DATA;
window.REPTES_DATA          = REPTES_DATA;
