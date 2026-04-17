// ════════════════════════════════════════════════════════
// kbd-accessory.js — Teclat virtual per a mòbils (GeoCat)
//
// Mostra una barra fixa amb tecles GeoGebra útils quan
// el camp d'entrada de comandes té el focus en un dispositiu
// tàctil. S'amaga en mode embed.
//
// Adaptat de PyCat: eliminades tecles Python (def, for, True…),
// afegides tecles GeoGebra: =, (, ), *, /, ,, √, π, °
// ════════════════════════════════════════════════════════

(function() {

  // ── Detecció de dispositiu tàctil ──────────────────────
  var isTouch = ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  if (!isTouch) return;

  // ── No mostrar en mode embed ───────────────────────────
  if (document.body.classList.contains('embed')) return;

  // ── Tecles disponibles ─────────────────────────────────
  // Agrupades visualment amb separadors (null = separador)
  // Mode A — comandes GeoGebra
  var KEYS = [
    '=', '(', ')',
    null,
    '*', '/', '^',
    null,
    ',', '.', '_',
    null,
    '√', 'π', '°',
    null,
    '<', '>',
  ];

  // ── Crea el DOM ────────────────────────────────────────
  var bar = document.createElement('div');
  bar.className = 'kbd-bar';
  bar.id = 'kbd-bar';
  bar.setAttribute('aria-label', 'Tecles ràpides GeoGebra');

  var scroll = document.createElement('div');
  scroll.className = 'kbd-scroll';

  for (var i = 0; i < KEYS.length; i++) {
    var k = KEYS[i];
    if (k === null) {
      var sep = document.createElement('span');
      sep.className = 'kbd-sep';
      scroll.appendChild(sep);
      continue;
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kbd-key';
    btn.textContent = k;
    btn.setAttribute('data-char', k);
    btn.setAttribute('aria-label', 'Insereix ' + k);
    // Prevé que el botó prengui el focus (tancaria el teclat del sistema)
    btn.addEventListener('mousedown', _preventDefault);
    btn.addEventListener('touchstart', _preventDefault);
    btn.addEventListener('pointerdown', _preventDefault);
    btn.addEventListener('click', _onKeyClick);
    scroll.appendChild(btn);
  }

  bar.appendChild(scroll);
  document.body.appendChild(bar);

  // ── Mostra/amaga quan el camp d'entrada té/perd el focus ─
  // GeoGebra usa un textarea/input intern que no és accessible
  // directament. El kbd-bar s'activa des d'un input visible
  // quan n'hi ha (ex: camp de comandes personalitzat).
  // Per compatibilitat futura, s'exposa G.kbdBar per activar-lo.
  var _activeInput = null;

  function _attachToInput(input) {
    if (!input) return;
    _activeInput = input;
    input.addEventListener('focus', function() {
      bar.classList.add('visible');
      document.body.classList.add('kbd-active');
    });
    input.addEventListener('blur', function() {
      setTimeout(function() {
        if (document.activeElement !== input) {
          bar.classList.remove('visible');
          document.body.classList.remove('kbd-active');
        }
      }, 150);
    });
  }

  // Intent d'attachar a un input#geo-cmd si existeix a la pàgina
  var geoCmd = document.getElementById('geo-cmd');
  if (geoCmd) _attachToInput(geoCmd);

  // ── Handlers ───────────────────────────────────────────

  function _preventDefault(e) {
    e.preventDefault();
  }

  function _onKeyClick(e) {
    var ch = e.currentTarget.getAttribute('data-char');
    if (!ch || !_activeInput) return;

    var start = _activeInput.selectionStart;
    var end   = _activeInput.selectionEnd;

    _activeInput.value =
      _activeInput.value.substring(0, start) + ch +
      _activeInput.value.substring(end);
    _activeInput.selectionStart = _activeInput.selectionEnd = start + ch.length;

    _activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    _activeInput.focus();
  }

  // ── API pública ────────────────────────────────────────
  // Permet a geomain.js connectar un input dinàmicament
  if (typeof G !== 'undefined') {
    G.kbdBar = {
      attach: _attachToInput,
      show:   function() { bar.classList.add('visible'); document.body.classList.add('kbd-active'); },
      hide:   function() { bar.classList.remove('visible'); document.body.classList.remove('kbd-active'); },
    };
  }

})();
