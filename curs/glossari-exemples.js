// ════════════════════════════════════════════════════════
// curs/glossari-exemples.js — Un exemple resolt per a cada paraula del glossari
//
// Cada <code> de les graelles del glossari (glossari-data.js) és un enllaç:
// obre aquest exemple dins la mateixa finestra, amb un applet de GeoGebra on
// l'alumne pot editar les ordres i tornar-les a executar (capitols.js,
// obreExempleGlossari). Els exemples són fets expressament per a cada paraula:
// cap no repeteix figures ni coordenades dels capítols o dels reptes.
//
// Clau: el text exacte del <code> del glossari. Camps:
//   codi  → ordres en català, una per línia (les que veu i edita l'alumne)
//   prova → què li proposem que canviï
//   view  → regió del pla que s'ha de veure: «xmin xmax ymin ymax»
//
// L'applet només entén els noms anglesos de les ordres quan s'executen des
// del codi (evalCommand): GLOSSARI_ORDRES els tradueix. Si s'afegeix un
// exemple amb una ordre nova, cal afegir-la a la taula (test-glossari.js ho
// comprova).
// ════════════════════════════════════════════════════════

// Català → anglès. Noms comprovats a l'applet en català (REPTES_SPECIFICATION.md,
// secció 6). L'ordre importa: els noms llargs abans dels que en són un prefix.
var GLOSSARI_ORDRES = [
  ['CircumferènciaInscrita', 'Incircle'],
  ['Circumferència',         'Circle'],
  ['PuntLliscant',           'Slider'],
  ['PuntMitjà',              'Midpoint'],
  ['Punt',                   'Point'],
  ['Semirecta',              'Ray'],
  ['Recta',                  'Line'],
  ['Segment',                'Segment'],
  ['Perpendicular',          'PerpendicularLine'],
  ['Mediatriu',              'PerpendicularBisector'],
  ['Bisectriu',              'AngleBisector'],
  ['Polígon',                'Polygon'],
  ['Distància',              'Distance'],
  ['Longitud',               'Length'],
  ['Angle',                  'Angle'],
  ['Àrea',                   'Area'],
  ['Perímetre',              'Perimeter'],
  ['Translació',             'Translate'],
  ['Rotació',                'Rotate'],
  ['Simetria',               'Reflect'],
  ['Homotècia',              'Dilate'],
  ['Intersecció',            'Intersect'],
  ['Arrel',                  'Root'],
  ['LlocGeomètric',          'Locus'],
  ['Seqüència',              'Sequence'],
  ['Vector',                 'Vector'],
  ['Tangent',                'Tangent'],
  ['Radi',                   'Radius'],
  ['Centre',                 'Center']
];

// Noms que no són ordres (no van seguits de parèntesi)
var GLOSSARI_NOMS = [['EixX', 'xAxis'], ['EixY', 'yAxis']];

// Una línia en català → la mateixa línia amb els noms anglesos
function tradueixOrdreGlossari(linia) {
  var lletra = 'A-Za-zÀ-ÖØ-öø-ÿ·_0-9';
  var out = linia;
  GLOSSARI_ORDRES.forEach(function(par) {
    var re = new RegExp('(^|[^' + lletra + '])' + par[0] + '(?=\\s*\\()', 'g');
    out = out.replace(re, '$1' + par[1]);
  });
  GLOSSARI_NOMS.forEach(function(par) {
    var re = new RegExp('(^|[^' + lletra + '])' + par[0] + '(?![' + lletra + '])', 'g');
    out = out.replace(re, '$1' + par[1]);
  });
  return out;
}

