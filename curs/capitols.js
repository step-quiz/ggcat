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
  { num: 1,  titol: 'Triangle des de zero',       arxiu: 'repte-1.html',  goalId: 'repte-1',  dificultat: 'facil'  },
  { num: 2,  titol: 'Segment de longitud exacta', arxiu: 'repte-2.html',  goalId: 'repte-2',  dificultat: 'facil'  },
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


// ── Taula de validators hardcodejats per repte ───────────────
// Aquests overrides s'apliquen en lloc del data-check de l'HTML.
// Útil quan l'HTML del servidor no s'actualitza correctament.

var VALIDATOR_OVERRIDES = {
  'repte-7': function(api) {
    // Triangle equilàter + 3 angles de 60°
    // Polígon: segs.length >= 3 amb longituds iguals
    // Angles: getObjectType retorna 'angle', getValue en radians → π/3
    var segs = api.getAllObjectNames('segment') || [];
    if (segs.length < 3) return false;
    // Tots els costats han de ser iguals (equilàter)
    var lens = [];
    for (var i = 0; i < segs.length; i++) {
      try { var l = api.getValue('Length(' + segs[i] + ')'); if (isFinite(l) && l > 0) lens.push(l); } catch(e) {}
    }
    if (lens.length < 3) return false;
    lens.sort(function(a,b){return a-b;});
    var equalSides = Math.abs(lens[0] - lens[lens.length-1]) < 0.15;
    if (!equalSides) return false;
    // Angles: busquem objectes de tipus 'angle' amb valor ≈ π/3
    var n = api.getObjectNumber ? api.getObjectNumber() : 0;
    var count60 = 0;
    for (var j = 0; j < n; j++) {
      var nm = api.getObjectName(j);
      if (!nm) continue;
      var t = '';
      try { t = (api.getObjectType(nm) || '').toLowerCase(); } catch(e) {}
      if (!t.includes('angle')) continue;
      try {
        var v = api.getValue(nm);
        // GeoGebra pot retornar en radians o graus segons configuració
        var deg = (v > Math.PI) ? v : v * 180 / Math.PI;
        if (Math.abs(deg - 60) < 1.5) count60++;
      } catch(e) {}
    }
    return count60 >= 3;
  },
  'repte-8': function(api) {
    // Perpendicular a f per P=(3,4) + peu de la perpendicular
    // f passa per (0,0) i (4,1). Peu ≈ (3.765, 0.941)
    var footX = 64/17, footY = 16/17; // ≈ 3.765, 0.941
    var tol = 0.2;
    // 1) Ha d'existir almenys una línia més a part de f
    var hasPerp = false;
    var n = api.getObjectNumber ? api.getObjectNumber() : 0;
    for (var i = 0; i < n; i++) {
      var nm = api.getObjectName(i);
      if (!nm || nm === 'f') continue;
      var t = '';
      try { t = (api.getObjectType(nm) || '').toLowerCase(); } catch(e) {}
      if (t.includes('line')) { hasPerp = true; break; }
    }
    // 2) Ha d'existir un punt al peu de la perpendicular (≈ 3.765, 0.941)
    var pts = api.getAllObjectNames('point') || [];
    var hasFoot = false;
    for (var j = 0; j < pts.length; j++) {
      var p = pts[j];
      if (p === 'P') continue;
      var x = api.getXcoord(p), y = api.getYcoord(p);
      if (Math.abs(x - footX) < tol && Math.abs(y - footY) < tol) { hasFoot = true; break; }
    }
    return hasPerp && hasFoot;
  },
  'repte-5': function(api) {
    var tol = 0.15;
    var pts  = api.getAllObjectNames('point')   || [];
    var segs = api.getAllObjectNames('segment') || [];
    // Necessitem: punt a (0,0), punt a (3,0), i 4 segments de longitud 3
    var hasOrigin = false, has30 = false;
    for (var i = 0; i < pts.length; i++) {
      var x = api.getXcoord(pts[i]), y = api.getYcoord(pts[i]);
      if (Math.abs(x) < tol && Math.abs(y) < tol) hasOrigin = true;
      if (Math.abs(x - 3) < tol && Math.abs(y) < tol) has30 = true;
    }
    var sides3 = 0;
    for (var j = 0; j < segs.length; j++) {
      try {
        var len = api.getValue('Length(' + segs[j] + ')');
        if (isFinite(len) && Math.abs(len - 3) < tol) sides3++;
      } catch(e) {}
    }
    return hasOrigin && has30 && sides3 >= 4;
  },
  'repte-6': function(api) {
    var tol = 0.15;
    // 1) Ha d'existir almenys una línia (la mediatriu). No hi ha línies pre-construïdes.
    var hasMedb = false;
    var n = api.getObjectNumber ? api.getObjectNumber() : 0;
    for (var i = 0; i < n; i++) {
      var nm = api.getObjectName(i);
      if (!nm) continue;
      var t = '';
      try { t = (api.getObjectType(nm) || '').toLowerCase(); } catch(e) {}
      if (t.includes('line')) { hasMedb = true; break; }
    }
    // 2) Ha d'existir un punt a x≈0 que no sigui A ni B (la intersecció amb l'eix Y)
    var pts = api.getAllObjectNames('point') || [];
    var hasYint = false;
    for (var j = 0; j < pts.length; j++) {
      var p = pts[j];
      if (p === 'A' || p === 'B') continue;
      if (Math.abs(api.getXcoord(p)) < tol) { hasYint = true; break; }
    }
    return hasMedb && hasYint;
  },
  'repte-1': function(api) {
    var tol = 0.15;
    var pts = api.getAllObjectNames('point') || [];
    var segs = api.getAllObjectNames('segment') || [];
    var hasA = false, hasB = false, hasC = false;
    for (var i = 0; i < pts.length; i++) {
      var x = api.getXcoord(pts[i]), y = api.getYcoord(pts[i]);
      if (Math.abs(x + 2) < tol && Math.abs(y + 1) < tol) hasA = true;
      if (Math.abs(x - 4) < tol && Math.abs(y + 1) < tol) hasB = true;
      if (Math.abs(x - 1) < tol && Math.abs(y - 4) < tol) hasC = true;
    }
    return hasA && hasB && hasC && segs.length >= 3;
  },
  'repte-2': function(api) {
    var tol = 0.15;
    var segs = api.getAllObjectNames('segment') || [];
    for (var i = 0; i < segs.length; i++) {
      try {
        var len = api.getValue('Length(' + segs[i] + ')');
        var mx  = api.getValue('x(Midpoint(' + segs[i] + '))');
        if (isFinite(len) && isFinite(mx) && Math.abs(len - 5) < tol && Math.abs(mx) < tol) return true;
      } catch(e) {}
    }
    return false;
  },
  'repte-3': function(api) {
    var tol = 0.15;
    var found2 = false, found4 = false;
    var n = api.getObjectNumber ? api.getObjectNumber() : 0;
    for (var i = 0; i < n; i++) {
      var nm = api.getObjectName(i);
      if (!nm) continue;
      try {
        var r  = api.getValue('Radius(' + nm + ')');
        if (!isFinite(r) || r <= 0) continue;
        var cx = api.getValue('x(Center(' + nm + '))');
        var cy = api.getValue('y(Center(' + nm + '))');
        if (Math.abs(cx) < tol && Math.abs(cy) < tol) {
          if (Math.abs(r - 2) < tol) found2 = true;
          if (Math.abs(r - 4) < tol) found4 = true;
        }
      } catch(e) {}
    }
    return found2 && found4;
  },
  'repte-4': function(api) {
    var tol = 0.15;
    var pts  = api.getAllObjectNames('point')   || [];
    var segs = api.getAllObjectNames('segment') || [];
    var hasA = false, hasB = false, hasC = false;
    for (var i = 0; i < pts.length; i++) {
      var x = api.getXcoord(pts[i]), y = api.getYcoord(pts[i]);
      if (Math.abs(x)     < tol && Math.abs(y)     < tol) hasA = true;
      if (Math.abs(x - 6) < tol && Math.abs(y)     < tol) hasB = true;
      if (Math.abs(x - 3) < tol && Math.abs(y - 4) < tol) hasC = true;
    }
    // Requerim un objecte numèric EXPLÍCIT amb valor 12 (ex: d=Àrea(tri1))
    // Excloem els polígons/triangles perquè el seu valor ja és l'àrea per defecte
    var hasArea = false;
    var n = api.getObjectNumber ? api.getObjectNumber() : 0;
    for (var j = 0; j < n; j++) {
      var nm = api.getObjectName(j);
      if (!nm) continue;
      var t = '';
      try { t = (api.getObjectType(nm) || '').toLowerCase(); } catch(e) {}
      if (t.includes('polygon') || t.includes('triangle')) continue;
      try { var v = api.getValue(nm); if (isFinite(v) && Math.abs(v - 12) < 0.3) hasArea = true; } catch(e) {}
    }
    return hasA && hasB && hasC && segs.length >= 3 && hasArea;
  }
};



