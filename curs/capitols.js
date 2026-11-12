// ════════════════════════════════════════════════════════
// curs/capitols.js — Dades dels capítols i helpers de UI (Ggcat)
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
      // Compàs geomètric com a logo de Ggcat
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
  { id: '3c',  tema: 3,  nivell: 'c', titol: 'Circumferència circumscrita',   arxiu: 'repte-3c.html',  goalId: 'repte-3c',  dificultat: 'dificil' },
  { id: '4a',  tema: 4,  nivell: 'a', titol: 'Pentàgon regular',              arxiu: 'repte-4a.html',  goalId: 'repte-4a',  dificultat: 'facil' },
  { id: '4b',  tema: 4,  nivell: 'b', titol: 'Hexàgon inscrit',               arxiu: 'repte-4b.html',  goalId: 'repte-4b',  dificultat: 'mitja' },
  { id: '4c',  tema: 4,  nivell: 'c', titol: 'Octàgon dins d\'un quadrat',    arxiu: 'repte-4c.html',  goalId: 'repte-4c',  dificultat: 'dificil' },
  { id: '5a',  tema: 5,  nivell: 'a', titol: 'Mediatriu d\'un segment',       arxiu: 'repte-5a.html',  goalId: 'repte-5a',  dificultat: 'facil' },
  { id: '5b',  tema: 5,  nivell: 'b', titol: 'El circumcentre',               arxiu: 'repte-5b.html',  goalId: 'repte-5b',  dificultat: 'mitja' },
  { id: '5c',  tema: 5,  nivell: 'c', titol: 'Tales i la hipotenusa',         arxiu: 'repte-5c.html',  goalId: 'repte-5c',  dificultat: 'dificil' },
  { id: '6a',  tema: 6,  nivell: 'a', titol: 'Bisectriu d\'un angle',         arxiu: 'repte-6a.html',  goalId: 'repte-6a',  dificultat: 'facil' },
  { id: '6b',  tema: 6,  nivell: 'b', titol: 'L\'incentre',                   arxiu: 'repte-6b.html',  goalId: 'repte-6b',  dificultat: 'mitja' },
  { id: '6c',  tema: 6,  nivell: 'c', titol: 'Circumferència inscrita',       arxiu: 'repte-6c.html',  goalId: 'repte-6c',  dificultat: 'dificil' },
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
  document.addEventListener(ev, function(e) { if (e.isTrusted) _alumneHaInteractuat = true; }, true);
});

// Teclat virtual de GeoGebra (tauletes i pantalles tàctils). En carregar, GeoGebra
// obre sol el seu teclat i tapa un terç de la pantalla; cap paràmetre de l'applet no
// ho evita. Si l'alumne encara no ha tocat res, es tanca amb el botó ✕ del mateix
// teclat (GeoGebra respon als esdeveniments de punter i de ratolí, no a click()).
// Quan l'alumne toca «Entrada…», el teclat torna a sortir.
function _tancaTeclatGeoGebra(sempre) {
  if (_alumneHaInteractuat && !sempre) return;
  document.querySelectorAll('.TabbedKeyBoard').forEach(function(k) {
    var r = k.getBoundingClientRect(), cs = getComputedStyle(k);
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.height === 0 || r.top >= innerHeight) return;
    var b = k.querySelector('.closeTabbedKeyboardButton');
    if (!b) return;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(function(t) {
      var Ctor = (t.indexOf('pointer') === 0 && typeof PointerEvent === 'function') ? PointerEvent : MouseEvent;
      b.dispatchEvent(new Ctor(t, { bubbles: true, cancelable: true, view: window }));
    });
  });
}
function _vigilaTeclatGeoGebra(sempre) {
  [300, 1000, 2000, 3500].forEach(function(ms) { setTimeout(function() { _tancaTeclatGeoGebra(sempre); }, ms); });
}

