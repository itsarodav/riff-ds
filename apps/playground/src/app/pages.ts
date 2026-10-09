import { Type } from '@angular/core';

// Registro único de páginas del playground: de aquí salen las rutas y el sidebar.
// Para añadir una foundation o un componente: crea la página en pages/ y añade
// una entrada aquí.

export const SECTIONS = [
  { id: 'start', label: 'Empezar' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'components', label: 'Componentes' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export interface PlaygroundPage {
  /** Ruta sin barra inicial. '' es la portada. */
  path: string;
  title: string;
  section: SectionId;
  loadComponent: () => Promise<Type<unknown>>;
}

export const PAGES: PlaygroundPage[] = [
  {
    path: '',
    title: 'Introducción',
    section: 'start',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'foundations/color',
    title: 'Color',
    section: 'foundations',
    loadComponent: () => import('./pages/foundations/color/color').then((m) => m.ColorPage),
  },
  {
    path: 'foundations/semantic-color',
    title: 'Color semántico',
    section: 'foundations',
    loadComponent: () =>
      import('./pages/foundations/semantic-color/semantic-color').then((m) => m.SemanticColorPage),
  },
];
