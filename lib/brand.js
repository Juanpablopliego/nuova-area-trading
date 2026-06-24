// Brand colors and per-path color derivations. Style, not editable content.

export const BRAND = {
  saffron: '#EF7B10',
  jade: '#009C4E',
  onyx: '#2C2E38',
  white: '#FFFFFF',
};

const hx = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
const toHex = (a) =>
  '#' + a.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
const mix = (hex, t, amt) => {
  const c = hx(hex);
  return toHex(c.map((v, i) => v + (t[i] - v) * amt));
};
const WHITE = [255, 255, 255];
const DARK = [22, 24, 32];

const RAW = {
  forex: ['Forex', '#EF7B10'],
  commodity: ['Commodity', '#1F9E55'],
  opzioni: ['Opzioni', '#2D6CB5'],
  cripto: ['Cripto', '#B8862A', true],
  etf: ['ETF', '#11A0A6'],
  flipping: ['Flipping', '#D6494E'],
  aste: ['Aste', '#7E57C2'],
  stralci: ['Stralci', '#9C6FD9'],
  affitti: ['Affitti', '#17A697'],
};

export const PATHS = {};
for (const id in RAW) {
  const [label, color, warning] = RAW[id];
  PATHS[id] = { id, label, color, soft: mix(color, WHITE, 0.88), ink: mix(color, DARK, 0.6), warning: !!warning };
}
