// data.js — Nuova Area Trading ABTG. Plain JS, sets window globals.

window.BRAND = {
  saffron: '#EF7B10',
  jade: '#009C4E',
  onyx: '#2C2E38',
  white: '#FFFFFF',
};

// Distinct, harmonious color per path — soft tint + ink shade derived from each.
(function () {
  const hx = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
  const toHex = a => '#' + a.map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  const mix = (hex, t, amt) => { const c = hx(hex); return toHex(c.map((v, i) => v + (t[i] - v) * amt)); };
  const WHITE = [255, 255, 255], DARK = [22, 24, 32];
  const RAW = {
    forex:     ['Forex', '#EF7B10'],
    commodity: ['Commodity', '#1F9E55'],
    opzioni:   ['Opzioni', '#2D6CB5'],
    cripto:    ['Cripto', '#B8862A', true],
    etf:       ['ETF', '#11A0A6'],
    flipping:  ['Flipping', '#D6494E'],
    aste:      ['Aste', '#7E57C2'],
    stralci:   ['Stralci', '#9C6FD9'],
    affitti:   ['Affitti', '#17A697'],
  };
  const P = {};
  for (const id in RAW) {
    const [label, color, warning] = RAW[id];
    P[id] = { id, label, color, soft: mix(color, WHITE, 0.88), ink: mix(color, DARK, 0.60), warning: !!warning };
  }
  window.PATHS = P;
})();

window.SPINE_SHARED = [
  {
    id: 'lead',
    kind: 'spine',
    title: 'Lead',
    badge: '00',
    summary: 'Pubblico in ingresso da acquisizione e marketing.',
    details: [
      'Punto di partenza del funnel.',
      'Alimenta la Wake Up Call.',
    ],
  },
  {
    id: 'wakeup',
    kind: 'spine',
    title: 'Wake Up Call',
    badge: '01',
    summary: 'Primo contatto. Da qui il lead sceglie l\'area di formazione.',
    details: [
      'Evento d\'ingresso che crea consapevolezza e motivazione.',
      'Indirizza verso una delle due aree: Trading o Immobili.',
    ],
  },
];

window.SPINE_TRADING = [
  {
    id: 'starter',
    kind: 'spine',
    title: 'Forex Starter Program',
    sub: 'Risultati in 3 mesi · durata prodotto 12 mesi',
    badge: '02',
    accent: 'forex',
    highlight: true,
    summary: 'L\'unico punto di ingresso. Porta il cliente rapidamente alla prima operazione.',
    details: [
      '4–5 video preparatori',
      'Setup piattaforma',
      'Setup conto demo',
      'Introduzione strategia Breaking Band',
      'Nessuna teoria inutile',
    ],
    extra: { label: '+ 2 LIVE a settimana', value: 'con Leonardo' },
  },
  {
    id: 'assessment',
    kind: 'spine',
    title: 'Assessment Finale',
    sub: 'Call 1-to-1 con Buddy',
    badge: '03',
    accent: 'commodity',
    summary: 'Tappa obbligatoria dopo 3 mesi. Profila il trader e prescrive il percorso.',
    details: [
      'Call 1-to-1 con Buddy',
      'Analisi risultati',
      'Profilazione trader',
      'Prescrizione percorso successivo',
    ],
    note: 'Momento commerciale naturale',
  },
];

window.SPINE_IMMOBILI = [
  {
    id: 'imm-starter',
    kind: 'spine',
    title: 'Immobili Starter Program',
    sub: 'Percorso di 3 mesi · durata prodotto 12 mesi',
    badge: '02',
    accent: 'flipping',
    highlight: true,
    summary: 'Punto di ingresso all\'immobiliare. Percorso equivalente, porta rapidamente all\'operatività.',
    details: [
      'Fondamenti dell\'investimento immobiliare',
      'Setup operativo',
      'Prime strategie',
      'Nessuna teoria inutile',
    ],
    extra: { label: '+ 2 LIVE a settimana', value: 'in diretta' },
  },
  {
    id: 'imm-assessment',
    kind: 'spine',
    title: 'Assessment Finale',
    sub: 'Call 1-to-1 con Buddy',
    badge: '03',
    accent: 'aste',
    summary: 'Tappa obbligatoria. Profila l\'investitore e prescrive la strategia.',
    details: [
      'Call 1-to-1 con Buddy',
      'Analisi obiettivi',
      'Profilazione investitore',
      'Prescrizione percorso successivo',
    ],
    note: 'Momento commerciale naturale',
  },
];

