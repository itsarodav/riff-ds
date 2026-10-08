# riff-ds

Design system de Riffims: tokens, foundations y componentes para Angular y React.

## Estructura

```
packages/
  tokens/          @riff-ds/tokens — SCSS + CSS custom properties (--riff-*)
apps/
  playground/      App Angular con la referencia visual del DS
docs/              Auditoría de riffims y decisiones de arquitectura
```

Es un monorepo con npm workspaces: `npm install` en la raíz instala todo.

## Playground

```bash
npm start              # http://localhost:4200
npm run build          # compila a dist/playground/browser
```

### Añadir una página

1. Crea el componente en `apps/playground/src/app/pages/<sección>/<nombre>/`.
2. Añade una entrada en `apps/playground/src/app/pages.ts`. Las rutas y el sidebar salen de ahí.

Piezas compartidas en `apps/playground/src/app/shared/`:

- `pg-page-header`: título, antetítulo y descripción.
- `pg-code-block`: código con pestañas (Angular / React / SCSS / CSS…) y botón de copiar.

### Desplegar

`npm run build` genera un sitio estático en `dist/playground/browser`, que puede subirse a cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages…).

Es una SPA, así que el hosting debe devolver `index.html` para cualquier ruta (por ejemplo `/foundations/color`):

- **Vercel / Netlify / Cloudflare Pages:** regla de *rewrite* de `/*` a `/index.html`.
- **GitHub Pages:** copiar `index.html` como `404.html` y compilar con `--base-href /<repo>/`.

## Tokens

```bash
npm run build:tokens   # regenera las rampas de color y compila dist/tokens.css
```

Las rampas de color se definen en `packages/tokens/scripts/build-color-ramps.mjs`. Ese script genera `src/primitives/_color.scss` y `src/colors.json`: no edites esos dos archivos a mano. Con `--report` imprime el contraste de cada paso.