// Noms dels objectes. Amb només la vista gràfica (sense la columna d'àlgebra),
// GeoGebra no mostra el nom dels punts, i els enunciats parlen d'A, B, C, f…
// Es fan visibles els noms dels punts, rectes, semirectes, circumferències i
// vectors: els que ja hi són en començar i els que crea l'alumne. Els costats dels
// polígons (segments) es deixen sense nom, perquè no s'omplin de lletres.
var _TIPUS_AMB_NOM = ['point', 'line', 'ray', 'circle', 'vector', 'ellipse', 'parabola', 'hyperbola', 'conic'];
function _posaNom(api, nom) {
  try { if (_TIPUS_AMB_NOM.indexOf(api.getObjectType(nom)) !== -1 && api.getVisible(nom)) api.setLabelVisible(nom, true); } catch (e) {}
}
function _posaNoms(api, id) {
  (api.getAllObjectNames() || []).forEach(function(n) { _posaNom(api, n); });
  var fn = id.replace(/-/g, '_') + '_nouObjecte';
  window[fn] = function(nom) { _posaNom(api, nom); };
  try { api.registerAddListener(fn); } catch (e) {}
}

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
    console.warn('[Ggcat] data-view no vàlid:', cfg.view);
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


// ── Zones de la pàgina ───────────────────────────────────
// Els capítols i els reptes es llegeixen per zones, cadascuna un desplegable
// gran amb una franja de color: capítols → Teoria · Exercici · Resum; reptes →
// Objectiu · Exercici · Pista. L'HTML de les pàgines no canvia (els capítols
// són fets a mà i els reptes surten del generador): aquesta funció reagrupa
// les seccions abans que s'injectin els applets. Totes les zones comencen
// obertes, menys la Pista dels reptes.
var _ZONES = {
  teoria:   { icona: '📘', titol: 'Teoria' },
  exercici: { icona: '✏️', titol: 'Exercici' },
  resum:    { icona: '📌', titol: 'Resum' },
  objectiu: { icona: '🎯', titol: 'Objectiu' },
  pista:    { icona: '💡', titol: 'Pista' }
};

function _creaZona(tipus, nodes, oberta) {
  var z = _ZONES[tipus];
  var d = document.createElement('details');
  d.className = 'zona zona-' + tipus;
  d.open = !!oberta;
  d.innerHTML = '<summary class="zona-cap"><span class="zona-icona" aria-hidden="true">' + z.icona +
    '</span><span class="zona-titol">' + z.titol + '</span><span class="zona-ajuda"></span></summary>' +
    '<div class="zona-cos"></div>';
  var cos = d.querySelector('.zona-cos');
  nodes[0].parentNode.insertBefore(d, nodes[0]);
  nodes.forEach(function(n) { cos.appendChild(n); });
  var ajuda = d.querySelector('.zona-ajuda');
  function posaAjuda() { ajuda.textContent = d.open ? 'clica per tancar' : 'clica per obrir'; }
  d.addEventListener('toggle', posaAjuda);
  posaAjuda();
  return d;
}

function _treuTitol(seccio) {
  var h2 = seccio.querySelector(':scope > h2');
  if (h2) h2.remove();
}

function _organitzaZones() {
  var main = document.querySelector('.curs-content');
  if (!main || main.querySelector('.zona')) return;
  var seccions = Array.prototype.slice.call(main.querySelectorAll('section.chapter-section'));
  if (!seccions.length) return;

  if (/repte-\d+[abc](\.html)?$/.test(location.pathname)) {   // Cloudflare serveix les pàgines sense .html
    // Repte: una sola secció amb <h2>Objectiu</h2> … <h2>Widget</h2> …; la pista és un <details> a part
    var sec = seccions[0], objectiu = [], exercici = [], dins = null;
    Array.prototype.slice.call(sec.childNodes).forEach(function(n) {
      if (n.nodeType === 1 && n.tagName === 'H2') {
        dins = /Objectiu/.test(n.textContent) ? objectiu : exercici;
        n.remove();
      } else if (dins && (n.nodeType === 1 || n.textContent.trim())) {
        dins.push(n);
      }
    });
    if (objectiu.length) _creaZona('objectiu', objectiu, true);
    if (exercici.length) _creaZona('exercici', exercici, true);
    var pista = main.querySelector('details.pista');
    if (pista) {
      var cosPista = Array.prototype.slice.call(pista.childNodes).filter(function(n) { return n.tagName !== 'SUMMARY'; });
      var zp = _creaZona('pista', cosPista.length ? cosPista : [document.createElement('div')], false);
      pista.replaceWith(zp);
    }
    if (!sec.children.length) sec.remove();
    return;
  }

  // Capítol: les seccions de teoria, l'exercici (.chapter-exercise) i el resum (<h2>Resum</h2>)
  var exercici = seccions.filter(function(s) { return s.classList.contains('chapter-exercise'); });
  var resum = seccions.filter(function(s) {
    var h = s.querySelector(':scope > h2');
    return h && /^\s*Resum\s*$/.test(h.textContent);
  });
  var teoria = seccions.filter(function(s) { return exercici.indexOf(s) === -1 && resum.indexOf(s) === -1; });
  exercici.forEach(_treuTitol);
  resum.forEach(_treuTitol);
  if (teoria.length)   _creaZona('teoria', teoria, true);
  if (exercici.length) _creaZona('exercici', exercici, true);
  if (resum.length)    _creaZona('resum', resum, true);
}

