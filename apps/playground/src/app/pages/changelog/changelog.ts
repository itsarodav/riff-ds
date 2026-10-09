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
      '76 colores semánticos para fondos, texto, bordes, acciones y feedback, en claro y oscuro.',
      'Página Color semántico con vista previa en los dos modos.',
      'Nuevo paso 5 en todas las rampas: un tinte casi blanco para superficies.',
      'Logo de Riff DS y naranja de marca unificado en orange-80.',
      'Nueva portada y footer compartido en todo el playground.',
    ],
  },
  {
    date: '2026-10-08',
    title: 'Tokens DTCG con Style Dictionary',
    changes: [
      'Los tokens se escriben en JSON DTCG y se generan como SCSS, CSS y JSON.',
      'Playground con tema claro y oscuro.',
      'Página Color con rampas, contraste WCAG y copia en varios formatos.',
    ],
  },
  {
    date: '2026-10-08',
    title: 'Primitivos',
    changes: [
      'Color: 8 familias generadas en OKLCH con la misma curva de luminosidad.',
      'Escalas de espaciado y tipografía.',
    ],
  },
];

@Component({
  selector: 'pg-changelog',
  imports: [PageHeader],
  template: `
    <pg-page-header
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
