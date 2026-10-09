import { Routes } from '@angular/router';

import { PAGES } from './pages';

export const routes: Routes = [
  // Portada a pantalla completa: el shell (app.ts) no pinta sidebar ni barra en esta ruta.
  {
    path: '',
    pathMatch: 'full',
    title: 'Riff DS | A design system for music',
    loadComponent: () => import('./pages/cover/cover').then((m) => m.Cover),
  },
  ...PAGES.map((page) => ({
    path: page.path,
    pathMatch: 'full' as const,
    title: `${page.title} | Riff DS`,
    data: { width: page.width },
    loadComponent: page.loadComponent,
  })),
  { path: '**', redirectTo: '' },
];