//
// VERSIÓ SIMPLIFICADA — patró idèntic a experiment_geogebra.html
//
// Requisit: <script src="https://www.geogebra.org/apps/deployggb.js">
//           carregat síncronament al <head> de cada pàgina HTML.
//
// Això garanteix que GGBApplet existeix quan renderSimuladors() s'executa.
// Sense càrrega dinàmica, sense cues, sense IntersectionObserver.

var _ggbWidgetCount = 0;


function renderSimuladors() {
  var divs = document.querySelectorAll('.geogebra');
  if (divs.length === 0) return;

  // ── Llegim data-attributes de cada div ──

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
      div: div, id: id, commands: commands, fixed: fixed,
      readonly:  div.getAttribute('data-readonly') === 'true',
      goalId:    div.getAttribute('data-goal-id') || '',
      app:       div.getAttribute('data-app') || '',
      tools:     div.getAttribute('data-tools') || '',
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
        (cfg.validator || VALIDATOR_OVERRIDES[cfg.goalId]
          ? '<button class="ggb-btn ggb-btn-check" type="button">✓ Comprova</button>'
          : '') +
        '<button class="ggb-btn ggb-btn-reset" type="button">↺ Reinicia</button>';
      wrapper.appendChild(tb);

      if (cfg.validator || VALIDATOR_OVERRIDES[cfg.goalId]) {
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

              // ── DEBUG MODE — obre F12 > Console per veure aquesta informació ──
              try {
                var goalLabel = cfg.goalId || 'sense-id';
                console.group('[GeoCat DEBUG] ' + goalLabel);
                console.log('getAllObjectNames point   :', api.getAllObjectNames('point'));
                console.log('getAllObjectNames segment :', api.getAllObjectNames('segment'));
                console.log('getAllObjectNames polygon :', api.getAllObjectNames('polygon'));
                console.log('getAllObjectNames conic   :', api.getAllObjectNames('conic'));
                console.log('getAllObjectNames numeric :', api.getAllObjectNames('numeric'));
                console.log('getObjectNumber          :', api.getObjectNumber ? api.getObjectNumber() : 'N/A');
                var n = api.getObjectNumber ? api.getObjectNumber() : 0;
                for (var _i = 0; _i < n; _i++) {
                  var _nm = api.getObjectName(_i);
                  var _type = (api.getObjectType && _nm) ? api.getObjectType(_nm) : '?';
                  var _x = '?', _y = '?'; try { if(_nm){_x=api.getXcoord(_nm);_y=api.getYcoord(_nm);} } catch(_xe){}
                  var _val = '?';
                  try { _val = api.getValue(_nm); } catch(_e) { _val = 'ERR'; }
                  console.log('  obj[' + _i + '] name=' + _nm + ' type=' + _type + ' x=' + _x + ' y=' + _y + ' val=' + _val);
                }
                try { console.log('xmin/xmax:', api.getXmin(), '/', api.getXmax()); } catch(e) { console.log('xmin/xmax: N/A'); }
                console.groupEnd();
              } catch(_dbgErr) { console.warn('[GeoCat DEBUG] error:', _dbgErr); }
              // ── FI DEBUG ──

              var ok = false;
              var validatorFn = VALIDATOR_OVERRIDES[cfg.goalId] || cfg.validator;
              console.log('[GeoCat] goalId:', cfg.goalId, '| using override:', !!VALIDATOR_OVERRIDES[cfg.goalId]);
              try { ok = !!validatorFn(api, GVref); } catch(e) { console.warn('[GeoCat] validator error:', e); }
              console.log('[GeoCat] validator result:', ok);
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
    cfg.div.replaceWith(wrapper);
  });

  // ── Carrega GV si cal ──
  if (entries.some(function(e) { return !!e.validator; })) {
    var gvScript = document.createElement('script');
    gvScript.src = '../js/geovalidator.js';
    document.head.appendChild(gvScript);
  }

  // ══════════════════════════════════════════════════════════
  // INJECCIÓ — Patró IDÈNTIC a experiment_geogebra.html
  //
  // experiment_geogebra.html fa exactament això i FUNCIONA:
  //   new GGBApplet(params, true).inject("ggb1");
  //
  // deployggb.js ja està carregat al <head> (síncron).
  // GGBApplet EXISTEIX aquí, garantit.
  // ══════════════════════════════════════════════════════════

  var H;

  entries.forEach(function(cfg) {
    H = Math.round((parseInt(cfg.height, 10) || 420) * 1.1);

    var wrapper = document.getElementById(cfg.id).parentElement;
    // Llegim l'amplada real del contenidor en el moment d'injectar,
    // així el canvas ocupa tota l'amplada disponible (no 640px fix).
    var W = document.getElementById(cfg.id).offsetWidth || 640;

    new GGBApplet({
      appName:             cfg.app || 'classic',
      width:               W,
      height:              H,
      showToolBar:         !cfg.readonly,
      showAlgebraInput:    !cfg.readonly,
      showMenuBar:         false,
      enableRightClick:    !cfg.readonly,
      enableLabelDrags:    !cfg.readonly,
      enableShiftDragZoom: true,
      showKeyboardOnFocus: false,
      language:            'ca',
      id:                  cfg.id,
      appletOnLoad: function(api) {
        console.log('[GeoCat] ✓ Applet ' + cfg.id + ' carregat OK');
        wrapper._ggbApi = api;

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

        // Badge
        var badge = wrapper.querySelector('.ggb-badge');
        if (badge) { badge.textContent = 'llest'; badge.className = 'ggb-badge ggb-ready'; }

        // ── Reset de la validació quan l'usuari modifica la construcció ──
        // Si el badge és ggb-ok o ggb-ko i l'usuari canvia qualsevol objecte,
        // tornem a l'estat "llest" per evitar mostrar un "Correcte" obsolet.
        if (cfg.validator || VALIDATOR_OVERRIDES[cfg.goalId]) {
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
        }
      }
    }, true).inject(cfg.id);
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