// ── Etiqueta de cada applet ──────────────────────────────
// L'alumne ha de saber si un applet és per mirar (data-readonly: sense eines
// ni barra d'entrada) o si hi ha de treballar. Etiqueta a sobre i vora diferent.
function _etiquetaApplet(wrapper, readonly) {
  wrapper.classList.add(readonly ? 'ggb-mira' : 'ggb-treballa');
  var t = document.createElement('div');
  t.className = 'ggb-etiqueta ' + (readonly ? 'ggb-etiqueta-mira' : 'ggb-etiqueta-treballa');
  t.innerHTML = readonly
    ? '<span aria-hidden="true">👁</span> <strong>Exemple per mirar</strong> <span class="ggb-etiqueta-detall">— pots moure\'n els punts, però aquí no s\'hi escriuen ordres</span>'
    : '<span aria-hidden="true">✍️</span> <strong>Et toca a tu</strong> <span class="ggb-etiqueta-detall">— fes servir les eines o escriu ordres a «Entrada…»</span>';
  wrapper.insertBefore(t, wrapper.firstChild);
}

function renderSimuladors() {
  _organitzaZones();
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
      // data-algebra="true": es veu la columna d'àlgebra (valors, coordenades, equacions)
      algebra:   div.getAttribute('data-algebra') === 'true',
      height:    div.getAttribute('data-height') || '420',
      validator: validatorFn
    });
  });

  // ── Construïm wrappers al DOM ──

  entries.forEach(function(cfg) {
    var wrapper = document.createElement('div');
    wrapper.className = 'geogebra-wrap';
    _etiquetaApplet(wrapper, cfg.readonly);

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
              // El validador torna true (correcte) o un text que diu què falta.
              var res = false;
              var validatorFn = cfg.validator;
              try { res = validatorFn(api, GVref); } catch(e) { console.warn('[Ggcat] validator error:', e); }
              var ok = res === true;
              var motiu = (!ok && typeof res === 'string' && res) ? res : 'Revisa la construcció.';
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
                  if (fb) { fb.className = 'simulador-feedback fb-ko'; fb.textContent = '✗ Encara no és correcte. ' + motiu; }
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
          _posaNoms(api, cfg.id);
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
    console.warn('[Ggcat] deployggb.js no s\'ha carregat: GeoGebra no és disponible');
    entries.forEach(function(cfg) {
      _mostraErrorGeoGebra(document.getElementById(cfg.id).parentElement);
    });
    return;
  }

  var H;

  entries.forEach(function(cfg) {
    H = Math.round((parseInt(cfg.height, 10) || 420) * 1.1);
    // Als portàtils de poca alçada (1366×768, 1280×720), l'applet i «Comprova» han
    // de cabre sencers a la pantalla: com a molt l'alçada de la finestra − 230 px
    // (capçalera, etiqueta, barra de «Comprova»), i mai menys de 340.
    if (!cfg.readonly) H = Math.max(340, Math.min(H, window.innerHeight - 230));

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
        console.log('[Ggcat] ✓ Applet ' + cfg.id + ' carregat OK');
        wrapper._ggbApi = api;
        var avis = wrapper.querySelector('.ggb-error');     // l'applet ha arribat tard
        if (avis) avis.remove();

        // Només Vista Gràfica (amaga la columna d'àlgebra de l'esquerra).
        // Excepció: als exercicis (goalId) amb l'app graphing. Allà la barra d'entrada
        // i les eines són dins el panell de l'esquerra, i amagar-lo deixaria l'alumne
        // sense manera de construir res.
        // data-algebra: columna d'àlgebra a l'esquerra (A) i vista gràfica (G).
        if (cfg.algebra) api.setPerspective('AG');
        else if (!(cfg.app === 'graphing' && cfg.goalId && !cfg.readonly)) api.setPerspective('G');

        // Eixos i graella sempre visibles
        api.evalCommand('ShowAxes(true)');
        api.evalCommand('ShowGrid(true)');

        // Comandes inicials. Les que GeoGebra rebutja queden a wrapper._ordresRebutjades,
        // que el mode debug comprova (curs/debug-tester.js, «Demostracions dels capítols»).
        wrapper._ordresRebutjades = [];
        cfg.commands.forEach(function(cmd) {
          if (!cmd) return;
          var ok;
          try { ok = api.evalCommand(cmd); } catch(e) {
            ok = false;
            console.warn('[Ggcat] evalCommand error:', cmd, e);
          }
          if (ok === false) wrapper._ordresRebutjades.push(cmd);
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

        // Noms dels objectes, els inicials i els que crearà l'alumne
        _posaNoms(api, cfg.id);

        // Tauleta: el teclat de GeoGebra no s'ha d'obrir sol en carregar
        _vigilaTeclatGeoGebra();

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
      console.warn('[Ggcat] GeoGebra no s\'ha pogut injectar:', e);
    }
    setTimeout(function() { _mostraErrorGeoGebra(wrapper); }, _GGB_ESPERA_MS);
  });
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


// Refresca la sidebar actual
function _refreshSidebar() {
  var path = window.location.pathname;
  // Cloudflare Pages serveix les pàgines sense «.html» (/curs/repte-5b)
  var capMatch = path.match(/capitol-(\d+)(\.html)?$/);
  var repMatch = path.match(/repte-(\d+[a-c])(\.html)?$/);
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

  // Totes les maneres de tancar-lo (✕, clic fora, Esc, el mateix botó) avisen amb
  // l'esdeveniment «glossari-tancat»: la propera vegada s'obre a la llista.
  function tanca() {
    if (!overlay.classList.contains('is-open')) return;
    overlay.classList.remove('is-open');
    overlay.dispatchEvent(new Event('glossari-tancat'));
  }
  btn.addEventListener('click', function() {
    if (overlay.classList.contains('is-open')) tanca(); else overlay.classList.add('is-open');
  });
  overlay.querySelector('#glossari-close').addEventListener('click', tanca);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) tanca();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') tanca();
  });

  _preparaExemplesGlossari(overlay);
}

