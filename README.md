# riff-ds

Design system de Riffims: tokens, foundations y componentes para Angular y React.

## Estructura

```
packages/
  tokens/          @riff-ds/tokens
    tokens/        fuente de verdad: JSON DTCG (primitives/, luego semantic/ y component/)
    scripts/       build con Style Dictionary + generador de rampas de color
    src/           API SCSS (mixin, space()) sobre lo generado
    dist/          generado: SCSS, tokens.css, colors.json (no se versiona)
apps/
  playground/      App Angular con la referencia visual del DS
    tokens/        tokens propios del playground (pg.*) con modos light / dark
docs/              Auditoría de riffims y decisiones de arquitectura
```

Es un monorepo con npm workspaces: `npm install` en la raíz instala todo.

## Tokens: flujo

```
tokens/**/*.json (DTCG) ──▶ Style Dictionary ──▶ dist/_tokens.scss   $riff-*  (rem + -px)
                                              ├─▶ dist/tokens.css     --riff-*
                                              └─▶ dist/colors.json    datos para el playground
```

- **Solo se edita JSON.** Todo lo demás se genera; preparado para que un agente sincronice desde Figma Variables y abra un PR.
- **Dimensiones en px** en la fuente (como en Figma). El build emite rem por defecto y una copia `-px`.
- **Color:** `primitives/color.json` lo genera `npm run generate:colors -w @riff-ds/tokens` a partir de los anclas de riffims (OKLCH). Cuando Figma sea la fuente, ese script se retira.

Más detalle en [`packages/tokens/tokens/README.md`](packages/tokens/tokens/README.md).

```bash
npm run tokens         # tokens del DS + tema del playground
```

## Playground

```bash
npm start              # genera tokens y arranca en http://localhost:4200
npm run build          # genera tokens y compila a dist/playground/browser
```

`prestart` / `prebuild` ejecutan `npm run tokens`. Si editas un JSON con el servidor arrancado, vuelve a lanzar `npm run tokens` y el servidor recarga solo.

### Tema claro / oscuro

Los colores del playground son tokens propios (`--pg-color-*`) definidos en `apps/playground/tokens/`:

- `base.json`: lo que no cambia con el tema (radios, tamaños, fuentes).
- `light.json` / `dark.json`: mismas claves, valores que apuntan a primitivos del DS (`{sage.10}` → `var(--riff-sage-10)`).

El tema sigue al sistema por defecto y se puede fijar desde el sidebar. Cualquier elemento con `data-theme="light"` o `data-theme="dark"` crea su propio ámbito de tema; la vista previa de la página Color lo usa.

### Añadir una página

1. Crea el componente en `apps/playground/src/app/pages/<sección>/<nombre>/`.
2. Añade una entrada en `apps/playground/src/app/pages.ts`. Las rutas y el sidebar salen de ahí.

Piezas compartidas en `apps/playground/src/app/shared/`:

- `pg-page-header`: título, antetítulo y descripción.
- `pg-code-block`: código con pestañas (Angular / React / SCSS / CSS…) y botón de copiar.
- `pg-segmented`: grupo de opciones (radios) con aspecto segmentado.

Usa siempre `--pg-*` para la interfaz del playground, y `--riff-*` solo para mostrar el DS.

### Desplegar

`npm run build` genera un sitio estático en `dist/playground/browser`, que puede subirse a cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages…). El hosting debe ejecutar `npm run build` (ya incluye los tokens).

Es una SPA, así que el hosting debe devolver `index.html` para cualquier ruta (por ejemplo `/foundations/color`):

- **Vercel / Netlify / Cloudflare Pages:** regla de *rewrite* de `/*` a `/index.html`.
- **GitHub Pages:** copiar `index.html` como `404.html` y compilar con `--base-href /<repo>/`.
