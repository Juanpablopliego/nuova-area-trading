// data.js — Nuova Area Trading ABTG. Plain JS, sets window globals.

window.BRAND = {
  saffron: '#EF7B10',
  jade: '#009C4E',
  onyx: '#2C2E38',
  white: '#FFFFFF',
};

// Path color-coding, kept on-brand (orange + green + neutral) + a warning tone for cripto.
window.PATHS = {
  forex:     { id: 'forex',     label: 'Forex',     color: '#EF7B10', soft: '#FDEEDC', ink: '#A8540A' },
  commodity: { id: 'commodity', label: 'Commodity', color: '#009C4E', soft: '#DCF1E6', ink: '#04693A' },
  opzioni:   { id: 'opzioni',   label: 'Opzioni',   color: '#2C2E38', soft: '#E7E8EC', ink: '#2C2E38' },
  cripto:    { id: 'cripto',    label: 'Cripto',    color: '#C77A12', soft: '#FBF1DF', ink: '#8A5410', warning: true },
};

// ── The linear spine (entry funnel everyone shares) ──────────────────
window.SPINE = [
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
    summary: 'Primo contatto che apre l’ingresso unico sul Forex.',
    details: [
      'Evento d’ingresso che indirizza tutti verso l’entry level.',
      'Crea consapevolezza e motivazione iniziale.',
    ],
  },
  {
    id: 'starter',
    kind: 'spine',
    title: 'Forex Starter Program',
    sub: 'Entry level · durata 3 mesi',
    badge: '02',
    accent: 'forex',
    highlight: true,
    summary: 'L’unico punto di ingresso. Porta il cliente rapidamente alla prima operazione.',
    details: [
      '4–5 video preparatori',
      'Setup piattaforma',
      'Setup conto demo',
      'Introduzione strategia Break & Bed',
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

// ── The branches after the Assessment ───────────────────────────────
window.BRANCHES = [
  {
    path: 'forex',
    title: 'Rimane nel Forex',
    steps: [
      { title: 'Group Coaching Forex', detail: 'Continua sul mercato d’ingresso in gruppo.' },
      { title: 'Forex Trading Diary', detail: 'Disciplina e tracciamento delle operazioni.' },
      { title: 'Trading Camp', detail: 'Accelerazione e community.' },
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
];

// Trading Camp as cross-cutting accelerator outcome
window.CAMP = {
  title: 'Trading Camp',
  sub: 'Acceleratore — non acquisizione',
  summary: 'Evento avanzato per chi è già nel percorso.',
  details: ['Community', 'Networking', 'Diversificazione', 'Scoperta di altri mercati'],
  outcome: 'Community + Diversificazione',
};

// ── Calendar / flusso Live ───────────────────────────────────────────
window.CALENDAR = {
  months: ['Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  weeksPerMonth: 4,
  livesPerWeek: 2,
  liveLabel: 'Live Forex',
  coach: 'Leonardo',
  // Diversification events placed on a (monthIndex, week) grid
  events: [
    { id: 'ev-commodity', path: 'commodity', label: 'Evento Commodity', month: 0, week: 2 },
    { id: 'ev-opzioni',   path: 'opzioni',   label: 'Evento Opzioni',   month: 1, week: 1 },
    { id: 'ev-cripto',    path: 'cripto',    label: 'Evento Cripto',    month: 2, week: 2 },
    { id: 'ev-camp',      path: 'forex',     label: 'Trading Camp',     month: 3, week: 1, camp: true },
  ],
  note: 'Il cliente può entrare in qualsiasi momento: guarda i video preparatori, si allinea rapidamente, entra nel flusso già attivo.',
  replaces: 'Sostituisce i grandi master iniziali da 80+ ore.',
};

// ── Decisioni emerse nella call ──────────────────────────────────────
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
  {
    id: 'd5', status: 'warning', title: 'Cripto da ripensare',
    points: ['Crypto Trading Diary → da valutare', 'Percepito poco sostenibile', 'Troppo dipendente dal momento di mercato', 'Possibile sostituzione: Crypto Group Coaching (Andrea Garagiola)'],
  },
];
