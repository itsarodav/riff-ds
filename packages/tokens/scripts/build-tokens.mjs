// Build de @riff-ds/tokens con Style Dictionary.
//
// Fuente de verdad: tokens/**/*.json (DTCG).
//   primitives/       valores con nombre por valor (sage.10, space.4…)
//   semantic/light.json, semantic/dark.json
//                     colores por función (color.content.default…), con las
//                     mismas claves en los dos archivos y referencias a primitivos.
//                     Equivalen a los modos light/dark de semantic-colors en Figma.
//
// Salidas en dist/ (no se versionan):
//   dist/scss/_tokens.scss  variables $riff-* (rem + -px) y el mapa $riff-tokens
//   dist/tokens.css         :root { --riff-* }
//   dist/colors.json        datos de color para el playground
//   dist/semantic.css       --riff-color-* en claro (:root, [data-theme='light']) y
//                           oscuro ([data-theme='dark'] y prefers-color-scheme)
//   dist/semantic.json      datos de los semánticos (light y dark) para el playground
//
// Uso: npm run build -w @riff-ds/tokens

import StyleDictionary from 'style-dictionary';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { RIFF_TRANSFORMS, cssValue, registerRiffFormats, tokenName } from './style-dictionary.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
registerRiffFormats();

const PRIMITIVES = 'tokens/primitives/**/*.json';
const MODES = ['light', 'dark'];

// ---- Primitivos ----
const sd = new StyleDictionary({
  usesDtcg: true,
  source: [PRIMITIVES],
  log: { verbosity: 'default' },
  platforms: {
    scss: {
      transforms: RIFF_TRANSFORMS,
      buildPath: 'dist/scss/',
      files: [{ destination: '_tokens.scss', format: 'riff/scss', options: { prefix: 'riff', pxTwins: true } }],
    },
    css: {
      transforms: RIFF_TRANSFORMS,
      buildPath: 'dist/',
      files: [{ destination: 'tokens.css', format: 'riff/css', options: { prefix: 'riff', pxTwins: true } }],
    },
    json: {
      transforms: RIFF_TRANSFORMS,
      buildPath: 'dist/',
      files: [{ destination: 'colors.json', format: 'riff/colors-json' }],
    },
  },
});

await sd.buildAllPlatforms();

// ---- Semánticos: una pasada por modo ----
// Cada modo se construye por separado porque light.json y dark.json comparten
// claves. Los primitivos se incluyen solo para resolver referencias.
async function semanticMode(mode, selector) {
  const msd = new StyleDictionary({
    usesDtcg: true,
    include: [PRIMITIVES],
    source: [`tokens/semantic/${mode}.json`],
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: RIFF_TRANSFORMS,
        files: [
          {
            destination: 'semantic.css',
            format: 'riff/css',
            filter: (token) => token.isSource,
            options: {
              selector,
              declarations: [`color-scheme: ${mode}`],
              prefix: 'riff',
              references: true,
              referencePrefix: 'riff',
              noHeader: true,
            },
          },
        ],
      },
    },
  });
  const [{ output }] = await msd.formatPlatform('css');
  const { allTokens } = await msd.getPlatformTokens('css');
  return { css: output, tokens: allTokens.filter((t) => t.isSource) };
}

const light = await semanticMode('light', ":root,\n[data-theme='light']");
const dark = await semanticMode('dark', "[data-theme='dark']");

const systemDark = dark.css
  .replace("[data-theme='dark']", ":root:not([data-theme='light'])")
  .replace(/^/gm, '  ')
  .trimEnd();

writeFileSync(
  'dist/semantic.css',
  `/**
 * Do not edit directly, this file was auto-generated.
 * Colores semánticos de riff-ds (tokens/semantic/*.json).
 */

${light.css}
${dark.css}
@media (prefers-color-scheme: dark) {
${systemDark}
}
`,
);
console.log('✔︎ dist/semantic.css');

// Grupos en el orden de la fuente, con el valor de cada modo.
const groups = new Map();
const darkByName = new Map(dark.tokens.map((t) => [tokenName(t), t]));
const modeValue = (token) => ({ ref: token.original.$value.replace(/^\{|\}$/g, '').replace('.', '-'), hex: cssValue(token) });
for (const token of light.tokens) {
  const group = token.path[1];
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push({
    name: token.path.slice(1).join('/'),
    cssVar: `--riff-${tokenName(token)}`,
    description: token.$description ?? '',
    light: modeValue(token),
    dark: modeValue(darkByName.get(tokenName(token))),
  });
}
writeFileSync(
  'dist/semantic.json',
  JSON.stringify(
    {
      $generated: 'Style Dictionary (packages/tokens/scripts/build-tokens.mjs). No editar a mano.',
      modes: MODES,
      groups: [...groups].map(([name, tokens]) => ({ name, tokens })),
    },
    null,
    2,
  ) + '\n',
);
console.log('✔︎ dist/semantic.json');
