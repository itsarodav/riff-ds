import { Component } from '@angular/core';

import { PageHeader } from '../../shared/page-header/page-header';

interface Release {
  date: string;
  title: string;
  changes: string[];
}

// Más reciente primero. Cuando haya versiones publicadas en npm, esto saldrá de los changesets.
const RELEASES: Release[] = [
  {
    date: '2026-10-09',
    title: 'Color semántico y nueva portada',
    changes: [
      '76 colores semánticos (background, content, border, action y feedback) en light y dark, como --riff-color-*.',
      'Página Color semántico con vista previa en los dos modos.',
      'Logo Riff DS: isotipo con el token content/logo y texto en currentColor.',
      'Portada del playground con navegación a Docs, Playground, Changelog y GitHub.',
      'Paso 5 en todas las rampas (como el 50 de Tailwind): un tinte casi blanco para superficies. background-surface en light pasa de neutral.10 a sage.5.',
      'Footer compartido en todas las vistas (portada y shell): enlaces, tema y firma.',
      'Sección Docs en el sidebar (Introducción, Cómo instalar y Changelog) y contenido centrado con ancho máximo.',
      'Control segmentado neutro para el selector de tema y las opciones de vista.',
      'El naranja de marca y del logo queda unificado en orange-80.',
    ],
  },
  {
    date: '2026-10-08',
    title: 'Tokens DTCG con Style Dictionary',
    changes: [
      'Los tokens se escriben en JSON W3C DTCG y Style Dictionary genera SCSS, CSS custom properties y JSON.',
      'Playground con tema claro y oscuro (sistema, claro u oscuro) que se recuerda entre visitas.',
      'Página Color: rampas, contraste WCAG y copiar como CSS var, SCSS o HEX.',
    ],
  },
  {
    date: '2026-10-08',
    title: 'Primitivos',
    changes: [
      'Color: 8 familias de 16 pasos (10 → 160) generadas en OKLCH con la misma curva de luminosidad.',
      'Espaciado en múltiplos de 4px y escala tipográfica, en rem con copia en px.',
    ],
  },
];

@Component({
  selector: 'pg-changelog',
  imports: [PageHeader],
  template: `
    <pg-page-header
      eyebrow="Empezar"
      title="Changelog"
      description="Qué ha cambiado en Riff DS, de lo más reciente a lo más antiguo."
    />

    <ol class="releases">
      @for (release of releases; track $index) {
        <li class="release">
          <time class="release__date" [attr.datetime]="release.date">{{ release.date }}</time>
          <div class="release__body">
            <h2 class="release__title">{{ release.title }}</h2>
            <ul class="release__changes">
              @for (change of release.changes; track change) {
                <li>{{ change }}</li>
              }
            </ul>
          </div>
        </li>
      }
    </ol>
  `,
  styles: `
    :host {
      display: block;
      max-width: 48rem;
    }

    .releases {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .release {
      display: grid;
      gap: var(--riff-space-2) var(--riff-space-8);
      padding-block: var(--riff-space-8);
      border-top: 1px solid var(--pg-color-border);

      @media (min-width: 48rem) {
        grid-template-columns: 8rem minmax(0, 1fr);
      }

      &__date {
        font-family: var(--pg-font-mono);
        font-size: var(--riff-font-size-sm);
        color: var(--pg-color-text-muted);
      }

      &__title {
        margin-bottom: var(--riff-space-3);
        font-size: var(--riff-font-size-lg);
        font-weight: var(--riff-font-weight-bold);
      }

      &__changes {
        display: flex;
        flex-direction: column;
        gap: var(--riff-space-2);
        padding-left: var(--riff-space-4);
        color: var(--pg-color-text-muted);
      }
    }
  `,
})
export class Changelog {
  protected readonly releases = RELEASES;
}