// ── Exemples del glossari ────────────────────────────────
// Cada paraula del glossari (<code> de les graelles) és un enllaç a un exemple
// fet expressament (glossari-exemples.js). L'exemple s'obre dins la mateixa
// finestra: les ordres en català en un quadre editable, ▶ Executa, ↺ Exemple
// original i un applet amb la vista algebraica (s'hi veuen els valors: àrees,
// distàncies…). L'alumne pot canviar els valors i tornar a executar, o
// arrossegar els punts. Un sol applet per pàgina, creat el primer cop.

var _glossariApi = null, _glossariEspera = [];

function _preparaExemplesGlossari(overlay) {
  if (typeof GLOSSARI_EXEMPLES === 'undefined') return;
  var modal = overlay.querySelector('.glossari-modal');
  var body  = overlay.querySelector('.glossari-body');
  if (!modal || !body) return;

  var panell = document.createElement('div');
  panell.className = 'glossari-exemple';
  panell.hidden = true;
  panell.innerHTML =
    '<button type="button" class="glossari-tornar">← Torna al glossari</button>' +
    '<h3 class="glossari-exemple-titol"></h3>' +
    '<p class="glossari-exemple-desc"></p>' +
    '<label class="glossari-exemple-label" for="glossari-exemple-codi">Ordres de l\'exemple (pots canviar-les):</label>' +
    '<textarea id="glossari-exemple-codi" class="glossari-exemple-codi" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>' +
    '<div class="glossari-exemple-botons">' +
      '<button type="button" class="ggb-btn ggb-btn-check glossari-executa">▶ Executa</button>' +
      '<button type="button" class="ggb-btn glossari-original">↺ Exemple original</button>' +
      '<span class="glossari-exemple-msg" role="status"></span>' +
    '</div>' +
    '<p class="glossari-exemple-prova"></p>' +
    '<div class="glossari-exemple-applet"><div id="ggb-glossari"></div></div>';
  body.parentNode.insertBefore(panell, body.nextSibling);

  var actual = null;
  var codi = panell.querySelector('.glossari-exemple-codi');
  var msg  = panell.querySelector('.glossari-exemple-msg');

  function mostraLlista() {
    panell.hidden = true; body.hidden = false;
    modal.classList.remove('amb-exemple');
  }
  function executa() {
    if (!actual) return;
    msg.textContent = 'carregant GeoGebra…'; msg.className = 'glossari-exemple-msg';
    _ambApiGlossari(panell, function(api) {
      var errors = _executaExempleGlossari(api, codi.value.split('\n'), actual.ex.view);
      if (errors.length) {
        msg.textContent = '⚠ GeoGebra no ha entès ' + (errors.length === 1 ? 'la línia ' : 'les línies ') +
          errors.join(', ') + '. Revisa el nom de l\'ordre, els parèntesis i les comes.';
        msg.className = 'glossari-exemple-msg glossari-exemple-error';
      } else {
        msg.textContent = '✓ Fet'; msg.className = 'glossari-exemple-msg glossari-exemple-ok';
      }
    });
  }
  function obre(clau, desc) {
    var ex = GLOSSARI_EXEMPLES[clau];
    if (!ex) return;
    actual = { clau: clau, ex: ex };
    panell.querySelector('.glossari-exemple-titol').textContent = clau;
    panell.querySelector('.glossari-exemple-desc').innerHTML = desc || '';
    panell.querySelector('.glossari-exemple-prova').innerHTML = '<strong>Prova-ho:</strong> ' + ex.prova;
    codi.value = ex.codi.join('\n');
    codi.rows = Math.max(2, ex.codi.length);
    body.hidden = true; panell.hidden = false;
    modal.classList.add('amb-exemple');
    panell.scrollTop = 0;
    executa();
  }

  // Les paraules del glossari, convertides en botons
  body.querySelectorAll('.glossari-grid > code').forEach(function(c) {
    var clau = c.textContent.trim();
    if (!GLOSSARI_EXEMPLES[clau]) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'glossari-terme';
    b.title = 'Mira un exemple';
    var desc = c.nextElementSibling ? c.nextElementSibling.innerHTML : '';
    c.parentNode.insertBefore(b, c);
    b.appendChild(c);
    b.addEventListener('click', function() { obre(clau, desc); });
  });

  panell.querySelector('.glossari-tornar').addEventListener('click', mostraLlista);
  panell.querySelector('.glossari-executa').addEventListener('click', executa);
  panell.querySelector('.glossari-original').addEventListener('click', function() {
    if (!actual) return;
    codi.value = actual.ex.codi.join('\n');
    executa();
  });
  codi.addEventListener('keydown', function(e) {          // Ctrl+Enter també executa
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); executa(); }
  });
  // En tancar el glossari (de qualsevol manera), la propera vegada torna a la llista
  overlay.addEventListener('glossari-tancat', mostraLlista);

  // Per al provador: executa tots els exemples i torna les línies que fallen
  window.GLOSSARI_PROVA_TOTS = function(fet) {
    var claus = Object.keys(GLOSSARI_EXEMPLES), out = {};
    overlay.classList.add('is-open');
    _ambApiGlossari(panell.hidden ? (obre(claus[0]), panell) : panell, function(api) {
      claus.forEach(function(k) {
        var ex = GLOSSARI_EXEMPLES[k];
        var errors = _executaExempleGlossari(api, ex.codi, ex.view);
        var indefinits = api.getAllObjectNames().filter(function(n) { return !api.isDefined(n); });
        if (errors.length || indefinits.length) out[k] = { linies: errors, indefinits: indefinits };
      });
      fet({ total: claus.length, fallen: out });
    });
  };
}

