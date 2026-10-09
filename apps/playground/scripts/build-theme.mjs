// Tokens propios del playground (--pg-*) con Style Dictionary.
//
// Fuente: apps/playground/tokens/*.json (DTCG)
//   base.json   lo que no cambia con el tema (radios, tamaños, fuentes)
//   light.json  colores del modo claro
//   dark.json   colores del modo oscuro (mismas claves que light.json)
// Los valores apuntan a primitivos de @riff-ds/tokens ({sage.10}) y se emiten
// como var(--riff-sage-10), así que el playground sigue al DS automáticamente.
//
// Salida: src/generated/pg-theme.css (no se versiona)
//   :root, [data-theme='light']   base + claro
//   [data-theme='dark']           oscuro
//   prefers-color-scheme: dark    oscuro si no se ha elegido claro a mano
//
// Uso: npm run tokens (desde la raíz)

import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import { RIFF_TRANSFORMS, registerRiffFormats } from '@riff-ds/tokens/build';

const appRoot = fileURLToPath(new URL('..', import.meta.url));
const dsTokens = join(dirname(createRequire(import.meta.url).resolve('@riff-ds/tokens/package.json')), 'tokens');
// Style Dictionary usa globs con barras normales también en Windows.
const glob = (...parts) => join(...parts).replace(/\\/g, '/');

registerRiffFormats();

async function themeCss(sources, selector, declarations) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    include: [glob(dsTokens, 'primitives', '**/*.json')],
    source: sources.map((s) => glob(appRoot, 'tokens', s)),
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: RIFF_TRANSFORMS,
        files: [
          {
            destination: 'pg-theme.css',
            format: 'riff/css',
            // Solo los tokens del playground; los del DS se incluyen para resolver referencias.
            filter: (token) => token.isSource,
            options: { selector, declarations, references: true, referencePrefix: 'riff', noHeader: true },
          },
        ],
      },
    },
  });
  const [{ output }] = await sd.formatPlatform('css');
  return output;
}

const light = await themeCss(['base.json', 'light.json'], ":root,\n[data-theme='light']", ['color-scheme: light']);
const dark = await themeCss(['dark.json'], "[data-theme='dark']", ['color-scheme: dark']);
const systemDark = dark
  .replace("[data-theme='dark']", ":root:not([data-theme='light'])")
  .replace(/^/gm, '  ')
  .trimEnd();

const css = `/**
 * GENERADO por apps/playground/scripts/build-theme.mjs a partir de apps/playground/tokens/*.json.
 * No editar a mano.
 */

${light}
${dark}
@media (prefers-color-scheme: dark) {
${systemDark}
}
`;

const out = join(appRoot, 'src', 'generated', 'pg-theme.css');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css);
console.log(`✔ ${out}`);