window.BRANCHES = [
  {
    path: 'forex',
    title: 'Rimane nel Forex',
    steps: [
      { title: 'Evento Forex', detail: 'Evento dedicato sul mercato d\'ingresso.' },
      { title: 'Group Coaching Forex', detail: 'Continua sul mercato d\'ingresso in gruppo.' },
      { title: 'Forex Trading Diary', detail: 'Disciplina e tracciamento delle operazioni.' },
    ],
  },
  {
    path: 'commodity',
    title: 'Si interessa alle Commodity',
    steps: [
      { title: 'Evento Commodity', detail: 'Evento dedicato di scoperta del mercato.' },
      { title: 'Group Coaching', detail: 'Approfondimento guidato in gruppo.' },
      { title: 'Commodity Trading Diary', detail: 'Tracciamento operazioni dedicato.' },
    ],
  },
  {
    path: 'opzioni',
    title: 'Si interessa alle Opzioni',
    steps: [
      { title: 'Evento Opzioni', detail: 'Evento dedicato di scoperta del mercato.' },
      { title: 'Group Coaching', detail: 'Approfondimento guidato in gruppo.' },
      { title: 'Trading Diary', detail: 'Tracciamento operazioni dedicato.' },
    ],
  },
  {
    path: 'cripto',
    title: 'Si interessa alle Cripto',
    warning: true,
    steps: [
      { title: 'Evento Cripto', detail: 'Evento dedicato di scoperta del mercato.' },
      { title: 'Crypto Group Coaching', detail: 'Ipotesi con Andrea Garagiola — in valutazione.', hypothesis: true },
      { title: 'Crypto Trading Diary', detail: 'Percepito poco sostenibile e troppo legato al momento di mercato.', struck: true },
    ],
  },
  {
    path: 'etf',
    title: 'Si interessa agli ETF',
    steps: [
      { title: 'Evento ETF', detail: 'Evento dedicato di scoperta del mercato.' },
      { title: 'Group Coaching', detail: 'Approfondimento guidato in gruppo.' },
      { title: 'ETF Trading Diary', detail: 'Non ancora disponibile.', struck: true, strikeTag: 'non esiste' },
    ],
  },
];

window.CAMP = {
  title: 'Trading Camp',
  sub: 'Acceleratore — non acquisizione',
  summary: 'Evento avanzato per chi è già nel percorso.',
  details: ['Community', 'Networking', 'Diversificazione', 'Scoperta di altri mercati'],
  outcome: 'Community + Diversificazione',
};

window.BRANCHES_IMMOBILI = [
  {
    path: 'flipping',
    title: 'Resta sul mercato libero',
    steps: [
      { title: 'Evento Flipping Advance', detail: 'Coaching privato sul mercato libero.' },
      { title: 'Evento dedicato', detail: 'DA STRUTTURARE' },
      { title: 'Deal Diary', detail: 'Tracciamento operazioni.' },
    ],
  },
  {
    path: 'aste',
    title: 'Si specializza nelle Aste',
    steps: [
      { title: 'Evento Aste Power', detail: 'Percorso di specializzazione sull\'asta.' },
      { title: 'Evento dedicato', detail: 'DA STRUTTURARE' },
      { title: 'Deal Diary', detail: 'Tracciamento operazioni.' },
    ],
  },
  {
    path: 'stralci',
    title: 'Si specializza negli Stralci',
    steps: [
      { title: 'Evento Stralci Advance', detail: 'Saldo e stralcio, alta marginalità.' },
      { title: 'Evento dedicato', detail: 'DA STRUTTURARE' },
      { title: 'Deal Diary', detail: 'Tracciamento operazioni.' },
    ],
  },
  {
    path: 'affitti',
    title: 'Si specializza negli Affitti',
    steps: [
      { title: 'Evento Rent Advance', detail: 'Rent to rent, property, affitti lunghi.' },
      { title: 'Evento dedicato', detail: 'DA STRUTTURARE' },
      { title: 'Deal Diary', detail: 'Tracciamento operazioni.' },
    ],
  },
];

window.RICORRENTI = {
  title: 'Real Estate Camp',
  sub: 'Acceleratore — community e affiancamento',
  summary: 'Dopo la biforcazione tutti i percorsi confluiscono nel programma Real Estate Camp.',
  details: ['Group Coaching', 'Community', 'Affiancamento operativo'],
  outcome: 'Continuità + Community',
};

window.CALENDAR = {
  months: ['Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  weeksPerMonth: 4,
  livesPerWeek: 2,
  liveLabel: 'Live Forex',
  coach: 'Leonardo',
  events: [
    { id: 'ev-commodity', path: 'commodity', label: 'Evento Commodity', month: 0, week: 2 },
    { id: 'ev-opzioni',   path: 'opzioni',   label: 'Evento Opzioni',   month: 1, week: 1 },
    { id: 'ev-cripto',    path: 'cripto',    label: 'Evento Cripto',    month: 2, week: 2 },
    { id: 'ev-etf',       path: 'etf',       label: 'Evento ETF',       month: 2, week: 0 },
    { id: 'ev-camp',      path: 'forex',     label: 'Trading Camp',     month: 3, week: 1, camp: true },
  ],
  note: 'Il cliente può entrare in qualsiasi momento: guarda i video preparatori, si allinea rapidamente, entra nel flusso già attivo.',
  replaces: 'Sostituisce i grandi master iniziali da 80+ ore.',
};

window.DECISIONS = [
  {
    id: 'd1', status: 'ok', title: 'Forex = unico entry level',
    points: ['Strumento semplice', 'Poca barriera economica', 'Setup rapido', 'Risultati visibili prima', 'Leonardo coach ideale per il primo approccio'],
  },
  {
    id: 'd2', status: 'ok', title: 'Assessment finale obbligatorio',
    points: ['Incontro con Buddy dopo 3 mesi', 'Verifica competenze', 'Orientamento al percorso', 'Momento commerciale naturale'],
  },
  {
    id: 'd3', status: 'ok', title: 'Eventi periodici sugli altri mercati',
    points: ['Commodity, Opzioni e altri NON diventano entry level', 'Introdotti via eventi dedicati', 'Alimentano Group Coaching e Trading Diary'],
  },
  {
    id: 'd4', status: 'ok', title: 'Trading Camp come acceleratore',
    points: ['Non per acquisire clienti', 'Community e networking', 'Diversificazione', 'Scoperta di altri mercati'],
  },
];
