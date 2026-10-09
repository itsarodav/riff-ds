# Fuente de verdad de los tokens (DTCG)

Todo lo que hay aquí es JSON en formato [DTCG](https://www.designtokens.org/) y es lo único que se edita. Style Dictionary (`scripts/build-tokens.mjs`) genera a partir de estos archivos todo lo demás: SCSS, CSS vars y el JSON del playground.

| Carpeta | Capa | Estado |
|---|---|---|
| `primitives/` | Valores con nombre por valor: `sage.10`, `space.4`, `font.size.sm` | ✅ |
| `semantic/` | Nombre por función (`color.content.default`), con referencias a primitivos (`{sage.130}`). `light.json` y `dark.json` tienen las mismas claves | ✅ color |
| `component/` | Tokens de un componente, con referencias a semánticos | Pendiente |

### Color semántico

Grupos: `background`, `content` (texto e iconos), `border`, `action` y los de feedback `info`, `positive`, `negative`, `warning`, `notice` y `discovery`. Cada grupo de feedback tiene los mismos tokens: `background`, `background-hover`, `background-strong`, `content`, `content-on-strong`, `icon` y `border`.

- **Salida:** `dist/semantic.css` con `--riff-color-<grupo>-<token>` (claro en `:root` y `[data-theme='light']`, oscuro en `[data-theme='dark']` y con `prefers-color-scheme`), y `dist/semantic.json` para el playground.
- **Figma:** colección `semantic-colors` (modo light) con el code syntax `var(--riff-color-…)`. Mientras el plan de Figma solo permita un modo por colección, el oscuro vive en `semantic-colors-dark`; cuando haya modos, pasa a ser el modo `dark` de `semantic-colors` sin cambiar nombres.
- **Contraste:** cada par de texto sobre fondo cumple AA (≥ 4.5:1) en los dos modos, e iconos y bordes de control llegan a ≥ 3:1.

## Convenciones

- **Nombres:** el path DTCG unido con guiones da el nombre de salida: `sage.10` → `$riff-sage-10` / `--riff-sage-10`.
- **Dimensiones:** se escriben en px (`{ "value": 16, "unit": "px" }`), como en Figma. El build emite rem por defecto y una copia en px con sufijo `-px`.
- **Color:** formato DTCG `{ colorSpace, components, hex }`.
- **`primitives/color.json` es generado:** lo escribe `scripts/build-color-ramps.mjs` (`npm run generate:colors`). Cuando Figma sea la fuente, ese script se retira y el archivo lo escribirá la sincronización con Figma.

## Flujo agéntico (objetivo)

```
Figma Variables ──▶ tokens/**/*.json ──▶ Style Dictionary ──▶ dist/ (SCSS, CSS, JSON)
   (modos)            (PR del agente)       npm run build
```

El agente solo modifica JSON. Los nombres de salida no cambian, así que ni el playground ni riffims lo notan.