// Crida fet(api) quan l'applet del glossari està llest (el crea el primer cop)
function _ambApiGlossari(panell, fet) {
  if (_glossariApi) { fet(_glossariApi); return; }
  _glossariEspera.push(fet);
  if (_glossariEspera.length > 1) return;
  var crea = function() {
    var host = panell.querySelector('#ggb-glossari');
    var W = host.parentNode.offsetWidth || 640;
    new GGBApplet({
      appName: 'classic', width: W, height: 380, language: 'ca', id: 'ggb-glossari',
      showToolBar: false, showAlgebraInput: false, showMenuBar: false,
      enableRightClick: false, enableShiftDragZoom: true, errorDialogsActive: false,
      showKeyboardOnFocus: false, preventFocus: true,
      appletOnLoad: function(api) {
        try { api.setPerspective('AG'); } catch (e) {}
        _glossariApi = api;
        var cues = _glossariEspera; _glossariEspera = [];
        cues.forEach(function(f) { f(api); });
      }
    }, true).inject('ggb-glossari');
  };
  if (typeof GGBApplet !== 'undefined') { crea(); return; }
  // Pàgines sense applets (l'índex del curs) no carreguen deployggb.js: el carreguem ara
  var sc = document.createElement('script');
  sc.src = 'https://www.geogebra.org/apps/deployggb.js';
  sc.onload = crea;
  sc.onerror = function() {
    var m = panell.querySelector('.glossari-exemple-msg');
    if (m) { m.textContent = '⚠ No s\'ha pogut carregar GeoGebra: comprova la connexió.'; m.className = 'glossari-exemple-msg glossari-exemple-error'; }
  };
  document.head.appendChild(sc);
}