var GLOSSARI_EXEMPLES = {

  // ── Punts i coordenades ──
  'A=(3,2)': {
    codi: ['P=(4,1)', 'Q=(-2,3)'],
    prova: 'Canvia les coordenades de Q, per exemple <code>Q=(-3,-1)</code>, i prem ▶ Executa. També pots arrossegar els punts.',
    view: '-5 6 -3 5'
  },
  '(3,2)': {
    codi: ['(2,-1)', '(-3,2)'],
    prova: 'Afegeix una línia <code>(0,4)</code> i mira quin nom li posa GeoGebra.',
    view: '-5 5 -3 5'
  },
  'PuntMitjà(A,B)': {
    codi: ['R=(-3,1)', 'S=(5,3)', 'Segment(R,S)', 'M=PuntMitjà(R,S)'],
    prova: 'Canvia <code>S=(5,3)</code> per <code>S=(1,-3)</code>: M sempre queda al mig.',
    view: '-5 7 -4 5'
  },
  'Punt(s,0.5)': {
    codi: ['s=Segment((-2,0),(4,3))', 'P=Punt(s,0.5)', 'Q=Punt(s,0.25)'],
    prova: 'El segon número diu quina part del camí s\'ha recorregut: canvia 0.25 per 0.9.',
    view: '-4 6 -2 5'
  },

  // ── Rectes i segments ──
  'Segment(A,B)': {
    codi: ['K=(-2,-1)', 'L=(3,2)', 's=Segment(K,L)'],
    prova: 'A la columna de l\'esquerra hi ha la longitud de s. Mou K o L i mira com canvia.',
    view: '-4 5 -3 4'
  },
  'Recta(A,B)': {
    codi: ['K=(-1,-2)', 'L=(2,1)', 'r=Recta(K,L)'],
    prova: 'Una recta no s\'acaba: arrossega la vista i ho veuràs. Canvia L per <code>L=(2,-3)</code>.',
    view: '-5 5 -4 4'
  },
  'Semirecta(A,B)': {
    codi: ['O=(-3,-1)', 'D=(1,1)', 'Semirecta(O,D)'],
    prova: 'Comença a O i no s\'acaba mai cap a D. Canvia l\'ordre: <code>Semirecta(D,O)</code>.',
    view: '-5 5 -3 4'
  },
  'Perpendicular(A,f)': {
    codi: ['f=Recta((-4,-1),(4,2))', 'P=(1,3)', 'p=Perpendicular(P,f)'],
    prova: 'Mou P: la recta p sempre talla f fent un angle recte.',
    view: '-5 5 -3 5'
  },
  'Recta(A,f)': {
    codi: ['f=Recta((-4,0),(2,3))', 'P=(2,-2)', 'g=Recta(P,f)'],
    prova: 'g és paral·lela a f i passa per P. Prova <code>P=(-3,3)</code>.',
    view: '-5 5 -4 5'
  },
  'Mediatriu(A,B)': {
    codi: ['E=(-3,-1)', 'F=(3,2)', 'Segment(E,F)', 'm=Mediatriu(E,F)'],
    prova: 'Cada punt de m és a la mateixa distància d\'E que de F. Mou E o F.',
    view: '-5 5 -4 4'
  },

  // ── Circumferències ──
  'Circumferència(A,r)': {
    codi: ['C=(1,1)', 'c=Circumferència(C,2.5)'],
    prova: 'Canvia el radi 2.5 per 1 o per 4 (els decimals s\'escriuen amb punt).',
    view: '-5 6 -4 5'
  },
  'Circumferència(A,B)': {
    codi: ['C=(-1,0)', 'P=(2,2)', 'c=Circumferència(C,P)'],
    prova: 'El centre és C i passa per P. Arrossega P lluny del centre.',
    view: '-6 5 -5 5'
  },
  'Circumferència(A,B,C)': {
    codi: ['K=(-3,0)', 'L=(2,-1)', 'M=(1,3)', 'c=Circumferència(K,L,M)'],
    prova: 'Hi ha una sola circumferència que passa per tres punts. Mou-ne un.',
    view: '-5 5 -4 5'
  },
  'CircumferènciaInscrita(A,B,C)': {
    codi: ['K=(-3,-2)', 'L=(4,-2)', 'M=(0,3)', 'Polígon(K,L,M)', 'c=CircumferènciaInscrita(K,L,M)'],
    prova: 'Toca els tres costats per dins. Mou M i mira com s\'adapta.',
    view: '-5 6 -3 4'
  },

  // ── Polígons ──
  'Polígon(A,B,C)': {
    codi: ['K=(-2,-1)', 'L=(3,0)', 'M=(1,3)', 't=Polígon(K,L,M)'],
    prova: 'Al costat de t hi ha la seva àrea. Canvia <code>M=(1,3)</code> per <code>M=(1,5)</code>.',
    view: '-4 5 -2 5'
  },
  'Polígon(A,B,C,D)': {
    codi: ['K=(-3,-1)', 'L=(2,-2)', 'M=(3,2)', 'N=(-1,3)', 'q=Polígon(K,L,M,N)'],
    prova: 'Els vèrtexs s\'uneixen en l\'ordre en què els escrius. Prova <code>Polígon(K,M,L,N)</code>.',
    view: '-5 5 -3 4'
  },
  'Polígon(A,B,n)': {
    codi: ['K=(-1,-2)', 'L=(1,-2)', 'p=Polígon(K,L,7)'],
    prova: 'El 7 és el nombre de costats. Prova 3, 5 o 12.',
    view: '-5 5 -3 5'
  },

  // ── Mesures ──
  'Distància(A,B)': {
    codi: ['K=(-2,-1)', 'L=(2,2)', 'd=Distància(K,L)'],
    prova: 'd val 5 (un triangle 3-4-5!). Canvia <code>L=(4,7)</code>: quant val ara?',
    view: '-4 5 -3 4'
  },
  'Longitud(s)': {
    codi: ['s=Segment((-3,-2),(3,1))', 'l=Longitud(s)'],
    prova: 'Allarga el segment canviant (3,1) per (5,4).',
    view: '-5 6 -3 5'
  },
  'Angle(A,B,C)': {
    codi: ['K=(3,-1)', 'V=(-1,-1)', 'L=(1,2)', 'Segment(V,K)', 'Segment(V,L)', 'α=Angle(K,V,L)'],
    prova: 'El vèrtex és la lletra del mig. Si escrius <code>Angle(L,V,K)</code>, GeoGebra mesura l\'angle de l\'altra banda.',
    view: '-3 5 -3 3'
  },
  'Àrea(p)': {
    codi: ['t=Polígon((-2,-1),(3,-1),(1,3))', 'S=Àrea(t)'],
    prova: 'Base 5 i altura 4: àrea 10. Canvia (1,3) per (1,5).',
    view: '-4 5 -2 6'
  },
  'Perímetre(p)': {
    codi: ['q=Polígon((-2,-1),(2,-1),(2,2),(-2,2))', 'per=Perímetre(q)'],
    prova: 'Un rectangle de 4 per 3: 4 + 3 + 4 + 3 = 14. Fes-lo de 5 per 3.',
    view: '-4 5 -2 3'
  },

  // ── Construccions clàssiques ──
  'Bisectriu(f,g)': {
    codi: ['f=Recta((0,0),(4,1))', 'g=Recta((0,0),(1,3))', 'Bisectriu(f,g)'],
    prova: 'Dues rectes que es tallen fan quatre angles: per això surten dues bisectrius. Canvia g.',
    view: '-4 4 -3 3'
  },

  // ── Transformacions ──
  'Translació(obj,v)': {
    codi: ['t=Polígon((-4,-1),(-2,-1),(-3,1))', 'v=Vector((0,0),(5,2))', 'Translació(t,v)'],
    prova: 'Tots els punts es mouen igual que la fletxa v. Prova <code>v=Vector((0,0),(2,-3))</code>.',
    view: '-5 4 -4 4'
  },
  'Rotació(obj,α,A)': {
    codi: ['t=Polígon((1,0),(3,0),(3,1))', 'O=(0,0)', 'Rotació(t,90°,O)'],
    prova: 'Gira en sentit antihorari. Prova 45°, 180° o -90°.',
    view: '-4 4 -3 4'
  },
  'Simetria(obj,f)': {
    // f primer: el polígon posa nom als seus costats (f, g, h…) i un f posterior el destruiria
    codi: ['f=Recta((-4,1.5),(4,1.5))', 't=Polígon((-2,-2),(1,-2),(0,0.5))', 'Simetria(t,f)'],
    prova: 'f fa de mirall. Canvia la primera línia per <code>f=Recta((0,-3),(1,3))</code>.',
    view: '-4 4 -3 5'
  },
  'Homotècia(obj,k,A)': {
    codi: ['t=Polígon((1,0),(2,0),(1,1))', 'O=(-1,-1)', 'Homotècia(t,2,O)'],
    prova: 'El 2 duplica les distàncies des d\'O. Prova 3, 0.5 o -1.',
    view: '-3 6 -2 4'
  },

  // ── Funcions i gràfiques ──
  'f(x)=x^2-3': {
    codi: ['f(x)=x^2-3'],
    prova: 'El -3 baixa la paràbola. Prova <code>f(x)=x^2+1</code> o <code>f(x)=-x^2-3</code>.',
    view: '-5 5 -4 5'
  },
  'f(x)=2x+1': {
    codi: ['f(x)=2x+1'],
    prova: 'El 2 és el pendent i l\'1, on talla l\'eix Y. Prova <code>f(x)=-x+3</code>.',
    view: '-5 5 -4 5'
  },
  'Intersecció(f,g)': {
    codi: ['f(x)=x^2-2x', 'g(x)=x', 'Intersecció(f,g)'],
    prova: 'Es tallen a (0, 0) i (3, 3). Canvia g per <code>g(x)=-1</code>: quants punts hi ha?',
    view: '-3 5 -2 5'
  },
  'Intersecció(f,EixX)': {
    codi: ['f(x)=x^2-x-2', 'Intersecció(f,EixX)'],
    prova: 'Són els zeros de f: x = −1 i x = 2. Prova <code>f(x)=x^2-4x+3</code>.',
    view: '-4 5 -3 4'
  },
  'Arrel(f,a,b)': {
    codi: ['f(x)=x^3-3x', 'Z=Arrel(f,1,3)'],
    prova: 'f té tres zeros, però només en busquem un entre 1 i 3. Prova <code>Arrel(f,-3,-1)</code>.',
    view: '-4 4 -3 3'
  },

  // ── Lliscadors i dinàmica ──
  'PuntLliscant(min,max,pas)': {
    codi: ['a=PuntLliscant(1,4,0.5)', 'c=Circumferència((0,0),a)'],
    prova: 'Arrossega el punt del lliscador a: el radi canvia de 0.5 en 0.5, entre 1 i 4.',
    view: '-5 5 -4 4'
  },
  'LlocGeomètric(B,A)': {
    codi: ['c=Circumferència((0,0),2)', 'A=Punt(c)', 'Q=(4,0)', 'M=PuntMitjà(A,Q)', 'LlocGeomètric(M,A)'],
    prova: 'Quan A dona la volta, M dibuixa una altra circumferència, la meitat de gran. Canvia Q.',
    view: '-3 5 -3 3'
  },
  'Seqüència(exp,var,i,f)': {
    codi: ['Seqüència(Circumferència((0,0),k),k,1,4)'],
    prova: 'Una circumferència per a cada k de 1 a 4. Prova de 1 a 8, o <code>Seqüència((k,k^2/4),k,-4,4)</code>.',
    view: '-5 5 -4 4'
  },

  // ── Termes geomètrics ──
  'punt': {
    codi: ['P=(2,1)'],
    prova: 'Un punt només té posició. Arrossega P o escriu <code>P=(-1,3)</code>.',
    view: '-4 4 -3 3'
  },
  'recta': {
    codi: ['Recta((-3,-1),(2,2))'],
    prova: 'Arrossega la vista: la recta no s\'acaba mai.',
    view: '-5 5 -3 3'
  },
  'segment': {
    codi: ['K=(-3,1)', 'L=(2,-1)', 'Segment(K,L)'],
    prova: 'Un segment té dos extrems i una longitud. Mou K o L.',
    view: '-4 4 -3 3'
  },
  'circumferència': {
    codi: ['C=(0,1)', 'c=Circumferència(C,2)', 'P=Punt(c)'],
    prova: 'Arrossega P: sempre és a 2 unitats del centre C.',
    view: '-4 4 -2 4'
  },
  'radi': {
    codi: ['C=(-1,0)', 'c=Circumferència(C,3)', 'P=Punt(c)', 'r=Segment(C,P)'],
    prova: 'Mou P per la circumferència: el radi r sempre mesura 3.',
    view: '-5 3 -4 4'
  },
  'diàmetre': {
    codi: ['c=Circumferència((0,0),2)', 'P=Punt(c)', 'Q=Rotació(P,180°,(0,0))', 'd=Segment(P,Q)'],
    prova: 'El diàmetre passa pel centre i fa el doble del radi: 4. Mou P.',
    view: '-4 4 -3 3'
  },
  'mediatriu': {
    codi: ['K=(-2,2)', 'L=(3,-1)', 'Segment(K,L)', 'm=Mediatriu(K,L)', 'P=Punt(m)', 'Segment(P,K)', 'Segment(P,L)'],
    prova: 'Mou P per la mediatriu: els dos segments fan sempre el mateix.',
    view: '-4 5 -3 4'
  },
  'bisectriu': {
    codi: ['K=(4,0)', 'V=(0,0)', 'L=(1,3)', 'Semirecta(V,K)', 'Semirecta(V,L)', 'Bisectriu(K,V,L)'],
    prova: 'Parteix l\'angle en dues meitats iguals. Mou L.',
    view: '-2 5 -2 4'
  },
  'polígon': {
    codi: ['Polígon((-3,-1),(0,-2),(3,0),(2,3),(-2,2))'],
    prova: 'Aquest té 5 costats: és un pentàgon (no regular). Afegeix-hi un punt més.',
    view: '-4 4 -3 4'
  },
  'triangle': {
    codi: ['Polígon((-2,-1),(3,-1),(-1,2))'],
    prova: 'Tres vèrtexs, tres costats. Canvia (-1,2) per (3,2): ara és rectangle.',
    view: '-3 4 -2 3'
  },
  'quadrilàter': {
    codi: ['Polígon((-3,-1),(2,-1),(3,2),(-2,2))'],
    prova: 'Aquest té els costats paral·lels dos a dos: és un paral·lelogram.',
    view: '-4 4 -2 3'
  },
  'translació': {
    codi: ['P=(-3,1)', 'v=Vector((0,0),(4,-2))', 'Translació(P,v)'],
    prova: 'El punt es mou exactament com indica v. Canvia el vector.',
    view: '-4 4 -3 3'
  },
  'rotació': {
    codi: ['P=(3,0)', 'C=(0,0)', 'Rotació(P,60°,C)', 'Rotació(P,120°,C)'],
    prova: 'Els punts girats són a la mateixa distància del centre C. Prova 90° i 270°.',
    view: '-4 4 -2 4'
  },
  'reflexió': {
    codi: ['f=Recta((0,-3),(0,3))', 'P=(2,1)', 'Simetria(P,f)'],
    prova: 'La imatge és a l\'altra banda del mirall f, a la mateixa distància. Mou P.',
    view: '-4 4 -3 3'
  },
  'lloc geomètric': {
    codi: ['K=(-2,0)', 'c=Circumferència((1,0),3)', 'P=Punt(c)', 'M=PuntMitjà(K,P)', 'LlocGeomètric(M,P)'],
    prova: 'El lloc és tot el camí que fa M quan P dona la volta. Mou K.',
    view: '-3 4 -3 3'
  }
};
