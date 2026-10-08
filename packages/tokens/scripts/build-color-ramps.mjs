// Genera src/primitives/_color.scss: rampas de 16 pasos (10…160) en OKLCH.
//
// Todas las familias comparten la misma curva de luminosidad (L), así que el
// mismo paso tiene el mismo peso visual en cualquier color. Los anclas son
// colores reales de riffims y se respetan exactos en su paso; la curva se
// deforma suavemente a su alrededor.
//
// Uso: node packages/tokens/scripts/build-color-ramps.mjs [--report]

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contrast, hexToOklch, oklchToHex } from './oklch.mjs';

const STEPS = 16;
const stepName = (i) => (i + 1) * 10; // índice 0…15 → 10…160

// Luminosidad base. Pasos cortos en los claros (fondos y superficies del tema
// light), largos en el centro (texto, acciones) y oscuros suficientes para
// fondos y superficies del tema dark.
const BASE_L = [
  0.985, 0.962, 0.93, 0.89, 0.84, 0.785, 0.727, 0.668,
  0.594, 0.519, 0.455, 0.395, 0.34, 0.285, 0.235, 0.19,
];

// Croma relativo al máximo: tintes suaves en los extremos, pico en el centro.
const CHROMA_SHAPE = [
  0.1, 0.2, 0.32, 0.45, 0.6, 0.75, 0.88, 0.97,
  1, 1, 0.95, 0.88, 0.8, 0.7, 0.6, 0.5,
];

// anchors: { paso: hex } con paso en 10…160.

const FAMILIES = {
  sage: {
    // Gris verdoso de marca. Croma explícito para que se sienta verde también
    // en los pasos oscuros (tema dark), donde #333532 casi lo pierde.
    anchors: { 10: '#F2F8F4', 20: '#EEF4F0', 40: '#D3DAD5', 80: '#859188', 130: '#333532' },
    chroma: [0.008, 0.008, 0.009, 0.01, 0.013, 0.016, 0.018, 0.019, 0.018, 0.016, 0.014, 0.011, 0.009, 0.009, 0.009, 0.008],
    hue: 152,
  },
  neutral: {
    anchors: { 30: '#E8E8E8' },
    chroma: Array(STEPS).fill(0),
    hue: 0,
  },
  blue: { anchors: { 100: '#2D68B5' } },
  orange: { anchors: { 80: '#F75828' } },
  green: { anchors: { 90: '#16A34A' } },
  red: { anchors: { 100: '#B91C1C' } },
  yellow: { anchors: { 20: '#FFF3D4', 60: '#F0B723', 90: '#AD7114' } },
  purple: { anchors: { 100: '#7C3AD6' } },
};

// Fuera de rampa hasta decidir cuál es el naranja de marca (ver docs §3.3).
const EXTRAS = { 'orange-logo': '#FF5E2D' };

// Interpola linealmente un valor por paso a partir de puntos { índice: valor };
// fuera del primer/último punto decae hacia `edge` en los extremos, o se
// mantiene constante si no se pasa `edge`.
function interpolate(points, edge) {
  const hold = edge === undefined;
  const idx = Object.keys(points).map(Number).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < STEPS; i++) {
    const lo = [...idx].reverse().find((k) => k <= i);
    const hi = idx.find((k) => k >= i);
    if (lo !== undefined && hi !== undefined) {
      out.push(lo === hi ? points[lo] : points[lo] + ((points[hi] - points[lo]) * (i - lo)) / (hi - lo));
    } else if (lo === undefined) {
      out.push(hold ? points[hi] : edge + ((points[hi] - edge) * i) / hi);
    } else {
      out.push(hold ? points[lo] : points[lo] + ((edge - points[lo]) * (i - lo)) / (STEPS - 1 - lo));
    }
  }
  return out;
}

function buildRamp({ anchors, chroma, hue }) {
  const a = Object.entries(anchors).map(([step, hex]) => ({ i: step / 10 - 1, hex, lch: hexToOklch(hex) }));

  // L: desplazamiento respecto a BASE_L, exacto en los anclas, 0 en los extremos libres.
  const lOffset = interpolate(Object.fromEntries(a.map(({ i, lch }) => [i, lch[0] - BASE_L[i]])), 0);

  // Croma: si no viene explícito, escala CHROMA_SHAPE para pasar por los anclas.
  let c = chroma;
  if (!c) {
    const peaks = interpolate(Object.fromEntries(a.map(({ i, lch }) => [i, lch[1] / CHROMA_SHAPE[i]])));
    c = CHROMA_SHAPE.map((s, i) => s * peaks[i]);
  }

  // Tono: fijo si se indica; si no, interpolado entre anclas (con varios anclas
  // el tono gira de forma natural, p. ej. amarillo claro → ocre).
  const h = hue !== undefined ? Array(STEPS).fill(hue) : interpolate(Object.fromEntries(a.map(({ i, lch }) => [i, lch[2]])));

  return Array.from({ length: STEPS }, (_, i) => {
    const anchor = a.find((x) => x.i === i);
    return anchor ? anchor.hex.toUpperCase() : oklchToHex([BASE_L[i] + lOffset[i], c[i], h[i]]);
  });
}

const ramps = Object.fromEntries(Object.entries(FAMILIES).map(([name, f]) => [name, buildRamp(f)]));

// ---- Salida SCSS ----
const lines = [
  '// ⚠️ GENERADO por scripts/build-color-ramps.mjs — no editar a mano.',
  '// Rampas de 16 pasos: 10 (más claro) … 160 (más oscuro), misma luminosidad',
  '// perceptual (OKLCH) en todas las familias. Anclas = colores reales de riffims.',
  '',
];
for (const [name, ramp] of Object.entries(ramps)) {
  const anchors = FAMILIES[name].anchors;
  lines.push(`// ---- ${name} ----`);
  ramp.forEach((hex, i) => {
    const step = stepName(i);
    lines.push(`$riff-${name}-${step}: ${hex};${anchors[step] ? ' // ancla riffims' : ''}`);
  });
  lines.push('');
}
lines.push('// ---- Fuera de rampa ----');
for (const [name, hex] of Object.entries(EXTRAS)) lines.push(`$riff-${name}: ${hex}; // logo y degradados, pendiente unificar con orange-80`);
lines.push('', '// Mapa para generar CSS custom properties y para riff.color(familia, paso).', '$riff-colors: (');
for (const [name, ramp] of Object.entries(ramps)) {
  lines.push(`  '${name}': (`);
  ramp.forEach((_, i) => lines.push(`    ${stepName(i)}: $riff-${name}-${stepName(i)},`));
  lines.push('  ),');
}
lines.push(');', '', '$riff-color-extras: (');
for (const name of Object.keys(EXTRAS)) lines.push(`  '${name}': $riff-${name},`);
lines.push(');', '');

const out = fileURLToPath(new URL('../src/primitives/_color.scss', import.meta.url));
writeFileSync(out, lines.join('\n'));
console.log(`✔ ${out}`);

// ---- Informe opcional: contraste de cada paso sobre los fondos light y dark ----
if (process.argv.includes('--report')) {
  const light = ramps.sage[0];
  const dark = ramps.sage[STEPS - 1];
  console.log(`\nContraste vs light ${light} | vs dark ${dark}`);
  for (const [name, ramp] of Object.entries(ramps)) {
    console.log(`\n${name}`);
    ramp.forEach((hex, i) =>
      console.log(`  ${String(stepName(i)).padStart(3)} ${hex}  ${contrast(hex, light).toFixed(2).padStart(5)}  ${contrast(hex, dark).toFixed(2).padStart(5)}`),
    );
  }
}