// Esborra la construcció, executa les línies (en català) i torna els números
// de les que GeoGebra no ha acceptat
function _executaExempleGlossari(api, linies, view) {
  try { api.newConstruction(); } catch (e) {}
  try { api.setPerspective('AG'); api.evalCommand('ShowAxes(true)'); api.evalCommand('ShowGrid(true)'); } catch (e) {}
  var errors = [];
  linies.forEach(function(l, i) {
    l = l.trim();
    if (!l) return;
    var ok = false;
    try { ok = api.evalCommand(tradueixOrdreGlossari(l)); } catch (e) { ok = false; }
    if (!ok) errors.push(i + 1);
  });
  // Una línia «nom=…» pot ser acceptada i desaparèixer després: per exemple, un
  // polígon posa nom als seus costats (f, g, h…) i una línia posterior «f=…»
  // el destrueix. Si un objecte amb nom no existeix al final, la línia és un error.
  linies.forEach(function(l, i) {
    var m = l.trim().match(/^([A-Za-zÀ-ÖØ-öø-ÿα-ω][A-Za-z0-9À-ÖØ-öø-ÿα-ω_']*)\s*(\([^)]*\))?\s*=/);
    if (!m || errors.indexOf(i + 1) !== -1) return;
    if (/^[xyz]$/.test(m[1])) return;          // x=3, y=2x+1: equacions, no noms
    try { if (!api.exists(m[1])) errors.push(i + 1); } catch (e) {}
  });
  errors.sort(function(a, b) { return a - b; });
  // Els lliscadors creats amb PuntLliscant(...) no surten a la vista gràfica si no es diu
  (api.getAllObjectNames('numeric') || []).forEach(function(n) {
    try { if (api.isMoveable(n)) api.setVisible(n, true); } catch (e) {}
  });
  _aplicaVista(api, { view: view });
  _vigilaTeclatGeoGebra(true);
  return errors;
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
