// Formatos de Style Dictionary compartidos por riff-ds y el playground.
//
// Reproducen los nombres que ya se usan: $riff-sage-10, --riff-space-4,
// --riff-space-4-px… Los nombres salen del path DTCG unido con guiones
// (sage.10 → sage-10, font.size.sm → font-size-sm).
//
// Las dimensiones se escriben en px en la fuente (como en Figma) y se emiten en
// rem por defecto. Con `pxTwins` se emite además una copia en px con sufijo -px.

import StyleDictionary from 'style-dictionary';
import { fileHeader } from 'style-dictionary/utils';

const ROOT_FONT_SIZE = 16;

export const tokenName = (token) => token.path.join('-');

// ---- Valores a texto CSS ----

function dimensionPx(value) {
  const { value: n, unit } = typeof value === 'object' ? value : { value: parseFloat(value), unit: 'px' };
  return unit === 'rem' ? n * ROOT_FONT_SIZE : n;
}

const trimNumber = (n) => String(Math.round(n * 10000) / 10000);

function dimensionCss(value, unit) {
  const px = dimensionPx(value);
  if (px === 0) return '0';
  return unit === 'px' ? `${trimNumber(px)}px` : `${trimNumber(px / ROOT_FONT_SIZE)}rem`;
}

function colorCss(value) {
  if (typeof value === 'string') return value;
  const alpha = value.alpha ?? 1;
  if (alpha < 1) {
    const [r, g, b] = value.components.map((c) => Math.round(c * 255));
    return `rgb(${r} ${g} ${b} / ${trimNumber(alpha)})`;
  }
  return value.hex.toUpperCase();
}

function fontFamilyCss(value) {
  const list = Array.isArray(value) ? value : [value];
  return list.map((f) => (/[\s\d]/.test(f) && !/^ui-|^[a-z-]+$/.test(f) ? `'${f}'` : f)).join(', ');
}

/** Valor CSS de un token. `unit` solo afecta a dimensiones. */
export function cssValue(token, unit = 'rem') {
  const value = token.$value;
  switch (token.$type) {
    case 'color':
      return colorCss(value);
    case 'dimension':
      return dimensionCss(value, unit);
    case 'fontFamily':
      return fontFamilyCss(value);
    default:
      return String(value);
  }
}

/** Si el token es una referencia directa ({sage.10}), su nombre (sage-10). */
function referenceName(token) {
  const original = token.original.$value;
  const match = typeof original === 'string' && original.match(/^\{([^}]+)\}$/);
  return match ? match[1].replace(/\./g, '-') : null;
}

// ---- Orden ----
// JS pone las claves numéricas antes que el resto ('0-5' acabaría tras '36').
// Dentro de cada grupo de dimensiones ordenamos por valor; el resto mantiene el
// orden de la fuente.
function sorted(tokens) {
  const groups = new Map();
  for (const token of tokens) {
    const key = token.path.slice(0, -1).join('.');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(token);
  }
  return [...groups.values()].flatMap((group) =>
    group.every((t) => t.$type === 'dimension')
      ? [...group].sort((a, b) => dimensionPx(a.$value) - dimensionPx(b.$value))
      : group,
  );
}

/** Pares [nombre, valor CSS] incluyendo las copias -px si se piden. */
function entries(tokens, { pxTwins = false } = {}) {
  return sorted(tokens).flatMap((token) => {
    const name = tokenName(token);
    const main = [name, cssValue(token), token];
    return pxTwins && token.$type === 'dimension' ? [main, [`${name}-px`, cssValue(token, 'px'), token]] : [main];
  });
}

const groupLabel = (token) => token.path.slice(0, -1).join('.') || token.path[0];

// ---- Formatos ----

/** Transformaciones que deben llevar todas las plataformas. */
export const RIFF_TRANSFORMS = ['riff/name'];

export function registerRiffFormats() {
  // Nombre = path completo con guiones (sage.10 → sage-10). Sin esto, Style
  // Dictionary nombra cada token por su último segmento y avisa de colisiones.
  StyleDictionary.registerTransform({
    name: 'riff/name',
    type: 'name',
    transform: tokenName,
  });

  /**
   * Variables SCSS ($riff-…) y el mapa $riff-tokens que usa el mixin
   * primitives-css-vars para emitir las CSS custom properties.
   */
  StyleDictionary.registerFormat({
    name: 'riff/scss',
    format: async ({ dictionary, file, options }) => {
      const prefix = options.prefix ? `${options.prefix}-` : '';
      const list = entries(dictionary.allTokens, options);
      const lines = [];
      let group;
      for (const [name, value, token] of list) {
        if (groupLabel(token) !== group) {
          group = groupLabel(token);
          lines.push(`${lines.length ? '\n' : ''}// ---- ${group} ----`);
        }
        lines.push(`$${prefix}${name}: ${value};`);
      }
      const map = list.map(([name]) => `  '${name}': $${prefix}${name},`);
      return (
        (await fileHeader({ file })) +
        lines.join('\n') +
        `\n\n// Todos los tokens, para emitirlos como CSS custom properties.\n$${prefix}tokens: (\n${map.join('\n')}\n);\n`
      );
    },
  });

  /**
   * CSS custom properties dentro de `options.selector`.
   * Con `options.references`, un token que apunta a otro se emite como
   * var(--<referencePrefix>-<nombre>) en lugar del valor resuelto.
   */
  StyleDictionary.registerFormat({
    name: 'riff/css',
    format: async ({ dictionary, file, options }) => {
      const prefix = options.prefix ? `${options.prefix}-` : '';
      const refPrefix = options.referencePrefix ? `${options.referencePrefix}-` : '';
      const body = entries(dictionary.allTokens, options).map(([name, value, token]) => {
        const ref = options.references && referenceName(token);
        return `  --${prefix}${name}: ${ref ? `var(--${refPrefix}${ref})` : value};`;
      });
      // Declaraciones extra al principio del bloque (p. ej. color-scheme: dark).
      body.unshift(...(options.declarations ?? []).map((d) => `  ${d};`));
      const header = options.noHeader ? '' : await fileHeader({ file, commentStyle: 'long' });
      return `${header}${options.selector ?? ':root'} {\n${body.join('\n')}\n}\n`;
    },
  });

  /** Datos de color para el playground: familias con sus pasos. */
  StyleDictionary.registerFormat({
    name: 'riff/colors-json',
    format: ({ dictionary }) => {
      const families = new Map();
      for (const token of dictionary.allTokens.filter((t) => t.$type === 'color')) {
        const [family, step] = token.path;
        if (!families.has(family)) families.set(family, []);
        families.get(family).push({
          step: Number(step),
          hex: cssValue(token),
          anchor: Boolean(token.$extensions?.['com.riff-ds']?.anchor),
        });
      }
      const json = {
        $generated: 'Style Dictionary (packages/tokens/scripts/build-tokens.mjs). No editar a mano.',
        families: [...families].map(([name, steps]) => ({ name, steps: steps.sort((a, b) => a.step - b.step) })),
      };
      return JSON.stringify(json, null, 2) + '\n';
    },
  });
}
