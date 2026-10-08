// Build de @riff-ds/tokens con Style Dictionary.
//
// Fuente de verdad: tokens/**/*.json (DTCG).
// Salidas en dist/ (no se versionan):
//   dist/scss/_tokens.scss  variables $riff-* (rem + -px) y el mapa $riff-tokens
//   dist/tokens.css         :root { --riff-* }
//   dist/colors.json        datos de color para el playground
//
// Uso: npm run build -w @riff-ds/tokens

import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'node:url';

import { RIFF_TRANSFORMS, registerRiffFormats } from './style-dictionary.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
registerRiffFormats();

const sd = new StyleDictionary({
  usesDtcg: true,
  source: ['tokens/**/*.json'],
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
