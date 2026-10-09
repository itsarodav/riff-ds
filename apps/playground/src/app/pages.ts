import { Type } from '@angular/core';

// Registro único de páginas del playground: de aquí salen las rutas, el sidebar
// y las tarjetas de la portada. Para añadir una foundation o un componente: crea
// la página en pages/ y añade una entrada aquí.

export const SECTIONS = [
  { id: 'docs', label: 'Docs' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'components', label: 'Componentes' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

/**
 * Ancho de la página en el shell. 'reading': una columna de texto
 * (--pg-size-reading-max). 'wide': para rejillas como las rampas de color
 * (--pg-size-content-max). El footer usa el mismo ancho para ir alineado.
 */
export type PageWidth = 'reading' | 'wide';

export interface PlaygroundPage {
  /** Ruta sin barra inicial. La portada ('') no es una página: ver app.routes.ts. */
  path: string;
  title: string;
  /** Una frase para la tarjeta de la portada. */
  description: string;
  section: SectionId;
  width: PageWidth;
  loadComponent: () => Promise<Type<unknown>>;
}

export const PAGES: PlaygroundPage[] = [
  {
    path: 'introduccion',
    title: 'Introducción',
    description: 'Qué es Riff DS y cómo se organizan los tokens en primitivos, semánticos y de componente.',
    section: 'docs',
    width: 'reading',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'instalacion',
    title: 'Cómo instalar',
    description: 'Instala los tokens y úsalos desde SCSS o CSS, en Angular, React o cualquier proyecto.',
    section: 'docs',
    width: 'reading',
    loadComponent: () => import('./pages/install/install').then((m) => m.Install),
  },
  {
    path: 'changelog',
    title: 'Changelog',
    description: 'Qué ha cambiado en cada versión del design system.',
    section: 'docs',
    width: 'reading',
    loadComponent: () => import('./pages/changelog/changelog').then((m) => m.Changelog),
  },
  {
    path: 'foundations/color',
    title: 'Color',
    description: '8 rampas de 17 pasos en OKLCH, con contraste WCAG sobre claro y oscuro.',
    section: 'foundations',
    width: 'wide',
    loadComponent: () => import('./pages/foundations/color/color').then((m) => m.ColorPage),
  },
  {
    path: 'foundations/semantic-color',
    title: 'Color semántico',
    description: 'Colores por función para fondos, texto, bordes, acciones y feedback, en light y dark.',
    section: 'foundations',
    width: 'wide',
    loadComponent: () =>
      import('./pages/foundations/semantic-color/semantic-color').then((m) => m.SemanticColorPage),
  },
];
