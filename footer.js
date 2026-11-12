// ════════════════════════════════════════════════════════
// footer.js — Peu de pàgina: autoria i llicència
//
// Còpia del fitxer comú de step-quiz-commons (fitxers/footer.js), amb el
// mateix text d'autoria i de llicència que els altres cursos de Step Quiz.
// Ggcat NO és a comuns.json per a aquest fitxer: no se sobreescriu sol. Si el
// text canvia a step-quiz-commons, cal copiar-lo aquí a mà. Diferències amb
// l'original: la configuració ja és escrita (classe 'ggcat-footer', no fix) i
// la lletra és la del curs (Space Mono, escala --fs-*).
// Llicència: vegeu LICENSE i LLICENCIA.md (contingut CC BY-NC-SA 4.0, codi MIT).
// ════════════════════════════════════════════════════════
(function () {
  // Mode embed (iframes): sense peu, per no saturar la interfície
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return;
  } catch (e) { /* ignore */ }

  var CLASSE = 'ggcat-footer';

  // Dins de curs/ o a l'arrel (Cloudflare serveix les pàgines amb o sense .html)
  var isCurs = window.location.pathname.indexOf('/curs/') !== -1;
  var root = isCurs ? '../' : '';

  var style = document.createElement('style');
  style.textContent = [
    '.' + CLASSE + ' {',
    '  flex-shrink: 0;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 6px;',
    '  padding: 6px 12px;',
    '  border-top: 1px solid var(--border, #ddd);',
    '  font-family: var(--mono, monospace);',
    '  font-size: var(--fs-xs, 0.6875rem);',
    '  color: var(--muted, #555);',
    '  text-align: center;',
    '  flex-wrap: wrap;',
    '  line-height: 1.4;',
    '  background: var(--bg, #fff);',
    '}',
    '.' + CLASSE + ' a { color: inherit; }'
  ].join('\n');
  document.head.appendChild(style);

  // El mateix text que el peu comú de step-quiz-commons
  var footer = document.createElement('footer');
  footer.className = CLASSE;
  footer.innerHTML =
    '<span>© 2026 <strong>David Arso Civil</strong> · INS Miquel Tarradell.</span>' +
    '<span>Contingut: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>' +
    ' · Codi: <a href="' + root + 'LICENSE" target="_blank" rel="noopener">llicència MIT</a></span>';

  document.body.appendChild(footer);
})();
