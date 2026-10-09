import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../layout/footer/footer';
import { PAGES, SECTIONS } from '../../pages';
import { Card } from '../../shared/card/card';
import { Logo } from '../../shared/logo/logo';
import { NAV_LINKS, REPO_URL } from '../../shared/site';
import { CardArt, CardArtKind } from './card-art/card-art';

interface CoverCard {
  path: string | null;
  title: string;
  description: string;
  art: CardArtKind;
}

/** Ilustración de cada página en su card. Las que no estén aquí usan 'soon'. */
const ART: Record<string, CardArtKind> = {
  introduccion: 'layers',
  instalacion: 'code',
  changelog: 'timeline',
  'foundations/color': 'swatches',
  'foundations/semantic-color': 'modes',
};

/**
 * Portada del playground, a pantalla completa: navbar, hero centrado, una vista
 * previa hecha con los tokens reales y tarjetas con las páginas (de pages.ts).
 */
@Component({
  selector: 'pg-cover',
  imports: [RouterLink, Logo, Footer, Card, CardArt],
  templateUrl: './cover.html',
  styleUrl: './cover.scss',
})
export class Cover {
  protected readonly repoUrl = REPO_URL;
  protected readonly nav = NAV_LINKS;

  /** Una tarjeta por página, y una por sección que aún no tiene páginas. */
  protected readonly cards: CoverCard[] = SECTIONS.flatMap((section): CoverCard[] => {
    const pages = PAGES.filter((page) => page.section === section.id);
    return pages.length
      ? pages.map((page) => ({
          path: '/' + page.path,
          title: page.title,
          description: page.description,
          art: ART[page.path] ?? 'soon',
        }))
      : [{ path: null, title: section.label, description: 'Botón, campos de texto, chips, tags… Próximamente.', art: 'soon' }];
  });

  // ---- Datos de la vista previa ----
  protected readonly ramps = ['sage', 'neutral', 'blue', 'orange', 'green', 'red', 'yellow', 'purple'];
  protected readonly steps = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
  protected readonly messages = [
    { kind: 'info', text: 'Nueva versión de los tokens disponible.' },
    { kind: 'positive', text: 'Cambios guardados.' },
    { kind: 'warning', text: 'Este color no llega a AA en texto pequeño.' },
    { kind: 'negative', text: 'No se pudo publicar el paquete.' },
  ];

  protected fb(kind: string, token: string): string {
    return `var(--riff-color-${kind}-${token})`;
  }
}
