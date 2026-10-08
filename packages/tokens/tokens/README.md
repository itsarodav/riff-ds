# Fuente de verdad de los tokens (DTCG)

Todo lo que hay aquí es JSON en formato [DTCG](https://www.designtokens.org/) y es lo único que se edita. Style Dictionary (`scripts/build-tokens.mjs`) genera a partir de estos archivos todo lo demás: SCSS, CSS vars y el JSON del playground.

| Carpeta | Capa | Estado |
|---|---|---|
| `primitives/` | Valores con nombre por valor: `sage.10`, `space.4`, `font.size.sm` | ✅ |
| `semantic/` | Nombre por función, con referencias a primitivos (`{sage.130}`) y un archivo por tema | Pendiente |
| `component/` | Tokens de un componente, con referencias a semánticos | Pendiente |

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
