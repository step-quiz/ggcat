// ════════════════════════════════════════════════════════
// constants.js — Configuració central de GeoCat
//
// Namespace global: G (com P per a PyCat, K per a KarelCat)
// Cada mòdul afegeix les seves funcions a G.*
// ════════════════════════════════════════════════════════

const G = {};

// ── Claus de localStorage ────────────────────────────────
G.LS_KEY_LANG     = 'geocat_lang';
G.LS_KEY_THEME    = 'geocat-theme';
G.LS_KEY_PROGRESS = 'geocat_progress';

// ── Aplicació GeoGebra per defecte al simulador lliure ───
G.DEFAULT_APP = 'geometry';   // 'geometry' | 'graphing' | 'classic' | '3d' | 'suite'

// ── CDN de GeoGebra ──────────────────────────────────────
G.GEOGEBRA_CDN = 'https://www.geogebra.org/apps/deployggb.js';

// ── Helpers HTML ─────────────────────────────────────────
G.escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
